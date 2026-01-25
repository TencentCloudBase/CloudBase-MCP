---
name: "tcb-auth-tool"
displayName: "TCB Auth Tool"
description: "Use CloudBase Auth tool to configure and manage authentication providers for web applications - enable/disable login methods (SMS, Email, WeChat Open Platform, Google, Anonymous, Username/password, OAuth, SAML, CAS, Dingding, etc.) and configure provider settings via MCP tools."
keywords: ["cloudbase", "auth tool", "authentication", "providers", "login methods", "云开发", "认证工具", "身份认证", "登录方式", "认证提供商", "SMS", "邮箱", "微信", "Google"]
author: "CloudBase Team"
---

# TCB Auth Tool

## Overview

This power provides comprehensive guidance for configuring and managing CloudBase authentication providers using MCP tools. It covers enabling/disabling various login methods including SMS, Email, WeChat Open Platform, Google, Anonymous, Username/Password, and other OAuth providers.

Whether you're setting up authentication for a new application or managing existing authentication providers, this power provides the essential configurations and API calls needed for CloudBase authentication management.

## Prerequisites

CloudBase environment ID (`env`)

## Authentication Scenarios

### 1. Get Login Strategy

Query current login configuration:
```js
{
    "params": { "EnvId": `env` },
    "service": "lowcode",
    "action": "DescribeLoginStrategy"
}
```
Returns `LoginStrategy` object or `false` if not configured.

### 2. Anonymous Login

1. Get `LoginStrategy` (see Scenario 1)
2. Set `LoginStrategy.AnonymousLogin = true` (on) or `false` (off)
3. Update:
```js
{
    "params": { "EnvId": `env`, ...LoginStrategy },
    "service": "lowcode",
    "action": "ModifyLoginStrategy"
}
```

### 3. Username/Password Login

1. Get `LoginStrategy` (see Scenario 1)
2. Set `LoginStrategy.UserNameLogin = true` (on) or `false` (off)
3. Update:
```js
{
    "params": { "EnvId": `env`, ...LoginStrategy },
    "service": "lowcode",
    "action": "ModifyLoginStrategy"
}
```

### 4. SMS Login

1. Get `LoginStrategy` (see Scenario 1)
2. Modify:
   - **Turn on**: `LoginStrategy.PhoneNumberLogin = true`
   - **Turn off**: `LoginStrategy.PhoneNumberLogin = false`
   - **Config** (optional):
     ```js
     LoginStrategy.SmsVerificationConfig = {
         Type: 'default',      // 'default' or 'apis'
         Method: 'methodName',
         SmsDayLimit: 30       // -1 = unlimited
     }
     ```
3. Update:
```js
{
    "params": { "EnvId": `env`, ...LoginStrategy },
    "service": "lowcode",
    "action": "ModifyLoginStrategy"
}
```

### 5. Email Login

**Turn on (Tencent Cloud email)**:
```js
{
    "params": {
        "EnvId": `env`,
        "Id": "email",
        "On": "TRUE",
        "EmailConfig": { "On": "TRUE", "SmtpConfig": {} }
    },
    "service": "tcb",
    "action": "ModifyProvider"
}
```

**Turn off**:
```js
{
    "params": { "EnvId": `env`, "Id": "email", "On": "FALSE" },
    "service": "tcb",
    "action": "ModifyProvider"
}
```

**Turn on (custom SMTP)**:
```js
{
    "params": {
        "EnvId": `env`,
        "Id": "email",
        "On": "TRUE",
        "EmailConfig": {
            "On": "FALSE",
            "SmtpConfig": {
                "AccountPassword": "password",
                "AccountUsername": "username",
                "SecurityMode": "SSL",
                "SenderAddress": "sender@example.com",
                "ServerHost": "smtp.qq.com",
                "ServerPort": 465
            }
        }
    },
    "service": "tcb",
    "action": "ModifyProvider"
}
```

### 6. WeChat Login

1. Get WeChat config:
```js
{
    "params": { "EnvId": `env` },
    "service": "tcb",
    "action": "GetProviders"
}
```
Filter by `Id == "wx_open"`, save as `WeChatProvider`.

2. Get credentials from [WeChat Open Platform](https://open.weixin.qq.com/cgi-bin/readtemplate?t=regist/regist_tmpl):
   - `AppID`
   - `AppSecret`

3. Update:
```js
{
    "params": {
        "EnvId": `env`,
        "Id": "wx_open",
        "On": "TRUE",  // "FALSE" to disable
        "Config": {
            ...WeChatProvider.Config,
            ClientId: `AppID`,
            ClientSecret: `AppSecret`
        }
    },
    "service": "tcb",
    "action": "ModifyProvider"
}
```

### 7. Google Login

1. Get redirect URI:
```js
{
    "params": { "EnvId": `env` },
    "service": "lowcode",
    "action": "DescribeStaticDomain"
}
```
Save `result.Data.StaticDomain` as `staticDomain`.

2. Configure at [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Create OAuth 2.0 Client ID
   - Set redirect URI: `https://{staticDomain}/__auth/`
   - Get `Client ID` and `Client Secret`

3. Enable:
```js
{
    "params": {
        "EnvId": `env`,
        "ProviderType": "OAUTH",
        "Id": "google",
        "On": "TRUE",  // "FALSE" to disable
        "Name": { "Message": "Google" },
        "Description": { "Message": "" },
        "Config": {
            "ClientId": `Client ID`,
            "ClientSecret": `Client Secret`,
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
}
```

## Common Patterns

### Enable Multiple Login Methods

```js
// Enable SMS, Email, and Anonymous login
const loginStrategy = await getLoginStrategy(env);
loginStrategy.PhoneNumberLogin = true;
loginStrategy.AnonymousLogin = true;

await updateLoginStrategy(env, loginStrategy);
await enableEmailLogin(env);
```

### Configure SMS with Custom Settings

```js
const loginStrategy = await getLoginStrategy(env);
loginStrategy.PhoneNumberLogin = true;
loginStrategy.SmsVerificationConfig = {
    Type: 'default',
    SmsDayLimit: 50  // Allow 50 SMS per day
};

await updateLoginStrategy(env, loginStrategy);
```

### Setup OAuth Provider (Generic)

```js
{
    "params": {
        "EnvId": env,
        "ProviderType": "OAUTH",
        "Id": "custom-oauth",
        "On": "TRUE",
        "Name": { "Message": "Custom OAuth" },
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
}
```

## Troubleshooting

### Common Issues

**Problem:** Login strategy update fails
**Cause:** Invalid configuration or missing required fields
**Solution:**
1. Verify all required fields are present
2. Check field value formats (boolean vs string)
3. Ensure environment ID is correct

**Problem:** WeChat login not working
**Cause:** Incorrect AppID/AppSecret or domain configuration
**Solution:**
1. Verify AppID and AppSecret from WeChat Open Platform
2. Check domain whitelist in WeChat console
3. Ensure redirect URI is correctly configured

**Problem:** Email login fails to send emails
**Cause:** SMTP configuration issues
**Solution:**
1. Verify SMTP server settings
2. Check authentication credentials
3. Test SMTP connection independently

## Best Practices

1. **Security**: Always use HTTPS for OAuth redirect URIs
2. **Configuration**: Test each authentication method after enabling
3. **User Experience**: Provide clear error messages for authentication failures
4. **Monitoring**: Monitor authentication success/failure rates
5. **Backup**: Keep backup of working configurations before making changes

## Console Management

**Authentication Console URLs:**

- **Login Management**: `https://tcb.cloud.tencent.com/dev?envId=${envId}#/identity/login-manage`
- **Provider Settings**: `https://tcb.cloud.tencent.com/dev?envId=${envId}#/identity/provider-settings`
- **Token Management**: `https://tcb.cloud.tencent.com/dev?envId=${envId}#/identity/token-management`

## Related Resources

- [CloudBase 官方文档](https://docs.cloudbase.net/)
- [CloudBase 身份认证文档](https://docs.cloudbase.net/authentication/)
- [微信开放平台](https://open.weixin.qq.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

## Summary

This skill covers all CloudBase authentication provider configuration scenarios:

- **Basic Login Methods** - Anonymous, Username/Password, SMS, Email
- **OAuth Providers** - WeChat, Google, and custom OAuth providers
- **Configuration Management** - Enable/disable and configure authentication methods
- **Best Practices** - Security, testing, and monitoring guidelines

**Key principle:** Always test authentication methods after configuration changes and maintain secure credential management practices.