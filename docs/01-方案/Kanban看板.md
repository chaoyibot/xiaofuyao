# 📋 小福药 · Kanban 看板

> **工具**：`hermes kanban`  
> **看板名称**：`xiaofuyao`  
> **创建日期**：2026-06-03

---

## 看板列（5 列）

| 列 | 状态 | 用途 |
|:---|:---:|:---|
| `triage` | 暂存 | 模糊想法，待 Specify 展开 |
| `todo` | 待办 | 明确需求，待开发 |
| `running` | 进行中 | AI/开发工作中 |
| `review` | 验收 | 东哥 review 中 |
| `done` | 完成 | 已完成、已部署 |

---

## 看板初始化命令

```bash
# 创建看板
hermes kanban create --board xiaofuyao

# 初始化列
hermes kanban add-column xiaofuyao triage
hermes kanban add-column xiaofuyao todo
hermes kanban add-column xiaofuyao running
hermes kanban add-column xiaofuyao review
hermes kanban add-column xiaofuyao done

# 初始化标签
hermes kanban add-tag xiaofuyao 模块-产品介绍
hermes kanban add-tag xiaofuyao 模块-学术培训
hermes kanban add-tag xiaofuyao 模块-售后服务
hermes kanban add-tag xiaofuyao 优先级-P0
hermes kanban add-tag xiaofuyao 优先级-P1
hermes kanban add-tag xiaofuyao 优先级-P2
hermes kanban add-tag xiaofuyao 类型-前端
hermes kanban add-tag xiaofuyao 类型-后端
hermes kanban add-tag xiaofuyao 类型-设计
hermes kanban add-tag xiaofuyao 类型-内容
hermes kanban add-tag xiaofuyao 类型-测试
hermes kanban add-tag xiaofuyao 类型-合规
hermes kanban add-tag xiaofuyao 类型-部署
hermes kanban add-tag xiaofuyao 类型-文档
```

---

## 任务清单（按 Sprint 组织）

### 🎯 Sprint 1: W1 - 基础 + 内容 + 设计

#### Triage（待 Specify）
- [ ] 💡 软文 100+ 入库自动化
- [ ] 💡 学术资料 224KB 处理
- [ ] 💡 设计稿 5+ 版探索

#### Todo
- [ ] 📦 搭建项目骨架（uni-app + 云开发）
- [ ] 🎨 设计系统 v1.0 定稿
- [ ] 🛡️ 合规规则引擎 v1.0
- [ ] 📋 微信小程序账号注册 + 类目申请
- [ ] 📋 资质材料准备

#### Running
- [ ] 🤖 100+ 软文结构化（后台）
- [ ] 🤖 224KB 学术资料处理（后台）
- [ ] 🎨 5+ 版设计稿探索（后台）

#### Review
- [ ] ⏳ 等内容入库完成

#### Done
- [x] ✅ 项目目录结构
- [x] ✅ README
- [x] ✅ 合规规则 v1.0
- [x] ✅ 设计系统 v1.0
- [x] ✅ 方案文档 v1.2

---

### 🎯 Sprint 2: W2 - 产品介绍 + 学术培训

#### Triage
- [ ] 💡 5 个卖点打磨
- [ ] 💡 患者故事筛选标准

#### Todo
- [ ] 📦 产品介绍-首页
- [ ] 📦 产品介绍-详情页
- [ ] 📦 患者故事列表
- [ ] 📦 医保查询
- [ ] 📦 学术中心-首页
- [ ] 📦 文献详情
- [ ] 📦 课件列表
- [ ] 📦 剂量计算器
- [ ] ⚙️ 后端 API（5+8 = 13 个）
- [ ] 📥 内容批量入库

#### Running
- [ ] （由 AI 自动填充）

#### Review
- [ ] ⏳ 等模块开发完成

#### Done
- [ ] （待办）

---

### 🎯 Sprint 3: W3 - 售后服务

#### Triage
- [ ] 💡 用药提醒策略
- [ ] 💡 不良反应分级流程

#### Todo
- [ ] 📦 售后服务-首页
- [ ] 📦 用药管理
- [ ] 📦 用药打卡
- [ ] 📦 不良反应上报
- [ ] 📦 复查提醒
- [ ] 📦 智能客服
- [ ] 📦 一键紧急求助
- [ ] ⚙️ 后端 API（12 个）
- [ ] 🤖 智能客服知识库
- [ ] 📲 微信订阅消息

#### Running
- [ ] （由 AI 自动填充）

#### Review
- [ ] ⏳ 等模块开发完成

#### Done
- [ ] （待办）

---

### 🎯 Sprint 4: W4 - 联调 + 测试 + 上线

#### Triage
- [ ] 💡 灰度发布策略
- [ ] 💡 应急响应预案

#### Todo
- [ ] 🔗 全模块联调
- [ ] 🧪 E2E 测试（50+ 用例）
- [ ] 📊 压测
- [ ] 🛡️ 安全扫描 + 等保测评
- [ ] 📋 微信小程序审核
- [ ] 🚀 灰度发布（10% → 50% → 100%）
- [ ] 📊 数据监控
- [ ] 📞 客服上线

#### Running
- [ ] （由 AI 自动填充）

#### Review
- [ ] ⏳ 等测试完成

#### Done
- [ ] （待办）

---

## 工作流

```
东哥 review（每天 30 分钟）
   ↓
   点击 ✨ Specify（AI 展开）
   ↓
   移到 todo
   ↓
   AI Worker 自动 pickup
   ↓
   进入 running
   ↓
   完成后进入 review
   ↓
   东哥 review 通过 → done
   ↓
   未通过 → 打回 todo
```

---

## 关键指标

| 指标 | 目标 |
|:---|:---|
| 任务完成率 | ≥ 90% |
| 东哥 review 时长 | ≤ 30 分钟/天 |
| Bug 漏出率 | ≤ 5% |
| 按时交付率 | ≥ 80% |

---

## 看板视图

```bash
# 终端查看
hermes kanban list --board xiaofuyao

# Web 界面（如有）
http://localhost:8500/kanban/xiaofuyao
```

---

> **版本**：v1.0  
> **更新日期**：2026-06-03
