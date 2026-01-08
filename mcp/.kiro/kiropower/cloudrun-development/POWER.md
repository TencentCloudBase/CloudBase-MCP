---
name: "tcb-cloudrun-development"
displayName: "TCB CloudRun Development"
description: "CloudBase Run backend development rules (Function mode/Container mode). Use this skill when deploying backend services that require long connections, multi-language support, custom environments, or AI agent development."
keywords: ["cloudbase", "cloudrun", "backend", "container", "function mode", "websocket", "云开发", "云托管", "后端服务", "容器", "长连接", "多语言", "AI代理"]
author: "CloudBase Team"
---

# TCB CloudRun Development

## Overview

This power provides comprehensive guidance for CloudBase Run backend service development, covering both Function mode and Container mode deployment strategies. It's designed for building scalable backend services that require long connections, multi-language support, custom environments, or AI agent capabilities.

Whether you're developing WebSocket services, multi-language applications, or AI agents, this power provides the essential knowledge and workflows for CloudBase Run development.

## When to use this skill

Use this skill for **CloudBase Run backend service development** when you need:

- Long connection capabilities: WebSocket / SSE / server push
- Long-running or persistent processes: tasks that are not suitable for cloud functions, background jobs
- Custom runtime environments/system dependencies: custom images, specific system libraries
- Multi-language/arbitrary frameworks: Java, Go, PHP, .NET, Python, Node.js, etc.
- Stable external services with elastic scaling: pay-as-you-go, can scale down to 0
- Private/internal network access: VPC/PRIVATE access, mini-program `callContainer` internal direct connection
- AI agent development: develop personalized AI applications based on Function mode CloudRun

**Do NOT use for:**
- Simple cloud functions (use cloud function development instead)
- Frontend-only applications
- Database schema design (use data-model-creation skill)

## How to use this skill (for a coding agent)

1. **Choose the right mode**
   - **Function mode**: Fastest to get started, built-in HTTP/WebSocket/SSE, fixed port 3000, local running supported
   - **Container mode**: Any language and runtime, requires Dockerfile, local running not supported by tools

2. **Follow mandatory requirements**
   - Must listen on `PORT` environment variable (real port in container)
   - Stateless service: write data externally (DB/storage/cache)
   - No background persistent threads/processes outside requests
   - Minimize dependencies, slim images; reduce cold start and deployment time
   - Resource constraints: `Mem = 2 × CPU` (e.g., 0.25 vCPU → 0.5 GB)
   - Access control: Only enable public network for Web scenarios; mini-programs prioritize internal direct connection, recommend closing public network

3. **Use tools correctly**
   - **Read operations**: `queryCloudRun` (list, detail, templates)
   - **Write operations**: `manageCloudRun` (init, download, run, deploy, delete, createAgent)
   - Always use absolute paths for `targetPath`
   - Use `force: true` for delete operations

4. **Follow the workflow**
   - Initialize project → Check/generate Dockerfile (for container mode) → Local run (function mode only) → Configure access → Deploy → Verify

## Mode Selection (Quick Comparison)

### Mode Comparison Checklist

| Dimension | Function Mode | Container Mode |
| --- | --- | --- |
| Language/Framework | Node.js (via `@cloudbase/functions-framework`) | Any language/runtime (Java/Go/PHP/.NET/Python/Node.js, etc.) |
| Runtime | Function framework loads functions (Runtime) | Docker image starts process |
| Port | Fixed 3000 | Application listens on `PORT` (injected by platform during deployment) |
| Dockerfile | Not required | Required (and must pass local build) |
| Local Running | Supported (built-in tools) | Not supported (recommend using Docker for debugging) |
| Typical Scenarios | WebSocket/SSE/streaming responses, forms/files, low latency, multiple functions per instance, shared memory | Arbitrary system dependencies/languages, migrating existing containerized applications |

## Development Requirements (Must Meet)

- Must listen on `PORT` environment variable (real port in container)
- Stateless service: write data externally (DB/storage/cache)
- No background persistent threads/processes outside requests
- Minimize dependencies, slim images; reduce cold start and deployment time
- Resource constraints: `Mem = 2 × CPU` (e.g., 0.25 vCPU → 0.5 GB)
- Access control: Only enable public network for Web scenarios; mini-programs prioritize internal direct connection, recommend closing public network

## Tools (Plain Language & Read/Write Separation)

- **Read operations** (`queryCloudRun`):
  - `list`: What services do I have? Can filter by name/type
  - `detail`: Current configuration, version, access address of a service
  - `templates`: Ready-to-use starter templates
- **Write operations** (`manageCloudRun`):
  - `init`: Create local project (optional template)
  - `download`: Pull existing service code to local
  - `run`: Run locally (Function mode only, supports normal function and Agent mode)
  - `deploy`: Deploy local code to CloudRun
  - `delete`: Delete service (requires explicit confirmation)
  - `createAgent`: Create AI agent (based on Function mode CloudRun)
- **Important parameters** (remember these):
  - `targetPath`: Local directory (must be absolute path)
  - `serverConfig`: Deployment parameters (CPU/Mem/instance count/access type/environment variables, etc.)
  - `runOptions`: Local running port and temporary environment variables (Function mode), supports `runMode: 'normal' | 'agent'`
  - `agentConfig`: Agent configuration (agentName, botTag, description, template)
  - Delete must include `force: true`, otherwise it won't execute

## Core Workflow (Understand Steps First, Then Examples)

1) **Choose mode**
   - Need multi-language/existing container/Docker: choose "Container mode"
   - Need long connection/streaming/low latency/multiple functions coexisting: prioritize "Function mode"

2) **Initialize local project**
   - General: Use template `init` (both Function mode and Container mode can start from templates)
   - Container mode must "check or generate Dockerfile":
     - Node.js minimal example:
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
     - Python minimal example:
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

3) **Local running** (Function mode only)
   - Automatically use `npm run dev/start` or entry file via `run`

4) **Configure access**
   - Set `OpenAccessTypes` (WEB/VPC/PRIVATE) as needed; configure security domain and authentication for Web scenarios

5) **Deploy**
   - Specify CPU/Mem/instance count/environment variables, etc. during `deploy`

6) **Verify**
   - Use `detail` to confirm access address and configuration meet expectations

### Example Tool Calls

1) **View templates/services**
```json
{ "name": "queryCloudRun", "arguments": { "action": "templates" } }
```
```json
{ "name": "queryCloudRun", "arguments": { "action": "detail", "detailServerName": "my-svc" } }
```

2) **Initialize project**
```json
{ "name": "manageCloudRun", "arguments": { "action": "init", "serverName": "my-svc", "targetPath": "/abs/ws/my-svc", "template": "helloworld" } }
```

3) **Download code** (optional)
```json
{ "name": "manageCloudRun", "arguments": { "action": "download", "serverName": "my-svc", "targetPath": "/abs/ws/my-svc" } }
```

4) **Local running** (Function mode only)
```json
{ "name": "manageCloudRun", "arguments": { "action": "run", "serverName": "my-svc", "targetPath": "/abs/ws/my-svc", "runOptions": { "port": 3000 } } }
```

5) **Deploy**
```json
{ "name": "manageCloudRun", "arguments": { "action": "deploy", "serverName": "my-svc", "targetPath": "/abs/ws/my-svc", "serverConfig": { "OpenAccessTypes": ["WEB"], "Cpu": 0.5, "Mem": 1, "MinNum": 0, "MaxNum": 5 } } }
```

6) **Create AI agent** (optional)
```json
{ "name": "manageCloudRun", "arguments": { "action": "createAgent", "serverName": "my-agent", "targetPath": "/abs/ws/agents", "agentConfig": { "agentName": "MyAgent", "botTag": "demo", "description": "My agent", "template": "blank" } } }
```

7) **Run agent** (optional)
```json
{ "name": "manageCloudRun", "arguments": { "action": "run", "serverName": "my-agent", "targetPath": "/abs/ws/agents/my-agent", "runOptions": { "port": 3000, "runMode": "agent" } } }
```

## Function Mode CloudRun (Function Mode) Key Points

- **Definition**: CloudRun + function framework (`@cloudbase/functions-framework`) + function code, making container service development as simple as writing cloud functions
- **When to choose**: Need WebSocket/SSE/file upload/streaming responses; need long tasks or connect to DB/message queue; need multiple functions per instance and shared memory, low latency and better logs/debugging
- **Agent mode**: Develop AI agents based on Function mode CloudRun, use `@cloudbase/aiagent-framework`, supports SSE streaming responses and personalized AI applications
- **Tool support**: Local running only supports Function mode (`manageCloudRun` → `run`); deploy using `manageCloudRun` → `deploy`; query using `queryCloudRun`
- **Migration tips**: Different from cloud function call chain/runtime, migration requires minor modifications (including client calling methods)
- **Portability**: Based on function framework, can run locally/host/Docker, non-CloudRun requires self-managed build and deployment

## Service Invocation Methods

### HTTP Direct Access (when WEB public network enabled)
```bash
curl -L "https://<your-service-domain>"
```

### WeChat Mini Program (internal direct connection, recommend closing public network)
```js
// app.js (ensure wx.cloud.init() is called)
const res = await wx.cloud.callContainer({
  config: { env: "<envId>" },
  path: "/",
  method: "GET",
  header: { "X-WX-SERVICE": "<serviceName>" }
});
```

### Web (JS SDK, need to configure security domain and authentication)
```js
import cloudbase from "@cloudbase/js-sdk";

const app = cloudbase.init({ env: "<envId>" });
const auth = app.auth();

// Authentication required
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

const res = await app.callContainer({
  name: "<serviceName>", method: "POST", path: "/api",
  header: { "Content-Type": "application/json" },
  data: { key: "value" }
});
```

// Web JS SDK initialization MUST be synchronous:
// - Always use top-level `import cloudbase from "@cloudbase/js-sdk";`
// - Do NOT use dynamic imports like `import("@cloudbase/js-sdk")` or async wrappers such as `initCloudBase()` with internal `initPromise`

### Node.js (server-side/cloud function internal call)
```js
import tcb from "@cloudbase/node-sdk";
const app = tcb.init({});
const res = await app.callContainer({
  name: "<serviceName>", method: "GET", path: "/health",
  timeout: 5000
});
```

### Recommendations
- Mini Program/Server side prioritize internal network (VPC/PRIVATE) calls, reduce exposure surface
- Web scenarios need to enable WEB, public domain and security domain, and use SDK authentication

## Best Practices

- Prioritize PRIVATE/VPC or mini-program internal `callContainer`, reduce public network exposure
- Web must use CloudBase Web SDK authentication; mini-programs authenticated by platform
- Secrets via environment variables; separate configuration for multiple environments (dev/stg/prod)
- Use `queryCloudRun.detail` to verify configuration and accessibility before and after deployment
- Image layers reusable, small volume; monitor startup latency and memory usage
- Agent development: Use `@cloudbase/aiagent-framework`, supports SSE streaming responses, BotId format is `ibot-{name}-{tag}`

## Quick Troubleshooting

- **Access failure**: Check OpenAccessTypes/domain/port, whether instance scaled down to 0
- **Deployment failure**: Verify Dockerfile/build logs/image volume and CPU/Mem ratio
- **Local running failure**: Only Function mode supported; requires `package.json` `dev`/`start` or entry `index.js|app.js|server.js`
- **Performance jitter**: Reduce dependencies and initialization; appropriately increase MinNum; optimize cold start
- **Agent running failure**: Check `@cloudbase/aiagent-framework` dependency, BotId format, SSE response format

## Troubleshooting

### Common Issues

**Problem:** Service deployment fails
**Cause:** Dockerfile issues or resource configuration problems
**Solution:**
1. Verify Dockerfile builds locally
2. Check CPU/Memory ratio (Mem = 2 × CPU)
3. Review build logs for specific errors
4. Ensure application listens on PORT environment variable

**Problem:** Service cannot be accessed
**Cause:** Access type configuration or domain issues
**Solution:**
1. Check OpenAccessTypes configuration
2. Verify security domain whitelist for Web access
3. Confirm service instances are running (not scaled to 0)
4. Test internal access first, then external

**Problem:** Local running fails
**Cause:** Function mode requirements not met
**Solution:**
1. Ensure Function mode is selected
2. Check package.json has dev/start scripts
3. Verify entry file exists (index.js, app.js, or server.js)
4. Container mode doesn't support local running via tools

## Related Resources

- [CloudBase Run 官方文档](https://docs.cloudbase.net/run/)
- [Function Framework 文档](https://github.com/TencentCloudBase/functions-framework-nodejs)
- [AI Agent Framework 文档](https://github.com/TencentCloudBase/aiagent-framework)

## Summary

This skill covers all CloudBase Run development scenarios:

- **Mode Selection** - Function mode vs Container mode comparison and selection
- **Development Workflow** - Complete development and deployment process
- **Service Invocation** - Multiple ways to call CloudRun services
- **AI Agent Development** - Building personalized AI applications
- **Best Practices** - Security, performance, and operational guidelines

**Key principle:** Choose the right mode based on requirements, follow stateless design principles, and prioritize internal network access for security.