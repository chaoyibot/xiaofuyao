<script setup>
import { ref, computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import MedicalAlert from '@/components/MedicalAlert.vue'
import DoseCalculator from '@/components/DoseCalculator.vue'

const input = ref({
  height: '',
  weight: '',
  age: '',
  indication: '结直肠癌',
  performanceStatus: 0
})

const result = ref(null)
const indications = ['结直肠癌', '胃癌', '乳腺癌', '头颈肿瘤']

const canCalc = computed(() => input.value.height && input.value.weight && input.value.age)

const bsa = computed(() => {
  if (!canCalc.value) return 0
  const h = parseFloat(input.value.height)
  const w = parseFloat(input.value.weight)
  return Math.sqrt((h * w) / 3600)
})

const doseMap = {
  '结直肠癌': 600,
  '胃癌': 600,
  '乳腺癌': 500,
  '头颈肿瘤': 500
}

const warnings = computed(() => {
  const w = []
  if (parseInt(input.value.age) >= 75) {
    w.push('老年人需谨慎，建议从 80% 剂量开始')
  }
  if (input.value.performanceStatus >= 2) {
    w.push('ECOG ≥ 2 分，建议减量至 75%')
  }
  if (!canCalc.value) {
    w.push('请填写完整信息')
  }
  return w
})

function onCalculate() {
  let dose = doseMap[input.value.indication] || 600
  if (input.value.performanceStatus >= 2) dose *= 0.75
  if (parseInt(input.value.age) >= 75) dose *= 0.8

  const totalMg = bsa.value * dose
  const totalMl = totalMg / 40  // 假设 0.4g/10mL

  result.value = {
    bsa: bsa.value.toFixed(2),
    baseDose: dose,
    totalMg: Math.round(totalMg),
    totalMl: (totalMl).toFixed(1),
    days14: (totalMg * 14).toFixed(0),
    days28: (totalMg * 28).toFixed(0)
  }
}

function onReset() {
  input.value = { height: '', weight: '', age: '', indication: '结直肠癌', performanceStatus: 0 }
  result.value = null
}
</script>

<template>
  <view class="calculator-page">
    <AppHeader title="剂量计算器" subtitle="基于 BSA · Mosteller 公式" />

    <view class="card">
      <view class="card-title">📋 患者信息</view>

      <view class="form-item">
        <text class="form-label">身高 (cm)</text>
        <input v-model="input.height" type="number" placeholder="例如 165" class="form-input" />
      </view>

      <view class="form-item">
        <text class="form-label">体重 (kg)</text>
        <input v-model="input.weight" type="number" placeholder="例如 60" class="form-input" />
      </view>

      <view class="form-item">
        <text class="form-label">年龄</text>
        <input v-model="input.age" type="number" placeholder="例如 55" class="form-input" />
      </view>

      <view class="form-item">
        <text class="form-label">适应症</text>
        <view class="radio-group">
          <view
            v-for="ind in indications"
            :key="ind"
            :class="['radio-item', input.indication === ind ? 'radio-active' : '']"
            @click="input.indication = ind"
          >
            {{ ind }}
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">ECOG 体能状态评分</text>
        <view class="radio-group">
          <view
            v-for="ps in [0, 1, 2, 3, 4]"
            :key="ps"
            :class="['radio-item', input.performanceStatus === ps ? 'radio-active' : '']"
            @click="input.performanceStatus = ps"
          >
            {{ ps }}
          </view>
        </view>
        <view class="ps-hint">
          0=活动自如 1=轻度受限 2=卧床<50% 3=卧床≥50% 4=完全卧床
        </view>
      </view>

      <view class="button-group">
        <button class="btn-secondary" @click="onReset">重置</button>
        <button class="btn-primary" :disabled="!canCalc" @click="onCalculate">立即计算</button>
      </view>
    </view>

    <view v-if="warnings.length > 0" class="warnings-card">
      <view class="warnings-title">⚠️ 注意事项</view>
      <view v-for="w in warnings" :key="w" class="warning-item">• {{ w }}</view>
    </view>

    <view v-if="result" class="result-card">
      <view class="result-title">📊 计算结果</view>
      <view class="result-row">
        <text class="result-label">体表面积 BSA</text>
        <text class="result-value">{{ result.bsa }} m²</text>
      </view>
      <view class="result-row">
        <text class="result-label">调整后基础剂量</text>
        <text class="result-value">{{ result.baseDose }} mg/m²/日</text>
      </view>
      <view class="result-row">
        <text class="result-label">推荐日剂量</text>
        <text class="result-value highlight">{{ result.totalMg }} mg/日</text>
      </view>
      <view class="result-row">
        <text class="result-label">折合体积</text>
        <text class="result-value highlight">{{ result.totalMl }} mL/日</text>
      </view>
      <view class="result-row">
        <text class="result-label">14 天疗程总量</text>
        <text class="result-value">{{ result.days14 }} mg</text>
      </view>
      <view class="result-row">
        <text class="result-label">28 天疗程总量</text>
        <text class="result-value">{{ result.days28 }} mg</text>
      </view>
    </view>

    <MedicalAlert
      type="danger"
      title="⚠️ 重要提示"
      content="本计算结果仅供参考，实际用药方案须由主治医师根据患者具体情况制定。请遵医嘱用药。"
    />
  </view>
</template>

<style lang="scss" scoped>
@import "@/uni.scss";

.calculator-page {
  min-height: 100vh;
  background: $uni-bg-color-grey;
  padding-bottom: 32rpx;
}

.card {
  background: #FFFFFF;
  margin: 24rpx;
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

.form-item {
  margin-bottom: 24rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: $uni-text-color;
  margin-bottom: 12rpx;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 88rpx;
  background: $uni-bg-color-grey;
  border-radius: $uni-border-radius-sm;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: $uni-text-color;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.radio-item {
  padding: 12rpx 24rpx;
  background: $uni-bg-color-grey;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: $uni-text-color-secondary;
  transition: all 0.2s;
}

.radio-active {
  background: $uni-color-primary;
  color: #FFFFFF;
  font-weight: 600;
}

.ps-hint {
  font-size: 22rpx;
  color: $uni-text-color-grey;
  margin-top: 8rpx;
  line-height: 1.4;
}

.button-group {
  display: flex;
  gap: 16rpx;
  margin-top: 32rpx;
}

.btn-primary, .btn-secondary {
  flex: 1;
  height: 88rpx;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: $uni-border-radius-sm;
  border: none;
  line-height: 1.4;
}

.btn-primary {
  background: $uni-color-primary-light;
  color: #FFFFFF;
}

.btn-primary[disabled] {
  background: #BBDEFB;
  color: #FFFFFF;
}

.btn-secondary {
  background: $uni-bg-color-grey;
  color: $uni-text-color;
}

.btn-primary::after, .btn-secondary::after { border: none; }

.warnings-card {
  background: #FFF3E0;
  margin: 0 24rpx 24rpx;
  padding: 24rpx;
  border-radius: $uni-border-radius-lg;
  border-left: 6rpx solid #FF9800;
}

.warnings-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #E65100;
  margin-bottom: 12rpx;
}

.warning-item {
  font-size: 26rpx;
  color: #E65100;
  line-height: 1.6;
}

.result-card {
  background: linear-gradient(135deg, $uni-color-primary 0%, $uni-color-primary-light 100%);
  margin: 0 24rpx 24rpx;
  padding: 32rpx;
  border-radius: $uni-border-radius-lg;
  color: #FFFFFF;
  box-shadow: $uni-shadow-base;
}

.result-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);
}

.result-row:last-child { border-bottom: none; }

.result-label {
  font-size: 28rpx;
  opacity: 0.9;
}

.result-value {
  font-size: 32rpx;
  font-weight: 600;
}

.result-value.highlight {
  color: #FFD54F;
  font-size: 36rpx;
}
</style>
