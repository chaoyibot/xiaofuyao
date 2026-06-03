<script setup>
import { ref, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppHeader from '@/components/AppHeader.vue'
import BannerCarousel from '@/components/BannerCarousel.vue'
import ProductCard from '@/components/ProductCard.vue'
import StoryCard from '@/components/StoryCard.vue'
import ServiceEntry from '@/components/ServiceEntry.vue'
import MedicalAlert from '@/components/MedicalAlert.vue'
import { getHomeData } from '@/api/product'
import { getFeaturedStories } from '@/api/story'

const banners = ref([])
const sellingPoints = ref([
  { icon: '🏠', title: '居家治疗', desc: '告别频繁往返医院' },
  { icon: '💊', title: '口服乳剂', desc: '乳剂型制剂，服用方便' },
  { icon: '🛡️', title: '安全可控', desc: '医生全程用药指导' },
  { icon: '📋', title: '品牌保障', desc: '中和制药正规生产' },
  { icon: '💰', title: '经济实惠', desc: '省去住院治疗费用' }
])
const featuredStories = ref([])
const quickEntries = ref([
  { icon: '📖', label: '患者故事', path: '/pages/story/list' },
  { icon: '🧮', label: '剂量计算', path: '/pages/academic/calculator' },
  { icon: '⏰', label: '用药提醒', path: '/pages/service/medication' },
  { icon: '🆘', label: '紧急求助', path: '/pages/service/chat' }
])

onLoad(() => {
  loadHomeData()
})

async function loadHomeData() {
  try {
    const [homeData, stories] = await Promise.all([
      getHomeData(),
      getFeaturedStories(3)
    ])
    banners.value = homeData.banners || []
    featuredStories.value = stories || []
  } catch (e) {
    // 加载失败：弹 toast 提示，前端兜底显示空数据
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

function onNavTo(path) {
  uni.navigateTo({ url: path })
}
</script>

<template>
  <view class="home-page">
    <AppHeader title="小福药" subtitle="中和制药官方" />

    <!-- 药品名片 Banner -->
    <BannerCarousel :items="banners" v-if="banners.length" />

    <!-- 五大核心优势 -->
    <view class="card">
      <view class="card-title">⭐ 五大核心优势</view>
      <view class="selling-points">
        <view v-for="point in sellingPoints" :key="point.title" class="point-item">
          <text class="point-icon">{{ point.icon }}</text>
          <text class="point-label">{{ point.title }}</text>
        </view>
      </view>
    </view>

    <!-- 快速入口 -->
    <view class="card">
      <view class="card-title">🚀 快速进入</view>
      <view class="quick-entries">
        <view
          v-for="entry in quickEntries"
          :key="entry.label"
          class="entry-item"
          @click="onNavTo(entry.path)"
        >
          <text class="entry-icon">{{ entry.icon }}</text>
          <text class="entry-label">{{ entry.label }}</text>
        </view>
      </view>
    </view>

    <!-- 患者故事 -->
    <view class="section-header">
      <text class="section-title">📖 真实患者故事</text>
      <text class="section-more" @click="onNavTo('/pages/story/list')">查看更多 →</text>
    </view>
    <StoryCard
      v-for="story in featuredStories"
      :key="story.id"
      :story="story"
      @click="onNavTo(`/pages/story/detail?id=${story.id}`)"
    />

    <!-- 风险提示 -->
    <MedicalAlert
      type="danger"
      title="⚠️ 风险提示"
      content="本品为处方药，可能引起骨髓抑制、消化道反应等，需在医生指导下使用。用药期间定期复查血常规、肝肾功能。"
    />
  </view>
</template>

<style lang="scss" scoped>
@import "@/uni.scss";

.home-page {
  padding: 20rpx 24rpx 160rpx;
  min-height: 100vh;
  background-color: $uni-bg-color-grey;
}

.card {
  background: #FFFFFF;
  border-radius: $uni-border-radius-base;
  padding: $uni-spacing-col-lg;
  margin-bottom: $uni-spacing-row-lg;
  box-shadow: $uni-shadow-sm;
}

.card-title {
  font-size: $uni-font-size-lg;
  font-weight: 600;
  color: $uni-text-color;
  margin-bottom: $uni-spacing-row-base;
}

.selling-points {
  display: flex;
  justify-content: space-between;
  gap: $uni-spacing-col-sm;
}

.point-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $uni-spacing-col-sm 0;
}

.point-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.point-label {
  font-size: $uni-font-size-sm;
  color: $uni-text-color;
  text-align: center;
}

.quick-entries {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $uni-spacing-row-base;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $uni-spacing-col-sm 0;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.95);
  }
}

.entry-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.entry-label {
  font-size: $uni-font-size-sm;
  color: $uni-text-color;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8rpx;
  margin-bottom: $uni-spacing-row-base;
}

.section-title {
  font-size: $uni-font-size-lg;
  font-weight: 600;
  color: $uni-text-color;
}

.section-more {
  font-size: $uni-font-size-sm;
  color: $uni-color-primary-light;
}
</style>
