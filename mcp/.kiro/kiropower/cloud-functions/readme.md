# TCB Cloud Functions 指南

## 概述

这个 Power 提供了开发、部署和管理 CloudBase 云函数（Node.js 无服务器函数）的完整指南。涵盖运行时选择、部署策略、日志监控、函数调用模式和 HTTP 访问配置。

无论你是在构建无服务器 API、后台处理函数还是事件驱动应用程序，这个 Power 都提供了 CloudBase 云函数开发的核心知识和最佳实践。

## 适用场景

当你需要进行**云函数操作**时使用此技能：

- 创建和部署 Node.js 云函数
- 了解运行时限制和选择
- 查询函数日志和监控执行
- 从应用程序调用云函数
- 配置云函数的 HTTP 访问

## 核心功能

### 1. 运行时环境管理
- **运行时选择**：支持多个 Node.js 版本（推荐 `Nodejs18.15`）
- **重要限制**：运行时创建后无法修改，需要删除重建
- **版本兼容性**：根据依赖需求选择合适的 Node.js 版本

### 2. 函数部署
- **新建函数**：使用 `createFunction` 创建新函数
- **代码更新**：使用 `updateFunctionCode` 更新代码（运行时不可变）
- **配置管理**：环境变量、超时设置、VPC 配置

### 3. 日志和监控
- **日志查询**：获取函数执行日志和详细信息
- **性能监控**：监控函数调用和性能指标
- **错误调试**：通过 RequestId 定位具体问题

### 4. 函数调用
- **Web 应用调用**：通过 Web SDK 调用
- **小程序调用**：通过微信小程序 API 调用
- **后端调用**：通过 Node SDK 调用
- **HTTP API 调用**：通过 REST API 调用

## 快速开始

### 1. 函数结构

```javascript
// index.js
exports.main = async (event, context) => {
  try {
    // 函数逻辑
    return {
      code: 0,
      message: "成功",
      data: result
    };
  } catch (error) {
    return {
      code: -1,
      message: error.message,
      data: null
    };
  }
};
```

### 2. 创建函数

```javascript
// 使用 createFunction 工具创建函数
const result = await createFunction({
  func: {
    name: "myFunction",
    runtime: "Nodejs18.15", // 明确指定运行时
    timeout: 30,
    envVariables: {
      "API_KEY": "your-api-key",
      "DATABASE_URL": "your-db-url"
    }
  },
  functionRootPath: "/path/to/cloudfunctions", // 函数目录的父路径
  force: true
});
```

### 3. 从 Web 应用调用

```javascript
import cloudbase from "@cloudbase/js-sdk";

const app = cloudbase.init({
  env: 'your-env-id'
});

// 调用云函数
const result = await app.callFunction({
  name: "myFunction",
  data: { 
    param1: "value1",
    param2: "value2"
  }
});

console.log(result.result);
```

### 4. 从小程序调用

```javascript
wx.cloud.callFunction({
  name: "myFunction",
  data: {
    param1: "value1",
    param2: "value2"
  }
}).then(res => {
  console.log(res.result);
});
```

## 高级功能

### 1. HTTP 访问配置

为云函数创建 HTTP 访问端点：

```javascript
// 创建 HTTP 访问
const httpAccess = await createFunctionHTTPAccess({
  functionName: "myFunction",
  path: "/api/users",
  authSwitch: 2, // 无需认证
  domain: "*"    // 使用默认域名
});

// 访问 URL: https://{envId}.{region}.app.tcloudbase.com/api/users
```

### 2. 环境变量管理

**重要：更新环境变量时必须先查询现有配置**

```javascript
// 1. 先获取当前函数配置
const currentFunction = await getFunctionList({
  action: "detail",
  name: "myFunction"
});

// 2. 合并现有环境变量和新变量
const mergedEnvVariables = {
  ...currentFunction.EnvVariables,  // 现有变量
  ...newEnvVariables                // 新增/更新的变量
};

// 3. 使用合并后的变量更新
await updateFunctionConfig({
  funcParam: {
    name: "myFunction",
    envVariables: mergedEnvVariables
  }
});
```

### 3. 定时触发器

```javascript
// 配置定时触发器
const triggers = [{
  type: "timer",
  config: "0 0 2 1 * * *" // 每月1日凌晨2点执行
}];

await manageFunctionTriggers({
  functionName: "myFunction",
  triggers: triggers
});
```

### 4. 日志查询

```javascript
// 获取日志列表
const logs = await getFunctionLogs({
  functionName: "myFunction",
  startTime: "2024-01-01 00:00:00",
  endTime: "2024-01-01 23:59:59",
  limit: 10
});

// 获取详细日志
const logDetail = await getFunctionLogDetail({
  requestId: logs.data[0].RequestId,
  startTime: "2024-01-01 00:00:00",
  endTime: "2024-01-01 23:59:59"
});
```

## 最佳实践

### 开发实践
1. **明确指定运行时**：创建函数时总是明确指定运行时版本
2. **代码组织**：保持函数专注和单一职责
3. **错误处理**：始终实现适当的错误处理
4. **环境变量**：使用环境变量进行配置，不要硬编码敏感信息
5. **日志记录**：添加有意义的日志用于调试

### 部署实践
1. **使用绝对路径**：为 `functionRootPath` 使用绝对路径
2. **不上传 node_modules**：依赖会自动安装
3. **本地测试**：部署前尽可能进行本地测试
4. **版本管理**：使用版本控制管理函数代码

### 性能优化
1. **冷启动优化**：优化冷启动时间
2. **连接池**：对数据库使用连接池
3. **内存配置**：根据需求配置适当的内存大小
4. **超时设置**：设置合理的超时时间

### 安全实践
1. **访问控制**：为 HTTP 访问实现认证/授权
2. **敏感信息**：使用环境变量存储敏感信息
3. **输入验证**：验证函数输入参数
4. **权限最小化**：只授予必要的权限

## 常见问题

### Q: 函数部署失败，提示运行时错误
**原因：** 运行时创建后无法更改
**解决方案：**
1. 删除现有函数
2. 使用正确的运行时创建新函数
3. 创建时始终明确指定运行时

### Q: 环境变量更新后不生效
**原因：** 直接覆盖删除了现有变量
**解决方案：**
1. 先查询当前函数配置
2. 将新变量与现有变量合并
3. 使用合并后的配置更新

### Q: 函数日志显示不详细
**原因：** 使用了错误的日志查询方法
**解决方案：**
1. 使用 `getFunctionLogs` 获取带 RequestId 的日志列表
2. 使用 `getFunctionLogDetail` 获取具体 RequestId 的详细信息
3. 确保时间范围在1天以内

## 控制台管理

**函数控制台 URL：**

- **函数列表**：`https://tcb.cloud.tencent.com/dev?envId=${envId}#/scf`
- **函数详情**：`https://tcb.cloud.tencent.com/dev?envId=${envId}#/scf/detail?id=${functionName}&NameSpace=${envId}`

**控制台功能：**

- 查看函数代码和配置
- 监控函数调用和性能
- 管理环境变量
- 配置触发器
- 查看日志和执行历史

## 相关资源

- [CloudBase 官方文档](https://docs.cloudbase.net/)
- [CloudBase 云函数文档](https://docs.cloudbase.net/cloud-function/)
- [Node.js 运行时文档](https://docs.cloudbase.net/cloud-function/runtime/)

## 总结

这个技能涵盖了 CloudBase 云函数开发的所有核心场景：

- **函数管理** - 创建、部署、更新和配置云函数
- **日志监控** - 查询日志和监控函数执行
- **调用模式** - 从不同环境调用云函数
- **HTTP 访问** - 配置 REST API 端点
- **最佳实践** - 开发、部署、性能和安全的实践指南

**核心原则：** 始终明确指定运行时，合理管理环境变量，实现适当的错误处理和日志记录。