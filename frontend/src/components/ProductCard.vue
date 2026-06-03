<template>
  <view class="product-card" @click="$emit('click')">
    <view class="product-image">
      <text class="product-emoji">{{ product.emoji || '💊' }}</text>
    </view>
    <view class="product-info">
      <view class="product-name">{{ product.name }}</view>
      <view class="product-en-name">{{ product.enName }}</view>
      <view class="product-tags">
        <text v-for="tag in product.tags" :key="tag" class="product-tag">{{ tag }}</text>
      </view>
    </view>
    <view class="product-arrow">›</view>
  </view>
</template>

<script setup>
defineProps({
  product: { type: Object, required: true }
})
defineEmits(['click'])
</script>

<style lang="scss" scoped>
.product-card {
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(10, 37, 64, 0.08);
  margin-bottom: 16rpx;
  transition: transform 0.2s;
}

.product-card:active {
  transform: scale(0.98);
}

.product-image {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.product-emoji {
  font-size: 64rpx;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #0A2540;
  margin-bottom: 4rpx;
}

.product-en-name {
  font-size: 24rpx;
  color: #757575;
  margin-bottom: 8rpx;
}

.product-tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}

.product-tag {
  font-size: 20rpx;
  padding: 2rpx 12rpx;
  background: #E3F2FD;
  color: #1565C0;
  border-radius: 16rpx;
}

.product-arrow {
  color: #BDBDBD;
  font-size: 32rpx;
}
</style>
