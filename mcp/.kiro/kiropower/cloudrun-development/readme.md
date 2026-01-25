# TCB CloudRun 开发指南

## 概述

这个 Power 提供了 CloudBase Run 后端服务开发的完整指南，涵盖函数模式和容器模式的部署策略。专为构建需要长连接、多语言支持、自定义环境或 AI 代理能力的可扩展后端服务而设计。

无论你是在开发 WebSocket 服务、多语言应用程序还是 AI 代理，这个 Power 都提供了 CloudBase Run 开发的核心知识和工作流程。

## 适用场景

当你需要进行 **CloudBase Run 后端服务开发** 时使用此指南：

- **长连接能力**：WebSocket / SSE / 服务器推送
- **长时间运行进程**：不适合云函数的任务、后台作业
- **自定义运行环境**：自定义镜像、特定系统库
- **多语言框架**：Java、Go、PHP、.NET、Python、Node.js 等
- **弹性扩缩服务**：按需付费、可缩容到 0
- **私有网络访问**：VPC/PRIVATE 访问、小程序内部直连
- **AI 代理开发**：基于函数模式开发个性化 AI 应用

## 核心特性

### 1. 双模式支持
- **函数模式**：快速上手，内置 HTTP/WebSocket/SSE，固定端口 3000，支持本地运行
- **容器模式**：任意语言和运行时，需要 Dockerfile，工具不支持本地运行

### 2. 开发要求
- 必须监听 `PORT` 环境变量（容器中的真实端口）
- 无状态服务：数据写入外部（数据库/存储/缓存）
- 请求外无后台持久线程/进程
- 最小化依赖，精简镜像；减少冷启动和部署时间
- 资源约束：`内存 = 2 × CPU`（如 0.25 vCPU → 0.5 GB）

### 3. 访问控制
- Web 场景才启用公网
- 小程序优先内部直连，建议关闭公网

## 快速开始

### 1. 模式选择

| 维度 | 函数模式 | 容器模式 |
| --- | --- | --- |
| 语言/框架 | Node.js（通过 `@cloudbase/functions-framework`） | 任意语言/运行时 |
| 运行时 | 函数框架加载函数 | Docker 镜像启动进程 |
| 端口 | 固定 3000 | 应用监听 `PORT`（部署时平台注入） |
| Dockerfile | 不需要 | 必需（且必须通过本地构建） |
| 本地运行 | 支持（内置工具） | 不支持（建议用 Docker 调试） |

### 2. 初始化项目

```json
// 查看可用模板
{ "name": "queryCloudRun", "arguments": { "action": "templates" } }

// 初始化项目
{ "name": "manageCloudRun", "arguments": { 
  "action": "init", 
  "serverName": "my-service", 
  "targetPath": "/absolute/path/to/my-service", 
  "template": "helloworld" 
}}
```

### 3. 容器模式 Dockerfile 示例

**Node.js 最小示例：**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","server.js"]
```

**Python 最小示例：**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt --no-cache-dir
COPY . .
ENV PORT=3000
EXPOSE 3000
CMD ["python","app.py"]
```

### 4. 本地运行（仅函数模式）

```json
{ "name": "manageCloudRun", "arguments": { 
  "action": "run", 
  "serverName": "my-service", 
  "targetPath": "/absolute/path/to/my-service", 
  "runOptions": { "port": 3000 } 
}}
```

### 5. 部署服务

```json
{ "name": "manageCloudRun", "arguments": { 
  "action": "deploy", 
  "serverName": "my-service", 
  "targetPath": "/absolute/path/to/my-service", 
  "serverConfig": { 
    "OpenAccessTypes": ["WEB"], 
    "Cpu": 0.5, 
    "Mem": 1, 
    "MinNum": 0, 
    "MaxNum": 5 
  } 
}}
```

## 高级功能

### 1. AI 代理开发

```json
// 创建 AI 代理
{ "name": "manageCloudRun", "arguments": { 
  "action": "createAgent", 
  "serverName": "my-agent", 
  "targetPath": "/absolute/path/to/agents", 
  "agentConfig": { 
    "agentName": "MyAgent", 
    "botTag": "demo", 
    "description": "我的 AI 代理", 
    "template": "blank" 
  } 
}}

// 运行代理
{ "name": "manageCloudRun", "arguments": { 
  "action": "run", 
  "serverName": "my-agent", 
  "targetPath": "/absolute/path/to/agents/my-agent", 
  "runOptions": { "port": 3000, "runMode": "agent" } 
}}
```

### 2. 函数模式特点

- **定义**：CloudRun + 函数框架 + 函数代码，让容器服务开发像写云函数一样简单
- **适用场景**：需要 WebSocket/SSE/文件上传/流式响应；需要长任务或连接数据库/消息队列；需要多函数共存和共享内存，低延迟和更好的日志/调试
- **代理模式**：基于函数模式开发 AI 代理，使用 `@cloudbase/aiagent-framework`，支持 SSE 流式响应
- **工具支持**：本地运行仅支持函数模式
- **可移植性**：基于函数框架，可在本地/主机/Docker 运行

## 服务调用方式

### 1. HTTP 直接访问（启用 WEB 公网时）

```bash
curl -L "https://your-service-domain"
```

### 2. 微信小程序（内部直连，建议关闭公网）

```javascript
// app.js（确保已调用 wx.cloud.init()）
const res = await wx.cloud.callContainer({
  config: { env: "your-env-id" },
  path: "/",
  method: "GET",
  header: { "X-WX-SERVICE": "your-service-name" }
});
```

### 3. Web（JS SDK，需配置安全域名和认证）

```javascript
import cloudbase from "@cloudbase/js-sdk";

const app = cloudbase.init({ env: "your-env-id" });
const auth = app.auth();

// 需要认证
const phoneNum = "13800000000";
const verificationInfo = await auth.getVerification({
  phone_number: `+86 ${phoneNum}`,
});
const verificationCode = "123456";
await auth.signInWithSms({
  verificationInfo,
  verificationCode,
  phoneNum,
});

// 调用容器服务
const res = await app.callContainer({
  name: "your-service-name", 
  method: "POST", 
  path: "/api",
  header: { "Content-Type": "application/json" },
  data: { key: "value" }
});
```

### 4. Node.js（服务端/云函数内部调用）

```javascript
import tcb from "@cloudbase/node-sdk";
const app = tcb.init({});
const res = await app.callContainer({
  name: "your-service-name", 
  method: "GET", 
  path: "/health",
  timeout: 5000
});
```

## 工具使用

### 读操作（`queryCloudRun`）
- `list`：我有哪些服务？可按名称/类型过滤
- `detail`：某个服务的当前配置、版本、访问地址
- `templates`：现成的启动模板

### 写操作（`manageCloudRun`）
- `init`：创建本地项目（可选模板）
- `download`：拉取现有服务代码到本地
- `run`：本地运行（仅函数模式，支持普通函数和代理模式）
- `deploy`：部署本地代码到 CloudRun
- `delete`：删除服务（需要明确确认）
- `createAgent`：创建 AI 代理（基于函数模式 CloudRun）

### 重要参数
- `targetPath`：本地目录（必须是绝对路径）
- `serverConfig`：部署参数（CPU/内存/实例数/访问类型/环境变量等）
- `runOptions`：本地运行端口和临时环境变量（函数模式）
- `agentConfig`：代理配置（代理名称、标签、描述、模板）
- 删除必须包含 `force: true`，否则不会执行

## 最佳实践

### 安全实践
1. **优先内网访问**：小程序/服务端优先使用内网（VPC/PRIVATE）调用
2. **Web 认证**：Web 必须使用 CloudBase Web SDK 认证
3. **环境变量**：通过环境变量传递密钥，多环境分离配置
4. **最小暴露**：减少公网暴露面

### 性能优化
1. **镜像优化**：镜像层可复用、体积小
2. **冷启动优化**：减少依赖和初始化时间
3. **实例配置**：适当增加 MinNum 避免冷启动
4. **监控指标**：监控启动延迟和内存使用

### 开发实践
1. **无状态设计**：数据写入外部存储
2. **资源约束**：遵循内存 = 2 × CPU 的约束
3. **配置验证**：部署前后使用 `queryCloudRun.detail` 验证配置
4. **代理开发**：使用 `@cloudbase/aiagent-framework`，BotId 格式为 `ibot-{name}-{tag}`

## 常见问题

### Q: 服务部署失败
**原因：** Dockerfile 问题或资源配置问题
**解决方案：**
1. 验证 Dockerfile 可以本地构建
2. 检查 CPU/内存比例（内存 = 2 × CPU）
3. 查看构建日志了解具体错误
4. 确保应用监听 PORT 环境变量

### Q: 服务无法访问
**原因：** 访问类型配置或域名问题
**解决方案：**
1. 检查 OpenAccessTypes 配置
2. 验证 Web 访问的安全域名白名单
3. 确认服务实例正在运行（未缩容到 0）
4. 先测试内网访问，再测试外网

### Q: 本地运行失败
**原因：** 函数模式要求未满足
**解决方案：**
1. 确保选择了函数模式
2. 检查 package.json 有 dev/start 脚本
3. 验证入口文件存在（index.js、app.js 或 server.js）
4. 容器模式不支持通过工具本地运行

### Q: 代理运行失败
**原因：** AI 代理框架依赖或配置问题
**解决方案：**
1. 检查 `@cloudbase/aiagent-framework` 依赖
2. 验证 BotId 格式正确
3. 确认 SSE 响应格式符合要求
4. 查看代理运行日志

## 故障排除

- **访问失败**：检查 OpenAccessTypes/域名/端口，实例是否缩容到 0
- **部署失败**：验证 Dockerfile/构建日志/镜像体积和 CPU/内存比例
- **本地运行失败**：仅函数模式支持；需要 `package.json` 的 `dev`/`start` 或入口文件
- **性能抖动**：减少依赖和初始化；适当增加 MinNum；优化冷启动

## 相关资源

- [CloudBase Run 官方文档](https://docs.cloudbase.net/run/)
- [Function Framework 文档](https://github.com/TencentCloudBase/functions-framework-nodejs)
- [AI Agent Framework 文档](https://github.com/TencentCloudBase/aiagent-framework)

## 总结

这个技能涵盖了 CloudBase Run 开发的所有场景：

- **模式选择** - 函数模式 vs 容器模式的对比和选择
- **开发工作流** - 完整的开发和部署流程
- **服务调用** - 多种调用 CloudRun 服务的方式
- **AI 代理开发** - 构建个性化 AI 应用程序
- **最佳实践** - 安全、性能和运维指导

**核心原则：** 根据需求选择合适的模式，遵循无状态设计原则，优先使用内网访问保证安全性。