---
name: cloudbase-guidelines
description: Essential CloudBase (TCB, Tencent CloudBase, 云开发, 微信云开发) development guidelines. MUST read when working with CloudBase projects, developing web apps, mini programs, or backend services using CloudBase platform.
---

# CloudBase Development Guidelines

## 💡 Recommended: MCP Installation

**For enhanced CloudBase development experience, we recommend installing CloudBase MCP (Model Context Protocol).**

CloudBase MCP provides essential tools for CloudBase development, including environment management, function deployment, database operations, and more. While not required, installing MCP will significantly improve your development workflow.

### MCP Configuration Instructions

Most Coding Agents support some kind of MCP configuration in Project level. For example:
```json
{
  "mcpServers": {
    "cloudbase": {
      "command": "npx",
      "args": ["@cloudbase/cloudbase-mcp@latest"]
    }
  }
}
```

---

## Quick Reference

### When Developing a Web Project:
1. **Platform**: Read the `web-development` skill for SDK integration, static hosting, and build configuration
2. **Authentication**: Read the `auth-web` and `auth-tool` skills - Use Web SDK built-in authentication
3. **Database**:
   - NoSQL: `no-sql-web-sdk` skill
   - MySQL: `relational-database-web` and `relational-database-tool` skills
4. **UI Design** (Recommended): Read the `ui-design` skill for better UI/UX design guidelines

### When Developing a Mini Program Project:
1. **Platform**: Read the `miniprogram-development` skill for project structure, WeChat Developer Tools, and wx.cloud usage
2. **Authentication**: Read the `auth-wechat` skill - Naturally login-free, get OPENID in cloud functions
3. **Database**:
   - NoSQL: `no-sql-wx-mp-sdk` skill
   - MySQL: `relational-database-tool` skill (via tools)
4. **UI Design** (Recommended): Read the `ui-design` skill for better UI/UX design guidelines

### When Developing a Native App Project (iOS/Android/Flutter/React Native/etc.):
1. **⚠️ Platform Limitation**: Native apps do NOT support CloudBase SDK - Must use HTTP API
2. **Required Skills**:
   - `http-api` - HTTP API usage for all CloudBase operations
   - `relational-database-tool` - MySQL database operations (via tools)
   - `auth-tool` - Authentication configuration
3. **⚠️ Database Limitation**: Only MySQL database is supported. If users need MySQL, prompt them to enable it in console: [CloudBase Console - MySQL Database](https://tcb.cloud.tencent.com/dev?envId=${envId}#/db/mysql/table/default/)

---

## Core Capabilities

### 1. Authentication

**Authentication Methods by Platform:**
- **Web Projects**: Use CloudBase Web SDK built-in authentication, refer to the `auth-web` skill
- **Mini Program Projects**: Naturally login-free, get `wxContext.OPENID` in cloud functions, refer to the `auth-wechat` skill
- **Node.js Backend**: Refer to the `auth-nodejs` skill

**Configuration:**
- When user mentions authentication requirements, read the `auth-tool` skill to configure authentication providers
- Check and enable required authentication methods before implementing frontend code

### 2. Database Operations

**Web Projects:**
- NoSQL Database: Refer to the `no-sql-web-sdk` skill
- MySQL Relational Database: Refer to the `relational-database-web` skill (Web) and `relational-database-tool` skill (Management)

**Mini Program Projects:**
- NoSQL Database: Refer to the `no-sql-wx-mp-sdk` skill
- MySQL Relational Database: Refer to the `relational-database-tool` skill (via tools)

### 3. Deployment

**Static Hosting (Web):**
- Use CloudBase static hosting after build completion
- Refer to the `web-development` skill for deployment process
- Remind users that CDN has a few minutes of cache after deployment

**Backend Deployment:**
- **Cloud Functions**: Refer to the `cloud-functions` skill - Runtime cannot be changed after creation, must select correct runtime initially
- **CloudRun**: Refer to the `cloudrun-development` skill - Ensure backend code supports CORS, prepare Dockerfile for container type

### 4. UI Design (Recommended)

For better UI/UX design, consider reading the `ui-design` skill which provides:
- Design thinking framework
- Frontend aesthetics guidelines
- Best practices for creating distinctive and high-quality interfaces

---

## Platform-Specific Skills

### Web Projects
- `web-development` - SDK integration, static hosting, build configuration
- `auth-web` - Web SDK built-in authentication
- `no-sql-web-sdk` - NoSQL database operations
- `relational-database-web` - MySQL database operations (Web)
- `relational-database-tool` - MySQL database management
- `cloud-storage-web` - Cloud storage operations
- `ai-model-web` - AI model calling for Web apps

### Mini Program Projects
- `miniprogram-development` - Project structure, WeChat Developer Tools, wx.cloud
- `auth-wechat` - Authentication (naturally login-free)
- `no-sql-wx-mp-sdk` - NoSQL database operations
- `relational-database-tool` - MySQL database operations
- `ai-model-wechat` - AI model calling for Mini Program

### Native App Projects
- `http-api` - HTTP API usage (MANDATORY - SDK not supported)
- `relational-database-tool` - MySQL database operations (MANDATORY)
- `auth-tool` - Authentication configuration

### Universal Skills
- `cloudbase-platform` - Universal CloudBase platform knowledge
- `ui-design` - UI design guidelines (recommended)
- `spec-workflow` - Standard software engineering process

---

## Professional Skill Reference

### Platform Development Skills
- **Web**: `web-development` - SDK integration, static hosting, build configuration
- **Mini Program**: `miniprogram-development` - Project structure, WeChat Developer Tools, wx.cloud
- **Cloud Functions**: `cloud-functions` - Cloud function development, deployment, logging, HTTP access
- **CloudRun**: `cloudrun-development` - Backend deployment (functions/containers)
- **Platform (Universal)**: `cloudbase-platform` - Environment, authentication, services

### Authentication Skills
- **Web**: `auth-web` - Use Web SDK built-in authentication
- **Mini Program**: `auth-wechat` - Naturally login-free, get OPENID in cloud functions
- **Node.js**: `auth-nodejs`
- **Auth Tool**: `auth-tool` - Configure and manage authentication providers

### Database Skills
- **NoSQL (Web)**: `no-sql-web-sdk`
- **NoSQL (Mini Program)**: `no-sql-wx-mp-sdk`
- **MySQL (Web)**: `relational-database-web`
- **MySQL (Tool)**: `relational-database-tool`

### Storage Skills
- **Cloud Storage (Web)**: `cloud-storage-web` - Upload, download, temporary URLs, file management

### AI Skills
- **AI Model (Web)**: `ai-model-web` - Text generation and streaming via @cloudbase/js-sdk
- **AI Model (Node.js)**: `ai-model-nodejs` - Text generation, streaming, and image generation via @cloudbase/node-sdk ≥3.16.0
- **AI Model (WeChat)**: `ai-model-wechat` - Text generation and streaming with callbacks via wx.cloud.extend.AI

### UI Design Skill
- **`ui-design`** - Design thinking framework, frontend aesthetics guidelines (recommended for UI work)

### Workflow Skills
- **Spec Workflow**: `spec-workflow` - Standard software engineering process (requirements, design, tasks)

---

## Core Behavior Rules

1. **Project Understanding**: Read current project's README.md, follow project instructions
2. **Development Order**: Prioritize frontend first, then backend
3. **Backend Strategy**: Prefer using SDK to directly call CloudBase database, rather than through cloud functions, unless specifically needed
4. **Deployment Order**: When there are backend dependencies, prioritize deploying backend before previewing frontend
5. **Authentication Rules**: Use built-in authentication functions, distinguish authentication methods by platform
   - **Web Projects**: Use CloudBase Web SDK built-in authentication (refer to `auth-web`)
   - **Mini Program Projects**: Naturally login-free, get OPENID in cloud functions (refer to `auth-wechat`)
   - **Native Apps**: Use HTTP API for authentication (refer to `http-api`)
6. **Native App Development**: CloudBase SDK is NOT available for native apps, MUST use HTTP API. Only MySQL database is supported.

---

## CloudBase Console Entry Points

After creating/deploying resources, provide corresponding console management page links. All console URLs follow the pattern: `https://tcb.cloud.tencent.com/dev?envId=${envId}#/{path}`

### Core Function Entry Points
1. **Overview (概览)**: `#/overview` - Main dashboard
2. **Template Center (模板中心)**: `#/cloud-template/market` - Project templates
3. **Document Database (文档型数据库)**: `#/db/doc` - NoSQL collections: `#/db/doc/collection/${collectionName}`, Models: `#/db/doc/model/${modelName}`
4. **MySQL Database (MySQL 数据库)**: `#/db/mysql` - Tables: `#/db/mysql/table/default/`
5. **Cloud Functions (云函数)**: `#/scf` - Function detail: `#/scf/detail?id=${functionName}&NameSpace=${envId}`
6. **CloudRun (云托管)**: `#/platform-run` - Container services
7. **Cloud Storage (云存储)**: `#/storage` - File storage
8. **AI+**: `#/ai` - AI capabilities
9. **Static Website Hosting (静态网站托管)**: `#/static-hosting`
10. **Identity Authentication (身份认证)**: `#/identity` - Login: `#/identity/login-manage`, Tokens: `#/identity/token-management`
11. **Weida Low-Code (微搭低代码)**: `#/lowcode/apps`
12. **Logs & Monitoring (日志监控)**: `#/devops/log`
13. **Extensions (扩展功能)**: `#/apis`
14. **Environment Settings (环境配置)**: `#/env`
