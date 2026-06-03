# 🗄️ 小福药 · 数据库 Schema v1.0

> **数据库**：腾讯云开发 MySQL  
> **设计原则**：医疗合规、查询性能、数据隔离

---

## 📋 集合清单

| 集合 | 用途 | 权限 | 预估数据量 |
|:---|:---|:---:|:---:|
| `users` | 用户基础信息 | 仅本人读写 | < 10 万 |
| `products` | 药品信息 | 公开读 | < 100 |
| `indications` | 适应症字典 | 公开读 | < 50 |
| `product_banners` | 首页轮播 | 公开读 | < 20 |
| `insurance_records` | 医保记录 | 公开读 | < 5000 |
| `academic_documents` | 学术文献 | 公开读 | < 1000 |
| `courses` | 培训课件 | 公开读 | < 500 |
| `patient_stories` | 患者故事 | 公开读 | < 10000 |
| `medication_plans` | 用药计划 | 仅本人 | < 10 万 |
| `medication_checkins` | 用药打卡 | 仅本人 | < 1000 万 |
| `reminders` | 复查提醒 | 仅本人 | < 100 万 |
| `adverse_events` | 不良反应 | 仅本人 + 医师 | < 100 万 |
| `chat_history` | 客服对话 | 仅本人 | < 1000 万 |
| `family_members` | 家属账号 | 仅本人 | < 10 万 |
| `view_history` | 浏览历史 | 仅本人 | < 1 亿 |

---

## 1. users（用户表）

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(64) UNIQUE NOT NULL COMMENT '微信 openid',
  unionid VARCHAR(64) DEFAULT NULL,
  nickname VARCHAR(64) DEFAULT '' COMMENT '昵称',
  avatar VARCHAR(512) DEFAULT '' COMMENT '头像 URL',
  phone VARCHAR(20) DEFAULT '' COMMENT '手机号（加密）',
  role ENUM('patient', 'doctor', 'family', 'admin') DEFAULT 'patient',
  real_name VARCHAR(64) DEFAULT '' COMMENT '真实姓名（脱敏）',
  gender ENUM('male', 'female', 'unknown') DEFAULT 'unknown',
  birth_date DATE DEFAULT NULL,
  province VARCHAR(32) DEFAULT '',
  city VARCHAR(32) DEFAULT '',
  -- 医疗相关
  primary_diagnosis VARCHAR(128) DEFAULT '' COMMENT '主要诊断',
  treatment_stage VARCHAR(64) DEFAULT '' COMMENT '治疗阶段',
  treatment_start_date DATE DEFAULT NULL,
  -- 行为统计
  streak INT DEFAULT 0 COMMENT '连续打卡天数',
  total_checkins INT DEFAULT 0,
  -- 时间
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_openid (openid),
  INDEX idx_role (role),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

---

## 2. products（产品表）

```sql
CREATE TABLE products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL COMMENT '通用名',
  en_name VARCHAR(256) DEFAULT '' COMMENT '英文名',
  specification VARCHAR(128) DEFAULT '' COMMENT '规格',
  dosage_form VARCHAR(64) DEFAULT '' COMMENT '剂型',
  manufacturer VARCHAR(128) DEFAULT '',
  approval_number VARCHAR(64) DEFAULT '' COMMENT '批准文号',
  indications JSON COMMENT '适应症列表',
  contraindications TEXT COMMENT '禁忌症',
  usage TEXT COMMENT '用法用量',
  adverse_reactions TEXT COMMENT '不良反应',
  precautions TEXT COMMENT '注意事项',
  storage VARCHAR(256) DEFAULT '' COMMENT '贮藏',
  valid_period VARCHAR(64) DEFAULT '' COMMENT '有效期',
  -- 媒体
  cover_image VARCHAR(512) DEFAULT '',
  images JSON,
  -- SEO
  summary TEXT,
  -- 时间
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产品表';
```

---

## 3. academic_documents（学术文献表）

```sql
CREATE TABLE academic_documents (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(512) NOT NULL,
  authors JSON COMMENT '作者列表',
  journal VARCHAR(256) DEFAULT '' COMMENT '期刊',
  year INT DEFAULT NULL COMMENT '发表年份',
  volume VARCHAR(32) DEFAULT '',
  issue VARCHAR(32) DEFAULT '',
  pages VARCHAR(32) DEFAULT '',
  doi VARCHAR(128) DEFAULT '',
  abstract TEXT,
  keywords JSON,
  themes JSON COMMENT '主题标签（药代/临床/安全等）',
  indications JSON COMMENT '相关适应症',
  category ENUM('research', 'review', 'guideline', 'case') DEFAULT 'research',
  pdf_url VARCHAR(512) DEFAULT '',
  view_count INT DEFAULT 0,
  download_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FULLTEXT INDEX ft_title (title, abstract),
  INDEX idx_year (year),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学术文献表';
```

---

## 4. patient_stories（患者故事表）

```sql
CREATE TABLE patient_stories (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(256) NOT NULL,
  summary TEXT,
  content LONGTEXT COMMENT '正文 Markdown',
  author VARCHAR(64) DEFAULT '' COMMENT '作者/患者',
  patient_age INT DEFAULT NULL,
  patient_gender ENUM('male', 'female') DEFAULT NULL,
  indications JSON COMMENT '相关适应症',
  treatment_duration VARCHAR(64) DEFAULT '' COMMENT '治疗时长',
  outcome VARCHAR(256) DEFAULT '' COMMENT '治疗结果',
  cover_image VARCHAR(512) DEFAULT '',
  images JSON,
  -- 审核
  review_status ENUM('draft', 'pending', 'approved', 'rejected') DEFAULT 'draft',
  reviewed_by VARCHAR(64) DEFAULT '',
  reviewed_at DATETIME,
  -- 状态
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  sort INT DEFAULT 0,
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  -- 时间
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_published (published),
  INDEX idx_featured (featured),
  INDEX idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='患者故事表';
```

---

## 5. medication_plans（用药计划表）

```sql
CREATE TABLE medication_plans (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL COMMENT '所属用户',
  medicine_name VARCHAR(128) NOT NULL COMMENT '药品名',
  specification VARCHAR(128) DEFAULT '',
  dosage VARCHAR(64) DEFAULT '' COMMENT '单次剂量',
  frequency VARCHAR(64) DEFAULT '' COMMENT '频次',
  timing JSON COMMENT '服药时间点 [{"time": "08:00"}, ...]',
  course_days INT DEFAULT 0 COMMENT '疗程天数',
  start_date DATE,
  end_date DATE,
  notes TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_user (user_id),
  INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用药计划表';
```

---

## 6. medication_checkins（用药打卡表）

```sql
CREATE TABLE medication_checkins (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(64) NOT NULL,
  plan_id VARCHAR(64) NOT NULL,
  taken_at DATETIME NOT NULL COMMENT '服药时间',
  mood ENUM('good', 'normal', 'bad') DEFAULT 'normal' COMMENT '主观感受',
  side_effects JSON COMMENT '副作用记录',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_taken (user_id, taken_at),
  INDEX idx_plan (plan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用药打卡表'
PARTITION BY RANGE (TO_DAYS(taken_at)) (
  -- 按月分区（示例）
  PARTITION p202606 VALUES LESS THAN (TO_DAYS('2026-07-01')),
  PARTITION p202607 VALUES LESS THAN (TO_DAYS('2026-08-01')),
  PARTITION p202608 VALUES LESS THAN (TO_DAYS('2026-09-01')),
  PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

> 💡 **打卡表数据量大，建议按月分区**

---

## 7. reminders（复查提醒表）

```sql
CREATE TABLE reminders (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  type ENUM('blood_test', 'imaging', 'doctor_visit', 'medication_refill', 'other') NOT NULL,
  title VARCHAR(128) NOT NULL,
  description TEXT,
  due_date DATETIME NOT NULL,
  repeat_type ENUM('once', 'daily', 'weekly', 'monthly') DEFAULT 'once',
  notification_methods JSON COMMENT '["sms", "wechat", "app_push"]',
  completed BOOLEAN DEFAULT FALSE,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_due (user_id, due_date),
  INDEX idx_completed (completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='复查提醒表';
```

---

## 8. adverse_events（不良反应表）🔴 关键

```sql
CREATE TABLE adverse_events (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(64) NOT NULL,
  plan_id VARCHAR(64),
  symptoms JSON NOT NULL COMMENT '症状列表',
  severity TINYINT NOT NULL COMMENT 'CTCAE 分级 1-4',
  body_system VARCHAR(64) DEFAULT '' COMMENT '涉及系统',
  occurred_at DATETIME NOT NULL,
  duration_minutes INT DEFAULT NULL COMMENT '持续时间',
  treatment_given TEXT COMMENT '已采取的处理',
  notes TEXT,
  -- 审核流程
  status ENUM('pending', 'reviewing', 'reviewed', 'reported_to_authority') DEFAULT 'pending',
  reviewed_by VARCHAR(64) DEFAULT '' COMMENT '审核医师',
  reviewed_at DATETIME,
  review_notes TEXT,
  -- 上报
  reported_to_authority BOOLEAN DEFAULT FALSE COMMENT '是否已上报药监',
  report_id VARCHAR(64) DEFAULT '' COMMENT '上报编号',
  -- 时间
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user (user_id),
  INDEX idx_severity (severity),
  INDEX idx_status (status),
  INDEX idx_occurred (occurred_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='不良反应事件表';
```

> ⚠️ **医疗合规要求**：
> - 严重不良反应（3-4 级）必须 24h 内审核
> - 群体不良反应必须上报药监
> - 数据保留至少 10 年

---

## 9. chat_history（客服对话表）

```sql
CREATE TABLE chat_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(64) NOT NULL,
  session_id VARCHAR(64) NOT NULL,
  user_message TEXT,
  bot_reply TEXT,
  intent VARCHAR(64) DEFAULT '' COMMENT '识别意图',
  confidence DECIMAL(3,2) DEFAULT 0,
  escalated_to_human BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_session (user_id, session_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客服对话表';
```

---

## 10. family_members（家属账号表）

```sql
CREATE TABLE family_members (
  id VARCHAR(64) PRIMARY KEY,
  owner_id VARCHAR(64) NOT NULL COMMENT '主账号',
  name VARCHAR(64) NOT NULL,
  relation VARCHAR(32) DEFAULT '' COMMENT '关系（父子/夫妻等）',
  phone VARCHAR(20) DEFAULT '',
  can_view_medication BOOLEAN DEFAULT TRUE,
  can_view_diagnosis BOOLEAN DEFAULT FALSE,
  can_receive_alerts BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_owner (owner_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='家属账号表';
```

---

## 🔒 安全策略

### 1. 数据加密

- **字段级加密**：`phone`、`real_name`、`id_card`
- **加密算法**：SM4（国密）
- **密钥管理**：腾讯云 KMS

### 2. 访问控制

```yaml
# 腾讯云开发安全规则
users:
  read: auth.openid == doc.openid
  write: auth.openid == doc.openid

products:
  read: true
  write: auth.role == 'admin'

patient_stories:
  read: doc.published == true
  write: auth.role == 'admin'
```

### 3. 审计日志

- 所有写操作记录到 `audit_log` 集合
- 保留 3 年以上
- 包含：操作人、时间、操作类型、数据变更前后

### 4. 数据备份

- 每日全量备份
- 实时增量备份
- 跨地域容灾

---

## 📊 索引策略

| 表 | 索引 | 场景 |
|:---|:---|:---|
| `medication_checkins` | (user_id, taken_at) | 查询用户历史打卡 |
| `adverse_events` | (severity, status) | 紧急告警扫描 |
| `academic_documents` | FULLTEXT (title, abstract) | 学术搜索 |
| `patient_stories` | (published, indications) | 故事列表筛选 |

---

## 🔄 初始化脚本

```bash
# 1. 创建数据库
mysql -u root -p -e "CREATE DATABASE xiaofuyao CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. 导入 schema
mysql -u root -p xiaofuyao < schema_v1.sql

# 3. 插入种子数据
mysql -u root -p xiaofuyao < seed_data.sql

# 4. 创建索引
mysql -u root -p xiaofuyao -e "CALL create_indexes();"
```

---

> **版本**：v1.0  
> **更新日期**：2026-06-03  
> **维护人**：来福（AI） + 东哥
