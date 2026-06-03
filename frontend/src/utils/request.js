import { useUserStore } from '@/stores/user'

/**
 * 统一请求封装
 */
export async function request(options) {
  const { url, method = 'GET', data = {}, header = {}, showLoading = false } = options

  if (showLoading) {
    uni.showLoading({ title: '加载中...', mask: true })
  }

  const userStore = useUserStore()
  const token = userStore.token

  try {
    const res = await uni.request({
      url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...header
      },
      timeout: 15000
    })

    if (showLoading) uni.hideLoading()

    // HTTP 状态码
    if (res.statusCode !== 200) {
      throw new Error(`HTTP ${res.statusCode}`)
    }

    // 业务状态码
    const body = res.data
    if (body.code !== 0 && body.code !== 200) {
      if (body.code === 401) {
        // token 失效
        userStore.logout()
        uni.showToast({ title: '请重新登录', icon: 'none' })
        throw new Error('未登录')
      }
      throw new Error(body.message || '请求失败')
    }

    return body.data
  } catch (e) {
    // 错误已通过 message 字段返回给前端，这里不再重复记录
    throw e
  }
}

/**
 * GET 请求
 */
export function get(url, params, options = {}) {
  const query = Object.keys(params)
    .filter(k => params[k] !== undefined && params[k] !== null)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&')
  const fullUrl = query ? `${url}?${query}` : url
  return request({ ...options, url: fullUrl, method: 'GET' })
}

/**
 * POST 请求
 */
export function post(url, data, options = {}) {
  return request({ ...options, url, method: 'POST', data })
}

/**
 * PUT 请求
 */
export function put(url, data, options = {}) {
  return request({ ...options, url, method: 'PUT', data })
}

/**
 * DELETE 请求
 */
export function del(url, options = {}) {
  return request({ ...options, url, method: 'DELETE' })
}
