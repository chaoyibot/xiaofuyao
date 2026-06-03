// 故事中心云函数
const cloud = require('@cloudbase/node-sdk')
const app = cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = app.database()

exports.main = async (event, context) => {
  const { action, params = {} } = event

  try {
    switch (action) {
      case 'getFeatured':
        return await getFeatured(db, params.limit || 3)
      case 'getStories':
        return await getStories(db, params)
      case 'getStoryDetail':
        return await getStoryDetail(db, params.id)
      case 'getStoriesByIndication':
        return await getStoriesByIndication(db, params.indication, params.limit || 10)
      default:
        return { code: 400, message: '未知 action' }
    }
  } catch (err) {
    console.error('[故事中心] 错误:', err)
    return { code: 500, message: err.message }
  }
}

async function getFeatured(db, limit) {
  const res = await db.collection('patient_stories')
    .where({ featured: true, published: true })
    .orderBy('sort', 'asc')
    .limit(limit)
    .get()
  return { code: 0, data: res.data }
}

async function getStories(db, { indication, page = 1, pageSize = 20 }) {
  const query = { published: true }
  if (indication) query.indications = indication
  const res = await db.collection('patient_stories')
    .where(query)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .orderBy('created_at', 'desc')
    .get()
  return { code: 0, data: res.data }
}

async function getStoryDetail(db, id) {
  const res = await db.collection('patient_stories').doc(id).get()
  // 增加浏览
  if (res.data) {
    await db.collection('patient_stories').doc(id).update({
      view_count: db.command.inc(1)
    })
  }
  return { code: 0, data: res.data }
}

async function getStoriesByIndication(db, indication, limit) {
  const res = await db.collection('patient_stories')
    .where({ indications: indication, published: true })
    .orderBy('view_count', 'desc')
    .limit(limit)
    .get()
  return { code: 0, data: res.data }
}
