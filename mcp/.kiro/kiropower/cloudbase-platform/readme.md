# CloudBase 平台知识 Power

## 概述

这个 Power 提供了 CloudBase 平台的全面知识和最佳实践，涵盖存储、托管、认证、云函数、数据库权限和数据模型，适用于所有 CloudBase 项目。

## 适用场景

当你需要**CloudBase 平台知识**时使用此 Power：

- 理解 CloudBase 存储和托管概念
- 为不同平台配置认证（Web vs 小程序）
- 部署和管理云函数
- 理解数据库权限和访问控制
- 使用数据模型（MySQL 和 NoSQL）
- 访问 CloudBase 控制台管理页面

**这个 Power 提供基础知识**，适用于所有 CloudBase 项目，无论是 Web、小程序还是后端服务。

## 主要功能

### 🌐 平台差异理解
- Web 和小程序认证方式完全不同
- 必须严格区分平台特性
- 不同平台的 SDK 使用规范

### 🗄️ 存储和托管
- 静态托管 vs 云存储的区别
- 公开访问文件的最佳实践
- 自定义域名配置指导

### 🔐 认证最佳实践
- Web 平台：必须使用 SDK 内置认证
- 小程序平台：天然免登录特性
- 禁止的认证实现方式

### 🛡️ 数据库权限（关键）
- **⚠️ 重要**：在编写数据库操作代码前必须配置权限
- 权限类型和适用场景
- 平台兼容性注意事项

### 📊 数据模型管理
- MySQL 和 NoSQL 数据模型操作
- 不同平台的数据模型 SDK 使用
- 跨集合操作的实现方式

### 🎛️ 控制台管理
- 完整的控制台导航指南
- 资源管理页面链接
- 配置和监控入口

## 平台差异（关键）

### Web vs 小程序认证

**重要**：不同平台的认证方法完全不同，必须严格区分！

#### Web 认证
- **必须使用 SDK 内置认证**：CloudBase Web SDK 提供完整认证功能
- **推荐方法**：使用 `auth.getVerification()` 进行短信登录
- **禁止行为**：不要使用云函数实现登录认证逻辑
- **用户管理**：登录后通过 `auth.getCurrentUser()` 获取用户信息

#### 小程序认证
- **免登录特性**：小程序 CloudBase 天然免登录，无需登录流程
- **用户标识**：在云函数中通过 wx-server-sdk 获取 `wxContext.OPENID`
- **用户管理**：在云函数中基于 openid 管理用户数据
- **禁止行为**：不要生成登录页面或登录流程代码

## 数据库权限（关键）

**⚠️ 重要：在编写数据库操作代码前，始终先配置权限！**

### 权限模型

CloudBase 数据库访问具有权限控制，默认基础权限包括：

- **READONLY**：所有人可读，仅创建者/管理员可写
- **PRIVATE**：仅创建者/管理员可读写
- **ADMINWRITE**：所有人可读，**仅管理员可写**（⚠️ Web SDK 无法写入！）
- **ADMINONLY**：仅管理员可读写
- **CUSTOM**：自定义规则的细粒度控制

### 平台兼容性（关键）

- ⚠️ **Web SDK 无法对 `ADMINWRITE` 或 `ADMINONLY` 进行写操作**
- ✅ 对于 Web 应用中的用户生成内容，使用 **CUSTOM** 规则
- ✅ 对于管理员管理的数据（产品、设置），使用 **READONLY**
- ✅ 云函数无论权限类型如何都具有完全访问权限

### 配置工作流程

```
创建集合 → 配置安全规则 → 编写代码 → 测试
```

- 使用 `writeSecurityRule` MCP 工具配置权限
- 等待 2-5 分钟缓存清除后再测试
- 详细示例请参考 `no-sql-web-sdk/security-rules.md`

### 常见场景

- **电商产品**：`READONLY`（管理员通过云函数管理）
- **购物车**：`CUSTOM` 配合 `auth.uid` 检查（用户管理自己的）
- **订单**：`CUSTOM` 配合所有权验证
- **系统日志**：`PRIVATE` 或 `ADMINONLY`

## 存储和托管

### 静态托管 vs 云存储

1. **静态托管 vs 云存储**：
   - CloudBase 静态托管和云存储是两个不同的存储桶
   - 一般来说，可公开访问的文件可存储在静态托管中，提供公开的网页地址
   - 静态托管支持自定义域名配置（需要控制台操作）
   - 云存储适合有隐私要求的文件，可通过临时文件 URL 获取临时访问地址

2. **静态托管域名**：
   - CloudBase 静态托管域名可通过 `getWebsiteConfig` 工具获取
   - 结合静态托管文件路径构建最终访问地址
   - **重要**：如果访问地址是目录，必须以 `/` 结尾

## 云函数

### Node.js 云函数

- Node.js 云函数需要包含 `package.json`，声明所需依赖
- 可使用 `createFunction` 创建函数
- 使用 `updateFunctionCode` 部署云函数
- 优先云端依赖安装，不要上传 node_modules
- `functionRootPath` 指函数目录的父目录，如 `cloudfunctions` 目录

### 云函数优化

- 如果涉及云函数，在确保安全的前提下，可尽量减少云函数数量
- 例如：实现一个云函数供客户端请求，实现一个云函数用于数据初始化

## 数据模型

### 获取数据模型操作对象

- **小程序**：需要 `@cloudbase/wx-cloud-client-sdk`，初始化 `const client = initHTTPOverCallFunction(wx.cloud)`，使用 `client.models`
- **云函数**：需要 `@cloudbase/node-sdk@3.10+`，初始化 `const app = cloudbase.init({env})`，使用 `app.models`
- **Web**：需要 `@cloudbase/js-sdk`，初始化 `const app = cloudbase.init({env})`，登录后使用 `app.models`

### 数据模型查询

可调用 MCP `manageDataModel` 工具来：
- 查询模型列表
- 获取模型详细信息（包括 Schema 字段）
- 获取特定模型的 SDK 使用文档

### MySQL 数据模型调用规则

- MySQL 数据模型不能使用集合方法调用，必须使用数据模型 SDK
- **错误**：`db.collection('model_name').get()`
- **正确**：`app.models.model_name.list({ filter: { where: {} } })`
- 使用 `manageDataModel` 工具的 `docs` 方法获取具体 SDK 使用方法

## 控制台管理

创建/部署资源后，提供对应的控制台管理页面链接。所有控制台 URL 遵循模式：`https://tcb.cloud.tencent.com/dev?envId=${envId}#/{path}`

### 核心功能入口

1. **概览**：`#/overview` - 主仪表板，显示环境状态、资源使用情况
2. **模板中心**：`#/template` - 访问 React、Vue、小程序等项目模板
3. **文档型数据库**：`#/db/doc` - 管理 NoSQL 文档数据库集合
4. **MySQL 数据库**：`#/db/mysql` - 管理 MySQL 关系数据库
5. **云函数**：`#/scf` - 管理和部署 Node.js 云函数
6. **云托管**：`#/cloudrun` - 管理容器化后端服务
7. **云存储**：`#/storage` - 管理文件存储桶
8. **AI+**：`#/ai` - 访问 AI 功能和服务
9. **静态网站托管**：`#/hosting` - 部署和管理静态网站
10. **身份认证**：`#/identity` - 配置认证方法和用户管理
11. **微搭低代码**：`#/weida` - 访问微搭低代码开发平台
12. **日志监控**：`#/logs` - 查看日志和监控资源使用情况
13. **环境配置**：`#/settings` - 配置环境级别设置

## 使用方法

1. **激活 Power**：使用 Kiro Powers 激活此 Power
2. **平台识别**：根据项目类型（Web/小程序）选择对应策略
3. **权限配置**：在数据库操作前配置适当权限
4. **SDK 选择**：使用正确的 SDK 和初始化方式
5. **控制台管理**：通过提供的链接访问管理页面

## 最佳实践

1. **平台感知**：始终区分 Web 和小程序需求
2. **权限优先**：在编写代码前配置数据库权限
3. **SDK 使用**：为每个平台和数据模型类型使用正确的 SDK
4. **安全性**：遵循平台特定的认证模式
5. **控制台访问**：为资源管理提供适当的控制台链接
6. **环境管理**：使用 `envQuery` 工具获取环境 ID

通过这个 Power，你可以全面理解和使用 CloudBase 平台的各项功能和服务。