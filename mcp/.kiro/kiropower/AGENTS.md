---
description: CloudBase AI Development Auto-Detection and Power Activation Guide
globs: *
alwaysApply: true
inclusion: always
---

# CloudBase AI 开发自动检测指南

## 🚀 自动 Power 激活策略

**核心原则：当检测到 CloudBase 相关内容时，自动激活相应的专业 Power 获取详细指导。**

### CloudBase Power 映射表

| 关键词检测 | Power 名称 | 用途 |
|-----------|-----------|------|
| `认证`, `登录`, `auth`, `authentication`, `微信登录`, `短信登录` | `tcb-auth-web`, `tcb-auth-wechat`, `tcb-auth-nodejs`, `tcb-auth-tool` | 身份认证配置和实现 |
| `web开发`, `前端`, `React`, `Vue`, `静态托管` | `tcb-web-development` | Web 平台开发规范 |
| `小程序`, `miniprogram`, `微信小程序` | `tcb-auth-wechat` | 小程序开发和认证 |
| `HTTP API`, `REST API`, `接口开发`, `原生应用` | `tcb-http-api` | HTTP API 开发 |
| `云函数`, `cloud functions`, `serverless` | `tcb-cloud-functions` | 云函数开发部署 |
| `数据库`, `MySQL`, `关系数据库` | `tcb-relational-database-tool` | 数据库管理工具 |
| `NoSQL`, `文档数据库`, `document database` | 根据平台选择相应 Power | NoSQL 数据库操作 |
| `UI设计`, `界面设计`, `前端界面`, `页面设计` | `tcb-ui-design` | UI 设计规范 |
| `数据建模`, `ER图`, `数据模型` | `tcb-data-model-creation` | 高级数据建模 |
| `工作流`, `需求分析`, `技术方案` | `tcb-spec-workflow` | 软件工程流程 |
| `CloudBase`, `云开发`, `腾讯云开发` | `tcb-cloudbase-platform` | 平台基础知识 |

### 自动激活逻辑

**检测触发条件：**
1. 用户消息包含上述关键词
2. 检测到相关项目文件（`cloudbaserc.json`, `project.config.json` 等）
3. 用户明确提到 CloudBase 相关需求

**执行流程：**
1. **检测阶段**：识别用户需求中的 CloudBase 相关关键词
2. **Power 激活**：自动调用 `kiroPowers` 激活相应的专业 Power
3. **获取指导**：从激活的 Power 中获取详细的开发规范和最佳实践
4. **执行开发**：按照 Power 提供的专业指导进行开发

## 🎯 快速开发决策树

### Web 项目开发流程
```
检测到 Web 项目关键词
↓
激活 tcb-web-development Power
↓
如果涉及认证 → 激活 tcb-auth-web + tcb-auth-tool
↓
如果涉及 UI → 激活 tcb-ui-design (强制优先)
↓
如果涉及数据库 → 激活相应数据库 Power
↓
按照 Power 指导执行开发
```

### 小程序项目开发流程
```
检测到小程序关键词
↓
激活 tcb-auth-wechat Power
↓
如果涉及 UI → 激活 tcb-ui-design (强制优先)
↓
如果涉及数据库 → 激活相应数据库 Power
↓
按照 Power 指导执行开发
```

### 原生应用开发流程
```
检测到原生应用关键词
↓
激活 tcb-http-api Power (强制)
↓
激活 tcb-auth-tool Power (认证配置)
↓
如果涉及 UI → 激活 tcb-ui-design (强制优先)
↓
如果需要数据库 → 激活 tcb-relational-database-tool (仅 MySQL)
↓
按照 Power 指导执行开发
```

## 🚨 强制性检查点

### 1. UI 设计强制检查 (最高优先级)
**触发条件：** 任何涉及页面、界面、组件、样式的任务
**强制操作：**
```
1. 立即激活 tcb-ui-design Power
2. 读取 UI 设计规范
3. 输出设计规范 (目的声明、美学方向、色彩方案、字体选择、布局策略)
4. 然后才能编写 UI 代码
```

### 2. 认证配置强制检查
**触发条件：** 用户提到任何登录、认证相关需求
**强制操作：**
```
1. 立即激活 tcb-auth-tool Power
2. 检查当前认证配置状态
3. 启用所需认证方式
4. 验证配置生效
5. 然后才能实现前端认证代码
```

### 3. 模板下载强制检查
**触发条件：** 新项目开发
**强制操作：**
```
1. 必须先调用 downloadTemplate 工具
2. 不得手动创建项目文件
3. 模板下载失败时才允许手动创建
```

## 📋 平台特定 Power 激活规则

### Web 项目必需 Power
- `tcb-web-development` (平台规范)
- `tcb-auth-web` (Web 认证)
- `tcb-ui-design` (UI 设计 - 强制)
- 数据库相关 Power (按需)

### 小程序项目必需 Power  
- `tcb-auth-wechat` (小程序认证和开发)
- `tcb-ui-design` (UI 设计 - 强制)
- 数据库相关 Power (按需)

### 原生应用必需 Power
- `tcb-http-api` (HTTP API - 强制)
- `tcb-auth-tool` (认证配置 - 强制)
- `tcb-relational-database-tool` (仅 MySQL 支持)
- `tcb-ui-design` (UI 设计 - 强制)

### 通用 Power
- `tcb-cloudbase-platform` (平台基础知识)
- `tcb-spec-workflow` (工程化流程)
- `tcb-data-model-creation` (高级数据建模)

## 🔧 Power 激活示例

### 示例 1：Web 项目认证需求
```
用户输入："我需要开发一个 React 应用，支持手机号登录"

自动执行：
1. 检测关键词：React (Web), 手机号登录 (认证)
2. 激活 Power：
   - kiroPowers.activate("tcb-web-development")
   - kiroPowers.activate("tcb-auth-web") 
   - kiroPowers.activate("tcb-auth-tool")
   - kiroPowers.activate("tcb-ui-design")
3. 按照 Power 指导执行开发流程
```

### 示例 2：小程序 UI 设计
```
用户输入："帮我设计一个小程序的首页界面"

自动执行：
1. 检测关键词：小程序, 界面设计
2. 激活 Power：
   - kiroPowers.activate("tcb-ui-design") (优先)
   - kiroPowers.activate("tcb-auth-wechat")
3. 先完成 UI 设计规范输出，再编写代码
```

## ⚠️ 重要提醒

### 必须遵循的原则
1. **Power 优先**：检测到相关需求时，必须先激活对应 Power
2. **UI 设计强制**：任何 UI 相关工作必须先激活 `tcb-ui-design`
3. **认证配置优先**：认证需求必须先配置后实现
4. **模板优先**：新项目必须使用官方模板
5. **平台区分**：严格区分不同平台的开发方式

### 常见错误避免
- ❌ 跳过 Power 激活直接开发
- ❌ 不读取 UI 设计规范就写界面代码  
- ❌ 混用不同平台的认证方式
- ❌ 手动创建项目文件而不用模板
- ❌ 在服务配置前就实现业务代码

## 🎯 使用方法

1. **自动检测**：系统自动检测用户需求中的关键词
2. **Power 激活**：根据检测结果自动激活相应 Power
3. **获取指导**：从 Power 中获取详细的开发规范
4. **执行开发**：严格按照 Power 提供的最佳实践进行开发
5. **质量保证**：确保每个强制检查点都得到执行

通过这个自动检测系统，确保 CloudBase 项目开发的标准化和高质量交付。
