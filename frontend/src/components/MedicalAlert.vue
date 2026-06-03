<template>
  <view :class="['medical-alert', `alert-${type}`]">
    <view v-if="title" class="alert-title">{{ title }}</view>
    <view class="alert-content">
      <slot>{{ content }}</slot>
    </view>
  </view>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (v) => ['info', 'warning', 'danger', 'success'].includes(v)
  },
  title: { type: String, default: '' },
  content: { type: String, default: '' }
})
</script>

<style lang="scss" scoped>
.medical-alert {
  padding: 20rpx 24rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  line-height: 1.5;
  margin-bottom: 16rpx;
}

.alert-info {
  background: #E3F2FD;
  border-left: 6rpx solid #2196F3;
  color: #0D47A1;
}

.alert-warning {
  background: #FFF3E0;
  border-left: 6rpx solid #FF9800;
  color: #E65100;
}

.alert-danger {
  background: #FFEBEE;
  border-left: 6rpx solid #F44336;
  color: #B71C1C;
}

.alert-success {
  background: #E8F5E9;
  border-left: 6rpx solid #4CAF50;
  color: #1B5E20;
}

.alert-title {
  font-weight: 600;
  margin-bottom: 8rpx;
}
</style>
