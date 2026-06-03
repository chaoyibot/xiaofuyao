<script setup>
import { ref, computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import DocCard from '@/components/DocCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { academicDocs, keyFindings } from '@/mock/academic'

const activeTab = ref('all')
const themes = [
  { key: 'all', label: '全部' },
  { key: '药代动力学', label: '药代' },
  { key: '临床疗效', label: '疗效' },
  { key: '安全性', label: '安全' },
  { key: '适应症', label: '适应症' },
  { key: '联合用药', label: '联合' },
  { key: '乳剂优势', label: '乳剂' }
]

const filtered = computed(() => {
  if (activeTab.value === 'all') return academicDocs
  return academicDocs.filter(d => d.theme === activeTab.value)
})

function onDocClick(doc) {
  uni.navigateTo({ url: `/pages/academic/detail?id=${doc.id}&theme=${doc.theme}` })
}

function goToCalculator() {
  uni.navigateTo({ url: '/pages/academic/calculator' })
}

function goToCourses() {
  uni.navigateTo({ url: '/pages/academic/courses' })
}
</script>

<template>
  <view class="academic-page">
    <AppHeader title="学术中心" subtitle="权威研究 · 临床指南 · 培训课件" />

    <!-- 关键数据 -->
    <view class="stats-row">
      <view class="stat-item">
        <text class="stat-num">{{ academicDocs.length }}</text>
        <text class="stat-label">研究章节</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">{{ keyFindings.length }}</text>
        <text class="stat-label">关键发现</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">6</text>
        <text class="stat-label">研究主题</text>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-grid">
      <view class="quick-item" @click="goToCalculator">
        <text class="quick-icon">🧮</text>
        <text class="quick-label">剂量计算器</text>
      </view>
      <view class="quick-item" @click="goToCourses">
        <text class="quick-icon">📚</text>
        <text class="quick-label">培训课件</text>
      </view>
    </view>

    <!-- 主题 Tab -->
    <view class="tab-bar">
      <view
        v-for="t in themes"
        :key="t.key"
        :class="['tab-item', activeTab === t.key ? 'tab-active' : '']"
        @click="activeTab = t.key"
      >
        {{ t.label }}
      </view>
    </view>

    <!-- 文献列表 -->
    <view class="doc-list">
      <DocCard
        v-for="doc in filtered.slice(0, 30)"
        :key="doc.id"
        :doc="doc"
        @click="onDocClick(doc)"
      />
      <EmptyState
        v-if="filtered.length === 0"
        title="该主题暂无文献"
        description="正在持续更新中"
      />
    </view>

    <view v-if="filtered.length > 30" class="load-more">
      展示前 30 条，共 {{ filtered.length }} 条
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import "@/uni.scss";

.academic-page {
  min-height: 100vh;
  background: $uni-bg-color-grey;
  padding-bottom: 32rpx;
}

.stats-row {
  display: flex;
  background: #FFFFFF;
  margin: 24rpx;
  padding: 32rpx 0;
  border-radius: $uni-border-radius-lg;
  box-shadow: $uni-shadow-sm;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 48rpx;
  font-weight: 600;
  color: $uni-color-primary;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: $uni-text-color-secondary;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  padding: 0 24rpx 24rpx;
}

.quick-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: linear-gradient(135deg, $uni-color-primary 0%, $uni-color-primary-light 100%);
  border-radius: $uni-border-radius-lg;
  color: #FFFFFF;
}

.quick-icon {
  font-size: 48rpx;
  margin-right: 16rpx;
}

.quick-label {
  font-size: 30rpx;
  font-weight: 600;
}

.tab-bar {
  display: flex;
  background: #FFFFFF;
  padding: 16rpx 24rpx;
  overflow-x: auto;
  white-space: nowrap;
}

.tab-item {
  padding: 12rpx 24rpx;
  font-size: 26rpx;
  color: $uni-text-color-secondary;
  border-radius: 32rpx;
  margin-right: 8rpx;
  flex-shrink: 0;
}

.tab-active {
  background: $uni-color-primary;
  color: #FFFFFF;
  font-weight: 600;
}

.doc-list {
  padding: 24rpx;
}

.load-more {
  text-align: center;
  padding: 32rpx;
  font-size: 24rpx;
  color: $uni-text-color-grey;
}
</style>
