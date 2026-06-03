// 学术中心云函数
const cloud = require('@cloudbase/node-sdk')
const app = cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = app.database()

exports.main = async (event, context) => {
  const { action, params = {} } = event
  const openid = context.OPENID || ''

  try {
    switch (action) {
      case 'getDocuments':
        return await getDocuments(db, params)
      case 'getDocumentDetail':
        return await getDocumentDetail(db, params.id, openid)
      case 'getCourses':
        return await getCourses(db, params)
      case 'calculateDose':
        return await calculateDose(params)
      case 'recordView':
        return await recordView(db, openid, params)
      default:
        return { code: 400, message: '未知 action' }
    }
  } catch (err) {
    console.error('[学术中心] 错误:', err)
    return { code: 500, message: err.message }
  }
}

async function getDocuments(db, { indication, page = 1, pageSize = 20 }) {
  const query = indication ? { indications: indication } : {}
  const skip = (page - 1) * pageSize
  const res = await db.collection('academic_documents')
    .where(query)
    .skip(skip)
    .limit(pageSize)
    .orderBy('created_at', 'desc')
    .get()
  return { code: 0, data: res.data }
}

async function getDocumentDetail(db, id, openid) {
  const res = await db.collection('academic_documents').doc(id).get()
  // 增加浏览计数
  if (res.data) {
    await db.collection('academic_documents').doc(id).update({
      view_count: db.command.inc(1)
    })
    // 记录用户浏览历史
    if (openid) {
      await db.collection('user_doc_history').add({
        user_id: openid,
        doc_id: id,
        viewed_at: new Date()
      }).catch(e => console.error('记录浏览历史失败:', e))
    }
  }
  return { code: 0, data: res.data }
}

async function getCourses(db, { category, page = 1, pageSize = 20 }) {
  const query = category ? { category } : {}
  const res = await db.collection('courses')
    .where(query)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .orderBy('created_at', 'desc')
    .get()
  return { code: 0, data: res.data }
}

function calculateDose({ height, weight, indication, age, performanceStatus = 0 }) {
  // 参数验证
  const h = parseFloat(height)
  const w = parseFloat(weight)
  if (!h || !w) {
    return { code: 400, message: '身高体重不能为空' }
  }
  if (h < 50 || h > 250 || w < 10 || w > 300) {
    return { code: 400, message: '身高或体重超出合理范围' }
  }

  // Mosteller 公式
  const bsa = Math.sqrt((h * w) / 3600)

  // 不同适应症的推荐剂量（mg/m²/日）
  const doseMap = {
    '结直肠癌': 600,
    '胃癌': 600,
    '乳腺癌': 500,
    '头颈肿瘤': 500
  }
  const baseDose = doseMap[indication] || 600

  // 根据体能状态调整
  let adjustedDose = baseDose
  if (performanceStatus >= 2) {
    adjustedDose = baseDose * 0.75  // ECOG 2 分减量
  } else if (age >= 75) {
    adjustedDose = baseDose * 0.8   // 老年人减量
  }

  const totalMg = bsa * adjustedDose
  const totalMl = totalMg / 40  // 假设 0.4g/10mL

  return {
    code: 0,
    data: {
      bsa: Math.round(bsa * 100) / 100,
      baseDose: adjustedDose,
      recommendedDailyMg: Math.round(totalMg),
      recommendedDailyMl: Math.round(totalMl * 10) / 10,
      warnings: age >= 75 ? ['老年人需谨慎，建议从 80% 剂量开始'] : [],
    }
  }
}

async function recordView(db, openid, { doc_id, course_id }) {
  if (!openid) return { code: 401, message: '未登录' }
  await db.collection('view_history').add({
    user_id: openid,
    doc_id: doc_id || null,
    course_id: course_id || null,
    viewed_at: new Date()
  })
  return { code: 0 }
}
