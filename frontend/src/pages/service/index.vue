<template>
  <view class="service-page">
    <AppHeader title="售后服务中心" subtitle="中和制药官方服务" />

    <!-- 用户问候卡片 -->
    <view class="greeting-card">
      <view class="greeting-content">
        <text class="greeting-time">{{ greeting.timeOfDay }}</text>
        <text class="greeting-name">{{ user.name }}</text>
      </view>
      <view class="streak-badge">
        <text class="streak-icon">🔥</text>
        <text class="streak-text">连续 {{ user.streak }} 天</text>
      </view>
    </view>

    <!-- 今日用药大卡片 -->
    <view class="medication-card">
      <view class="medication-content">
        <view class="medication-label">今日用药</view>
        <view class="medication-count">{{ user.todayDoses }} 次</view>
        <view class="medication-next">下次服药：{{ user.nextDose }}</view>
      </view>
      <view class="medication-icon">💊</view>
    </view>

    <!-- 8 大服务入口 -->
    <view class="section-title">
      <text>🛠️ 服务入口</text>
    </view>
    <view class="entry-grid">
      <view
        v-for="entry in entries"
        :key="entry.label"
        class="entry-item"
        @click="onNavigate(entry)"
      >
        <view class="entry-icon-wrap" :style="{background: entry.bg}">
          <text class="entry-icon">{{ entry.icon }}</text>
        </view>
        <text class="entry-label">{{ entry.label }}</text>
        <text v-if="entry.badge" class="entry-badge">{{ entry.badge }}</text>
      </view>
    </view>

    <!-- 用药打卡 · 14 天 -->
    <view class="section-title">
      <text>📅 用药打卡 · 连续 12 天</text>
      <text class="section-more" @click="onNavigate({path: '/pages/service/medication'})">查看详情 →</text>
    </view>
    <view class="streak-grid">
      <view v-for="d in weekDays" :key="d" class="streak-day-label">{{ d }}</view>
      <view
        v-for="(s, i) in streakDays"
        :key="i"
        class="streak-day"
        :class="s"
      >
        {{ i + 1 }}
      </view>
    </view>

    <!-- 紧急求助 -->
    <EmergencyButton :phone="config.emergencyPhone" />

    <!-- 风险提示 -->
    <MedicalAlert
      type="info"
      title="📞 服务时间"
      content="人工客服：周一至周日 8:00-22:00\n紧急热线：全天 24 小时"
    />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import EmergencyButton from '@/components/EmergencyButton.vue'
import MedicalAlert from '@/components/MedicalAlert.vue'
import { config } from '@/config'

const user = ref({
  name: '张女士',
  streak: 12,
  todayDoses: 3,
  nextDose: '14:00'
})

const greeting = computed(() => {
  const h = new Date().getHours()
  let timeOfDay = '早上好'
  if (h >= 12 && h < 18) timeOfDay = '下午好'
  else if (h >= 18) timeOfDay = '晚上好'
  return { timeOfDay }
})

const weekDays = ['一', '二', '三', '四', '五', '六', '日']

const streakDays = [
  'taken','taken','missed','taken','taken','taken',
  'taken','taken','taken','taken','today','future','future','future'
]

const entries = [
  { icon: '💊', label: '用药打卡', path: '/pages/service/medication', bg: '#E3F2FD', badge: '3/3' },
  { icon: '🔔', label: '复查提醒', path: '/pages/service/reminder', bg: '#FFF3E0', badge: '2' },
  { icon: '🚨', label: '不良反应', path: '/pages/service/aer', bg: '#FFEBEE' },
  { icon: '📞', label: '智能客服', path: '/pages/service/chat', bg: '#E8F5E9' },
  { icon: '📦', label: '物流查询', path: '/pages/service/logistics', bg: '#F3E5F5' },
  { icon: '📝', label: '健康档案', path: '/pages/my/index', bg: '#E0F7FA' },
  { icon: '🎁', label: '健康讲座', path: '/pages/academic/courses', bg: '#FFF8E1' },
  { icon: '👨‍👩‍👧', label: '家属账号', path: '/pages/my/family', bg: '#FCE4EC' }
]

function onNavigate(entry) {
  if (entry.path) {
    uni.navigateTo({ url: entry.path })
  }
}
</script>

<style lang="scss" scoped>
@import "@/uni.scss";

.service-page {
  padding: 0 24rpx 32rpx;
  background: $uni-bg-color-grey;
  min-height: 100vh;
}

.greeting-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, $uni-color-primary 0%, $uni-color-primary-light 100%);
  color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  margin: 16rpx 0 24rpx;
}

.greeting-time { font-size: 24rpx; opacity: 0.9; display: block; }
.greeting-name { font-size: 36rpx; font-weight: 600; margin-top: 4rpx; display: block; }

.streak-badge {
  background: rgba(255,255,255,0.2);
  border-radius: 32rpx;
  padding: 12rpx 20rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.streak-icon { font-size: 28rpx; }
.streak-text { font-size: 24rpx; }

.medication-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #FFFFFF 0%, #F0F8FF 100%);
  border: 2rpx solid $uni-color-primary-light;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}
.medication-content { flex: 1; }
.medication-label { font-size: 24rpx; color: $uni-text-color-secondary; }
.medication-count { font-size: 64rpx; font-weight: 700; color: $uni-color-primary; line-height: 1.2; }
.medication-next { font-size: 24rpx; color: $uni-text-color-secondary; margin-top: 4rpx; }
.medication-icon { font-size: 80rpx; }

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30rpx;
  font-weight: 600;
  color: $uni-text-color;
  margin: 32rpx 0 16rpx;
}
.section-more { font-size: 24rpx; color: $uni-color-primary-light; font-weight: 400; }

.entry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
}
.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 0;
  position: relative;
  transition: transform 0.2s;
  &:active { transform: scale(0.95); }
}
.entry-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
}
.entry-icon { font-size: 40rpx; }
.entry-label { font-size: 24rpx; color: $uni-text-color; }
.entry-badge {
  position: absolute;
  top: 8rpx;
  right: 16rpx;
  background: $uni-color-error;
  color: #FFFFFF;
  font-size: 20rpx;
  padding: 2rpx 12rpx;
  border-radius: 20rpx;
  min-width: 32rpx;
  text-align: center;
}

.streak-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
}
.streak-day-label {
  text-align: center;
  font-size: 22rpx;
  color: $uni-text-color-secondary;
  padding: 4rpx 0;
}
.streak-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  border-radius: 8rpx;
  &.taken { background: $uni-color-primary; color: #FFFFFF; font-weight: 600; }
  &.today { background: #FF9800; color: #FFFFFF; font-weight: 600; }
  &.missed { background: #FFEBEE; color: #F44336; }
  &.future { background: #F5F5F5; color: #999; }
}
</style>
