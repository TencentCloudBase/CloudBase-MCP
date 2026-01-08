# TCB Auth Tool 指南

## 概述

这个 Power 提供了使用 MCP 工具配置和管理 CloudBase 认证提供商的完整指南。涵盖启用/禁用各种登录方式，包括短信、邮箱、微信开放平台、Google、匿名、用户名/密码和其他 OAuth 提供商。

无论你是为新应用设置身份认证，还是管理现有的认证提供商，这个 Power 都提供了 CloudBase 认证管理所需的核心配置和 API 调用。

## 适用场景

当你需要**配置和管理 CloudBase 认证提供商**时使用此指南：

- 启用/禁用各种登录方式
- 配置短信、邮箱认证
- 设置第三方 OAuth 登录（微信、Google 等）
- 管理匿名登录和用户名密码登录
- 自定义认证提供商配置

## 核心功能

### 1. 基础登录方式
- **匿名登录**：无需注册的临时用户访问
- **用户名密码登录**：传统的用户名密码认证
- **短信验证码登录**：基于手机号的验证码认证
- **邮箱验证码登录**：基于邮箱的验证码认证

### 2. 第三方登录
- **微信开放平台登录**：微信 OAuth 认证
- **Google 登录**：Google OAuth 认证
- **自定义 OAuth**：其他 OAuth 2.0 提供商

### 3. 高级配置
- **SMTP 自定义配置**：自定义邮件服务器
- **短信限制配置**：每日短信发送限制
- **OAuth 参数配置**：自定义 OAuth 流程参数

## 快速开始

### 前提条件

需要 CloudBase 环境 ID (`env`)

### 1. 查询当前登录策略

```javascript
// 获取当前登录配置
const loginStrategyParams = {
    "params": { "EnvId": "your-env-id" },
    "service": "lowcode",
    "action": "DescribeLoginStrategy"
};

// 返回 LoginStrategy 对象或 false（如果未配置）
```

### 2. 启用匿名登录

```javascript
// 1. 获取当前登录策略
const loginStrategy = await getLoginStrategy(env);

// 2. 设置匿名登录
loginStrategy.AnonymousLogin = true; // 启用
// loginStrategy.AnonymousLogin = false; // 禁用

// 3. 更新配置
const updateParams = {
    "params": { "EnvId": env, ...loginStrategy },
    "service": "lowcode",
    "action": "ModifyLoginStrategy"
};
```

### 3. 启用短信登录

```javascript
// 1. 获取当前登录策略
const loginStrategy = await getLoginStrategy(env);

// 2. 配置短信登录
loginStrategy.PhoneNumberLogin = true; // 启用短信登录

// 3. 可选：配置短信限制
loginStrategy.SmsVerificationConfig = {
    Type: 'default',      // 'default' 或 'apis'
    Method: 'methodName',
    SmsDayLimit: 30       // 每日限制 30 条，-1 表示无限制
};

// 4. 更新配置
const updateParams = {
    "params": { "EnvId": env, ...loginStrategy },
    "service": "lowcode",
    "action": "ModifyLoginStrategy"
};
```

### 4. 启用邮箱登录

```javascript
// 使用腾讯云邮箱服务
const enableEmailParams = {
    "params": {
        "EnvId": env,
        "Id": "email",
        "On": "TRUE",
        "EmailConfig": { "On": "TRUE", "SmtpConfig": {} }
    },
    "service": "tcb",
    "action": "ModifyProvider"
};

// 禁用邮箱登录
const disableEmailParams = {
    "params": { "EnvId": env, "Id": "email", "On": "FALSE" },
    "service": "tcb",
    "action": "ModifyProvider"
};
```

## 高级配置

### 1. 自定义 SMTP 邮箱配置

```javascript
const customSmtpParams = {
    "params": {
        "EnvId": env,
        "Id": "email",
        "On": "TRUE",
        "EmailConfig": {
            "On": "FALSE", // 不使用腾讯云邮箱
            "SmtpConfig": {
                "AccountPassword": "your-email-password",
                "AccountUsername": "your-email@example.com",
                "SecurityMode": "SSL", // 或 "TLS"
                "SenderAddress": "noreply@yourdomain.com",
                "ServerHost": "smtp.qq.com",
                "ServerPort": 465
            }
        }
    },
    "service": "tcb",
    "action": "ModifyProvider"
};
```

### 2. 配置微信登录

```javascript
// 1. 获取微信配置
const getWeChatConfigParams = {
    "params": { "EnvId": env },
    "service": "tcb",
    "action": "GetProviders"
};
// 过滤 Id == "wx_open"，保存为 WeChatProvider

// 2. 从微信开放平台获取凭据
// 访问：https://open.weixin.qq.com/cgi-bin/readtemplate?t=regist/regist_tmpl
// 获取：AppID 和 AppSecret

// 3. 更新微信配置
const updateWeChatParams = {
    "params": {
        "EnvId": env,
        "Id": "wx_open",
        "On": "TRUE", // "FALSE" 表示禁用
        "Config": {
            ...WeChatProvider.Config,
            ClientId: "your-wechat-appid",
            ClientSecret: "your-wechat-appsecret"
        }
    },
    "service": "tcb",
    "action": "ModifyProvider"
};
```

### 3. 配置 Google 登录

```javascript
// 1. 获取重定向 URI
const getRedirectUriParams = {
    "params": { "EnvId": env },
    "service": "lowcode",
    "action": "DescribeStaticDomain"
};
// 保存 result.Data.StaticDomain 为 staticDomain

// 2. 在 Google Cloud Console 配置
// 访问：https://console.cloud.google.com/apis/credentials
// - 创建 OAuth 2.0 客户端 ID
// - 设置重定向 URI：https://{staticDomain}/__auth/
// - 获取客户端 ID 和客户端密钥

// 3. 启用 Google 登录
const enableGoogleParams = {
    "params": {
        "EnvId": env,
        "ProviderType": "OAUTH",
        "Id": "google",
        "On": "TRUE", // "FALSE" 表示禁用
        "Name": { "Message": "Google" },
        "Description": { "Message": "" },
        "Config": {
            "ClientId": "your-google-client-id",
            "ClientSecret": "your-google-client-secret",
            "Scope": "email openid profile",
            "AuthorizationEndpoint": "https://accounts.google.com/o/oauth2/v2/auth",
            "TokenEndpoint": "https://oauth2.googleapis.com/token",
            "UserinfoEndpoint": "https://www.googleapis.com/oauth2/v3/userinfo",
            "TokenEndpointAuthMethod": "CLIENT_SECRET_BASIC",
            "RequestParametersMap": {
                "RegisterUserSyncScope": "syncEveryLogin",
                "IsGoogle": "TRUE"
            }
        },
        "Picture": "https://qcloudimg.tencent-cloud.cn/raw/f9131c00dcbcbccd5899a449d68da3ba.png",
        "TransparentMode": "FALSE",
        "ReuseUserId": "TRUE",
        "AutoSignUpWithProviderUser": "TRUE"
    },
    "service": "tcb",
    "action": "ModifyProvider"
};
```

### 4. 自定义 OAuth 提供商

```javascript
const customOAuthParams = {
    "params": {
        "EnvId": env,
        "ProviderType": "OAUTH",
        "Id": "custom-oauth",
        "On": "TRUE",
        "Name": { "Message": "自定义 OAuth" },
        "Description": { "Message": "自定义 OAuth 提供商" },
        "Config": {
            "ClientId": "your-client-id",
            "ClientSecret": "your-client-secret",
            "Scope": "openid profile email",
            "AuthorizationEndpoint": "https://provider.com/oauth/authorize",
            "TokenEndpoint": "https://provider.com/oauth/token",
            "UserinfoEndpoint": "https://provider.com/oauth/userinfo",
            "TokenEndpointAuthMethod": "CLIENT_SECRET_BASIC"
        }
    },
    "service": "tcb",
    "action": "ModifyProvider"
};
```

## 常用模式

### 1. 启用多种登录方式

```javascript
async function enableMultipleLoginMethods(env) {
    // 获取当前登录策略
    const loginStrategy = await getLoginStrategy(env);
    
    // 启用短信、匿名登录
    loginStrategy.PhoneNumberLogin = true;
    loginStrategy.AnonymousLogin = true;
    loginStrategy.UserNameLogin = true;
    
    // 更新登录策略
    await updateLoginStrategy(env, loginStrategy);
    
    // 启用邮箱登录
    await enableEmailLogin(env);
    
    console.log('多种登录方式已启用');
}
```

### 2. 配置短信限制

```javascript
async function configureSmsLimits(env) {
    const loginStrategy = await getLoginStrategy(env);
    
    loginStrategy.PhoneNumberLogin = true;
    loginStrategy.SmsVerificationConfig = {
        Type: 'default',
        SmsDayLimit: 50  // 每日限制 50 条短信
    };
    
    await updateLoginStrategy(env, loginStrategy);
    console.log('短信限制配置完成');
}
```

### 3. 批量配置第三方登录

```javascript
async function setupThirdPartyLogins(env) {
    // 配置微信登录
    await setupWeChatLogin(env, {
        appId: 'your-wechat-appid',
        appSecret: 'your-wechat-appsecret'
    });
    
    // 配置 Google 登录
    await setupGoogleLogin(env, {
        clientId: 'your-google-client-id',
        clientSecret: 'your-google-client-secret'
    });
    
    console.log('第三方登录配置完成');
}
```

## 最佳实践

### 安全实践
1. **HTTPS 重定向**：OAuth 重定向 URI 始终使用 HTTPS
2. **凭据保护**：妥善保管 AppSecret、ClientSecret 等敏感信息
3. **域名白名单**：在第三方平台配置正确的域名白名单
4. **定期轮换**：定期更换认证凭据

### 配置管理
1. **测试验证**：启用每种认证方式后进行测试
2. **错误处理**：为认证失败提供清晰的错误信息
3. **监控告警**：监控认证成功/失败率
4. **配置备份**：在更改前备份工作配置

### 用户体验
1. **多选择**：提供多种登录方式供用户选择
2. **引导提示**：为新用户提供登录方式说明
3. **错误反馈**：提供友好的错误提示和解决建议
4. **快速登录**：优先推荐便捷的登录方式（如短信验证码）

## 常见问题

### Q: 登录策略更新失败
**原因：** 配置无效或缺少必需字段
**解决方案：**
1. 验证所有必需字段都存在
2. 检查字段值格式（布尔值 vs 字符串）
3. 确保环境 ID 正确

### Q: 微信登录不工作
**原因：** AppID/AppSecret 错误或域名配置问题
**解决方案：**
1. 验证微信开放平台的 AppID 和 AppSecret
2. 检查微信控制台中的域名白名单
3. 确保重定向 URI 配置正确

### Q: 邮箱登录发送邮件失败
**原因：** SMTP 配置问题
**解决方案：**
1. 验证 SMTP 服务器设置
2. 检查认证凭据
3. 独立测试 SMTP 连接

### Q: 短信验证码发送失败
**原因：** 短信配置或限制问题
**解决方案：**
1. 检查短信服务配置
2. 验证手机号格式（需包含国家代码）
3. 检查是否超过每日发送限制

## 控制台管理

**认证控制台 URL：**

- **登录管理**：`https://tcb.cloud.tencent.com/dev?envId=${envId}#/identity/login-manage`
- **提供商设置**：`https://tcb.cloud.tencent.com/dev?envId=${envId}#/identity/provider-settings`
- **令牌管理**：`https://tcb.cloud.tencent.com/dev?envId=${envId}#/identity/token-management`

## 相关资源

- [CloudBase 官方文档](https://docs.cloudbase.net/)
- [CloudBase 身份认证文档](https://docs.cloudbase.net/authentication/)
- [微信开放平台](https://open.weixin.qq.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

## 总结

这个技能涵盖了 CloudBase 认证提供商配置的所有场景：

- **基础登录方式** - 匿名、用户名/密码、短信、邮箱
- **OAuth 提供商** - 微信、Google 和自定义 OAuth 提供商
- **配置管理** - 启用/禁用和配置认证方式
- **最佳实践** - 安全、测试和监控指导

**核心原则：** 配置更改后始终测试认证方式，并保持安全的凭据管理实践。