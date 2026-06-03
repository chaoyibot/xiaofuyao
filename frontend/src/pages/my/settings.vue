<template>
  <view class="settings-page">
    <AppHeader title="设置" />

    <!-- 通知设置 -->
    <view class="section-title">🔔 通知设置</view>
    <view class="settings-card">
      <view class="setting-item">
        <view class="setting-left">
          <text class="setting-icon">💊</text>
          <view class="setting-info">
            <text class="setting-label">用药提醒</text>
            <text class="setting-desc">到点推送服药通知</text>
          </view>
        </view>
        <switch :checked="settings.medicationAlert" @change="e => settings.medicationAlert = e.detail.value" color="#0A2540" />
      </view>
      <view class="setting-item">
        <view class="setting-left">
          <text class="setting-icon">🔔</text>
          <view class="setting-info">
            <text class="setting-label">复查提醒</text>
            <text class="setting-desc">复查前 1 天推送</text>
          </view>
        </view>
        <switch :checked="settings.checkupAlert" @change="e => settings.checkupAlert = e.detail.value" color="#0A2540" />
      </view>
      <view class="setting-item">
        <view class="setting-left">
          <text class="setting-icon">📰</text>
          <view class="setting-info">
            <text class="setting-label">学术资讯</text>
            <text class="setting-desc">新文章/课程推送</text>
          </view>
        </view>
        <switch :checked="settings.academicAlert" @change="e => settings.academicAlert = e.detail.value" color="#0A2540" />
      </view>
    </view>

    <!-- 隐私设置 -->
    <view class="section-title">🔒 隐私设置</view>
    <view class="settings-card">
      <view class="setting-item" @click="onToggle('hideName')">
        <view class="setting-left">
          <text class="setting-icon">👤</text>
          <view class="setting-info">
            <text class="setting-label">隐藏真实姓名</text>
            <text class="setting-desc">对家属显示昵称</text>
          </view>
        </view>
        <switch :checked="settings.hideName" @change="e => settings.hideName = e.detail.value" color="#0A2540" />
      </view>
      <view class="setting-item" @click="onToggle('analytics')">
        <view class="setting-left">
          <text class="setting-icon">📊</text>
          <view class="setting-info">
            <text class="setting-label">使用分析</text>
            <text class="setting-desc">帮助改进产品体验</text>
          </view>
        </view>
        <switch :checked="settings.analytics" @change="e => settings.analytics = e.detail.value" color="#0A2540" />
      </view>
    </view>

    <!-- 通用设置 -->
    <view class="section-title">⚙️ 通用</view>
    <view class="settings-card">
      <view class="setting-item" @click="onClearCache">
        <view class="setting-left">
          <text class="setting-icon">🗑️</text>
          <view class="setting-info">
            <text class="setting-label">清除缓存</text>
            <text class="setting-desc">当前缓存：{{ cacheSize }}</text>
          </view>
        </view>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="onCheckUpdate">
        <view class="setting-left">
          <text class="setting-icon">🔄</text>
          <view class="setting-info">
            <text class="setting-label">检查更新</text>
            <text class="setting-desc">当前版本 v0.3.0</text>
          </view>
        </view>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="onView('agreement')">
        <view class="setting-left">
          <text class="setting-icon">📜</text>
          <view class="setting-info">
            <text class="setting-label">用户协议</text>
          </view>
        </view>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="onView('privacy')">
        <view class="setting-left">
          <text class="setting-icon">🛡️</text>
          <view class="setting-info">
            <text class="setting-label">隐私政策</text>
          </view>
        </view>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="onView('about')">
        <view class="setting-left">
          <text class="setting-icon">ℹ️</text>
          <view class="setting-info">
            <text class="setting-label">关于小福药</text>
            <text class="setting-desc">v0.3.0</text>
          </view>
        </view>
        <text class="setting-arrow">›</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <button class="btn-logout" @click="onLogout">退出登录</button>

    <!-- 风险提示 -->
    <MedicalAlert
      type="info"
      title="💡 隐私保护"
      content="您的所有数据均加密存储，我们不会将医疗信息用于商业用途。"
    />
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import MedicalAlert from '@/components/MedicalAlert.vue'

const settings = reactive({
  medicationAlert: true,
  checkupAlert: true,
  academicAlert: false,
  hideName: false,
  analytics: true
})

const cacheSize = ref('2.4 MB')

function onToggle(key) {
  settings[key] = !settings[key]
}

function onClearCache() {
  uni.showModal({
    title: '清除缓存',
    content: '确定要清除本地缓存吗？',
    success: (res) => {
      if (res.confirm) {
        cacheSize.value = '0 KB'
        uni.showToast({ title: '清除成功', icon: 'success' })
      }
    }
  })
}

function onCheckUpdate() {
  uni.showLoading({ title: '检查中...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '已是最新版本', icon: 'success' })
  }, 1000)
}

function onView(type) {
  const map = {
    agreement: '用户协议',
    privacy: '隐私政策',
    about: '关于小福药'
  }
  uni.showModal({
    title: map[type],
    content: type === 'about' ? '小福药 v0.3.0\n中和制药官方出品\n© 2026 Zhonghe Pharma' : '详见正式上线版本',
    showCancel: false
  })
}

function onLogout() {
  uni.showModal({
    title: '退出登录',
    content: '退出后您将无法接收用药提醒',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已退出', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 800)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@import "@/uni.scss";

.settings-page {
  padding: 0 24rpx 32rpx;
  background: $uni-bg-color-grey;
  min-height: 100vh;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $uni-text-color;
  margin: 24rpx 0 12rpx;
  display: block;
}

.settings-card {
  background: #FFFFFF;
  border-radius: 12rpx;
  overflow: hidden;
  margin-bottom: 8rpx;
}
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  border-bottom: 1rpx solid $uni-border-color;
  &:last-child { border-bottom: none; }
}
.setting-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}
.setting-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
}
.setting-info { flex: 1; }
.setting-label {
  display: block;
  font-size: 28rpx;
  color: $uni-text-color;
}
.setting-desc {
  display: block;
  font-size: 22rpx;
  color: $uni-text-color-secondary;
  margin-top: 4rpx;
}
.setting-arrow {
  font-size: 32rpx;
  color: $uni-text-color-grey;
}

.btn-logout {
  width: 100%;
  background: #FFEBEE;
  color: #B71C1C;
  font-size: 30rpx;
  font-weight: 500;
  padding: 24rpx 0;
  border-radius: 12rpx;
  border: none;
  margin: 32rpx 0 16rpx;
  &::after { border: none; }
}
</style>
