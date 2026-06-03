<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StoryCard from '@/components/StoryCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { articles, articlesByIndication } from '@/mock/articles'

const activeTab = ref('all')
const tabs = [
  { key: 'all', label: '全部' },
  { key: '结直肠癌', label: '结直肠癌' },
  { key: '胃癌', label: '胃癌' },
  { key: '乳腺癌', label: '乳腺癌' },
  { key: '头颈肿瘤', label: '头颈肿瘤' }
]

const displayList = computed(() => {
  if (activeTab.value === 'all') return articles
  return articlesByIndication[activeTab.value] || []
})

function onTabClick(key) {
  activeTab.value = key
}

function onStoryClick(story) {
  uni.navigateTo({ url: `/pages/story/detail?id=${story.id}` })
}
</script>

<template>
  <view class="story-list-page">
    <view class="page-header">
      <view class="header-title">📖 患者故事</view>
      <view class="header-subtitle">真实患者康复经历分享</view>
    </view>

    <!-- Tab 切换 -->
    <view class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-item', activeTab === tab.key ? 'tab-active' : '']"
        @click="onTabClick(tab.key)"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 列表 -->
    <view class="story-list">
      <StoryCard
        v-for="story in displayList.slice(0, 30)"
        :key="story.id"
        :story="story"
        @click="onStoryClick(story)"
      />
      <EmptyState
        v-if="displayList.length === 0"
        title="该分类暂无故事"
        description="我们正在收集更多患者故事，敬请期待"
      />
    </view>

    <view v-if="displayList.length > 30" class="load-more">
      展示前 30 条，共 {{ displayList.length }} 条
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import "@/uni.scss";

.story-list-page {
  min-height: 100vh;
  background: $uni-bg-color-grey;
}

.page-header {
  background: linear-gradient(135deg, $uni-color-primary 0%, $uni-color-primary-light 100%);
  padding: 48rpx 32rpx 32rpx;
  color: #FFFFFF;
}

.header-title {
  font-size: 44rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.header-subtitle {
  font-size: 26rpx;
  opacity: 0.9;
}

.tab-bar {
  display: flex;
  background: #FFFFFF;
  padding: 16rpx 0;
  position: sticky;
  top: 0;
  z-index: 10;
  overflow-x: auto;
  white-space: nowrap;
}

.tab-item {
  padding: 12rpx 32rpx;
  font-size: 28rpx;
  color: $uni-text-color-secondary;
  border-radius: 32rpx;
  margin: 0 8rpx;
  flex-shrink: 0;
}

.tab-active {
  background: $uni-color-primary;
  color: #FFFFFF;
  font-weight: 600;
}

.story-list {
  padding: 24rpx;
}

.load-more {
  text-align: center;
  padding: 32rpx;
  font-size: 24rpx;
  color: $uni-text-color-grey;
}
</style>
