# 🏥 小福药 · 氟尿嘧啶口服乳售后服务小程序

> **项目代号**：小福药 (Xiaofuyao)  
> **品牌**：中和制药官方  
> **类型**：微信小程序  
> **当前版本**：v0.1（W1 进行中）

---

## 🎯 项目进度

| 阶段 | 状态 | 完成度 |
|:---|:---:|:---:|
| W0 筹备期 | ✅ 完成 | 100% |
| W1 基础架构 | 🟡 进行中 | 50% |
| W2 产品+学术 | ⏳ 待开始 | 0% |
| W3 售后服务 | ⏳ 待开始 | 0% |
| W4 联调上线 | ⏳ 待开始 | 0% |

---

## 📦 已交付内容

### 📁 frontend/ - 前端代码
- `package.json` - 依赖配置（uni-app + Vue 3 + Pinia）
- `manifest.json` - 小程序/H5 配置
- `pages.json` - 19 个页面路由 + TabBar
- `uni.scss` - 全局主题变量（深蓝+科技蓝）
- `App.vue` - 应用入口
- `main.js` - 应用初始化
- `src/api/` - 5 大 API 模块（24 个接口）
- `src/stores/` - Pinia 状态管理（user store）
- `src/utils/` - 工具类（request 封装）
- `src/components/` - **15 个 UI 组件**
- `src/pages/` - 19 个页面（首页/产品/学术/服务/我的）

### 📁 cloudfunctions/ - 后端云函数
- `product/index.js` - 产品中心
- `academic/index.js` - 学术中心（含剂量计算）
- `service/index.js` - 售后中心（含智能客服、紧急告警）
- `user/index.js` - 用户中心
- `story/index.js` - 故事中心

### 📁 docs/ - 项目文档
- `01-方案/小福药方案_v1.2.md` - 完整方案
- `01-方案/Kanban看板.md` - 任务看板设计
- `02-API/API规范.md` - **24 个 API 接口规范**
- `02-API/数据库Schema.md` - **15 个数据表设计**

### 📁 content/ - 内容资产
- `软文结构化/` - 90 篇软文（72 万字）
- `学术资料/` - 289 章节（101K 字符）
- `患者故事/` - 待整理
- `临床指南/` - 待整理

### 📁 compliance/ - 合规资产
- `合规规则引擎.md` - 合规规则
- `compliance_report.json` - 审查报告（28 严重 + 37 警告）
- `forbidden_words.json` - 违规词库（前端过滤用）

### 📁 scripts/ - 自动化脚本
- `软文结构化.py` - 90 篇软文结构化
- `学术资料处理.py` - 224KB 学术资料
- `合规审查.py` - 28 处违规词检测
- `违规词过滤.py` - 177 处违规词替换

### 📁 demo/ - 在线 Demo
- `index.html` - 5 种设计风格 + 5 个 Tab 预览
- 🌐 **在线访问**：https://chaoyibot.github.io/xiaofuyao/

---

## 🚀 快速开始

### 前端开发
```bash
cd frontend
npm install
npm run dev:mp-weixin    # 微信小程序
npm run dev:h5           # H5
```

### 云函数部署
1. 在微信开发者工具中关联云开发环境
2. 右键 `cloudfunctions/xxx` 目录 → 上传并部署

### 数据库初始化
详见 `docs/02-API/数据库Schema.md`

---

## 🛠️ 技术栈

| 层级 | 技术 |
|:---|:---|
| 前端框架 | uni-app + Vue 3 |
| 状态管理 | Pinia |
| 样式 | SCSS |
| 后端 | 腾讯云开发（云函数） |
| 数据库 | MySQL + COS |
| 智能客服 | 混元大模型（待接入） |
| 实时通讯 | 腾讯云 IM |

---

## 📊 核心数据

| 指标 | 数值 |
|:---|---:|
| 页面数 | 19 |
| UI 组件 | 15 |
| API 接口 | 24 |
| 数据库表 | 15 |
| 软文数 | 90 |
| 学术章节 | 289 |
| 自动化脚本 | 4 |

---

## 👥 团队

| 角色 | 负责人 |
|:---|:---|
| 🧠 项目指挥 + 主程序员 | **来福（AI）** |
| 👤 业务决策 | **东哥** |
| 💼 商务助理 | 待定 |

**预算**：**0 元**（只付 token 费用 + 腾讯云费用）

---

## 🔗 链接

- **在线 Demo**：https://chaoyibot.github.io/xiaofuyao/
- **GitHub 仓库**：https://github.com/chaoyibot/xiaofuyao
- **提 Issue**：https://github.com/chaoyibot/xiaofuyao/issues

---

> **版本**：v0.1  
> **最后更新**：2026-06-03  
> **状态**：🟡 W1 进行中
