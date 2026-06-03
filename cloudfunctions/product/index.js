// 云函数入口
const cloud = require('@cloudbase/node-sdk')
const app = cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = app.database()

exports.main = async (event, context) => {
  const { action, params = {} } = event

  try {
    switch (action) {
      case 'getHomeData':
        return await getHomeData(db)
      case 'getProductDetail':
        return await getProductDetail(db, params.id)
      case 'getIndications':
        return await getIndications(db)
      // 已删除：getInsurance（医保板块已取消）
      default:
        return { code: 400, message: '未知 action' }
    }
  } catch (err) {
    console.error('[产品中心] 错误:', err)
    return { code: 500, message: err.message }
  }
}

async function getHomeData(db) {
  // 获取首页 Banner（从 product_banners 集合）
  const bannersRes = await db.collection('product_banners')
    .where({ enabled: true })
    .orderBy('sort', 'asc')
    .limit(5)
    .get()
  return {
    code: 0,
    data: {
      banners: bannersRes.data
    }
  }
}

async function getProductDetail(db, id) {
  const res = await db.collection('products').doc(id).get()
  return { code: 0, data: res.data }
}

async function getIndications(db) {
  const res = await db.collection('indications')
    .orderBy('sort', 'asc')
    .get()
  return { code: 0, data: res.data }
}
