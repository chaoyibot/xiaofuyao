<template>
  <view class="medication-page">
    <AppHeader title="用药管理" />

    <!-- 顶部统计 -->
    <view class="stat-card">
      <view class="stat-row">
        <view class="stat-block">
          <text class="stat-num">12</text>
          <text class="stat-label">连续打卡</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-block">
          <text class="stat-num">86%</text>
          <text class="stat-label">完成率</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-block">
          <text class="stat-num">3/3</text>
          <text class="stat-label">今日</text>
        </view>
      </view>
    </view>

    <!-- 今日用药计划 -->
    <view class="section-title">
      <text>📋 今日用药计划</text>
    </view>
    <view class="plan-list">
      <view
        v-for="(dose, i) in todayDoses"
        :key="i"
        :class="['dose-item', dose.status]"
      >
        <view class="dose-time">
          <text class="dose-hour">{{ dose.hour }}</text>
          <text class="dose-status">{{ doseStatusText(dose.status) }}</text>
        </view>
        <view class="dose-content">
          <view class="dose-amount">💊 {{ dose.amount }}</view>
          <view class="dose-note">{{ dose.note }}</view>
        </view>
        <view class="dose-action">
          <button
            v-if="dose.status === 'pending'"
            class="btn-checkin"
            @click="checkin(i)"
          >打卡</button>
          <text v-else class="dose-checked">✓</text>
        </view>
      </view>
    </view>

    <!-- 14 天日历 -->
    <view class="section-title">
      <text>📅 14 天打卡日历</text>
    </view>
    <view class="calendar">
      <view v-for="d in weekDays" :key="d" class="calendar-day-label">{{ d }}</view>
      <view
        v-for="(s, i) in calendarDays"
        :key="i"
        class="calendar-day"
        :class="s"
      >
        <text class="day-num">{{ i + 1 }}</text>
        <text class="day-mark">{{ s === 'taken' ? '✓' : s === 'missed' ? '✗' : s === 'today' ? '今' : '' }}</text>
      </view>
    </view>

    <!-- 情绪记录 -->
    <view class="section-title">
      <text>😊 今日感受</text>
    </view>
    <view class="mood-grid">
      <view
        v-for="m in moods"
        :key="m.key"
        :class="['mood-item', mood === m.key ? 'selected' : '']"
        @click="mood = m.key"
      >
        <text class="mood-icon">{{ m.icon }}</text>
        <text class="mood-label">{{ m.label }}</text>
      </view>
    </view>
    <view class="mood-notes">
      <textarea
        v-model="notes"
        class="notes-input"
        placeholder="补充说明（可选）"
        maxlength="200"
      />
    </view>

    <!-- 风险提示 -->
    <MedicalAlert
      type="warning"
      title="⚠️ 用药提醒"
      content="请按时服药，不要擅自调整剂量。如有不适，及时联系医师或上报不良反应。"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import MedicalAlert from '@/components/MedicalAlert.vue'

const todayDoses = ref([
  { hour: '08:00', amount: '400mg（1 支）', note: '早餐后 30 分钟服用', status: 'taken' },
  { hour: '14:00', amount: '400mg（1 支）', note: '午餐后 30 分钟服用', status: 'pending' },
  { hour: '20:00', amount: '400mg（1 支）', note: '晚餐后 30 分钟服用', status: 'pending' }
])

const weekDays = ['一', '二', '三', '四', '五', '六', '日']
const calendarDays = ref([
  'taken','taken','missed','taken','taken','taken','taken',
  'taken','taken','taken','today','future','future','future'
])

const moods = [
  { key: 'great', icon: '😄', label: '很好' },
  { key: 'good', icon: '🙂', label: '不错' },
  { key: 'normal', icon: '😐', label: '一般' },
  { key: 'tired', icon: '😪', label: '疲倦' },
  { key: 'sick', icon: '🤒', label: '不适' }
]

const mood = ref('good')
const notes = ref('')

function doseStatusText(s) {
  return { taken: '已服', pending: '待服', missed: '漏服' }[s] || ''
}

function checkin(idx) {
  todayDoses.value[idx].status = 'taken'
  uni.showToast({ title: '打卡成功 ✓', icon: 'success' })
}
</script>

<style lang="scss" scoped>
@import "@/uni.scss";

.medication-page {
  padding: 0 24rpx 32rpx;
  background: $uni-bg-color-grey;
  min-height: 100vh;
}

.stat-card {
  background: linear-gradient(135deg, $uni-color-primary 0%, $uni-color-primary-light 100%);
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  margin: 16rpx 0 24rpx;
  color: #FFFFFF;
}
.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.stat-block {
  flex: 1;
  text-align: center;
}
.stat-num {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  line-height: 1.2;
}
.stat-label {
  display: block;
  font-size: 22rpx;
  opacity: 0.9;
  margin-top: 4rpx;
}
.stat-divider {
  width: 1rpx;
  height: 60rpx;
  background: rgba(255,255,255,0.3);
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $uni-text-color;
  margin: 32rpx 0 16rpx;
  display: block;
}

.plan-list {
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}
.dose-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid $uni-border-color;
  &:last-child { border-bottom: none; }
  &.taken { background: #F1F8E9; }
  &.pending { background: #FFF8E1; }
}
.dose-time {
  width: 120rpx;
  text-align: center;
  margin-right: 16rpx;
}
.dose-hour {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: $uni-color-primary;
}
.dose-status {
  display: block;
  font-size: 20rpx;
  margin-top: 4rpx;
  &.taken { color: #4CAF50; }
  &.pending { color: #FF9800; }
}
.dose-content {
  flex: 1;
}
.dose-amount { font-size: 28rpx; font-weight: 500; color: $uni-text-color; }
.dose-note { font-size: 22rpx; color: $uni-text-color-secondary; margin-top: 4rpx; }

.dose-action { margin-left: 16rpx; }
.btn-checkin {
  background: $uni-color-primary;
  color: #FFFFFF;
  font-size: 24rpx;
  padding: 8rpx 24rpx;
  border-radius: 24rpx;
  border: none;
  line-height: 1.4;
  &::after { border: none; }
}
.dose-checked {
  font-size: 48rpx;
  color: #4CAF50;
  font-weight: 600;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
}
.calendar-day-label {
  text-align: center;
  font-size: 22rpx;
  color: $uni-text-color-secondary;
  padding: 4rpx 0;
}
.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  &.taken { background: $uni-color-primary; color: #FFFFFF; }
  &.today { background: #FF9800; color: #FFFFFF; border: 2rpx solid #F57C00; }
  &.missed { background: #FFEBEE; color: #F44336; }
  &.future { background: #F5F5F5; color: #999; }
}
.day-num { font-size: 24rpx; font-weight: 500; }
.day-mark { font-size: 18rpx; margin-top: 2rpx; }

.mood-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12rpx;
}
.mood-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 8rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s;
  &.selected {
    border-color: $uni-color-primary;
    background: $uni-color-primary-bg;
  }
}
.mood-icon { font-size: 48rpx; margin-bottom: 4rpx; }
.mood-label { font-size: 22rpx; color: $uni-text-color; }

.mood-notes { margin-top: 16rpx; }
.notes-input {
  width: 100%;
  min-height: 120rpx;
  padding: 16rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
  font-size: 26rpx;
  box-sizing: border-box;
}
</style>
