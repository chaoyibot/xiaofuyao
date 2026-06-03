<template>
  <view class="dose-calculator">
    <view class="calc-card">
      <view class="calc-title">🧮 氟尿嘧啶口服乳剂量计算器</view>
      <view class="calc-subtitle">基于体表面积（BSA）法 · Mosteller 公式</view>

      <view class="form-group">
        <text class="form-label">身高 (cm)</text>
        <input
          v-model="form.height"
          type="digit"
          placeholder="例如 165"
          class="form-input"
        />
      </view>

      <view class="form-group">
        <text class="form-label">体重 (kg)</text>
        <input
          v-model="form.weight"
          type="digit"
          placeholder="例如 60"
          class="form-input"
        />
      </view>

      <view class="form-group">
        <text class="form-label">适应症</text>
        <picker
          :range="indications"
          :value="indicationIndex"
          @change="onIndicationChange"
          class="form-input"
        >
          <view>{{ form.indication || '请选择' }}</view>
        </picker>
      </view>

      <button class="calc-btn" hover-class="calc-btn--hover" @click="onCalculate">
        立即计算
      </button>
    </view>

    <view v-if="result" class="result-card">
      <view class="result-title">📊 计算结果</view>
      <view class="result-row">
        <text class="result-label">体表面积 BSA</text>
        <text class="result-value">{{ result.bsa }} m²</text>
      </view>
      <view class="result-row">
        <text class="result-label">推荐日剂量</text>
        <text class="result-value highlight">{{ result.doseMg }} mg/日</text>
      </view>
      <view class="result-row">
        <text class="result-label">推荐日剂量</text>
        <text class="result-value highlight">{{ result.doseMl }} mL/日</text>
      </view>
      <view class="result-tip">
        ⚠️ 以上为推荐剂量，实际用药方案请遵医嘱。请在医生指导下使用。
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const indications = ['结直肠癌', '胃癌', '乳腺癌', '头颈肿瘤']

const form = ref({
  height: '',
  weight: '',
  indication: ''
})

const indicationIndex = computed(() => indications.indexOf(form.value.indication))
const result = ref(null)

const canCalc = computed(() => form.value.height && form.value.weight)

function onIndicationChange(e) {
  form.value.indication = indications[e.detail.value]
}

function onCalculate() {
  // 前置校验（不再用 :disabled，给用户 toast 反馈）
  if (!canCalc.value) {
    uni.showToast({ title: '请填写身高、体重', icon: 'none', duration: 2000 })
    return
  }

  const h = parseFloat(form.value.height)
  const w = parseFloat(form.value.weight)

  // Mosteller 公式
  const bsa = Math.sqrt((h * w) / 3600)

  // 不同适应症的推荐剂量（mg/m²/日）
  const doseMap = {
    '结直肠癌': 600,
    '胃癌': 600,
    '乳腺癌': 500,
    '头颈肿瘤': 500
  }
  const dosePerM2 = doseMap[form.value.indication] || 600
  const totalDose = bsa * dosePerM2

  // 假设 0.4g/支，10mL/支 → 40mg/mL
  const totalMl = totalDose / 40

  result.value = {
    bsa: bsa.toFixed(2),
    doseMg: Math.round(totalDose),
    doseMl: totalMl.toFixed(1)
  }

  // 触发分析
  uni.showToast({ title: '计算完成', icon: 'success' })
}
</script>

<style lang="scss" scoped>
@import "@/uni.scss";

.dose-calculator {
  padding: 24rpx;
}

.calc-card {
  background: #FFFFFF;
  border-radius: $uni-border-radius-lg;
  padding: 32rpx;
  box-shadow: $uni-shadow-base;
  margin-bottom: 24rpx;
}

.calc-title {
  font-size: 36rpx;
  font-weight: 600;
  color: $uni-color-primary;
  margin-bottom: 8rpx;
}

.calc-subtitle {
  font-size: 24rpx;
  color: $uni-text-color-secondary;
  margin-bottom: 32rpx;
}

.form-group {
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
  display: flex;
  align-items: center;
}

.calc-btn {
  width: 100%;
  height: 88rpx;
  background: $uni-color-primary-light;
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: $uni-border-radius-sm;
  margin-top: 16rpx;
  border: none;
}

.calc-btn--hover {
  background: $uni-color-primary;
  opacity: 0.9;
}

.calc-btn[disabled] {
  background: #BBDEFB;
  color: #FFFFFF;
}

.calc-btn::after { border: none; }

.result-card {
  background: linear-gradient(135deg, $uni-color-primary 0%, $uni-color-primary-light 100%);
  color: #FFFFFF;
  border-radius: $uni-border-radius-lg;
  padding: 32rpx;
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

.result-row:last-of-type {
  border-bottom: none;
}

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

.result-tip {
  margin-top: 24rpx;
  padding: 16rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: $uni-border-radius-sm;
  font-size: 24rpx;
  line-height: 1.5;
}
</style>
