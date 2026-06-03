<template>
  <view class="reminder-page">
    <AppHeader title="复查提醒" />

    <!-- 统计卡片 -->
    <view class="summary-card">
      <view class="summary-item">
        <text class="summary-num urgent">2</text>
        <text class="summary-label">紧急</text>
      </view>
      <view class="summary-divider"></view>
      <view class="summary-item">
        <text class="summary-num">5</text>
        <text class="summary-label">待办</text>
      </view>
      <view class="summary-divider"></view>
      <view class="summary-item">
        <text class="summary-num done">12</text>
        <text class="summary-label">已完成</text>
      </view>
    </view>

    <!-- 提醒列表 -->
    <view class="section-title">🔔 即将到期</view>
    <view class="reminder-list">
      <view
        v-for="(r, i) in reminders"
        :key="i"
        :class="['reminder-item', r.priority]"
      >
        <view class="reminder-priority-bar"></view>
        <view class="reminder-content">
          <view class="reminder-header">
            <text class="reminder-title">{{ r.title }}</text>
            <text :class="['reminder-tag', r.priority]">{{ priorityText(r.priority) }}</text>
          </view>
          <text class="reminder-desc">{{ r.desc }}</text>
          <view class="reminder-meta">
            <text class="reminder-date">📅 {{ r.date }}</text>
            <text class="reminder-doctor">👨‍⚕️ {{ r.doctor }}</text>
          </view>
        </view>
        <view class="reminder-action">
          <button class="btn-action" @click="onAction(r)">查看</button>
        </view>
      </view>
    </view>

    <!-- 添加提醒 -->
    <view class="add-btn" @click="onAdd">
      <text class="add-icon">+</text>
      <text class="add-label">添加自定义提醒</text>
    </view>

    <MedicalAlert
      type="info"
      title="💡 复查建议"
      content="化疗期间建议每 2-4 周复查血常规，每 2-3 个月复查影像。具体请遵医嘱。"
    />
  </view>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import MedicalAlert from '@/components/MedicalAlert.vue'

const reminders = [
  {
    title: '血常规复查',
    desc: '监测白细胞、血小板等指标，评估骨髓抑制情况',
    date: '明天 09:00',
    doctor: '王医师',
    priority: 'urgent'
  },
  {
    title: '肝肾功能检查',
    desc: '评估化疗药物对肝肾的负担',
    date: '2026-06-05 09:00',
    doctor: '王医师',
    priority: 'urgent'
  },
  {
    title: '影像学复查（CT）',
    desc: '评估肿瘤大小变化，方案效果监测',
    date: '2026-06-15 14:00',
    doctor: '张主任',
    priority: 'normal'
  },
  {
    title: '肿瘤标志物检测',
    desc: 'CEA、CA19-9 等指标监测',
    date: '2026-06-20 10:00',
    doctor: '王医师',
    priority: 'normal'
  },
  {
    title: '门诊复诊',
    desc: '化疗方案调整评估',
    date: '2026-06-25 15:00',
    doctor: '张主任',
    priority: 'normal'
  }
]

function priorityText(p) {
  return { urgent: '紧急', normal: '普通' }[p] || ''
}

function onAction(r) {
  uni.showModal({
    title: r.title,
    content: `${r.date}\n${r.doctor}\n\n${r.desc}`,
    showCancel: false
  })
}

function onAdd() {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
@import "@/uni.scss";

.reminder-page {
  padding: 0 24rpx 32rpx;
  background: $uni-bg-color-grey;
  min-height: 100vh;
}

.summary-card {
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 16rpx 0 24rpx;
}
.summary-item {
  flex: 1;
  text-align: center;
}
.summary-num {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: $uni-text-color;
  &.urgent { color: $uni-color-error; }
  &.done { color: #4CAF50; }
}
.summary-label {
  display: block;
  font-size: 22rpx;
  color: $uni-text-color-secondary;
  margin-top: 4rpx;
}
.summary-divider {
  width: 1rpx;
  height: 60rpx;
  background: $uni-border-color;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $uni-text-color;
  margin: 24rpx 0 16rpx;
  display: block;
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.reminder-item {
  display: flex;
  background: #FFFFFF;
  border-radius: 12rpx;
  overflow: hidden;
  &.urgent { border: 2rpx solid rgba(244,67,54,0.2); }
}
.reminder-priority-bar {
  width: 8rpx;
  &.urgent { background: $uni-color-error; }
  &.normal { background: $uni-color-primary-light; }
}
.reminder-content {
  flex: 1;
  padding: 20rpx 16rpx;
}
.reminder-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 6rpx;
}
.reminder-title { font-size: 30rpx; font-weight: 600; color: $uni-text-color; }
.reminder-tag {
  font-size: 20rpx;
  padding: 2rpx 12rpx;
  border-radius: 16rpx;
  &.urgent { background: #FFEBEE; color: #B71C1C; }
  &.normal { background: #E3F2FD; color: #1565C0; }
}
.reminder-desc {
  display: block;
  font-size: 24rpx;
  color: $uni-text-color-secondary;
  line-height: 1.4;
}
.reminder-meta {
  display: flex;
  gap: 16rpx;
  margin-top: 8rpx;
}
.reminder-date, .reminder-doctor {
  font-size: 22rpx;
  color: $uni-text-color-secondary;
}

.reminder-action {
  display: flex;
  align-items: center;
  padding: 0 16rpx;
}
.btn-action {
  background: $uni-color-primary;
  color: #FFFFFF;
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  border: none;
  &::after { border: none; }
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  background: #FFFFFF;
  border: 2rpx dashed $uni-color-primary-light;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-top: 24rpx;
}
.add-icon {
  font-size: 36rpx;
  color: $uni-color-primary;
  font-weight: 600;
}
.add-label {
  font-size: 28rpx;
  color: $uni-color-primary;
}
</style>
