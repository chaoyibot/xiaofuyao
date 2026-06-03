<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppHeader from '@/components/AppHeader.vue'
import MedicalAlert from '@/components/MedicalAlert.vue'
import { academicDocs } from '@/mock/academic'

const doc = ref(null)
const docId = ref(null)
const docTheme = ref('')

onLoad((options) => {
  docId.value = parseInt(options?.id) || 0
  docTheme.value = options?.theme || ''
  loadDoc()
})

function loadDoc() {
  doc.value = academicDocs.find(d => d.id === docId.value)
}
</script>

<template>
  <view class="doc-detail-page" v-if="doc">
    <AppHeader :title="`文献 #${doc.id}`" />

    <view class="doc-content">
      <view class="doc-theme-tag">{{ doc.theme }}</view>
      <view class="doc-title">{{ doc.title }}</view>

      <view class="meta-card">
        <view class="meta-row">
          <text class="meta-label">主题</text>
          <text class="meta-value">{{ doc.theme }}</text>
        </view>
        <view class="meta-row">
          <text class="meta-label">字数</text>
          <text class="meta-value">{{ doc.word_count }} 字</text>
        </view>
        <view class="meta-row">
          <text class="meta-label">分类</text>
          <text class="meta-value">研究章节</text>
        </view>
      </view>

      <view class="summary-section">
        <view class="section-title">📝 摘要</view>
        <view class="section-text">{{ doc.summary }}</view>
      </view>

      <MedicalAlert
        type="info"
        title="📚 学术内容提示"
        content="学术内容仅供医务人员参考，不作为临床决策唯一依据。具体用药方案请遵医嘱。"
      />
    </view>
  </view>

  <view v-else class="empty">
    <text>加载中...</text>
  </view>
</template>

<style lang="scss" scoped>
@import "@/uni.scss";

.doc-detail-page {
  min-height: 100vh;
  background: $uni-bg-color-grey;
}

.doc-content {
  background: #FFFFFF;
  margin: 24rpx;
  padding: 32rpx;
  border-radius: $uni-border-radius-lg;
  box-shadow: $uni-shadow-sm;
}

.doc-theme-tag {
  display: inline-block;
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  background: $uni-color-primary;
  color: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
}

.doc-title {
  font-size: 36rpx;
  font-weight: 600;
  color: $uni-color-primary;
  line-height: 1.5;
  margin-bottom: 24rpx;
}

.meta-card {
  background: $uni-color-primary-bg;
  border-radius: $uni-border-radius-base;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 0;
}

.meta-label { font-size: 26rpx; color: $uni-text-color-secondary; }
.meta-value { font-size: 26rpx; color: $uni-color-primary; font-weight: 600; }

.summary-section { margin-bottom: 24rpx; }

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $uni-color-primary;
  margin-bottom: 16rpx;
}

.section-text {
  font-size: 28rpx;
  line-height: 1.8;
  color: $uni-text-color;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: $uni-text-color-secondary;
}
</style>
