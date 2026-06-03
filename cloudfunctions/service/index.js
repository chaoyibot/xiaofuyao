// 售后服务中心云函数
const cloud = require('@cloudbase/node-sdk')
const app = cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = app.database()

exports.main = async (event, context) => {
  const { action, params = {} } = event
  const openid = context.OPENID || ''

  if (!openid && ['medicationCheckin', 'reportAdverseEvent', 'chatWithBot', 'getMedicationPlan'].includes(action)) {
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

// 用药计划
async function getMedicationPlan(db, openid) {
  const res = await db.collection('medication_plans')
    .where({ user_id: openid, active: true })
    .orderBy('created_at', 'desc')
    .limit(1)
    .get()
  return { code: 0, data: res.data[0] || null }
}

// 用药打卡
async function medicationCheckin(db, openid, { plan_id, taken_at, mood, notes }) {
  // 写入打卡记录
  const res = await db.collection('medication_checkins').add({
    user_id: openid,
    plan_id,
    taken_at: taken_at || new Date(),
    mood: mood || 'normal',
    notes: notes || ''
  })
  // 更新连续打卡
  await updateStreak(db, openid)
  return { code: 0, data: { id: res.id } }
}

async function updateStreak(db, openid) {
  // 查询最近 30 天打卡
  const checkins = await db.collection('medication_checkins')
    .where({ user_id: openid })
    .orderBy('taken_at', 'desc')
    .limit(30)
    .get()
  
  // 计算连续天数（简化为：昨天和今天都有打卡就算 1）
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
  // 更新用户表的 streak 字段
  await db.collection('users').where({ openid }).update({ streak }).catch(() => {})
}

// 复查提醒
async function getReminders(db, openid) {
  const res = await db.collection('reminders')
    .where({ user_id: openid, completed: false })
    .orderBy('due_date', 'asc')
    .get()
  return { code: 0, data: res.data }
}

// 不良反应上报
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
    // TODO: 触发短信/电话告警（通过腾讯云 SMS / IM）
    await sendUrgentAlert(openid, severity, symptoms)
  }
  return { code: 0, data: { id: res.id, urgent: isUrgent } }
}

async function sendUrgentAlert(openid, severity, symptoms) {
  // 调用 IM 通知药师/客服
  console.log(`[紧急告警] 用户 ${openid} 报告 ${severity} 级不良反应: ${symptoms.join(', ')}`)
  // 实际实现：通过腾讯云 IM 推送消息给值班客服
  // await app.callFunction({ name: 'notification', data: { type: 'urgent_aer', openid }})
}

// 智能客服（接入混元大模型）
async function chatWithBot(db, openid, { message, session_id }) {
  // 获取历史对话
  const history = await db.collection('chat_history')
    .where({ user_id: openid, session_id })
    .orderBy('created_at', 'desc')
    .limit(10)
    .get()
  
  // TODO: 接入混元大模型
  // const reply = await callHunyuan(message, history.data)
  
  // 临时模拟回复
  const reply = `收到您的咨询："${message}"。关于该问题，建议您：\n1. 仔细阅读说明书\n2. 联系主治医师\n3. 必要时拨打 400-888-XXXX 紧急求助\n\n请在医生指导下使用。`
  
  // 保存对话
  await db.collection('chat_history').add({
    user_id: openid,
    session_id,
    user_message: message,
    bot_reply: reply,
    created_at: new Date()
  })
  
  return { code: 0, data: { reply, session_id } }
}

// 物流查询
async function getLogistics(db, openid, orderId) {
  // TODO: 对接物流公司 API
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
        { time: '2026-06-03 14:30', status: '运输中' }
      ]
    }
  }
}
