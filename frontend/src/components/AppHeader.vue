<template>
  <view class="app-header" :style="headerStyle">
    <view class="header-content">
      <view class="header-left" v-if="$slots.left">
        <slot name="left" />
      </view>
      <view class="header-center">
        <view class="header-title">{{ title }}</view>
        <view v-if="subtitle" class="header-subtitle">{{ subtitle }}</view>
      </view>
      <view class="header-right" v-if="$slots.right">
        <slot name="right" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  background: { type: String, default: '#0A2540' },
  textColor: { type: String, default: '#FFFFFF' }
})

const headerStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.background} 0%, #1565C0 100%)`,
  color: props.textColor
}))
</script>

<style lang="scss" scoped>
.app-header {
  padding: 88rpx 32rpx 32rpx;
  color: #FFFFFF;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-center {
  flex: 1;
  text-align: center;
}

.header-title {
  font-size: 36rpx;
  font-weight: 600;
}

.header-subtitle {
  font-size: 24rpx;
  opacity: 0.9;
  margin-top: 4rpx;
}
</style>
