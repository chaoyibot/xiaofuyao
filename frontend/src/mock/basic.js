export const indications = [
  { id: 'crc', name: '结直肠癌', icon: '🎗️', description: '结直肠癌辅助化疗、转移性治疗、维持治疗' },
  { id: 'gc', name: '胃癌', icon: '🩺', description: '进展期胃癌姑息化疗、围手术期化疗' },
  { id: 'bc', name: '乳腺癌', icon: '🎀', description: '术后辅助化疗、转移性乳腺癌' },
  { id: 'hnc', name: '头颈肿瘤', icon: '💪', description: '同步放化疗、姑息化疗' }
]

/**
 * 药品基础信息（仅展示"可对外公开"信息）
 * 详细用药/禁忌/不良反应 等专业内容，**严格遵循"详见说明书"原则**，
 * 不展示未经药监部门审核的临床数据。
 */
export const product = {
  id: 'fluorouracil-oral',
  name: '氟尿嘧啶口服乳',
  enName: '5-Fluorouracil Oral Emulsion',
  genericName: '氟尿嘧啶',
  specification: '0.4g/支',
  dosageForm: '口服乳剂',
  manufacturer: '中和制药',
  // 以下信息均不展示，详见官方说明书
  usage: '详见药品说明书。请在医生指导下使用。',
  storage: '详见药品说明书',
  validPeriod: '详见药品说明书',
  // 风险提示
  isPrescription: true,  // 处方药
  isRx: true,
  // 重大风险点（必须展示）
  riskAlerts: [
    '⚠️ 本品为处方药，必须凭医师处方购买、使用',
    '⚠️ 用药前请仔细阅读说明书',
    '⚠️ 应在有化疗经验的医师指导下使用',
    '⚠️ 孕妇及哺乳期妇女禁用',
    '⚠️ 用药期间需定期监测血常规、肝肾功能',
    '⚠️ 出现严重不良反应应立即停药并就医'
  ]
}

// 已删除：医保板块（医保已取消，不再展示）

/**
 * 5 大核心优势
 * ⚠️ 已删除"医保覆盖"卖点（医保已取消）
 */
export const sellingPoints = [
  { icon: '🏠', title: '居家治疗', description: '告别频繁往返医院' },
  { icon: '💊', title: '口服乳剂', description: '乳剂型制剂，服用方便' },
  { icon: '🛡️', title: '安全可控', description: '医生全程用药指导' },
  { icon: '📋', title: '品牌保障', description: '中和制药正规生产' },
  { icon: '💰', title: '经济实惠', description: '省去住院治疗费用' }
]
