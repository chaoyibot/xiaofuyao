import { get } from '@/utils/request'

const BASE = '/api/academic'

/**
 * 获取文献列表
 */
export function getDocuments(params = {}) {
  return get(`${BASE}/documents`, params)
}

/**
 * 获取文献详情
 */
export function getDocumentDetail(id) {
  return get(`${BASE}/documents/${id}`)
}

/**
 * 获取课件列表
 */
export function getCourses(params = {}) {
  return get(`${BASE}/courses`, params)
}

/**
 * 计算剂量
 */
export function calculateDose({ height, weight, indication, age, performanceStatus }) {
  return get(`${BASE}/calculator`, { height, weight, indication, age, performanceStatus })
}

/**
 * 获取直播/讲座列表
 */
export function getWebinars(params = {}) {
  return get(`${BASE}/webinars`, params)
}
