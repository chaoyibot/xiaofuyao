<template>
  <view class="story-card" @click="$emit('click')">
    <view class="story-image">
      <text class="story-emoji">📖</text>
    </view>
    <view class="story-content">
      <view class="story-title">{{ story.title }}</view>
      <view class="story-summary">{{ story.summary }}</view>
      <view class="story-tags">
        <text v-for="tag in (story.indications || []).slice(0, 2)" :key="tag" class="story-tag">
          {{ tag }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  story: { type: Object, required: true }
})
defineEmits(['click'])
</script>

<style lang="scss" scoped>
.story-card {
  display: flex;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(10, 37, 64, 0.08);
  margin-bottom: 16rpx;
  transition: transform 0.2s;
}

.story-card:active {
  transform: scale(0.98);
}

.story-image {
  width: 128rpx;
  height: 128rpx;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.story-emoji {
  font-size: 64rpx;
}

.story-content {
  flex: 1;
  min-width: 0;
}

.story-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #212121;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.story-summary {
  font-size: 26rpx;
  color: #757575;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8rpx;
}

.story-tags {
  display: flex;
  gap: 8rpx;
}

.story-tag {
  font-size: 20rpx;
  padding: 2rpx 12rpx;
  background: #E3F2FD;
  color: #1565C0;
  border-radius: 16rpx;
}
</style>
