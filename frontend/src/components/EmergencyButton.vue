<template>
  <view class="emergency-button" @click="onCall">
    <view class="emergency-icon">🆘</view>
    <view class="emergency-content">
      <view class="emergency-title">紧急求助</view>
      <view class="emergency-desc">严重不良反应？立即接通医师</view>
    </view>
    <button class="emergency-call-btn" @click.stop="onCall">立即拨打</button>
  </view>
</template>

<script setup>
const props = defineProps({
  phone: { type: String, default: '400-888-XXXX' }
})

const emit = defineEmits(['call'])

function onCall() {
  uni.showModal({
    title: '紧急求助',
    content: `确认拨打医师电话 ${props.phone}？`,
    confirmText: '立即拨打',
    success: (res) => {
      if (res.confirm) {
        uni.makePhoneCall({ phoneNumber: props.phone })
        emit('call')
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.emergency-button {
  display: flex;
  align-items: center;
  background: #FFEBEE;
  border-left: 6rpx solid #F44336;
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 16rpx 0;
}

.emergency-icon {
  font-size: 60rpx;
  margin-right: 24rpx;
}

.emergency-content {
  flex: 1;
}

.emergency-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #B71C1C;
  margin-bottom: 4rpx;
}

.emergency-desc {
  font-size: 24rpx;
  color: #B71C1C;
}

.emergency-call-btn {
  background: #F44336;
  color: #FFFFFF;
  font-size: 26rpx;
  font-weight: 600;
  padding: 12rpx 24rpx;
  border-radius: 32rpx;
  border: none;
  line-height: 1.4;
}

.emergency-call-btn::after {
  border: none;
}
</style>
