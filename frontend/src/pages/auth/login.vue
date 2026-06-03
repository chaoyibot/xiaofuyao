<template>
  <view class="login-page">
    <AppHeader title="登录" />

    <view class="login-container">
      <!-- Logo 区 -->
      <view class="logo-section">
        <text class="logo-icon">🏥</text>
        <text class="logo-title">小福药</text>
        <text class="logo-subtitle">氟尿嘧啶口服乳售后服务平台</text>
      </view>

      <!-- 登录方式 -->
      <view class="login-card">
        <button class="btn-wechat" @click="onWechatLogin">
          <text class="btn-icon">💬</text>
          <text>微信一键登录</text>
        </button>

        <button class="btn-phone" @click="onPhoneLogin">
          <text class="btn-icon">📱</text>
          <text>手机号登录</text>
        </button>

        <view class="divider">
          <text class="divider-text">其他登录方式</text>
        </view>

        <view class="quick-login">
          <view class="quick-item" @click="onQuickLogin('qq')">
            <text class="quick-icon">🐧</text>
            <text class="quick-label">QQ</text>
          </view>
          <view class="quick-item" @click="onQuickLogin('apple')">
            <text class="quick-icon">🍎</text>
            <text class="quick-label">Apple</text>
          </view>
          <view class="quick-item" @click="onQuickLogin('alipay')">
            <text class="quick-icon">💙</text>
            <text class="quick-label">支付宝</text>
          </view>
        </view>
      </view>

      <!-- 协议 -->
      <view class="agreement">
        <view class="checkbox-row" @click="agreed = !agreed">
          <view :class="['checkbox', agreed ? 'checked' : '']">
            <text v-if="agreed" class="check-icon">✓</text>
          </view>
          <text class="agreement-text">
            登录即同意
            <text class="link" @click.stop="onViewAgreement('user')">《用户协议》</text>
            <text class="link" @click.stop="onViewAgreement('privacy')">《隐私政策》</text>
          </text>
        </view>
      </view>

      <!-- 风险提示 -->
      <view class="risk-alert">
        <text class="risk-icon">🛡️</text>
        <text class="risk-text">本平台仅供氟尿嘧啶口服乳患者使用，请如实填写身份信息。</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

const agreed = ref(false)

function onWechatLogin() {
  if (!checkAgreement()) return
  uni.showLoading({ title: '登录中...' })
  // 模拟登录（接入 wx.login 真实接口）
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1000)
  }, 800)
}

function onPhoneLogin() {
  if (!checkAgreement()) return
  uni.showModal({
    title: '手机号登录',
    content: '请输入手机号',
    editable: true,
    placeholderText: '请输入手机号',
    success: (res) => {
      if (res.confirm && res.content) {
        if (!/^1[3-9]\d{9}$/.test(res.content)) {
          uni.showToast({ title: '手机号格式错误', icon: 'none' })
          return
        }
        uni.showLoading({ title: '发送验证码...' })
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({ title: '验证码已发送', icon: 'success' })
        }, 600)
      }
    }
  })
}

function onQuickLogin(type) {
  if (!checkAgreement()) return
  const map = { qq: 'QQ', apple: 'Apple ID', alipay: '支付宝' }
  uni.showToast({ title: `${map[type]} 登录 · 开发中`, icon: 'none' })
}

function onViewAgreement(type) {
  const title = type === 'user' ? '用户协议' : '隐私政策'
  uni.showModal({ title, content: `${title} 全文 · 详见正式上线版本`, showCancel: false })
}

function checkAgreement() {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' })
    return false
  }
  return true
}
</script>

<style lang="scss" scoped>
@import "@/uni.scss";

.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, $uni-color-primary-bg 0%, #FFFFFF 30%);
}

.login-container {
  padding: 0 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0 64rpx;
}
.logo-icon {
  font-size: 128rpx;
  margin-bottom: 24rpx;
}
.logo-title {
  font-size: 48rpx;
  font-weight: 700;
  color: $uni-color-primary;
  margin-bottom: 8rpx;
}
.logo-subtitle {
  font-size: 26rpx;
  color: $uni-text-color-secondary;
}

.login-card {
  width: 100%;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 48rpx 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(10, 37, 64, 0.08);
}

.btn-wechat, .btn-phone {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  font-size: 32rpx;
  font-weight: 600;
  padding: 24rpx 0;
  border-radius: 48rpx;
  border: none;
  margin-bottom: 16rpx;
  &::after { border: none; }
}
.btn-wechat {
  background: #07C160;
  color: #FFFFFF;
}
.btn-phone {
  background: $uni-color-primary-bg;
  color: $uni-color-primary;
  border: 2rpx solid $uni-color-primary-light;
}
.btn-icon { font-size: 36rpx; }

.divider {
  display: flex;
  align-items: center;
  margin: 32rpx 0 24rpx;
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1rpx;
    background: $uni-border-color;
  }
}
.divider-text {
  font-size: 24rpx;
  color: $uni-text-color-grey;
  margin: 0 16rpx;
}

.quick-login {
  display: flex;
  justify-content: space-around;
}
.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx;
  transition: transform 0.2s;
  &:active { transform: scale(0.95); }
}
.quick-icon { font-size: 56rpx; margin-bottom: 8rpx; }
.quick-label { font-size: 22rpx; color: $uni-text-color-secondary; }

.agreement {
  margin-top: 32rpx;
  width: 100%;
}
.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}
.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid $uni-border-color;
  border-radius: 50%;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2rpx;
  &.checked {
    background: $uni-color-primary;
    border-color: $uni-color-primary;
  }
}
.check-icon { color: #FFFFFF; font-size: 24rpx; }
.agreement-text { font-size: 24rpx; color: $uni-text-color-secondary; line-height: 1.5; }
.link { color: $uni-color-primary; }

.risk-alert {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: $uni-color-primary-bg;
  border-radius: 12rpx;
  padding: 16rpx 24rpx;
  margin-top: 32rpx;
  width: 100%;
}
.risk-icon { font-size: 32rpx; }
.risk-text { font-size: 24rpx; color: $uni-text-color-secondary; flex: 1; }
</style>
