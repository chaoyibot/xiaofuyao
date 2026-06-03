/**
 * 全局配置
 * 上线前需替换的占位符
 */
export const config = {
  // 紧急咨询电话（占位符，上线前请替换为真实号码）
  emergencyPhone: process.env.UNI_PLATFORM === 'mp-weixin'
    ? '400-000-0000'  // 微信小程序环境示例
    : '400-888-XXXX', // 默认占位符

  // 公司信息
  company: {
    name: '中和制药',
    fullName: '湖南中和制药有限公司',
    hotline: '400-888-XXXX',  // 客服热线（占位）
    website: 'https://www.zhhz.com'  // 官网
  },

  // API 端点
  api: {
    baseURL: process.env.NODE_ENV === 'production'
      ? 'https://api.xiaofuyao.com'  // 生产环境
      : 'https://dev-api.xiaofuyao.com'  // 开发环境
  },

  // 第三方服务
  services: {
    // 腾讯混元大模型（key 通过云函数环境变量注入，不暴露在前端）
    hunyuanEnabled: false,
    // 腾讯云 IM（同上）
    imEnabled: false
  }
}
