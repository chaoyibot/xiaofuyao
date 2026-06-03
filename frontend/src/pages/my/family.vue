<template>
  <view class="family-page">
    <AppHeader title="家属账号" />

    <!-- 顶部说明 -->
    <view class="info-card">
      <text class="info-icon">👨‍👩‍👧</text>
      <view class="info-content">
        <text class="info-title">家属共享</text>
        <text class="info-desc">添加家属账号，可同步查看您的用药记录、复查提醒、不良反应等信息，便于家属关注您的治疗情况。</text>
      </view>
    </view>

    <!-- 家属列表 -->
    <view class="section-title">👥 已添加家属</view>
    <view class="family-list">
      <view v-for="f in familyList" :key="f.id" class="family-item">
        <view class="family-avatar">{{ f.avatar }}</view>
        <view class="family-info">
          <view class="family-header">
            <text class="family-name">{{ f.name }}</text>
            <text :class="['family-relation', f.relation]">{{ relationText(f.relation) }}</text>
          </view>
          <text class="family-phone">📱 {{ f.phone }}</text>
          <text class="family-permission">权限：{{ permissionText(f.permission) }}</text>
        </view>
        <view class="family-actions">
          <button class="btn-edit" @click="onEdit(f)">编辑</button>
        </view>
      </view>

      <view v-if="familyList.length === 0" class="empty">
        <text class="empty-icon">👨‍👩‍👧</text>
        <text class="empty-text">还没有添加家属账号</text>
      </view>
    </view>

    <!-- 添加按钮 -->
    <view class="add-btn" @click="onAdd">
      <text class="add-icon">+</text>
      <text class="add-label">添加家属账号</text>
    </view>

    <!-- 权限说明 -->
    <view class="section-title">🔐 权限说明</view>
    <view class="permission-list">
      <view class="permission-item">
        <text class="perm-icon">📋</text>
        <view class="perm-content">
          <text class="perm-title">基础信息</text>
          <text class="perm-desc">查看患者基本信息、用药方案</text>
        </view>
      </view>
      <view class="permission-item">
        <text class="perm-icon">💊</text>
        <view class="perm-content">
          <text class="perm-title">用药记录</text>
          <text class="perm-desc">查看打卡记录、漏服提醒</text>
        </view>
      </view>
      <view class="permission-item">
        <text class="perm-icon">🔔</text>
        <view class="perm-content">
          <text class="perm-title">复查提醒</text>
          <text class="perm-desc">同步接收复查通知</text>
        </view>
      </view>
      <view class="permission-item">
        <text class="perm-icon">🚨</text>
        <view class="perm-content">
          <text class="perm-title">紧急告警</text>
          <text class="perm-desc">严重不良反应时紧急通知</text>
        </view>
      </view>
    </view>

    <MedicalAlert
      type="info"
      title="🔒 隐私保护"
      content="所有家属账号均需您本人同意添加。家属无法查看您的个人隐私信息（身份证、银行卡等）。"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import MedicalAlert from '@/components/MedicalAlert.vue'

const familyList = ref([
  {
    id: 1,
    name: '李明',
    avatar: '👨',
    relation: 'spouse',
    phone: '138****1234',
    permission: 'full'
  }
])

function relationText(r) {
  return { spouse: '配偶', parent: '父母', child: '子女', sibling: '兄弟姐妹', other: '其他' }[r] || r
}

function permissionText(p) {
  return { full: '全部权限', basic: '基础权限' }[p] || p
}

function onEdit(f) {
  uni.showActionSheet({
    itemList: ['编辑权限', '解除绑定', '发送通知'],
    success: (res) => {
      if (res.tapIndex === 1) {
        uni.showModal({
          title: '确认解除',
          content: `确认解除与 ${f.name} 的家属绑定？`,
          success: (r) => {
            if (r.confirm) {
              familyList.value = familyList.value.filter(x => x.id !== f.id)
              uni.showToast({ title: '已解除', icon: 'success' })
            }
          }
        })
      }
    }
  })
}

function onAdd() {
  uni.showModal({
    title: '添加家属',
    content: '请输入家属手机号，系统将发送邀请短信，对方确认后即可绑定。',
    editable: true,
    placeholderText: '家属手机号',
    success: (res) => {
      if (res.confirm && res.content) {
        uni.showToast({ title: '邀请已发送', icon: 'success' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@import "@/uni.scss";

.family-page {
  padding: 0 24rpx 32rpx;
  background: $uni-bg-color-grey;
  min-height: 100vh;
}

.info-card {
  display: flex;
  background: $uni-color-primary-bg;
  border-radius: 12rpx;
  padding: 24rpx;
  margin: 16rpx 0 24rpx;
}
.info-icon { font-size: 60rpx; margin-right: 16rpx; }
.info-content { flex: 1; }
.info-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $uni-color-primary;
  margin-bottom: 4rpx;
}
.info-desc {
  display: block;
  font-size: 24rpx;
  color: $uni-text-color-secondary;
  line-height: 1.5;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $uni-text-color;
  margin: 24rpx 0 16rpx;
  display: block;
}

.family-list {
  background: #FFFFFF;
  border-radius: 12rpx;
  overflow: hidden;
}
.family-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid $uni-border-color;
  &:last-child { border-bottom: none; }
}
.family-avatar {
  width: 80rpx;
  height: 80rpx;
  background: $uni-color-primary-bg;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
}
.family-info { flex: 1; }
.family-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 4rpx;
}
.family-name { font-size: 30rpx; font-weight: 600; color: $uni-text-color; }
.family-relation {
  font-size: 20rpx;
  padding: 2rpx 12rpx;
  border-radius: 12rpx;
  background: $uni-color-primary-bg;
  color: $uni-color-primary;
}
.family-phone {
  display: block;
  font-size: 24rpx;
  color: $uni-text-color-secondary;
  margin-bottom: 2rpx;
}
.family-permission {
  display: block;
  font-size: 22rpx;
  color: $uni-text-color-grey;
}

.family-actions { margin-left: 12rpx; }
.btn-edit {
  background: $uni-bg-color-grey;
  color: $uni-text-color;
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 16rpx;
  border: none;
  &::after { border: none; }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64rpx 0;
}
.empty-icon { font-size: 96rpx; opacity: 0.3; margin-bottom: 16rpx; }
.empty-text { font-size: 26rpx; color: $uni-text-color-grey; }

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  background: #FFFFFF;
  border: 2rpx dashed $uni-color-primary-light;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-top: 24rpx;
}
.add-icon { font-size: 36rpx; color: $uni-color-primary; font-weight: 600; }
.add-label { font-size: 28rpx; color: $uni-color-primary; }

.permission-list {
  background: #FFFFFF;
  border-radius: 12rpx;
  overflow: hidden;
}
.permission-item {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid $uni-border-color;
  &:last-child { border-bottom: none; }
}
.perm-icon { font-size: 40rpx; margin-right: 16rpx; }
.perm-content { flex: 1; }
.perm-title { display: block; font-size: 28rpx; color: $uni-text-color; }
.perm-desc { display: block; font-size: 22rpx; color: $uni-text-color-secondary; margin-top: 2rpx; }
</style>
