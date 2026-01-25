# TCB Auth Web 指南

## 概述

这个 Power 提供了使用 CloudBase Web SDK (@cloudbase/js-sdk@2.x) 在 Web 应用中实现 CloudBase 身份认证的完整指南。涵盖所有登录流程、用户管理、会话处理和前端认证最佳实践。

无论你是在构建登录/注册流程、管理用户会话，还是将 CloudBase 身份与后端集成，这个 Power 都提供了前端 Web 认证的完整模式和 API。

## 适用场景

当你需要在 CloudBase 项目中实现**前端 Web 身份认证**，使用**新认证系统 (Auth v2)** 和 `@cloudbase/js-sdk@2.x` 时使用此技能。

适用于以下需求：

- 在浏览器应用中设计和实现登录/注册流程
- 将 CloudBase 身份（`uid`、tokens）与自有后端集成
- 在前端管理会话和用户配置文件

**默认登录方式：** 如未特别指定，假设使用**手机号 + 短信验证码（无密码）**登录。

## 核心功能

### 1. 多种登录方式
- **短信登录**：手机号 + 验证码（推荐默认方式）
- **邮箱登录**：邮箱 + 验证码
- **用户名密码登录**：传统用户名/密码方式
- **匿名登录**：临时用户，稳定的 `uid`
- **微信登录**：微信开放平台 OAuth
- **自定义登录**：与现有用户系统集成

### 2. 用户管理
- 获取当前用户信息
- 更新用户资料
- 密码管理（修改、重置）
- 账号绑定/解绑
- 账号删除

### 3. 会话管理
- 登录状态监听
- Token 自动刷新
- 会话持久化（30天）
- 登出处理

## 快速开始

### 1. 安装和初始化

```bash
npm install --save @cloudbase/js-sdk
```

```javascript
import cloudbase from "@cloudbase/js-sdk";

const app = cloudbase.init({
  env: "your-env-id", // CloudBase 环境 ID
});

const auth = app.auth();
```

### 2. 控制台配置（必需）

**在使用任何登录方式之前，必须在 CloudBase 控制台进行配置：**

1. **打开登录管理页面：**
   - 控制台 URL：`https://tcb.cloud.tencent.com/dev?envId={envId}#/identity/login-manage`
   - 将 `{envId}` 替换为你的实际 CloudBase 环境 ID

2. **启用所需的登录方式：**
   - 匿名登录
   - 短信验证码登录
   - 邮箱验证码登录
   - 用户名密码登录
   - 微信开放平台登录
   - 自定义登录

3. **配置短信/邮箱模板**（如使用短信/邮箱登录）

4. **将 Web 域名添加到安全域名白名单：**
   - 进入：云开发控制台 → 身份认证 → 登录方式 → 安全域名
   - 添加你的前端域名（如 `https://your-app.com`、`http://localhost:3000`）

### 3. 短信登录示例

```javascript
// 收集用户手机号
const phoneNum = "13800000000";

// 发送短信验证码
const verificationInfo = await auth.getVerification({
  phone_number: `+86 ${phoneNum}`,
});

// 收集用户输入的验证码
const verificationCode = "123456";

// 登录
await auth.signInWithSms({
  verificationInfo,
  verificationCode,
  phoneNum,
});

// 获取当前用户
const user = await auth.getCurrentUser();
console.log("登录成功", user.uid);
```

### 4. 用户名密码登录

```javascript
await auth.signIn({
  username: "your_username", // 手机号、邮箱或用户名
  password: "your_password",
});
```

### 5. 获取用户信息

```javascript
const user = await auth.getCurrentUser();

if (user) {
  console.log("用户信息", {
    uid: user.uid,
    name: user.name,
    email: user.email,
    phone: user.phone
  });
}
```

## 高级功能

### 1. 监听登录状态变化

```javascript
app.auth().onLoginStateChanged((params) => {
  const { eventType } = params?.data || {};

  switch (eventType) {
    case "sign_in":
      console.log("用户登录");
      break;
    case "sign_out":
      console.log("用户退出");
      break;
    case "refresh_token_failed":
      console.log("Token 刷新失败，需要重新登录");
      break;
  }
});
```

### 2. 更新用户资料

```javascript
const user = await auth.getCurrentUser();

if (user) {
  await user.update({
    name: "新昵称",
    gender: "FEMALE", // "MALE" | "FEMALE" | "UNKNOWN"
    picture: "https://example.com/avatar.jpg",
  });
}
```

### 3. 修改密码

```javascript
// 1. 获取 sudo_token（需要当前密码验证）
const sudoRes = await auth.sudo({
  password: "current_password",
});

// 2. 设置新密码
await auth.setPassword({
  new_password: "new_password",
  sudo_token: sudoRes.sudo_token,
});
```

### 4. 获取访问令牌（用于后端验证）

```javascript
const { accessToken, accessTokenExpire } = await auth.getAccessToken();

// 将 accessToken 传给后端
await fetch("/api/protected", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

## 错误处理

### 常见错误码

```javascript
try {
  await auth.signIn({ username: "user", password: "wrong" });
} catch (error) {
  console.error(error.code, error.message);

  const errorMessages = {
    INVALID_CREDENTIALS: "用户名或密码错误",
    VERIFICATION_CODE_EXPIRED: "验证码已过期",
    VERIFICATION_CODE_INVALID: "验证码错误",
    RATE_LIMIT_EXCEEDED: "请求过于频繁，请稍后再试",
    CAPTCHA_REQUIRED: "需要图形验证码",
    USER_NOT_FOUND: "用户不存在",
    USER_ALREADY_EXISTS: "用户已存在"
  };

  alert(errorMessages[error.code] || "操作失败，请重试");
}
```

## 最佳实践

### 安全性
1. **服务端验证**：前端只负责用户体验，鉴权应在后端基于 `access_token` 完成
2. **仅使用 HTTPS**：生产环境必须使用 HTTPS（localhost 除外）
3. **域名白名单**：将所有前端域名加入控制台「安全域名」
4. **敏感操作重新认证**：删除账号等操作前先调用 `auth.sudo` 重新验证身份

### 用户体验
1. **检查现有登录状态**：页面初始化时检查当前登录状态，避免重复登录
2. **处理会话过期**：使用 `onLoginStateChanged` 监听 token 失效，提示用户重新登录
3. **显示加载状态**：登录/注册按钮要有 loading 状态和防抖
4. **清晰的错误提示**：将错误码映射为用户可读的中文提示
5. **短信倒计时**：发送验证码按钮增加倒计时，避免重复点击

### 性能优化
1. **同步初始化**：始终使用同步初始化，不要使用动态导入或异步包装器
2. **缓存用户数据**：获取用户实例后调用 `user.refresh()`，避免重复请求
3. **批量操作**：使用一次 `user.update()` 更新多个字段

## 常见问题

### Q: 认证失败，提示域名错误
**原因：** 域名未在 CloudBase 控制台白名单中
**解决方案：**
1. 打开 CloudBase 控制台登录管理页面
2. 进入安全域名设置
3. 将你的域名添加到白名单
4. 包括开发环境（localhost）和生产环境域名

### Q: 短信/邮箱验证不工作
**原因：** 登录方式未启用或模板未配置
**解决方案：**
1. 在控制台启用所需的登录方式
2. 配置短信/邮箱模板
3. 验证手机号格式包含国家代码（+86）

### Q: `onLoginStateChanged` 不触发
**原因：** 多个 SDK 实例或初始化不正确
**解决方案：**
1. 使用单一共享的 SDK 实例
2. 在应用启动时同步初始化
3. 避免动态导入或异步包装器

## 相关资源

- [CloudBase 官方文档](https://docs.cloudbase.net/)
- [CloudBase Web SDK 文档](https://docs.cloudbase.net/api-reference/webv2/authentication/)
- [CloudBase 身份认证指南](https://docs.cloudbase.net/authentication/)

## 总结

这个技能涵盖了 CloudBase Web Auth 的所有场景：

- **登录/用户管理场景** - 提供完整代码的平铺列表
- **验证码处理** - 说明如何处理 `CAPTCHA_REQUIRED` 错误
- **错误处理** - 常见错误码和处理模式
- **最佳实践** - 安全、用户体验、性能的实践示例

**核心原则：** 所有示例都基于 CloudBase 官方 Web SDK 接口，不自行发明 API。