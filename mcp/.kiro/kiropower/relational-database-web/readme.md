# CloudBase 关系数据库 Web Power

## 概述

这个 Power 提供了在浏览器应用中使用 @cloudbase/js-sdk 访问 CloudBase 关系数据库的完整指南，提供类似 Supabase 的查询模式和最佳实践。

## 适用场景

### 何时使用此 Power

当你需要**从浏览器应用访问 CloudBase 关系数据库**时使用此 Power（React、Vue、原生 JS）。

**适用于以下情况：**
- 在前端初始化 CloudBase 关系数据库
- 将现有 Supabase 客户端替换为 CloudBase 关系数据库
- 在 Web 应用中共享单个数据库客户端

### 何时不使用此 Power

**不适用于以下情况：**
- 后端/Node.js 访问 CloudBase 关系数据库（使用 relation-database-skill）
- MCP/代理数据库管理（使用 relation-database-skill）
- 身份认证流程（使用 Web/Node/Auth 相关 Power）

## 主要功能

### 🌐 浏览器集成
- 无缝的 CloudBase 关系数据库集成
- 针对 Web 应用优化的初始化模式
- 跨组件的数据库客户端共享

### 🔄 Supabase 兼容
- 使用熟悉的 Supabase 风格查询模式
- 相同的方法名称和查询语法
- 平滑的迁移体验

### 🛠️ 客户端管理
- 单一共享数据库客户端模式
- 优化性能的客户端复用
- 避免重复初始化的最佳实践

### 🎯 框架支持
- React 集成示例和最佳实践
- Vue 应用集成指南
- 原生 JavaScript 使用模式

### 📊 查询操作
- 完整的 CRUD 操作支持
- 高级查询和筛选功能
- 排序、分页和聚合操作

## 安装配置

### 安装依赖
```bash
npm install @cloudbase/js-sdk
```

### 标准初始化模式
```javascript
import cloudbase from "@cloudbase/js-sdk";

const app = cloudbase.init({
  env: "your-env-id", // CloudBase 环境 ID
});

const auth = app.auth();
// 单独处理用户认证（Web Auth skill）

const db = app.rdb();
// 像使用 Supabase 客户端一样使用 db
```

## 使用示例

### React 应用集成
```javascript
// lib/db.js（共享数据库客户端）
import cloudbase from "@cloudbase/js-sdk";

const app = cloudbase.init({
  env: "your-env-id",
});

export const db = app.rdb();
```

```javascript
// hooks/usePosts.js
import { useEffect, useState } from "react";
import { db } from "../lib/db";

export function usePosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await db.from("posts").select("*");
      setPosts(data || []);
    }
    fetchPosts();
  }, []);

  return { posts };
}
```

### 基础查询模式
```javascript
// 获取最新文章
const { data, error } = await db
  .from("posts")
  .select("*")
  .order("created_at", { ascending: false });

if (error) {
  console.error("加载文章失败", error.message);
}
```

### 数据操作
```javascript
// 插入数据
await db.from("posts").insert({ title: "Hello" });

// 更新数据
await db.from("posts").update({ title: "Updated" }).eq("id", 1);

// 删除数据
await db.from("posts").delete().eq("id", 1);
```

## 核心原则

**CloudBase 关系数据库 = Supabase API**

- 获得 `db = app.rdb()` 后，使用 **Supabase 文档和模式**进行所有查询
- 此 Power 仅标准化 **Web 初始化和客户端共享**
- 查询形状和选项依赖模型内置的 Supabase 知识

## 最佳实践

### 初始化规则
- 始终使用**同步初始化**模式
- **不要**使用 `import("@cloudbase/js-sdk")` 懒加载 SDK
- **不要**将 SDK 初始化包装在异步助手中
- 创建单一共享数据库客户端并复用

### 客户端管理
- 创建共享的数据库客户端实例
- 避免在组件中重复初始化
- 使用模块化方式管理数据库连接

### 错误处理
- 实现统一的错误处理机制
- 提供用户友好的错误信息
- 记录和监控数据库操作错误

通过这个 Power，你可以在 Web 应用中高效地使用 CloudBase 关系数据库，享受类似 Supabase 的开发体验。