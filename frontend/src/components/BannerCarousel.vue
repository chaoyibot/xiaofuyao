<template>
  <view class="banner-carousel" v-if="items.length">
    <swiper
      class="banner-swiper"
      :indicator-dots="true"
      :autoplay="true"
      :interval="4000"
      :duration="500"
      indicator-color="rgba(255,255,255,0.5)"
      indicator-active-color="#FFFFFF"
    >
      <swiper-item v-for="(item, idx) in items" :key="idx" @click="onItemClick(item)">
        <view class="banner-item" :style="bannerStyle(item)">
          <view class="banner-content">
            <view class="banner-title">{{ item.title }}</view>
            <view class="banner-subtitle">{{ item.subtitle }}</view>
          </view>
          <view v-if="item.icon" class="banner-icon">{{ item.icon }}</view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] }
})

const emit = defineEmits(['click'])

function onItemClick(item) {
  emit('click', item)
}

function bannerStyle(item) {
  return {
    background: item.background || 'linear-gradient(135deg, #0A2540 0%, #1565C0 100%)'
  }
}
</script>

<style lang="scss" scoped>
.banner-carousel {
  margin-bottom: 24rpx;
}

.banner-swiper {
  height: 280rpx;
  border-radius: 24rpx;
  overflow: hidden;
}

.banner-item {
  height: 100%;
  padding: 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #FFFFFF;
}

.banner-title {
  font-size: 40rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.banner-subtitle {
  font-size: 26rpx;
  opacity: 0.9;
}

.banner-icon {
  font-size: 96rpx;
  opacity: 0.5;
}
</style>
