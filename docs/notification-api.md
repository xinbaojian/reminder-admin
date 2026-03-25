# 通知管理 API 文档

## 概述

通知管理接口，支持多种推送渠道配置（Bark、企业微信、钉钉），用于接收订阅到期提醒和生日提醒消息。

**基础路径**: `/api/v1`

**认证方式**: JWT Token（所有接口均需要登录认证）

---

## 接口列表

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/notification/list` | 获取通知配置列表 |
| POST | `/notification/bark` | 保存通知配置 |
| DELETE | `/notification/{id}` | 删除通知配置 |
| POST | `/notification/test` | 测试推送 |

---

## 接口详情

### 1. 获取通知配置列表

获取当前用户的所有通知渠道配置。

**请求**
```
GET /api/v1/notification/list
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
        "channel": 1,
        "url": "https://api.day.app/YOUR_KEY/",
        "status": 1,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      },
      {
        "id": 2,
        "userId": 1,
        "channel": 2,
        "url": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx",
        "status": 1,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      },
      {
        "id": 3,
        "userId": 1,
        "channel": 3,
        "url": "",
        "status": 2,
        "createdAt": null,
        "updatedAt": null
      }
    ]
  }
}
```

**响应字段说明**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 配置ID（未配置时为空） |
| userId | int | 用户ID |
| channel | int | 渠道：1-Bark，2-企业微信，3-钉钉 |
| url | string | 推送地址 |
| status | int | 状态：1-启用，2-禁用 |
| createdAt | string | 创建时间（ISO 8601格式） |
| updatedAt | string | 更新时间（ISO 8601格式） |

**注意事项**
- 返回列表始终包含所有3种渠道（1-Bark，2-企业微信，3-钉钉）
- 未配置的渠道返回空数据，仅 `channel` 字段有值
- 列表按 `channel` 升序排列

---

### 2. 保存通知配置

保存或更新指定渠道的通知配置。如果该渠道已有配置则更新，否则新增。

**请求**
```
POST /api/v1/notification/bark
```

**请求头**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Authorization | string | 是 | JWT Token |
| Content-Type | string | 是 | application/json |

**请求体**
```json
{
  "channel": 1,
  "url": "https://api.day.app/YOUR_KEY/",
  "status": 1
}
```

**请求字段说明**
| 字段 | 类型 | 必填 | 校验规则 | 说明 |
|------|------|------|----------|------|
| channel | int | 是 | 必填，值在1,2,3中 | 渠道：1-Bark，2-企业微信，3-钉钉 |
| url | string | 否 | - | 推送地址 |
| status | int | 是 | 必填，值在1,2中 | 状态：1-启用，2-禁用 |

**响应示例**
```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "id": 1
  }
}
```

---

### 3. 删除通知配置

删除指定的通知配置。

**请求**
```
DELETE /api/v1/notification/{id}
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

**错误响应**
| message | 说明 |
|---------|------|
| 您无权限删除 | 尝试删除不属于当前用户的配置 |

---

### 4. 测试推送

用于测试填写的推送地址是否能正常接收消息。无需提前保存配置即可测试。

**请求**
```
POST /api/v1/notification/test
```

**请求头**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Authorization | string | 是 | JWT Token |
| Content-Type | string | 是 | application/json |

**请求体**
```json
{
  "channel": 1,
  "url": "https://api.day.app/YOUR_KEY/"
}
```

**请求字段说明**
| 字段 | 类型 | 必填 | 校验规则 | 说明 |
|------|------|------|----------|------|
| channel | int | 是 | 必填，值在1,2,3中 | 渠道：1-Bark，2-企业微信，3-钉钉 |
| url | string | 是 | 必填 | 推送地址 |

**响应示例（成功）**
```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "success": true,
    "message": "推送成功"
  }
}
```

**响应示例（失败）**
```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "success": false,
    "message": "HTTP状态码错误: 401, 响应: {\"code\":400,\"message\":\"invalid token\"}"
  }
}
```

**响应字段说明**
| 字段 | 类型 | 说明 |
|------|------|------|
| success | bool | 推送是否成功 |
| message | string | 响应消息，失败时包含错误详情 |

**测试消息内容**
```
【测试推送】这是一条测试消息，用于验证推送配置是否正确
```

---

## 推送渠道说明

### 1. Bark（iOS推送）

Bark 是一款 iOS 上的消息推送应用，支持自定义推送内容。

**获取方式**
1. 在 App Store 下载 [Bark](https://apps.apple.com/app/bark-custom-notifications/id1403753865) 应用
2. 打开应用，复制设备 Key

**URL格式**
```
https://api.day.app/YOUR_DEVICE_KEY/
```

**示例**
```
https://api.day.app/XXXXXX/
```

**消息分组**
- 订阅到期提醒：`订阅到期提醒`
- 生日提醒：`生日提醒`
- 测试推送：`测试推送`

---

### 2. 企业微信机器人

在企业微信群中添加自定义机器人，通过 Webhook 发送消息。

**获取方式**
1. 在企业微信 PC 端打开目标群聊
2. 点击群设置 → 群机器人 → 添加机器人
3. 复制 Webhook 地址

**URL格式**
```
https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY
```

**示例**
```
https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**消息格式**
```json
{
  "msgtype": "text",
  "text": {
    "content": "消息内容"
  }
}
```

---

### 3. 钉钉机器人

在钉钉群中添加自定义机器人，通过 Webhook 发送消息。

**获取方式**
1. 在钉钉 PC 端打开目标群聊
2. 点击群设置 → 智能群助手 → 添加机器人 → 自定义
3. 安全设置选择"自定义关键词"，添加关键词：`提醒`
4. 复制 Webhook 地址

**URL格式**
```
https://oapi.dingtalk.com/robot/send?access_token=YOUR_TOKEN
```

**示例**
```
https://oapi.dingtalk.com/robot/send?access_token=xxxxxx
```

**消息格式**
```json
{
  "msgtype": "text",
  "text": {
    "content": "消息内容"
  }
}
```

**注意事项**
- 钉钉机器人需要配置安全设置
- 推荐使用"自定义关键词"，设置关键词为 `提醒`
- 消息内容需包含关键词才能发送成功

---

## 使用流程

### 推荐使用流程

1. **获取推送地址** - 根据上述说明获取 Bark/企业微信/钉钉的 Webhook 地址
2. **测试推送** - 调用 `/notification/test` 接口测试地址是否可用
3. **保存配置** - 测试成功后调用 `/notification/bark` 保存配置
4. **启用状态** - 设置 `status=1` 启用该推送渠道

### 前端对接示例

```javascript
// 1. 获取通知配置列表
const listRes = await fetch('/api/v1/notification/list', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data: { list } } = await listRes.json();

// 2. 测试推送
const testRes = await fetch('/api/v1/notification/test', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    channel: 1,
    url: 'https://api.day.app/YOUR_KEY/'
  })
});
const { data: { success, message } } = await testRes.json();

// 3. 保存配置
const saveRes = await fetch('/api/v1/notification/bark', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    channel: 1,
    url: 'https://api.day.app/YOUR_KEY/',
    status: 1
  })
});
```

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
| 渠道不能为空 | channel 参数缺失或无效 |
| 状态不能为空 | status 参数缺失或无效 |
| 推送地址不能为空 | url 参数缺失 |
| 您无权限删除 | 尝试删除不属于当前用户的配置 |
| 不支持的推送渠道 | channel 值不在 1,2,3 范围内 |

---

## 数据结构

### Notifications 通知配置

```typescript
interface Notifications {
  id: number;        // 配置ID
  userId: number;    // 用户ID
  channel: number;   // 渠道：1-Bark，2-企业微信，3-钉钉
  url: string;       // 推送地址
  status: number;    // 状态：1-启用，2-禁用
  createdAt: string; // 创建时间（ISO 8601格式）
  updatedAt: string; // 更新时间（ISO 8601格式）
}
```

---

## 常见问题

### Q: 为什么测试推送成功但实际没有收到消息？

A: 请检查：
1. 推送地址是否正确
2. Bark 应用是否允许通知
3. 企业微信/钉钉机器人是否被禁用

### Q: 钉钉机器人测试失败怎么办？

A: 钉钉机器人需要配置安全设置：
- 推荐：自定义关键词，添加 `提醒`
- 或：使用 IP 地址白名单
- 或：使用加签方式

### Q: 可以同时配置多个推送渠道吗？

A: 可以，每种渠道只能配置一个地址，但可以同时启用多个渠道，消息会同时推送到所有启用的渠道。

---

## 更新日志

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2024-01-01 | 初始版本 |
| v1.1 | 2024-01-02 | 新增测试推送接口 |
