<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppHeader from '@/components/AppHeader.vue'
import MedicalAlert from '@/components/MedicalAlert.vue'
import { articles } from '@/mock/articles'

const story = ref(null)
const storyId = ref(null)

onLoad((options) => {
  storyId.value = parseInt(options?.id) || 0
  loadStory()
})

function loadStory() {
  story.value = articles.find(a => a.id === storyId.value)
}

function onBack() {
  uni.navigateBack()
}
</script>

<template>
  <view class="story-detail-page" v-if="story">
    <AppHeader :title="story.title.slice(0, 10) + '...'" />

    <view class="story-content">
      <view class="story-title">{{ story.title }}</view>

      <view class="story-tags">
        <text v-for="tag in story.indications" :key="tag" class="tag">{{ tag }}</text>
      </view>

      <view class="meta-row">
        <text class="meta-label">字数</text>
        <text class="meta-value">{{ story.word_count }} 字</text>
      </view>

      <view class="story-summary">
        <text class="summary-label">📝 摘要</text>
        <text class="summary-text">{{ story.summary }}</text>
      </view>

      <view class="story-content-text">
        <text class="content-text">{{ story.content_preview }}</text>
      </view>

      <MedicalAlert
        type="info"
        title="📋 内容提示"
        content="本文为患者故事分享，案例仅供参考，具体治疗方案请遵医嘱。"
      />
    </view>
  </view>

  <view v-else class="empty">
    <text>加载中...</text>
  </view>
</template>

<style lang="scss" scoped>
@import "@/uni.scss";

.story-detail-page {
  min-height: 100vh;
  background: $uni-bg-color-grey;
}

.story-content {
  background: #FFFFFF;
  padding: 32rpx;
  margin: 24rpx;
  border-radius: $uni-border-radius-lg;
  box-shadow: $uni-shadow-sm;
}

.story-title {
  font-size: 40rpx;
  font-weight: 600;
  color: $uni-color-primary;
  line-height: 1.4;
  margin-bottom: 16rpx;
}

.story-tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
  margin-bottom: 16rpx;
}

.tag {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  background: $uni-color-primary-bg;
  color: $uni-color-primary;
  border-radius: 16rpx;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $uni-border-color;
  margin-bottom: 24rpx;
}

.meta-label { font-size: 26rpx; color: $uni-text-color-secondary; }
.meta-value { font-size: 26rpx; color: $uni-text-color; }

.summary-label {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: $uni-color-primary;
  margin-bottom: 12rpx;
}

.summary-text {
  font-size: 28rpx;
  line-height: 1.6;
  color: $uni-text-color;
  display: block;
  margin-bottom: 32rpx;
}

.content-text {
  font-size: 28rpx;
  line-height: 1.8;
  color: $uni-text-color;
  display: block;
  white-space: pre-wrap;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: $uni-text-color-secondary;
}
</style>
