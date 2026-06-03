# 🏥 小福药 · API 接口规范 v1.0

> **基础 URL**：`https://{env-id}.service.tcloudbase.com/api`  
> **认证方式**：Bearer Token  
> **数据格式**：JSON  
> **字符编码**：UTF-8

---

## 📋 通用约定

### 请求头

```
Content-Type: application/json
Authorization: Bearer {token}     # 用户登录后获取
X-OpenID: {openid}                 # 微信 openid（备用）
```

### 响应格式

```json
{
  "code": 0,           // 0=成功，其他=失败
  "message": "ok",     // 错误信息
  "data": { ... }      // 业务数据
}
```

### 错误码

| 状态码 | 含义 |
|:---:|:---|
| 0 / 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未登录 / token 失效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 1️⃣ 用户中心 `/api/user`

### 1.1 登录

```http
POST /api/user
action: login
```

**请求体**：
```json
{
  "code": "微信 code"
}
```

**响应**：
```json
{
  "code": 0,
  "data": {
    "token": "eyJhbGc...",
    "userInfo": {
      "openid": "oXyz...",
      "nickname": "张女士",
      "avatar": "https://...",
      "role": "patient"
    }
  }
}
```

### 1.2 获取用户信息

```http
POST /api/user
action: getUserInfo
```

### 1.3 更新用户信息

```http
POST /api/user
action: updateUserInfo
```

**请求体**：
```json
{ "nickname": "新昵称", "phone": "138****1234" }
```

### 1.4 家属账号

```http
POST /api/user
action: addFamilyMember     # 添加
action: getFamilyMembers    # 列表
```

---

## 2️⃣ 产品中心 `/api/product`

### 2.1 首页数据

```http
POST /api/product
action: getHomeData
```

**响应**：
```json
{
  "code": 0,
  "data": {
    "banners": [
      { "title": "氟尿嘧啶口服乳", "subtitle": "口服化疗新选择", "icon": "💊" }
    ]
  }
}
```

### 2.2 产品详情

```http
POST /api/product
action: getProductDetail
params: { "id": "fluorouracil-oral" }
```

### 2.3 适应症

```http
POST /api/product
action: getIndications
```

### 2.4 ~~医保查询~~（已取消）

> ⚠️ 2026-06-03 东哥指示：医保板块已取消，getInsurance 接口不再维护。

---

## 3️⃣ 学术中心 `/api/academic`

### 3.1 文献列表

```http
POST /api/academic
action: getDocuments
params: { "indication": "结直肠癌", "page": 1, "pageSize": 20 }
```

### 3.2 文献详情

```http
POST /api/academic
action: getDocumentDetail
params: { "id": "doc_001" }
```

### 3.3 课件列表

```http
POST /api/academic
action: getCourses
params: { "category": "基础", "page": 1, "pageSize": 20 }
```

### 3.4 剂量计算

```http
POST /api/academic
action: calculateDose
params: { "height": 165, "weight": 60, "indication": "结直肠癌", "age": 55, "performanceStatus": 0 }
```

**响应**：
```json
{
  "code": 0,
  "data": {
    "bsa": 1.66,
    "baseDose": 600,
    "recommendedDailyMg": 996,
    "recommendedDailyMl": 24.9,
    "warnings": []
  }
}
```

---

## 4️⃣ 售后中心 `/api/service`

### 4.1 用药计划

```http
POST /api/service
action: getMedicationPlan
```

### 4.2 用药打卡

```http
POST /api/service
action: medicationCheckin
params: { "plan_id": "plan_001", "mood": "normal", "notes": "" }
```

### 4.3 复查提醒

```http
POST /api/service
action: getReminders
```

### 4.4 不良反应上报

```http
POST /api/service
action: reportAdverseEvent
params: {
  "symptoms": ["恶心", "呕吐"],
  "severity": 2,
  "occurred_at": "2026-06-03T10:00:00Z",
  "notes": "饭后 2 小时出现"
}
```

**严重等级**：
- 1: 轻度
- 2: 中度
- 3: 重度（触发告警）
- 4: 危及生命（立即响应）

### 4.5 智能客服

```http
POST /api/service
action: chatWithBot
params: { "message": "如何服药？", "session_id": "s_001" }
```

### 4.6 物流查询

```http
POST /api/service
action: getLogistics
params: { "orderId": "order_001" }
```

---

## 5️⃣ 故事中心 `/api/story`

### 5.1 精选故事（首页用）

```http
POST /api/story
action: getFeatured
params: { "limit": 3 }
```

### 5.2 故事列表

```http
POST /api/story
action: getStories
params: { "indication": "胃癌", "page": 1, "pageSize": 20 }
```

### 5.3 故事详情

```http
POST /api/story
action: getStoryDetail
params: { "id": "story_001" }
```

---

## 📊 接口汇总表

| 模块 | 接口数 | 状态 |
|:---|:---:|:---:|
| 用户中心 | 5 | 🟢 已实现 |
| 产品中心 | 4 | 🟢 已实现 |
| 学术中心 | 5 | 🟢 已实现 |
| 售后中心 | 6 | 🟢 已实现 |
| 故事中心 | 4 | 🟢 已实现 |
| **总计** | **24** | **🟢 100%** |

---

## 🔒 安全规范

1. **鉴权**：所有需要登录的接口必须传 token
2. **限流**：单 IP 100 次/分钟
3. **HTTPS**：生产环境强制 HTTPS
4. **审计**：所有医疗行为全量日志，至少保留 3 年
5. **数据加密**：敏感字段（身份证、手机号）加密存储

---

> **更新日期**：2026-06-03
> **维护人**：来福（AI） + 东哥
