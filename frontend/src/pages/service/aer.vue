<template>
  <view class="aer-page">
    <AppHeader title="不良反应上报" />

    <!-- 严重程度选择 -->
    <view class="section-title">⚠️ 严重程度（CTCAE 4-5 级需立即就诊）</view>
    <view class="severity-grid">
      <view
        v-for="s in severities"
        :key="s.level"
        :class="['severity-item', `sev-${s.level}`, severity === s.level ? 'selected' : '']"
        @click="severity = s.level"
      >
        <text class="sev-level">{{ s.level }}</text>
        <text class="sev-name">{{ s.name }}</text>
        <text class="sev-desc">{{ s.desc }}</text>
      </view>
    </view>

    <!-- 症状选择 -->
    <view class="section-title">🩺 出现的症状（可多选）</view>
    <view class="symptom-grid">
      <view
        v-for="sym in symptoms"
        :key="sym"
        :class="['symptom-item', selectedSymptoms.includes(sym) ? 'selected' : '']"
        @click="toggleSymptom(sym)"
      >
        {{ sym }}
      </view>
    </view>

    <!-- 发生时间 -->
    <view class="section-title">🕐 发生时间</view>
    <view class="form-item">
      <picker mode="datetime" :value="occurredAt" @change="onTimeChange">
        <view class="picker">{{ occurredAt || '请选择时间' }}</view>
      </picker>
    </view>

    <!-- 详细描述 -->
    <view class="section-title">📝 详细描述</view>
    <view class="form-item">
      <textarea
        v-model="notes"
        class="notes-input"
        placeholder="请详细描述症状、持续时间、处理情况..."
        maxlength="500"
      />
    </view>

    <!-- 联系方式 -->
    <view class="section-title">📞 紧急联系方式</view>
    <view class="form-item">
      <input
        v-model="phone"
        class="phone-input"
        type="number"
        placeholder="手机号（药师会主动联系您）"
        maxlength="11"
      />
    </view>

    <!-- 严重程度提示 -->
    <view v-if="severity >= 3" class="urgent-alert">
      <text class="urgent-icon">🆘</text>
      <view class="urgent-content">
        <text class="urgent-title">检测到严重不良反应</text>
        <text class="urgent-desc">系统将立即通知值班医师，请保持电话畅通</text>
      </view>
    </view>

    <!-- 提交按钮 -->
    <button class="btn-submit" @click="onSubmit">立即上报</button>

    <!-- 风险提示 -->
    <MedicalAlert
      type="danger"
      title="⚠️ 重要提示"
      content="本品为处方化疗药，可能引起骨髓抑制、消化道反应等。任何不适都建议及时上报，由专业医师判断处理。"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import MedicalAlert from '@/components/MedicalAlert.vue'

const severity = ref(1)
const selectedSymptoms = ref([])
const occurredAt = ref('')
const notes = ref('')
const phone = ref('')

const severities = [
  { level: 1, name: '轻度', desc: '无症状或轻微' },
  { level: 2, name: '中度', desc: '需要局部处理' },
  { level: 3, name: '重度', desc: '需要住院' },
  { level: 4, name: '危及生命', desc: '紧急处理' },
  { level: 5, name: '死亡', desc: '—' }
]

const symptoms = [
  '恶心', '呕吐', '腹泻', '便秘', '口腔黏膜炎', '食欲下降',
  '白细胞减少', '血小板减少', '贫血', '发热',
  '皮疹', '手足综合征', '脱发', '疲劳', '头晕',
  '胸闷', '呼吸困难', '出血', '感染', '其他'
]

function toggleSymptom(sym) {
  const idx = selectedSymptoms.value.indexOf(sym)
  if (idx >= 0) selectedSymptoms.value.splice(idx, 1)
  else selectedSymptoms.value.push(sym)
}

function onTimeChange(e) {
  occurredAt.value = e.detail.value
}

function onSubmit() {
  if (selectedSymptoms.value.length === 0) {
    uni.showToast({ title: '请选择症状', icon: 'none' })
    return
  }
  if (severity.value >= 3) {
    uni.showModal({
      title: '紧急情况',
      content: '检测到严重不良反应，建议立即拨打紧急热线或前往就近医院。',
      confirmText: '立即拨打',
      success: (res) => {
        if (res.confirm) uni.makePhoneCall({ phoneNumber: '400-888-XXXX' })
      }
    })
  } else {
    uni.showToast({ title: '上报成功，医师将尽快处理', icon: 'success' })
  }
}
</script>

<style lang="scss" scoped>
@import "@/uni.scss";

.aer-page {
  padding: 0 24rpx 32rpx;
  background: $uni-bg-color-grey;
  min-height: 100vh;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $uni-text-color;
  margin: 24rpx 0 12rpx;
  display: block;
}

.severity-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8rpx;
}
.severity-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 4rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  text-align: center;
  transition: all 0.2s;
  &.sev-1 { color: #4CAF50; }
  &.sev-2 { color: #FFC107; }
  &.sev-3 { color: #FF9800; }
  &.sev-4 { color: #F44336; }
  &.sev-5 { color: #B71C1C; }
  &.selected {
    border-color: currentColor;
    background: rgba(0,0,0,0.04);
  }
}
.sev-level { font-size: 36rpx; font-weight: 700; }
.sev-name { font-size: 22rpx; margin-top: 2rpx; }
.sev-desc { font-size: 18rpx; opacity: 0.7; margin-top: 2rpx; }

.symptom-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.symptom-item {
  padding: 12rpx 24rpx;
  background: #FFFFFF;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: $uni-text-color;
  border: 2rpx solid transparent;
  &.selected {
    background: $uni-color-primary;
    color: #FFFFFF;
  }
}

.form-item {
  background: #FFFFFF;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 12rpx;
}
.picker { font-size: 28rpx; color: $uni-text-color; }
.notes-input {
  width: 100%;
  min-height: 200rpx;
  font-size: 28rpx;
  line-height: 1.5;
  box-sizing: border-box;
}
.phone-input {
  width: 100%;
  font-size: 28rpx;
  color: $uni-text-color;
}

.urgent-alert {
  display: flex;
  align-items: center;
  background: #FFEBEE;
  border: 2rpx solid #F44336;
  border-radius: 12rpx;
  padding: 24rpx;
  margin: 16rpx 0;
  animation: blink 1.5s infinite;
}
@keyframes blink {
  0%, 100% { box-shadow: 0 0 0 0 rgba(244,67,54,0.4); }
  50% { box-shadow: 0 0 0 8rpx rgba(244,67,54,0.1); }
}
.urgent-icon { font-size: 60rpx; margin-right: 16rpx; }
.urgent-content { flex: 1; }
.urgent-title { display: block; font-size: 30rpx; font-weight: 600; color: #B71C1C; }
.urgent-desc { display: block; font-size: 24rpx; color: #B71C1C; margin-top: 4rpx; }

.btn-submit {
  width: 100%;
  background: $uni-color-error;
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 600;
  padding: 24rpx 0;
  border-radius: 16rpx;
  border: none;
  margin: 24rpx 0 16rpx;
  &::after { border: none; }
}
</style>
