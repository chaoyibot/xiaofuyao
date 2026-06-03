import { get } from '@/utils/request'

const BASE = '/api/product'

/**
 * 获取首页数据
 */
export function getHomeData() {
  return get(`${BASE}/home`)
}

/**
 * 获取产品详情
 */
export function getProductDetail(id = 'fluorouracil-oral') {
  return get(`${BASE}/detail/${id}`)
}

/**
 * 获取适应症列表
 */
export function getIndications() {
  return get(`${BASE}/indications`)
}

// 已删除：getInsurance（医保板块已取消）
