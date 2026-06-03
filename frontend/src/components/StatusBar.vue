<template>
  <view class="status-bar" :style="statusBarStyle">
    <text class="status-time">{{ timeText }}</text>
    <view class="status-icons">
      <text class="status-icon">📶</text>
      <text class="status-icon">🔋</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  theme: { type: String, default: 'light', validator: v => ['light', 'dark'].includes(v) }
})

const timeText = ref('')
let timer = null

function updateTime() {
  const now = new Date()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  timeText.value = `${hh}:${mm}`
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 30000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const statusBarStyle = computed(() => ({
  color: props.theme === 'dark' ? '#FFFFFF' : '#212121'
}))
</script>

<style lang="scss" scoped>
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24rpx;
  height: 48rpx;
  font-size: 26rpx;
  font-weight: 600;
}

.status-icons {
  display: flex;
  gap: 8rpx;
}

.status-icon {
  font-size: 24rpx;
}
</style>
