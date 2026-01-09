# TCB NoSQL Web SDK 指南

## 概述

这个 Power 提供了使用 CloudBase 文档数据库 Web SDK 进行数据操作的完整指南。涵盖 NoSQL 数据库操作的所有方面，包括 CRUD 操作、复杂查询、分页、聚合、地理位置查询和实时数据同步。

无论你是在构建数据驱动的 Web 应用程序、实现实时功能，还是管理复杂的数据关系，这个 Power 都提供了 CloudBase 文档数据库操作的核心模式和最佳实践。

## 适用场景

当你需要在 Web 应用中进行**文档数据库操作**时使用此技能：

- 查询、创建、更新和删除数据
- 实现复杂查询和数据过滤
- 处理分页和大数据集
- 进行聚合查询和统计分析
- 实现地理位置相关功能
- 构建实时数据同步应用

## 核心功能

### 1. 基础数据操作
- **查询操作**：单文档查询、多文档查询、条件查询
- **创建操作**：添加单个文档、批量添加文档
- **更新操作**：部分更新、使用操作符更新
- **删除操作**：条件删除、软删除

### 2. 高级查询功能
- **查询操作符**：gt、gte、lt、lte、eq、neq、in、nin 等
- **复合条件**：多条件组合查询
- **字段选择**：指定返回字段
- **排序和限制**：orderBy、limit、skip

### 3. 分页和聚合
- **分页实现**：基于页面的导航、游标分页
- **聚合查询**：数据分组、统计计算、管道操作
- **时间聚合**：基于时间的数据分析

### 4. 实时数据同步
- **实时监听**：使用 watch() 方法监听数据变化
- **实时更新**：处理聊天和协作应用的实时更新
- **性能优化**：实时应用的性能优化和错误处理

## 快速开始

### 1. 初始化 SDK

```javascript
import cloudbase from "@cloudbase/js-sdk";

const app = cloudbase.init({
  env: "your-env-id", // 替换为你的环境 ID
});

const db = app.database();
const _ = db.command; // 获取查询操作符

// 注意：在实际查询数据库之前，登录是必需的
```

### 2. 基础查询操作

```javascript
// 查询单个文档
const result = await db.collection('todos')
    .doc('docId')
    .get();

// 查询多个文档
const result = await db.collection('todos')
    .where({
        completed: false,
        priority: 'high'
    })
    .get();

console.log(result.data); // 查询结果数组
```

### 3. 使用查询操作符

```javascript
// 使用操作符进行复杂查询
const result = await db.collection('users')
    .where({
        age: _.gt(18),           // 年龄大于 18
        status: _.in(['active', 'pending']) // 状态在指定数组中
    })
    .get();
```

### 4. 分页查询

```javascript
// 实现分页
const result = await db.collection('posts')
    .orderBy('createdAt', 'desc')  // 按创建时间降序
    .skip(20)                      // 跳过前 20 条
    .limit(10)                     // 限制返回 10 条
    .get();
```

### 5. 字段选择

```javascript
// 只返回指定字段
const result = await db.collection('users')
    .field({ 
        name: true,     // 返回 name 字段
        email: true,    // 返回 email 字段
        _id: false      // 不返回 _id 字段
    })
    .get();
```

## 高级功能

### 1. 添加数据

```javascript
// 添加单个文档
const result = await db.collection('todos').add({
    title: '学习 CloudBase',
    completed: false,
    createdAt: new Date(),
    priority: 'high'
});

// 检查错误
if (typeof result.code === 'string') {
    console.error('添加失败:', result.message);
} else {
    console.log('添加成功，文档 ID:', result.id);
}
```

### 2. 更新数据

```javascript
// 更新文档
const result = await db.collection('todos')
    .doc('docId')
    .update({
        completed: true,
        updatedAt: new Date()
    });

// 使用操作符更新
const result = await db.collection('posts')
    .doc('postId')
    .update({
        views: _.inc(1),        // 浏览量加 1
        tags: _.push('新标签')   // 添加新标签
    });
```

### 3. 删除数据

```javascript
// 删除单个文档
const result = await db.collection('todos')
    .doc('docId')
    .remove();

// 条件删除
const result = await db.collection('todos')
    .where({
        completed: true,
        createdAt: _.lt(new Date('2023-01-01'))
    })
    .remove();
```

### 4. 实时数据监听

```javascript
// 监听数据变化
const watcher = db.collection('messages')
    .where({
        roomId: 'room123'
    })
    .watch({
        onChange: (snapshot) => {
            console.log('数据变化:', snapshot.docs);
            // 更新 UI
        },
        onError: (error) => {
            console.error('监听错误:', error);
        }
    });

// 取消监听
// watcher.close();
```

## 错误处理

### 标准错误处理模式

```javascript
try {
    const result = await db.collection('todos').get();
    
    // 检查操作是否成功
    if (typeof result.code === 'string') {
        // 处理错误
        console.error('数据库错误:', result.message);
        // 显示用户友好的错误信息
        showErrorMessage('获取数据失败，请稍后重试');
    } else {
        // 处理成功结果
        console.log('查询成功:', result.data);
    }
} catch (error) {
    console.error('网络或其他错误:', error);
    showErrorMessage('网络连接失败，请检查网络设置');
}
```

## 最佳实践

### 开发实践
1. **类型定义**：为每个集合创建类型定义和模型层
2. **集合命名**：使用唯一的集合名称，建议为同一项目的所有集合添加统一前缀
3. **安全规则**：为集合配置有意义的安全规则
4. **错误处理**：每个数据库操作都应该检查返回值的错误码
5. **用户体验**：提供详细和用户友好的错误信息

### 性能优化
1. **SDK 初始化**：在应用启动时初始化一次 SDK
2. **实例复用**：在整个应用中复用数据库实例
3. **查询优化**：使用查询操作符进行复杂条件查询
4. **分页实现**：为大数据集实现分页
5. **字段选择**：只选择需要的字段以减少数据传输
6. **索引创建**：为频繁查询的字段创建索引

### 安全考虑
1. **身份认证**：数据库操作前确保用户已认证
2. **权限配置**：配置适当的集合级安全规则
3. **数据验证**：在客户端和服务端都进行数据验证
4. **敏感操作**：涉及敏感数据的操作使用云函数
5. **频率限制**：对高频操作实现频率限制

## 常见问题

### Q: 数据库操作失败，提示权限错误
**原因：** 集合安全规则配置不当
**解决方案：**
1. 为集合配置适当的安全规则
2. 使用 `writeSecurityRule` 工具设置权限
3. 等待 2-5 分钟让缓存清除后再测试

### Q: 查询意外返回空结果
**原因：** 需要认证但用户未登录
**解决方案：**
1. 确保数据库操作前用户已认证
2. 使用 `auth.getLoginState()` 检查登录状态
3. 实现适当的认证流程

### Q: 地理位置查询不工作
**原因：** 未创建地理索引
**解决方案：**
1. 在控制台为位置字段创建地理索引
2. 确保位置数据以正确的 GeoPoint 格式存储
3. 使用适当的地理位置查询操作符

## 相关资源

- [CloudBase 官方文档](https://docs.cloudbase.net/)
- [CloudBase 数据库文档](https://docs.cloudbase.net/database/)
- [CloudBase Web SDK 文档](https://docs.cloudbase.net/api-reference/webv2/database/)

## 总结

这个技能涵盖了 CloudBase 文档数据库 Web SDK 的所有场景：

- **基础操作** - 带有适当错误处理的 CRUD 操作
- **高级查询** - 复杂查询、分页和聚合
- **实时功能** - 实时数据同步和更新
- **安全性** - 认证和安全规则配置
- **性能** - 优化技术和最佳实践

**核心原则：** 所有示例都基于官方 CloudBase Web SDK 接口，具有适当的错误处理和安全考虑。