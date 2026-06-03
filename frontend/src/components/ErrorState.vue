<template>
  <view class="error-state">
    <view class="error-icon">{{ icon || '😢' }}</view>
    <view class="error-title">{{ title || '加载失败' }}</view>
    <view v-if="message" class="error-message">{{ message }}</view>
    <button v-if="retryText" class="error-retry" @click="$emit('retry')">
      {{ retryText }}
    </button>
  </view>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  retryText: { type: String, default: '重试' }
})
defineEmits(['retry'])
</script>

<style lang="scss" scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 32rpx;
  text-align: center;
}

.error-icon {
  font-size: 120rpx;
  margin-bottom: 24rpx;
}

.error-title {
  font-size: 30rpx;
  color: #212121;
  margin-bottom: 12rpx;
}

.error-message {
  font-size: 26rpx;
  color: #757575;
  margin-bottom: 24rpx;
  line-height: 1.5;
}

.error-retry {
  background: #1565C0;
  color: #FFFFFF;
  font-size: 28rpx;
  padding: 16rpx 48rpx;
  border-radius: 32rpx;
  border: none;
  line-height: 1.4;
}

.error-retry::after { border: none; }
</style>
