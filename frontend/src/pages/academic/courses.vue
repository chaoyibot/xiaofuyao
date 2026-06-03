<script setup>
import { ref, computed } from 'vue'
import { academicDocs } from '@/mock/academic'

const activeCategory = ref('all')

// 模拟课件数据
const courses = ref([
  {
    id: 1,
    title: '氟尿嘧啶口服乳临床应用专家共识',
    category: '指南',
    duration: '45 分钟',
    instructor: '李教授 · 中山大学肿瘤防治中心',
    cover: '🎓',
    level: '高级'
  },
  {
    id: 2,
    title: '结直肠癌辅助化疗方案优化',
    category: '专题',
    duration: '32 分钟',
    instructor: '张主任 · 北京肿瘤医院',
    cover: '🎗️',
    level: '中级'
  },
  {
    id: 3,
    title: '化疗药物不良反应管理实操',
    category: '实操',
    duration: '28 分钟',
    instructor: '王医师 · 复旦肿瘤医院',
    cover: '⚠️',
    level: '中级'
  },
  {
    id: 4,
    title: '口服化疗患者依从性提升',
    category: '管理',
    duration: '22 分钟',
    instructor: '陈护士长 · 中山医护理部',
    cover: '💊',
    level: '初级'
  },
  {
    id: 5,
    title: '胃癌围手术期化疗进展',
    category: '专题',
    duration: '38 分钟',
    instructor: '刘教授 · 上海瑞金医院',
    cover: '🩺',
    level: '高级'
  },
  {
    id: 6,
    title: '乳腺癌化疗新进展',
    category: '专题',
    duration: '35 分钟',
    instructor: '黄教授 · 复旦肿瘤医院',
    cover: '🎀',
    level: '高级'
  }
])

const categories = [
  { key: 'all', label: '全部' },
  { key: '指南', label: '指南' },
  { key: '专题', label: '专题' },
  { key: '实操', label: '实操' },
  { key: '管理', label: '管理' }
]

const filtered = computed(() => {
  if (activeCategory.value === 'all') return courses.value
  return courses.value.filter(c => c.category === activeCategory.value)
})

function onCourseClick(course) {
  uni.showToast({ title: '课件详情（开发中）', icon: 'none' })
}
</script>

<template>
  <view class="courses-page">
    <view class="page-header">
      <view class="header-title">📚 培训课件</view>
      <view class="header-subtitle">专家讲座 · 临床实操 · 培训认证</view>
    </view>

    <view class="category-bar">
      <view
        v-for="c in categories"
        :key="c.key"
        :class="['cat-item', activeCategory === c.key ? 'cat-active' : '']"
        @click="activeCategory = c.key"
      >
        {{ c.label }}
      </view>
    </view>

    <view class="course-list">
      <view
        v-for="course in filtered"
        :key="course.id"
        class="course-item"
        @click="onCourseClick(course)"
      >
        <view class="course-cover">{{ course.cover }}</view>
        <view class="course-info">
          <view class="course-title">{{ course.title }}</view>
          <view class="course-meta">
            <text class="meta-tag">⏱ {{ course.duration }}</text>
            <text class="meta-tag">📊 {{ course.level }}</text>
            <text class="meta-tag cat">{{ course.category }}</text>
          </view>
          <view class="course-instructor">👨‍🏫 {{ course.instructor }}</view>
        </view>
        <view class="course-arrow">›</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import "@/uni.scss";

.courses-page {
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

.category-bar {
  display: flex;
  background: #FFFFFF;
  padding: 16rpx 24rpx;
  overflow-x: auto;
  white-space: nowrap;
}

.cat-item {
  padding: 12rpx 24rpx;
  font-size: 26rpx;
  color: $uni-text-color-secondary;
  border-radius: 32rpx;
  margin-right: 8rpx;
  flex-shrink: 0;
}

.cat-active {
  background: $uni-color-primary;
  color: #FFFFFF;
  font-weight: 600;
}

.course-list {
  padding: 24rpx;
}

.course-item {
  display: flex;
  align-items: center;
  background: #FFFFFF;
  padding: 24rpx;
  border-radius: $uni-border-radius-lg;
  margin-bottom: 16rpx;
  box-shadow: $uni-shadow-sm;
  transition: transform 0.2s;
}

.course-item:active { transform: scale(0.98); }

.course-cover {
  width: 120rpx;
  height: 120rpx;
  background: $uni-color-primary-bg;
  border-radius: $uni-border-radius-base;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.course-info {
  flex: 1;
  min-width: 0;
}

.course-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $uni-color-primary;
  margin-bottom: 12rpx;
  line-height: 1.4;
}

.course-meta {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
  margin-bottom: 8rpx;
}

.meta-tag {
  font-size: 20rpx;
  padding: 2rpx 12rpx;
  background: $uni-color-primary-bg;
  color: $uni-color-primary;
  border-radius: 16rpx;
}

.meta-tag.cat {
  background: #FFF3E0;
  color: #E65100;
}

.course-instructor {
  font-size: 22rpx;
  color: $uni-text-color-secondary;
}

.course-arrow {
  color: #BDBDBD;
  font-size: 32rpx;
}
</style>
