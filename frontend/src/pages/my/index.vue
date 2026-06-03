<template>
  <view class="my-page">
    <AppHeader title="我的" />

    <!-- 用户卡片 -->
    <view class="user-card">
      <view class="user-avatar">👤</view>
      <view class="user-info">
        <text class="user-name">{{ user.name }}</text>
        <text class="user-meta">已用药 {{ user.days }} 天 · 治疗中</text>
      </view>
      <view class="user-edit">编辑 ›</view>
    </view>

    <!-- 数据概览 -->
    <view class="stats-row">
      <view class="stat-item">
        <text class="stat-num">12</text>
        <text class="stat-label">连续打卡</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">3</text>
        <text class="stat-label">复查提醒</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">5</text>
        <text class="stat-label">学习记录</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">1</text>
        <text class="stat-label">家属账号</text>
      </view>
    </view>

    <!-- 我的服务 -->
    <view class="section-title">📋 我的服务</view>
    <view class="service-grid">
      <view
        v-for="s in services"
        :key="s.label"
        class="service-item"
        @click="onTap(s)"
      >
        <text class="service-icon">{{ s.icon }}</text>
        <text class="service-label">{{ s.label }}</text>
      </view>
    </view>

    <!-- 学习专区 -->
    <view class="section-title">🎓 我的学习</view>
    <view class="learning-list">
      <view class="learning-item">
        <text class="learning-icon">📚</text>
        <view class="learning-content">
          <text class="learning-title">已学课程</text>
          <text class="learning-meta">5 节 · 共 168 分钟</text>
        </view>
        <text class="learning-arrow">›</text>
      </view>
      <view class="learning-item">
        <text class="learning-icon">📖</text>
        <view class="learning-content">
          <text class="learning-title">已读故事</text>
          <text class="learning-meta">12 篇 · 73 分钟</text>
        </view>
        <text class="learning-arrow">›</text>
      </view>
      <view class="learning-item">
        <text class="learning-icon">🏆</text>
        <view class="learning-content">
          <text class="learning-title">学习成就</text>
          <text class="learning-meta">3 / 10 已解锁</text>
        </view>
        <text class="learning-arrow">›</text>
      </view>
    </view>

    <!-- 工具 -->
    <view class="section-title">⚙️ 工具</view>
    <view class="tools-list">
      <view
        v-for="t in tools"
        :key="t.label"
        class="tool-item"
        @click="onTap(t)"
      >
        <text class="tool-icon">{{ t.icon }}</text>
        <text class="tool-label">{{ t.label }}</text>
        <text class="tool-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

const user = ref({
  name: '张女士',
  days: 32
})

const services = [
  { icon: '📋', label: '电子药历', path: '' },
  { icon: '👨‍👩‍👧', label: '家属账号', path: '/pages/my/family' },
  { icon: '📦', label: '我的订单', path: '/pages/service/logistics' },
  { icon: '🎁', label: '我的福利', path: '' },
  { icon: '📞', label: '专属顾问', path: '/pages/service/chat' },
  { icon: '❓', label: '常见问题', path: '/pages/service/chat' },
  { icon: '💬', label: '意见反馈', path: '' },
  { icon: '⚙️', label: '设置', path: '/pages/my/settings' }
]

const tools = [
  { icon: '🔔', label: '消息通知' },
  { icon: '🔒', label: '账号安全' },
  { icon: '👨‍👩‍👧', label: '家属管理' },
  { icon: '📍', label: '地址管理' },
  { icon: '📜', label: '隐私协议' },
  { icon: 'ℹ️', label: '关于小福药' }
]

function onTap(item) {
  if (item.path) {
    uni.navigateTo({ url: item.path })
  } else {
    uni.showToast({ title: `${item.label} · 开发中`, icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
@import "@/uni.scss";

.my-page {
  padding: 0 24rpx 32rpx;
  background: $uni-bg-color-grey;
  min-height: 100vh;
}

.user-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, $uni-color-primary 0%, $uni-color-primary-light 100%);
  border-radius: 16rpx;
  padding: 32rpx;
  margin: 16rpx 0 24rpx;
  color: #FFFFFF;
}
.user-avatar {
  width: 96rpx;
  height: 96rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
  margin-right: 24rpx;
}
.user-info { flex: 1; }
.user-name { display: block; font-size: 36rpx; font-weight: 600; }
.user-meta { display: block; font-size: 24rpx; opacity: 0.9; margin-top: 4rpx; }
.user-edit { font-size: 26rpx; opacity: 0.9; }

.stats-row {
  display: flex;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx 0;
  margin-bottom: 24rpx;
}
.stat-item {
  flex: 1;
  text-align: center;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 16rpx;
    height: 40rpx;
    width: 1rpx;
    background: $uni-border-color;
  }
  &:last-child::after { display: none; }
}
.stat-num {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: $uni-color-primary;
}
.stat-label {
  display: block;
  font-size: 22rpx;
  color: $uni-text-color-secondary;
  margin-top: 4rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $uni-text-color;
  margin: 24rpx 0 16rpx;
  display: block;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
}
.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 0;
  transition: transform 0.2s;
  &:active { transform: scale(0.95); }
}
.service-icon { font-size: 48rpx; margin-bottom: 8rpx; }
.service-label { font-size: 24rpx; color: $uni-text-color; }

.learning-list, .tools-list {
  background: #FFFFFF;
  border-radius: 12rpx;
  overflow: hidden;
}
.learning-item, .tool-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid $uni-border-color;
  &:last-child { border-bottom: none; }
}
.learning-icon, .tool-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
}
.learning-content { flex: 1; }
.learning-title { display: block; font-size: 28rpx; color: $uni-text-color; }
.learning-meta { display: block; font-size: 22rpx; color: $uni-text-color-secondary; margin-top: 2rpx; }
.learning-arrow { font-size: 32rpx; color: $uni-text-color-grey; }

.tool-label { flex: 1; font-size: 28rpx; color: $uni-text-color; }
.tool-arrow { font-size: 32rpx; color: $uni-text-color-grey; }
</style>
