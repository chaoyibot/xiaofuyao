<template>
  <view class="empty-state">
    <view class="empty-icon">{{ icon || '📭' }}</view>
    <view class="empty-title">{{ title || '暂无数据' }}</view>
    <view v-if="description" class="empty-desc">{{ description }}</view>
    <button v-if="actionText" class="empty-action" @click="$emit('action')">
      {{ actionText }}
    </button>
  </view>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  actionText: { type: String, default: '' }
})
defineEmits(['action'])
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 32rpx;
  text-align: center;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 24rpx;
  opacity: 0.5;
}

.empty-title {
  font-size: 30rpx;
  color: #212121;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #757575;
  margin-bottom: 24rpx;
  line-height: 1.5;
}

.empty-action {
  background: #1565C0;
  color: #FFFFFF;
  font-size: 28rpx;
  padding: 16rpx 48rpx;
  border-radius: 32rpx;
  border: none;
  line-height: 1.4;
}

.empty-action::after { border: none; }
</style>
