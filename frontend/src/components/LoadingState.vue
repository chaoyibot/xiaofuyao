<template>
  <view class="loading-state">
    <view class="loading-spinner" />
    <view v-if="text" class="loading-text">{{ text }}</view>
  </view>
</template>

<script setup>
defineProps({
  text: { type: String, default: '加载中...' }
})
</script>

<style lang="scss" scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 32rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #E3F2FD;
  border-top-color: #1565C0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #757575;
}
</style>
