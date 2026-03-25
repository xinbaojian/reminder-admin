# 定时任务配置管理 API 文档

## 概述

定时任务配置管理接口，支持用户级别的定时任务配置管理。每个用户可独立配置自己的定时任务执行时间。

**基础路径**: `/api/v1`

**认证方式**: JWT Token（所有接口均需要登录认证）

---

## 接口列表

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/cron-config/list` | 获取定时任务配置列表 |
| GET | `/cron-config/{id}` | 获取定时任务配置详情 |
| POST | `/cron-config` | 创建定时任务配置 |
| PUT | `/cron-config/{id}` | 更新定时任务配置 |
| PUT | `/cron-config/status` | 更新定时任务配置状态 |
| DELETE | `/cron-config/{id}` | 删除定时任务配置 |
| POST | `/cron-config/reload` | 重载定时任务 |

---

## 接口详情

### 1. 获取定时任务配置列表

**请求**
```
GET /api/v1/cron-config/list
```

**请求头**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Authorization | string | 是 | JWT Token，格式：`Bearer {token}` |

**响应示例**
```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 1,
        "taskName": "订阅检查任务",
        "taskKey": "check_subscriptions",
        "cronExpression": "0 0 7 * * *",
        "description": "检查订阅是否过期并发送提醒",
        "status": 1,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      },
      {
        "id": 2,
        "userId": 1,
        "taskName": "生日检查任务",
        "taskKey": "check_birthdays",
        "cronExpression": "0 2 7 * * *",
        "description": "检查生日并发送提醒",
        "status": 1,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

**响应字段说明**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 配置ID |
| userId | int | 用户ID |
| taskName | string | 任务名称（显示名） |
| taskKey | string | 任务键（唯一标识） |
| cronExpression | string | Cron表达式 |
| description | string | 任务描述 |
| status | int | 状态：1-启用，2-禁用 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

---

### 2. 获取定时任务配置详情

**请求**
```
GET /api/v1/cron-config/{id}
```

**路径参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | int | 是 | 配置ID |

**请求头**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Authorization | string | 是 | JWT Token |

**响应示例**
```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "id": 1,
    "userId": 1,
    "taskName": "订阅检查任务",
    "taskKey": "check_subscriptions",
    "cronExpression": "0 0 7 * * *",
    "description": "检查订阅是否过期并发送提醒",
    "status": 1,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 3. 创建定时任务配置

**请求**
```
POST /api/v1/cron-config
```

**请求头**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Authorization | string | 是 | JWT Token |
| Content-Type | string | 是 | application/json |

**请求体**
```json
{
  "taskName": "自定义任务",
  "taskKey": "custom_task",
  "cronExpression": "0 0 8 * * *",
  "description": "每天8点执行的自定义任务"
}
```

**请求字段说明**
| 字段 | 类型 | 必填 | 最大长度 | 说明 |
|------|------|------|----------|------|
| taskName | string | 是 | 100 | 任务名称 |
| taskKey | string | 是 | 100 | 任务键（用户内唯一） |
| cronExpression | string | 是 | 100 | Cron表达式 |
| description | string | 否 | 255 | 任务描述 |

**响应示例**
```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "id": 3
  }
}
```

---

### 4. 更新定时任务配置

**请求**
```
PUT /api/v1/cron-config/{id}
```

**路径参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | int | 是 | 配置ID |

**请求头**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Authorization | string | 是 | JWT Token |
| Content-Type | string | 是 | application/json |

**请求体**
```json
{
  "taskName": "订阅检查任务",
  "cronExpression": "0 30 8 * * *",
  "description": "每天8点30分检查订阅"
}
```

**请求字段说明**
| 字段 | 类型 | 必填 | 最大长度 | 说明 |
|------|------|------|----------|------|
| taskName | string | 是 | 100 | 任务名称 |
| cronExpression | string | 是 | 100 | Cron表达式 |
| description | string | 否 | 255 | 任务描述 |

**响应示例**
```json
{
  "code": 0,
  "message": "OK",
  "data": {}
}
```

---

### 5. 更新定时任务配置状态

**请求**
```
PUT /api/v1/cron-config/status
```

**请求头**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Authorization | string | 是 | JWT Token |
| Content-Type | string | 是 | application/json |

**请求体**
```json
{
  "id": 1,
  "status": 2
}
```

**请求字段说明**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | int | 是 | 配置ID |
| status | int | 是 | 状态：1-启用，2-禁用 |

**响应示例**
```json
{
  "code": 0,
  "message": "OK",
  "data": {}
}
```

---

### 6. 删除定时任务配置

**请求**
```
DELETE /api/v1/cron-config/{id}
```

**路径参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | int | 是 | 配置ID |

**请求头**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Authorization | string | 是 | JWT Token |

**响应示例**
```json
{
  "code": 0,
  "message": "OK",
  "data": {}
}
```

**注意事项**
- 系统默认任务（`check_subscriptions`、`check_birthdays`）不允许删除
- 如需停用默认任务，请使用更新状态接口将其禁用

---

### 7. 重载定时任务

手动重新加载当前用户的所有定时任务配置。

**请求**
```
POST /api/v1/cron-config/reload
```

**请求头**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Authorization | string | 是 | JWT Token |
| Content-Type | string | 是 | application/json |

**响应示例**
```json
{
  "code": 0,
  "message": "OK",
  "data": {}
}
```

---

## Cron 表达式说明

Cron 表达式格式：`秒 分 时 日 月 周`

### 常用示例

| 表达式 | 说明 |
|--------|------|
| `0 0 7 * * *` | 每天早上7点执行 |
| `0 30 8 * * *` | 每天早上8点30分执行 |
| `0 0 9 * * 1-5` | 周一到周五早上9点执行 |
| `0 0 */2 * * *` | 每2小时执行一次 |
| `0 0 0 * * *` | 每天凌晨执行 |

### 字段说明

| 字段 | 允许值 | 允许的特殊字符 |
|------|--------|----------------|
| 秒 | 0-59 | * / , - |
| 分 | 0-59 | * / , - |
| 时 | 0-23 | * / , - |
| 日 | 1-31 | * / , - ? |
| 月 | 1-12 | * / , - |
| 周 | 0-6（0为周日） | * / , - ? |

---

## 错误码说明

| code | message | 说明 |
|------|---------|------|
| 0 | OK | 成功 |
| 50 | Internal Error | 服务器内部错误 |
| 51 | Invalid Parameter | 参数错误 |
| 52 | Unauthorized | 未授权/Token无效 |

### 业务错误

| message | 说明 |
|---------|------|
| 配置不存在或无权限访问 | 配置ID不存在或不属于当前用户 |
| 任务键已存在 | 创建时任务键重复 |
| 系统默认任务不允许删除 | 尝试删除 check_subscriptions 或 check_birthdays |
| 获取定时任务配置列表失败 | 数据库查询异常 |
| 重载定时任务失败 | 任务重载异常 |

---

## 数据结构

### SysCronConfig 定时任务配置

```typescript
interface SysCronConfig {
  id: number;              // 配置ID
  userId: number;          // 用户ID
  taskName: string;        // 任务名称
  taskKey: string;         // 任务键
  cronExpression: string;  // Cron表达式
  description: string;     // 任务描述
  status: number;          // 状态：1-启用，2-禁用
  createdAt: string;       // 创建时间（ISO 8601格式）
  updatedAt: string;       // 更新时间（ISO 8601格式）
}
```

---

## 注意事项

1. **用户隔离**：所有配置操作仅对当前登录用户生效，用户之间数据隔离
2. **自动重载**：创建、更新、删除、状态变更操作后会自动重载定时任务配置
3. **系统任务保护**：`check_subscriptions` 和 `check_birthdays` 为系统默认任务，不允许删除
4. **JWT认证**：所有接口均需在请求头携带有效的 JWT Token

---

## 更新日志

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2024-01-01 | 初始版本 |
