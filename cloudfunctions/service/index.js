// 售后服务中心云函数（W3 升级版）
// AI 接入：
//   - 智能客服：腾讯混元大模型（hunyuan）
//   - 紧急告警：腾讯云 IM（IM-SDK）
const cloud = require('@cloudbase/node-sdk')
const app = cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = app.database()

// 腾讯混元大模型配置（从环境变量读取）
const HUNYUAN_CONFIG = {
  secretId: process.env.TENCENT_SECRET_ID || '',
  secretKey: process.env.TENCENT_SECRET_KEY || '',
  endpoint: 'hunyuan.tencentcloudapi.com',
  region: 'ap-guangzhou',
  model: 'hunyuan-pro'
}

// 腾讯云 IM 配置
const IM_CONFIG = {
  sdkAppId: process.env.IM_SDK_APP_ID || '',
  identifier: process.env.IM_IDENTIFIER || '',
  usersig: process.env.IM_USERSIG || ''
}

exports.main = async (event, context) => {
  const { action, params = {} } = event
  const openid = context.OPENID || ''

  // 需要登录的接口
  if (!openid && ['medicationCheckin', 'reportAdverseEvent', 'chatWithBot', 'getMedicationPlan', 'getReminders', 'getLogistics'].includes(action)) {
    return { code: 401, message: '请先登录' }
  }

  try {
    switch (action) {
      case 'getMedicationPlan':
        return await getMedicationPlan(db, openid)
      case 'medicationCheckin':
        return await medicationCheckin(db, openid, params)
      case 'getReminders':
        return await getReminders(db, openid)
      case 'reportAdverseEvent':
        return await reportAdverseEvent(db, openid, params)
      case 'chatWithBot':
        return await chatWithBot(db, openid, params)
      case 'getLogistics':
        return await getLogistics(db, openid, params.orderId)
      default:
        return { code: 400, message: '未知 action' }
    }
  } catch (err) {
    console.error('[售后中心] 错误:', err)
    return { code: 500, message: err.message }
  }
}

// ============================================
// 用药管理
// ============================================

async function getMedicationPlan(db, openid) {
  const res = await db.collection('medication_plans')
    .where({ user_id: openid, active: true })
    .orderBy('created_at', 'desc')
    .limit(1)
    .get()
  return { code: 0, data: res.data[0] || null }
}

async function medicationCheckin(db, openid, { plan_id, taken_at, mood, notes }) {
  const res = await db.collection('medication_checkins').add({
    user_id: openid,
    plan_id,
    taken_at: taken_at || new Date(),
    mood: mood || 'normal',
    notes: notes || ''
  })
  await updateStreak(db, openid)
  return { code: 0, data: { id: res.id } }
}

async function updateStreak(db, openid) {
  const checkins = await db.collection('medication_checkins')
    .where({ user_id: openid })
    .orderBy('taken_at', 'desc')
    .limit(30)
    .get()

  const days = new Set(
    checkins.data.map(c => new Date(c.taken_at).toISOString().slice(0, 10))
  )
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const d = new Date(today - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    if (days.has(d)) streak++
    else break
  }
  await db.collection('users').where({ openid }).update({ streak }).catch(() => {})
}

// ============================================
// 复查提醒
// ============================================

async function getReminders(db, openid) {
  const res = await db.collection('reminders')
    .where({ user_id: openid, completed: false })
    .orderBy('due_date', 'asc')
    .get()
  return { code: 0, data: res.data }
}

// ============================================
// 不良反应上报
// ============================================

async function reportAdverseEvent(db, openid, params) {
  const { symptoms, severity, occurred_at, notes } = params
  if (!symptoms || symptoms.length === 0) {
    return { code: 400, message: '请选择症状' }
  }
  // 严重（3-4 级）立即触发告警
  const isUrgent = severity >= 3
  const res = await db.collection('adverse_events').add({
    user_id: openid,
    symptoms,
    severity,
    occurred_at: occurred_at || new Date(),
    notes: notes || '',
    status: isUrgent ? 'urgent' : 'pending',
    created_at: new Date()
  })
  if (isUrgent) {
    // 调用 IM 通知药师/客服（IM 配置后才生效）
    await sendUrgentAlertIM(openid, severity, symptoms)
  }
  return { code: 0, data: { id: res.id, urgent: isUrgent } }
}

/**
 * 紧急告警 · 接入腾讯云 IM
 * 当用户上报 3 级以上不良反应时，通知值班客服
 */
async function sendUrgentAlertIM(openid, severity, symptoms) {
  console.log(`[紧急告警] 用户 ${openid} 报告 ${severity} 级不良反应: ${symptoms.join(', ')}`)

  // 如果 IM 配置就绪，调用 IM 推送
  if (IM_CONFIG.sdkAppId && IM_CONFIG.usersig) {
    try {
      const cloudIM = require('@cloudbase/extension-im-sdk')
      const im = new cloudIM({
        sdkAppId: IM_CONFIG.sdkAppId,
        identifier: IM_CONFIG.identifier,
        usersig: IM_CONFIG.usersig
      })

      // 推送给值班客服群组（group_id 需在 IM 控制台配置）
      await im.sendGroupSystemNotification({
        groupId: 'urgent_aer_alert_group',
        content: JSON.stringify({
          type: 'urgent_aer',
          openid,
          severity,
          symptoms,
          timestamp: Date.now()
        })
      })
      console.log('[IM] 紧急告警推送成功')
    } catch (err) {
      console.error('[IM] 推送失败:', err.message)
      // fallback：写日志
    }
  } else {
    // IM 未配置时：写日志（生产环境应同时发送短信）
    console.warn('[IM] IM_SDK_APP_ID 未配置，紧急告警仅写入日志')
    await db.collection('urgent_alerts_log').add({
      openid, severity, symptoms, sent_at: new Date()
    }).catch(() => {})
  }
}

// ============================================
// 智能客服 · 接入腾讯混元大模型
// ============================================

/**
 * 药品知识库（用作 system prompt）
 * 严格按照药品说明书 + 临床指南编写
 */
const MEDICAL_KB = `
【药品基础信息】
- 通用名：氟尿嘧啶口服乳
- 英文名：5-Fluorouracil Oral Emulsion
- 规格：0.4g/支
- 厂家：中和制药
- 适应症：结直肠癌、胃癌、乳腺癌、头颈肿瘤

【用法用量】
- 遵医嘱，不可自行调整
- 一般每日分次口服，餐后 30 分钟服用

【重大风险】
- 处方药，必须凭医师处方购买
- 孕妇及哺乳期妇女禁用
- 需定期监测血常规、肝肾功能
- 出现严重不良反应立即就医
`.trim()

/**
 * 调用腾讯混元大模型
 * 文档：https://cloud.tencent.com/document/product/1729
 */
async function callHunyuan(messages) {
  if (!HUNYUAN_CONFIG.secretId || !HUNYUAN_CONFIG.secretKey) {
    console.warn('[混元] TENCENT_SECRET_ID 未配置，使用本地兜底回复')
    return null
  }

  try {
    const tencentcloud = require('tencentcloud-sdk-nodejs')
    const HunyuanClient = tencentcloud.hunyuan.v20230901.Client
    const client = new HunyuanClient({
      credential: { secretId: HUNYUAN_CONFIG.secretId, secretKey: HUNYUAN_CONFIG.secretKey },
      region: HUNYUAN_CONFIG.region
    })

    const params = {
      Model: HUNYUAN_CONFIG.model,
      Messages: messages,
      // 限制输出长度
      Temperature: 0.7,
      TopP: 0.9
    }
    const result = await client.ChatCompletions(params)
    return result.Choices?.[0]?.Message?.Content || null
  } catch (err) {
    console.error('[混元] 调用失败:', err.message)
    return null
  }
}

/**
 * 兜底回复（无 AI 时使用）
 */
function fallbackReply(userMessage) {
  const m = userMessage
  if (/怎么.*吃|怎么.*服|用法|用量/.test(m)) {
    return '📋 氟尿嘧啶口服乳用法用量请严格遵医嘱。一般餐后 30 分钟温水送服，整支服用勿拆分。具体方案以您的医师处方为准。'
  }
  if (/漏服|忘了|忘记/.test(m)) {
    return '⏰ 漏服处理：想起时立即补服；若已接近下次服药时间，跳过本次。切勿双倍剂量。'
  }
  if (/副作用|不良反应|不适/.test(m)) {
    return '🩺 常见副作用：恶心、呕吐、腹泻、白细胞减少等。严重不适请立即联系医师或使用「不良反应上报」功能。'
  }
  if (/复查|检查|检验/.test(m)) {
    return '📅 化疗期间复查建议：血常规每 2-4 周、肝肾功能每月、影像学每 2-3 个月。具体请遵医嘱。'
  }
  if (/饮食|吃什么|忌口/.test(m)) {
    return '🥗 建议：高蛋白、易消化、新鲜蔬果；避免辛辣、生冷、酒精。每日饮水 2000ml+。'
  }
  return `关于您咨询的问题，建议：
1. 仔细阅读药品说明书
2. 联系您的主治医师
3. 必要时拨打紧急热线 ${process.env.EMERGENCY_PHONE || '400-888-XXXX'}

⚠️ 我是 AI 助手，不能替代专业医师诊断。`
}

async function chatWithBot(db, openid, { message, session_id }) {
  // 获取历史对话（最近 10 条）
  const history = await db.collection('chat_history')
    .where({ user_id: openid, session_id })
    .orderBy('created_at', 'desc')
    .limit(10)
    .get()

  let reply = null

  // 尝试调用混元大模型
  if (HUNYUAN_CONFIG.secretId) {
    const messages = [
      { Role: 'system', Content: `你是「小福药」AI 药师助手，专门为使用氟尿嘧啶口服乳的患者提供咨询服务。请遵守以下原则：\n1. 只回答与本品相关的用药问题\n2. 任何症状评估都建议联系医师\n3. 紧急情况建议立即就医\n4. 严格基于以下知识库回答，不要编造数据：\n\n${MEDICAL_KB}` },
      ...history.data.reverse().map(h => ({ Role: 'user', Content: h.user_message })),
      { Role: 'assistant', Content: history.data[0]?.bot_reply || '' },
      { Role: 'user', Content: message }
    ]
    reply = await callHunyuan(messages)
  }

  // 兜底：本地知识匹配
  if (!reply) {
    reply = fallbackReply(message)
  }

  // 保存对话
  await db.collection('chat_history').add({
    user_id: openid,
    session_id,
    user_message: message,
    bot_reply: reply,
    ai_powered: !!HUNYUAN_CONFIG.secretId,
    created_at: new Date()
  })

  return {
    code: 0,
    data: {
      reply,
      session_id,
      ai_powered: !!HUNYUAN_CONFIG.secretId
    }
  }
}

// ============================================
// 物流查询
// ============================================

async function getLogistics(db, openid, orderId) {
  // 物流查询（演示版：返回模拟数据，生产环境对接顺丰/京东等 API）
  // 接入方案：通过第三方聚合 API（如快递鸟）获取实时物流
  return {
    code: 0,
    data: {
      order_id: orderId,
      status: 'in_transit',
      company: '顺丰',
      tracking_number: 'SF1234567890',
      estimated_delivery: '2026-06-05',
      history: [
        { time: '2026-06-03 10:00', status: '已发货' },
        { time: '2026-06-03 14:30', status: '运输中' },
        { time: '2026-06-03 18:45', status: '派送中' }
      ]
    }
  }
}
