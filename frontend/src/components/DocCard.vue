<template>
  <view class="doc-card" @click="$emit('click')">
    <view class="doc-header">
      <view class="doc-title">{{ doc.title }}</view>
      <text class="doc-theme">{{ doc.theme }}</text>
    </view>
    <view class="doc-summary">{{ doc.summary }}</view>
    <view class="doc-footer">
      <text class="doc-meta">📅 {{ doc.year || '2025' }} · {{ doc.source || '核心期刊' }}</text>
      <text class="doc-action">查看详情 →</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  doc: { type: Object, required: true }
})
defineEmits(['click'])
</script>

<style lang="scss" scoped>
.doc-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(10, 37, 64, 0.06);
  margin-bottom: 16rpx;
  transition: transform 0.2s;
}

.doc-card:active {
  transform: scale(0.98);
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12rpx;
  gap: 16rpx;
}

.doc-title {
  flex: 1;
  font-size: 30rpx;
  font-weight: 600;
  color: #0A2540;
  line-height: 1.4;
}

.doc-theme {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  background: #E3F2FD;
  color: #1565C0;
  border-radius: 16rpx;
  flex-shrink: 0;
}

.doc-summary {
  font-size: 26rpx;
  color: #757575;
  line-height: 1.5;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.doc-footer {
  display: flex;
  justify-content: space-between;
  font-size: 22rpx;
  color: #999;
  padding-top: 12rpx;
  border-top: 1rpx solid #F5F5F5;
}

.doc-action {
  color: #1565C0;
}
</style>
