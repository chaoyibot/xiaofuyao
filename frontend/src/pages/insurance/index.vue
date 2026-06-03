<script setup>
import { ref, computed } from 'vue'
import { insurance } from '@/mock/basic'

const keyword = ref('')
const filtered = computed(() => {
  if (!keyword.value) return insurance
  return insurance.filter(i =>
    i.province.includes(keyword.value) || i.city.includes(keyword.value)
  )
})

function onCallPhone(phone) {
  uni.makePhoneCall({ phoneNumber: phone })
}
</script>

<template>
  <view class="insurance-page">
    <view class="page-header">
      <view class="header-title">🏥 医保查询</view>
      <view class="header-subtitle">查询各省挂网与报销情况</view>
    </view>

    <!-- 搜索 -->
    <view class="search-box">
      <text class="search-icon">🔍</text>
      <input
        v-model="keyword"
        class="search-input"
        placeholder="输入省份/城市查询..."
        placeholder-style="color: #999"
      />
    </view>

    <!-- 列表 -->
    <view class="card">
      <view class="card-title">📋 已挂网省份（共 {{ filtered.length }} 个）</view>
      <view class="insurance-list">
        <view v-for="item in filtered" :key="item.province" class="insurance-item">
          <view class="item-left">
            <text class="province">{{ item.province }}</text>
            <text class="city">{{ item.city }}</text>
          </view>
          <view class="item-right">
            <text class="category">{{ item.category }}</text>
            <text class="ratio">{{ item.reimbursementRatio }} 报销</text>
            <text class="status status-ok">{{ item.status }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="info-card">
      <view class="info-title">📞 医保咨询</view>
      <view class="info-row">
        <text class="info-label">全国医保热线</text>
        <text class="info-value">12393</text>
      </view>
      <view class="info-row">
        <text class="info-label">当地医保局</text>
        <text class="info-value">区号 + 12333</text>
      </view>
    </view>

    <view class="alert">
      <text class="alert-icon">💡</text>
      <text class="alert-text">具体报销比例以当地医保政策为准，建议购药前咨询当地医保局。</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import "@/uni.scss";

.insurance-page {
  min-height: 100vh;
  background: $uni-bg-color-grey;
  padding-bottom: 32rpx;
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

.search-box {
  background: #FFFFFF;
  margin: 24rpx;
  padding: 16rpx 24rpx;
  border-radius: $uni-border-radius-lg;
  display: flex;
  align-items: center;
  box-shadow: $uni-shadow-sm;
}

.search-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: $uni-text-color;
}

.card {
  background: #FFFFFF;
  margin: 0 24rpx 24rpx;
  padding: 32rpx;
  border-radius: $uni-border-radius-lg;
  box-shadow: $uni-shadow-sm;
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $uni-color-primary;
  margin-bottom: 24rpx;
}

.insurance-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.insurance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background: $uni-color-primary-bg;
  border-radius: $uni-border-radius-base;
}

.item-left { display: flex; flex-direction: column; }
.province { font-size: 32rpx; font-weight: 600; color: $uni-color-primary; }
.city { font-size: 24rpx; color: $uni-text-color-secondary; margin-top: 4rpx; }

.item-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4rpx; }
.category {
  font-size: 22rpx;
  padding: 2rpx 12rpx;
  background: $uni-color-primary;
  color: #FFFFFF;
  border-radius: 16rpx;
}
.ratio { font-size: 26rpx; font-weight: 600; color: $uni-color-primary; }
.status-ok { font-size: 22rpx; color: $uni-color-success; }

.info-card {
  background: #FFFFFF;
  margin: 0 24rpx 24rpx;
  padding: 32rpx;
  border-radius: $uni-border-radius-lg;
  box-shadow: $uni-shadow-sm;
}

.info-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $uni-color-primary;
  margin-bottom: 16rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 0;
}

.info-label { font-size: 28rpx; color: $uni-text-color-secondary; }
.info-value { font-size: 28rpx; color: $uni-color-primary; font-weight: 600; }

.alert {
  background: #FFF3E0;
  margin: 24rpx;
  padding: 24rpx;
  border-radius: $uni-border-radius-base;
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.alert-icon { font-size: 32rpx; flex-shrink: 0; }
.alert-text { font-size: 26rpx; color: #E65100; line-height: 1.5; flex: 1; }
</style>
