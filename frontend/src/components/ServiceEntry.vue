<template>
  <view class="service-entry" @click="$emit('click')">
    <view class="entry-icon-wrap">
      <text class="entry-icon">{{ entry.icon }}</text>
    </view>
    <text class="entry-label">{{ entry.label }}</text>
  </view>
</template>

<script setup>
defineProps({
  entry: { type: Object, required: true }
})
defineEmits(['click'])
</script>

<style lang="scss" scoped>
.service-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 0;
  transition: transform 0.2s;
}

.service-entry:active {
  transform: scale(0.95);
}

.entry-icon-wrap {
  width: 96rpx;
  height: 96rpx;
  background: #E3F2FD;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.entry-icon {
  font-size: 48rpx;
}

.entry-label {
  font-size: 24rpx;
  color: #212121;
  text-align: center;
}
</style>
