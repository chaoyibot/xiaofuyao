import { post } from '@/utils/request'

const BASE = '/api/user'

/**
 * 微信登录
 * @param {string} code - wx.login 返回的 code
 */
export function login(code) {
  return post(BASE, { action: 'login', params: { code } })
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return post(BASE, { action: 'getUserInfo' })
}

/**
 * 更新用户信息
 * @param {object} data - { nickname, avatar, phone, etc. }
 */
export function updateUserInfo(data) {
  return post(BASE, { action: 'updateUserInfo', params: data })
}

/**
 * 添加家属
 * @param {object} member - { name, phone, relation, permission }
 */
export function addFamilyMember(member) {
  return post(BASE, { action: 'addFamilyMember', params: member })
}

/**
 * 获取家属列表
 */
export function getFamilyMembers() {
  return post(BASE, { action: 'getFamilyMembers' })
}

/**
 * 删除家属
 * @param {string} id - 家属记录 ID
 */
export function removeFamilyMember(id) {
  return post(BASE, { action: 'removeFamilyMember', params: { id } })
}
