// 用户中心云函数
const cloud = require('@cloudbase/node-sdk')
const app = cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = app.database()

exports.main = async (event, context) => {
  const { action, params = {} } = event
  const openid = context.OPENID || ''
  const wxContext = cloud.getWXContext()

  try {
    switch (action) {
      case 'login':
        return await login(db, wxContext)
      case 'getUserInfo':
        return await getUserInfo(db, openid)
      case 'updateUserInfo':
        return await updateUserInfo(db, openid, params)
      case 'addFamilyMember':
        return await addFamilyMember(db, openid, params)
      case 'getFamilyMembers':
        return await getFamilyMembers(db, openid)
      default:
        return { code: 400, message: '未知 action' }
    }
  } catch (err) {
    console.error('[用户中心] 错误:', err)
    return { code: 500, message: err.message }
  }
}

async function login(db, wxContext) {
  const { OPENID, APPID, UNIONID } = wxContext
  // 查询用户是否存在
  let userRes = await db.collection('users').where({ openid: OPENID }).get()
  if (userRes.data.length === 0) {
    // 新用户，创建记录
    userRes = await db.collection('users').add({
      openid: OPENID,
      unionid: UNIONID,
      appid: APPID,
      nickname: '新用户',
      avatar: '',
      role: 'patient', // patient | doctor | family
      created_at: new Date(),
      last_login_at: new Date()
    })
  } else {
    // 老用户，更新登录时间
    await db.collection('users').where({ openid: OPENID }).update({
      last_login_at: new Date()
    })
  }
  // 生成 token（实际项目用 JWT）
  const token = `mock_token_${OPENID}_${Date.now()}`
  return {
    code: 0,
    data: {
      token,
      userInfo: userRes.data[0] || { openid: OPENID }
    }
  }
}

async function getUserInfo(db, openid) {
  const res = await db.collection('users').where({ openid }).get()
  return { code: 0, data: res.data[0] || null }
}

async function updateUserInfo(db, openid, updates) {
  await db.collection('users').where({ openid }).update({
    ...updates,
    updated_at: new Date()
  })
  return { code: 0 }
}

async function addFamilyMember(db, openid, member) {
  const res = await db.collection('family_members').add({
    owner_id: openid,
    ...member,
    created_at: new Date()
  })
  return { code: 0, data: { id: res.id } }
}

async function getFamilyMembers(db, openid) {
  const res = await db.collection('family_members').where({ owner_id: openid }).get()
  return { code: 0, data: res.data }
}
