<template>
  <view class="logistics-page">
    <AppHeader title="物流查询" />

    <!-- 订单号搜索 -->
    <view class="search-bar">
      <input
        v-model="orderId"
        class="search-input"
        placeholder="输入订单号查询"
        @confirm="onSearch"
      />
      <button class="btn-search" @click="onSearch">查询</button>
    </view>

    <!-- 当前订单状态 -->
    <view v-if="logistics" class="logistics-card">
      <view class="logistics-header">
        <view class="company-info">
          <text class="company-name">🚚 {{ logistics.company }}</text>
          <text class="tracking-number">单号：{{ logistics.tracking_number }}</text>
        </view>
        <text :class="['status-badge', logistics.status]">{{ statusText(logistics.status) }}</text>
      </view>

      <view class="eta-info">
        <text class="eta-label">预计到达</text>
        <text class="eta-date">📅 {{ logistics.estimated_delivery }}</text>
      </view>

      <!-- 配送时间线 -->
      <view class="timeline">
        <view
          v-for="(item, i) in logistics.history"
          :key="i"
          :class="['timeline-item', i === logistics.history.length - 1 ? 'latest' : '']"
        >
          <view class="timeline-dot">
            <view class="timeline-dot-inner"></view>
          </view>
          <view class="timeline-content">
            <text class="timeline-status">{{ item.status }}</text>
            <text class="timeline-time">{{ item.time }}</text>
          </view>
        </view>
      </view>

      <!-- 联系快递 -->
      <view class="contact-row">
        <button class="btn-contact" @click="onCallCourier">📞 联系快递员</button>
        <button class="btn-route">🗺️ 查看路线</button>
      </view>
    </view>

    <!-- 历史订单 -->
    <view class="section-title">📦 历史订单</view>
    <view class="order-list">
      <view v-for="o in orderHistory" :key="o.id" class="order-item">
        <view class="order-id">订单号：{{ o.id }}</view>
        <view class="order-meta">
          <text class="order-date">{{ o.date }}</text>
          <text :class="['order-status', o.status]">{{ o.statusText }}</text>
        </view>
      </view>
    </view>

    <MedicalAlert
      type="info"
      title="💊 药品运输说明"
      content="本品需避光、密封、阴凉处（不超过 20℃）保存。运输过程采用冷链/恒温箱，确保药品质量。"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import MedicalAlert from '@/components/MedicalAlert.vue'

const orderId = ref('DD20260603001')
const logistics = ref({
  order_id: 'DD20260603001',
  status: 'in_transit',
  company: '顺丰速运',
  tracking_number: 'SF1234567890',
  estimated_delivery: '2026-06-05',
  history: [
    { time: '2026-06-03 10:00', status: '已发货，仓库出库' },
    { time: '2026-06-03 14:30', status: '运输中，已到达长沙分拣中心' },
    { time: '2026-06-03 18:45', status: '派送中，快递员正在派送' }
  ]
})

const orderHistory = [
  { id: 'DD20260520001', date: '2026-05-20', status: 'completed', statusText: '✓ 已签收' },
  { id: 'DD20260415002', date: '2026-04-15', status: 'completed', statusText: '✓ 已签收' },
  { id: 'DD20260310003', date: '2026-03-10', status: 'completed', statusText: '✓ 已签收' }
]

function statusText(s) {
  return {
    in_transit: '运输中',
    delivered: '已送达',
    preparing: '备货中'
  }[s] || s
}

function onSearch() {
  if (!orderId.value) {
    uni.showToast({ title: '请输入订单号', icon: 'none' })
    return
  }
  uni.showLoading({ title: '查询中...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '查询成功', icon: 'success' })
  }, 800)
}

function onCallCourier() {
  uni.makePhoneCall({ phoneNumber: '95338' })
}
</script>

<style lang="scss" scoped>
@import "@/uni.scss";

.logistics-page {
  padding: 0 24rpx 32rpx;
  background: $uni-bg-color-grey;
  min-height: 100vh;
}

.search-bar {
  display: flex;
  gap: 12rpx;
  margin: 16rpx 0 24rpx;
}
.search-input {
  flex: 1;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 16rpx 24rpx;
  font-size: 28rpx;
}
.btn-search {
  background: $uni-color-primary;
  color: #FFFFFF;
  font-size: 28rpx;
  padding: 0 32rpx;
  border-radius: 24rpx;
  border: none;
  &::after { border: none; }
}

.logistics-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}
.logistics-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}
.company-name {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: $uni-text-color;
}
.tracking-number {
  display: block;
  font-size: 22rpx;
  color: $uni-text-color-secondary;
  margin-top: 4rpx;
}
.status-badge {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 16rpx;
  &.in_transit { background: #E3F2FD; color: #1565C0; }
  &.delivered { background: #E8F5E9; color: #2E7D32; }
  &.preparing { background: #FFF3E0; color: #E65100; }
}

.eta-info {
  background: $uni-color-primary-bg;
  border-radius: 12rpx;
  padding: 16rpx 24rpx;
  margin-bottom: 16rpx;
}
.eta-label {
  display: block;
  font-size: 22rpx;
  color: $uni-text-color-secondary;
}
.eta-date {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: $uni-color-primary;
  margin-top: 4rpx;
}

.timeline {
  position: relative;
  padding: 8rpx 0;
}
.timeline-item {
  display: flex;
  align-items: flex-start;
  position: relative;
  padding: 12rpx 0 12rpx 0;
  &::before {
    content: '';
    position: absolute;
    left: 11rpx;
    top: 32rpx;
    bottom: -4rpx;
    width: 2rpx;
    background: $uni-border-color;
  }
  &:last-child::before { display: none; }
}
.timeline-dot {
  width: 24rpx;
  height: 24rpx;
  background: #FFFFFF;
  border: 4rpx solid $uni-color-primary-light;
  border-radius: 50%;
  margin-right: 16rpx;
  flex-shrink: 0;
  margin-top: 4rpx;
}
.timeline-dot-inner {
  width: 8rpx;
  height: 8rpx;
  background: $uni-color-primary;
  border-radius: 50%;
  margin: 4rpx auto;
}
.timeline-item.latest .timeline-dot {
  border-color: $uni-color-primary;
  background: $uni-color-primary;
  animation: pulse 2s infinite;
}
.timeline-item.latest .timeline-dot-inner { background: #FFFFFF; }
.timeline-content {
  flex: 1;
  padding-bottom: 16rpx;
}
.timeline-status {
  display: block;
  font-size: 28rpx;
  color: $uni-text-color;
}
.timeline-item.latest .timeline-status {
  font-weight: 600;
  color: $uni-color-primary;
}
.timeline-time {
  display: block;
  font-size: 22rpx;
  color: $uni-text-color-secondary;
  margin-top: 4rpx;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(21,101,192,0.4); }
  50% { box-shadow: 0 0 0 8rpx rgba(21,101,192,0.1); }
}

.contact-row {
  display: flex;
  gap: 12rpx;
  margin-top: 16rpx;
}
.btn-contact, .btn-route {
  flex: 1;
  background: $uni-color-primary-bg;
  color: $uni-color-primary;
  font-size: 26rpx;
  padding: 16rpx 0;
  border-radius: 12rpx;
  border: 1rpx solid $uni-color-primary-light;
  &::after { border: none; }
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $uni-text-color;
  margin: 24rpx 0 16rpx;
  display: block;
}

.order-list {
  background: #FFFFFF;
  border-radius: 12rpx;
  overflow: hidden;
}
.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid $uni-border-color;
  &:last-child { border-bottom: none; }
}
.order-id { font-size: 26rpx; color: $uni-text-color; }
.order-meta { display: flex; align-items: center; gap: 12rpx; }
.order-date { font-size: 22rpx; color: $uni-text-color-secondary; }
.order-status {
  font-size: 22rpx;
  padding: 2rpx 12rpx;
  border-radius: 12rpx;
  &.completed { background: #E8F5E9; color: #2E7D32; }
}
</style>
