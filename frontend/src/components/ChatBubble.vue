<template>
  <view :class="['chat-bubble', `bubble-${role}`]">
    <view v-if="role === 'bot'" class="bubble-avatar">🤖</view>
    <view class="bubble-content">
      <view v-if="text" class="bubble-text">{{ text }}</view>
      <slot />
    </view>
    <view v-if="role === 'user'" class="bubble-avatar">👤</view>
  </view>
</template>

<script setup>
defineProps({
  role: { type: String, default: 'bot', validator: v => ['bot', 'user'].includes(v) },
  text: { type: String, default: '' }
})
</script>

<style lang="scss" scoped>
.chat-bubble {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;
  gap: 12rpx;
}

.bubble-bot { justify-content: flex-start; }
.bubble-user { justify-content: flex-end; }

.bubble-avatar {
  width: 64rpx;
  height: 64rpx;
  background: #E3F2FD;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  flex-shrink: 0;
}

.bubble-content {
  max-width: 70%;
  padding: 16rpx 24rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  line-height: 1.5;
  word-wrap: break-word;
}

.bubble-bot .bubble-content {
  background: #F5F5F5;
  color: #212121;
}

.bubble-user .bubble-content {
  background: #1565C0;
  color: #FFFFFF;
}
</style>
