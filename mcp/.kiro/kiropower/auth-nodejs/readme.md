# TCB Auth Node.js 指南

## 概述

这个 Power 提供了在 Node.js 环境中实现 CloudBase 身份认证的完整指南。涵盖服务端认证模式、用户身份管理、自定义登录票据生成以及 CloudBase 应用的安全最佳实践。

无论你是在构建 CloudBase 云函数、Node.js 服务，还是需要与 CloudBase Auth 集成的后端系统，这个 Power 都提供了你所需的核心模式和 API。

## 适用场景

当任务涉及 CloudBase 项目中的**服务端身份认证或身份识别**，且代码运行在 **Node.js** 环境时使用此技能，例如：

- 需要知道**谁在调用**的 CloudBase 云函数（Node 运行时）
- 使用 **CloudBase Node SDK** 查找用户信息的 Node 服务
- 为 Web/移动客户端颁发**自定义登录票据**的后端
- 需要检查 CloudBase 终端用户配置文件的管理或运维工具

## 核心功能

### 1. 调用者身份识别
- 在云函数中使用 `auth.getUserInfo()` 获取调用者的 `uid`、`openId` 和 `customUserId`
- 用于授权决策、日志记录和个性化

### 2. 用户查找
- 当知道 CloudBase `uid` 时使用 `auth.getEndUserInfo(uid)`
- 当只有登录标识符（手机、邮箱、用户名或自定义 ID）时使用 `auth.queryUserInfo()`

### 3. 自定义登录票据
- 当你已有自己的用户系统时，Node 后端可调用 `auth.createTicket()` 并将票据返回给可信客户端
- 客户端使用此票据通过 Web SDK 登录到 CloudBase，无需强制用户重新注册

### 4. 客户端 IP 记录
- 在云函数中，`auth.getClientIP()` 返回调用者 IP，可用于审计日志、异常检测或访问控制

## 快速开始

### 1. 初始化 SDK

```typescript
import tcb from "@cloudbase/node-sdk";

const app = tcb.init({ env: "your-env-id" });
const auth = app.auth();
```

### 2. 获取调用者身份

```typescript
exports.main = async (event, context) => {
  const { openId, appId, uid, customUserId } = auth.getUserInfo();
  
  console.log("调用者身份", { openId, appId, uid, customUserId });
  
  // 使用 uid / customUserId 进行授权决策
  // 例如检查角色、权限或数据所有权
};
```

### 3. 查询用户信息

```typescript
// 通过 UID 查询
const { userInfo } = await auth.getEndUserInfo(uid);

// 通过登录标识符查询
const { userInfo } = await auth.queryUserInfo({
  platform: "PHONE",
  platformId: "+86 13800000000",
});
```

### 4. 创建自定义登录票据

```typescript
const ticket = auth.createTicket(customUserId, {
  refresh: 3600 * 1000,       // access_token 刷新间隔（毫秒）
  expire: 24 * 3600 * 1000,   // 票据过期时间（毫秒）
});

return { ticket };
```

## 最佳实践

### 身份管理
- 将 CloudBase `uid` 作为关联终端用户记录的主键
- 仅在启用**自定义登录**并映射自己的用户时使用 `customUserId`
- 不要仅依赖 `openId`/`appId` 进行授权，它们是微信特定的标识符

### 权限控制
- 在 Node 中使用 `uid`、角色和所有权进行授权检查，而不仅仅是登录成功
- 避免直接向客户端暴露原始的 `getEndUserInfo` / `queryUserInfo` 结果

### 错误处理
- 对所有返回 Promise 的 `auth.*` 调用使用 `try/catch` 包装
- 记录 `error.message`（如果存在则记录 `error.code`），但避免记录敏感数据

### 安全性
- 像保护任何私钥一样保护 `tcb_custom_login.json`
- 必要时根据 CloudBase 指导轮换自定义登录密钥
- 在客户端和 Node 后端之间交换票据时使用 HTTPS 和适当的身份验证

## 常见问题

### Q: `getUserInfo()` 返回空值或未定义值
**原因：** 函数未在已认证的上下文中调用
**解决方案：**
1. 确保云函数由已认证的用户调用
2. 验证 CloudBase 环境配置正确
3. 检查用户在客户端是否正确登录

### Q: `getEndUserInfo()` 抛出权限错误
**原因：** 权限不足或 UID 无效
**解决方案：**
1. 验证 UID 存在且有效
2. 检查 CloudBase 控制台权限
3. 确保函数具有适当的访问权限

### Q: 自定义登录票据创建失败
**原因：** 缺少或无效的凭据文件
**解决方案：**
1. 从 CloudBase 控制台下载正确的 `tcb_custom_login.json`
2. 验证文件路径和权限
3. 确保凭据未过期

## 相关资源

- [CloudBase 官方文档](https://docs.cloudbase.net/)
- [CloudBase Node SDK 文档](https://docs.cloudbase.net/api-reference/server/node-sdk/)
- [CloudBase 身份认证指南](https://docs.cloudbase.net/authentication/)

## 总结

当你需要以下功能时使用此 Node Auth 技能：

- 知道**谁**在调用你的 CloudBase Node 代码
- 通过 `uid` 或登录标识符查找 CloudBase 用户
- 使用**自定义登录票据**将现有用户系统桥接到 CloudBase
- 应用一致、安全的服务端认证最佳实践

对于端到端体验，请将此技能与以下内容配对：

- Web 端认证文档（用于使用 `@cloudbase/js-sdk` 的所有浏览器端登录和用户体验）
- CloudBase HTTP 认证文档（用于语言无关的 HTTP 集成，如果你正在使用这些）