<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppHeader from '@/components/AppHeader.vue'
import ProductCard from '@/components/ProductCard.vue'
import MedicalAlert from '@/components/MedicalAlert.vue'
import { product, sellingPoints, indications } from '@/mock/basic'

const currentIndication = ref(0)

onMounted(() => {
  // 模拟加载
})

function onIndicationChange(idx) {
  currentIndication.value = idx
}
</script>

<template>
  <view class="product-detail">
    <AppHeader title="产品介绍" />

    <!-- 主药品卡片 -->
    <view class="hero">
      <view class="hero-content">
        <text class="product-emoji">💊</text>
        <view class="hero-text">
          <view class="product-name">{{ product.name }}</view>
          <view class="product-en">{{ product.enName }}</view>
          <view class="product-tags">
            <text class="tag">📋 处方药</text>
            <text class="tag">🏥 医保乙类</text>
            <text class="tag">💊 口服化疗</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 5 大核心优势 -->
    <view class="card">
      <view class="card-title">⭐ 五大核心优势</view>
      <view class="selling-grid">
        <view v-for="point in sellingPoints" :key="point.title" class="selling-item">
          <text class="selling-icon">{{ point.icon }}</text>
          <text class="selling-title">{{ point.title }}</text>
          <text class="selling-desc">{{ point.description }}</text>
        </view>
      </view>
    </view>

    <!-- 药品基本信息 -->
    <view class="card">
      <view class="card-title">📋 药品基本信息</view>
      <view class="info-row">
        <text class="info-label">规格</text>
        <text class="info-value">{{ product.specification }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">剂型</text>
        <text class="info-value">{{ product.dosageForm }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">批准文号</text>
        <text class="info-value">{{ product.approvalNumber }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">贮藏</text>
        <text class="info-value">{{ product.storage }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">有效期</text>
        <text class="info-value">{{ product.validPeriod }}</text>
      </view>
    </view>

    <!-- 适应症 -->
    <view class="card">
      <view class="card-title">🎯 适应症</view>
      <view class="indication-list">
        <view v-for="ind in indications" :key="ind.id" class="indication-item">
          <text class="indication-icon">{{ ind.icon }}</text>
          <view class="indication-content">
            <text class="indication-name">{{ ind.name }}</text>
            <text class="indication-desc">{{ ind.description }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 用法用量 -->
    <view class="card">
      <view class="card-title">💊 用法用量</view>
      <view class="text-block">{{ product.usage }}</view>
    </view>

    <!-- 不良反应 -->
    <view class="card">
      <view class="card-title">⚠️ 不良反应</view>
      <view class="text-block">{{ product.adverseReactions }}</view>
    </view>

    <!-- 注意事项 -->
    <view class="card">
      <view class="card-title">📌 注意事项</view>
      <view class="text-block">{{ product.precautions }}</view>
    </view>

    <!-- 风险提示 -->
    <MedicalAlert
      type="danger"
      title="⚠️ 风险提示"
      content="本品为处方药，请凭医师处方购买使用。用药前请仔细阅读说明书，并在医生指导下使用。"
    />
  </view>
</template>

<style lang="scss" scoped>
@import "@/uni.scss";

.product-detail {
  padding: 0 0 32rpx;
  background: $uni-bg-color-grey;
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, $uni-color-primary 0%, $uni-color-primary-light 100%);
  padding: 32rpx 32rpx 48rpx;
  color: #FFFFFF;
}

.hero-content {
  display: flex;
  align-items: center;
}

.product-emoji {
  font-size: 96rpx;
  margin-right: 24rpx;
}

.hero-text { flex: 1; }

.product-name {
  font-size: 40rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.product-en {
  font-size: 24rpx;
  opacity: 0.9;
  margin-bottom: 16rpx;
}

.product-tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.tag {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16rpx;
}

.card {
  background: #FFFFFF;
  border-radius: $uni-border-radius-lg;
  padding: 32rpx;
  margin: 24rpx;
  box-shadow: $uni-shadow-sm;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $uni-color-primary;
  margin-bottom: 24rpx;
}

.selling-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.selling-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx;
  background: $uni-color-primary-bg;
  border-radius: $uni-border-radius-base;
}

.selling-icon { font-size: 48rpx; margin-bottom: 8rpx; }
.selling-title { font-size: 28rpx; font-weight: 600; color: $uni-color-primary; }
.selling-desc { font-size: 22rpx; color: $uni-text-color-secondary; text-align: center; margin-top: 4rpx; }

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $uni-border-color;
}

.info-row:last-child { border-bottom: none; }
.info-label { font-size: 28rpx; color: $uni-text-color-secondary; }
.info-value { font-size: 28rpx; color: $uni-text-color; }

.indication-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.indication-item {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background: $uni-color-primary-bg;
  border-radius: $uni-border-radius-base;
}

.indication-icon { font-size: 48rpx; margin-right: 16rpx; }
.indication-content { flex: 1; }
.indication-name { font-size: 28rpx; font-weight: 600; color: $uni-color-primary; display: block; }
.indication-desc { font-size: 24rpx; color: $uni-text-color-secondary; margin-top: 4rpx; }

.text-block {
  font-size: 28rpx;
  line-height: 1.6;
  color: $uni-text-color;
}
</style>
