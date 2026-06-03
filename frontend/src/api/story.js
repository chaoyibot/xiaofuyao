import { get } from '@/utils/request'

const BASE = '/api/story'

/**
 * 获取精选故事
 */
export function getFeaturedStories(limit = 3) {
  return get(`${BASE}/featured`, { limit })
}

/**
 * 获取故事列表
 */
export function getStories(params = {}) {
  return get(`${BASE}/list`, params)
}

/**
 * 获取故事详情
 */
export function getStoryDetail(id) {
  return get(`${BASE}/detail/${id}`)
}

/**
 * 按适应症筛选故事
 */
export function getStoriesByIndication(indication, limit = 10) {
  return get(`${BASE}/by-indication/${indication}`, { limit })
}
