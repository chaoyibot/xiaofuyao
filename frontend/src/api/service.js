import { get, post, put } from '@/utils/request'

const BASE = '/api/service'

/**
 * 获取用药计划
 */
export function getMedicationPlan() {
  return get(`${BASE}/medication/plan`)
}

/**
 * 用药打卡
 */
export function medicationCheckin(data) {
  return post(`${BASE}/medication/checkin`, data)
}

/**
 * 获取复查提醒
 */
export function getReminders() {
  return get(`${BASE}/reminders`)
}

/**
 * 上报不良反应
 */
export function reportAdverseEvent(data) {
  return post(`${BASE}/adverse-event`, data)
}

/**
 * 智能客服对话
 */
export function chatWithBot(data) {
  return post(`${BASE}/chat`, data)
}

/**
 * 获取物流信息
 */
export function getLogistics(orderId) {
  return get(`${BASE}/logistics/${orderId}`)
}
