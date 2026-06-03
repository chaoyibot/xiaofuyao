<template>
  <view class="medication-card">
    <view class="medication-header">
      <view class="medication-name">{{ plan.medicineName }}</view>
      <view class="medication-dose">{{ plan.dosage }} · {{ plan.frequency }}</view>
    </view>
    <view class="medication-calendar">
      <view v-for="(day, idx) in weekDays" :key="idx" class="day-label">{{ day }}</view>
      <view
        v-for="(status, idx) in calendarStatus"
        :key="`d-${idx}`"
        :class="['day-cell', `day-${status}`]"
        @click="onDayClick(idx, status)"
      >
        {{ idx + 1 }}
      </view>
    </view>
    <view class="medication-streak">
      🔥 已连续打卡 <text class="streak-num">{{ streak }}</text> 天
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  plan: { type: Object, required: true },
  streak: { type: Number, default: 0 }
})

const emit = defineEmits(['checkin'])

const weekDays = ['一', '二', '三', '四', '五', '六', '日']

const calendarStatus = computed(() => {
  const total = 28
  const days = []
  const today = new Date().getDate()
  for (let i = 1; i <= total; i++) {
    if (i < today) {
      // 历史：随机模拟 95% 已打卡
      days.push(Math.random() < 0.95 ? 'taken' : 'missed')
    } else if (i === today) {
      days.push('today')
    } else {
      days.push('future')
    }
  }
  return days
})

function onDayClick(idx, status) {
  if (status === 'today' || status === 'future') {
    emit('checkin', idx)
  }
}
</script>

<style lang="scss" scoped>
.medication-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(10, 37, 64, 0.08);
  margin-bottom: 16rpx;
}

.medication-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #EEEEEE;
}

.medication-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #0A2540;
}

.medication-dose {
  font-size: 24rpx;
  color: #757575;
}

.medication-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.day-label {
  text-align: center;
  font-size: 22rpx;
  color: #757575;
  padding: 8rpx 0;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  font-size: 24rpx;
  transition: transform 0.2s;
}

.day-cell:active {
  transform: scale(0.9);
}

.day-taken {
  background: #1565C0;
  color: #FFFFFF;
  font-weight: 600;
}

.day-today {
  background: #FF9800;
  color: #FFFFFF;
  font-weight: 600;
}

.day-future {
  background: #F5F5F5;
  color: #999;
}

.day-missed {
  background: #FFEBEE;
  color: #F44336;
}

.medication-streak {
  text-align: center;
  font-size: 26rpx;
  color: #757575;
  padding-top: 8rpx;
}

.streak-num {
  color: #FF5722;
  font-weight: 600;
  font-size: 32rpx;
}
</style>
