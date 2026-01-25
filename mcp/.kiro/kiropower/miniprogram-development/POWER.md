---
name: "tcb-miniprogram-development"
displayName: "TCB 小程序开发"
description: "WeChat Mini Program development rules. Use this skill when developing WeChat mini programs, integrating CloudBase capabilities, and deploying mini program projects."
keywords: ["miniprogram", "wechat", "cloudbase", "小程序", "微信小程序", "云开发", "小程序开发", "微信开发", "CloudBase集成"]
author: "CloudBase Team"
---

# TCB 小程序开发

## 概述

这个 Power 提供了微信小程序开发的完整指南，特别是与 CloudBase 云开发能力的集成。涵盖小程序项目结构、CloudBase 集成、身份认证特性、AI 模型调用、微信步数获取等核心功能。

无论你是在开发全新的小程序项目，还是为现有小程序集成云开发能力，这个 Power 都提供了必要的开发规范和最佳实践。

## 适用场景

当你需要进行**微信小程序开发**时使用此技能：

- 开发微信小程序页面和组件
- 集成 CloudBase 能力（数据库、云函数、存储）
- 部署和预览小程序项目
- 处理小程序身份认证和用户身份
- 在小程序中调用 AI 模型
- 获取微信步数数据

**不适用于：**
- Web 前端开发（使用 web-development 技能）
- 后端服务开发（使用 cloudrun-development 技能）
- 纯 UI 设计（使用 ui-design 技能，但可与此技能结合）

## 核心特性

### 1. 项目结构规范
- 小程序代码位于 `miniprogram` 目录
- 云函数位于 `cloudfunctions` 目录
- 使用最新基础库版本
- 生成页面时包含页面配置文件（如 index.json）

### 2. CloudBase 集成
- 环境配置和 ID 查询
- 资源管理和图标下载
- 云函数部署和权限配置

### 3. 身份认证特性
- **重要**：小程序与 CloudBase 天然免登录
- **严禁**：生成登录页面或登录流程
- 通过 `cloud.getWXContext().OPENID` 获取用户身份

### 4. AI 模型调用
- 基础库 3.7.1+ 支持直接调用 AI 模型
- 支持 DeepSeek 等 AI 模型
- 流式文本生成

### 5. 微信步数获取
- 使用 CloudID 方法（基础库 2.7.0+）
- 安全的数据解密机制
- 错误处理和回退机制

## 快速开始

### 1. 项目初始化

```javascript
// app.js
App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'your-env-id', // 环境 ID，可通过 envQuery 工具查询
        traceUser: true,
      });
    }
  }
});
```

### 2. 页面结构示例

```javascript
// pages/index/index.js
Page({
  data: {
    userInfo: null,
    todos: []
  },

  onLoad() {
    this.getUserInfo();
    this.loadTodos();
  },

  // 获取用户信息（通过云函数）
  async getUserInfo() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getUserInfo'
      });
      this.setData({
        userInfo: res.result
      });
    } catch (error) {
      console.error('获取用户信息失败', error);
    }
  },

  // 加载待办事项
  async loadTodos() {
    try {
      const db = wx.cloud.database();
      const res = await db.collection('todos').get();
      this.setData({
        todos: res.data
      });
    } catch (error) {
      console.error('加载数据失败', error);
    }
  }
});
```

### 3. 云函数获取用户身份

```javascript
// cloudfunctions/getUserInfo/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  };
};
```

## 高级功能

### 1. AI 模型调用

```javascript
// 创建 AI 模型实例
const model = wx.cloud.extend.AI.createModel("deepseek");

// 设置系统提示词
const systemPrompt = "你是一个专业的助手，请根据用户需求提供准确的回答。";

// 用户输入
const userInput = "请帮我写一首关于春天的诗";

// 调用 AI 模型
async function callAI() {
  try {
    const res = await model.streamText({
      data: {
        model: "deepseek-v3",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userInput },
        ],
      },
    });

    // 接收流式响应
    for await (let str of res.textStream) {
      console.log(str);
      // 更新页面显示
      this.setData({
        aiResponse: this.data.aiResponse + str
      });
    }
  } catch (error) {
    console.error('AI 调用失败', error);
  }
}
```

### 2. 微信步数获取

```javascript
// 前端：获取微信步数
async function getWeRunData() {
  try {
    // 获取 cloudID
    const res = await wx.getWeRunData();
    
    // 调用云函数解密步数数据
    const result = await wx.cloud.callFunction({
      name: 'getStepCount',
      data: {
        weRunData: wx.cloud.CloudID(res.cloudID)
      }
    });
    
    console.log('步数数据:', result.result);
  } catch (error) {
    console.error('获取步数失败', error);
    // 实现回退机制
    this.setData({
      stepCount: '暂无数据'
    });
  }
}
```

```javascript
// 云函数：解密步数数据
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const { weRunData } = event;
  
  try {
    // 检查解密是否成功
    if (weRunData.errCode !== 0) {
      return {
        success: false,
        error: '步数数据解密失败'
      };
    }
    
    // 获取步数数据
    const stepInfo = weRunData.data.stepInfoList[0];
    
    return {
      success: true,
      stepCount: stepInfo.step,
      timestamp: stepInfo.timestamp
    };
  } catch (error) {
    console.error('处理步数数据失败', error);
    return {
      success: false,
      error: error.message
    };
  }
};
```

### 3. 数据库操作

```javascript
// 添加数据
async function addTodo(title) {
  try {
    const db = wx.cloud.database();
    const res = await db.collection('todos').add({
      data: {
        title: title,
        completed: false,
        createTime: new Date(),
        // 注意：不需要手动添加用户 ID，云开发会自动关联
      }
    });
    
    console.log('添加成功', res._id);
    return res._id;
  } catch (error) {
    console.error('添加失败', error);
    wx.showToast({
      title: '添加失败',
      icon: 'error'
    });
  }
}

// 查询数据
async function getTodos() {
  try {
    const db = wx.cloud.database();
    const res = await db.collection('todos')
      .orderBy('createTime', 'desc')
      .get();
    
    return res.data;
  } catch (error) {
    console.error('查询失败', error);
    return [];
  }
}
```

### 4. 云存储操作

```javascript
// 上传文件
async function uploadFile(filePath) {
  try {
    const res = await wx.cloud.uploadFile({
      cloudPath: `images/${Date.now()}.jpg`,
      filePath: filePath,
    });
    
    console.log('上传成功', res.fileID);
    return res.fileID;
  } catch (error) {
    console.error('上传失败', error);
  }
}

// 下载文件
async function downloadFile(fileID) {
  try {
    const res = await wx.cloud.downloadFile({
      fileID: fileID,
    });
    
    return res.tempFilePath;
  } catch (error) {
    console.error('下载失败', error);
  }
}
```

## 开发工具集成

### 微信开发者工具

**项目打开流程：**
- 检测到小程序项目时，建议用户使用微信开发者工具进行预览、调试和发布
- 打开前确认 `project.config.json` 已配置 `appid` 字段
- 使用微信开发者工具内置 CLI 命令打开项目：

```bash
# Windows
"C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat" open --project "项目根目录路径"

# macOS
/Applications/wechatwebdevtools.app/Contents/MacOS/cli open --project "/path/to/project/root"
```

### 项目配置

```json
// project.config.json
{
  "miniprogramRoot": "miniprogram/",
  "cloudfunctionRoot": "cloudfunctions/",
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "preloadBackgroundData": false,
    "minified": true,
    "newFeature": false,
    "coverView": true,
    "nodeModules": false,
    "autoAudits": false,
    "showShadowRootInWxmlPanel": true,
    "scopeDataCheck": false,
    "uglifyFileName": false,
    "checkInvalidKey": true,
    "checkSiteMap": true,
    "uploadWithSourceMap": true,
    "compileHotReLoad": false,
    "lazyloadPlaceholderEnable": false,
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "useApiHostProcess": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    },
    "enableEngineNative": false,
    "useIsolateContext": false,
    "userConfirmedBundleSwitch": false,
    "packNpmManually": false,
    "packNpmRelationList": [],
    "minifyWXSS": true,
    "disableUseStrict": false,
    "minifyWXML": true,
    "showES6CompileOption": false,
    "useCompilerPlugins": false
  },
  "appid": "your-app-id",
  "projectname": "your-project-name",
  "libVersion": "latest",
  "cloudfunctionTemplateRoot": "cloudfunctionTemplate",
  "condition": {
    "search": {
      "list": []
    },
    "conversation": {
      "list": []
    },
    "game": {
      "list": []
    },
    "plugin": {
      "list": []
    },
    "gamePlugin": {
      "list": []
    },
    "miniprogram": {
      "list": []
    }
  }
}
```

## 最佳实践

### 开发规范
1. **项目结构**：遵循微信小程序和 CloudBase 最佳实践
2. **基础库版本**：使用 `latest` 版本获得最新功能
3. **页面配置**：生成页面时必须包含配置文件
4. **资源管理**：下载所需图标和资源，避免构建错误

### 身份认证
1. **免登录特性**：利用小程序 CloudBase 天然免登录特性
2. **用户标识**：通过云函数获取 `wxContext.OPENID`
3. **数据管理**：基于 openid 管理用户数据
4. **禁止行为**：不要生成登录页面或登录流程

### 云函数部署
1. **权限配置**：AI 自动部署后可能缺少特殊权限
2. **依赖安装**：建议在开发者工具中右键选择"云端安装依赖"
3. **手动部署**：对于需要云调用权限的函数，建议通过开发者工具手动部署一次
4. **权限检查**：遇到权限问题时，检查云函数的服务授权和 API 权限配置

### 性能优化
1. **数据缓存**：合理使用本地缓存减少网络请求
2. **分页加载**：大数据集使用分页加载
3. **图片优化**：使用适当的图片格式和尺寸
4. **云函数优化**：减少云函数数量，提高执行效率

## 常见问题

### Q: 小程序无法连接到云开发环境
**原因：** 环境 ID 配置错误或环境未开通
**解决方案：**
1. 使用 `envQuery` 工具查询正确的环境 ID
2. 确认云开发环境已开通并配置正确
3. 检查小程序 AppID 是否与云开发环境匹配

### Q: 云函数调用失败
**原因：** 云函数未部署或权限配置问题
**解决方案：**
1. 确认云函数已正确部署
2. 检查云函数权限配置
3. 在开发者工具中手动部署一次获取完整权限

### Q: AI 模型调用不工作
**原因：** 基础库版本过低或模型配置错误
**解决方案：**
1. 确保基础库版本 3.7.1+
2. 检查模型名称和参数配置
3. 处理流式响应的异步逻辑

## 相关资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [CloudBase 小程序开发文档](https://docs.cloudbase.net/quick-start/miniprogram/)
- [微信开发者工具下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

## 总结

这个技能涵盖了微信小程序开发的核心场景：

- **项目结构** - 标准的小程序项目组织方式
- **CloudBase 集成** - 数据库、云函数、云存储的使用
- **身份认证** - 天然免登录特性的正确使用
- **高级功能** - AI 模型调用、微信步数获取等
- **开发工具** - 微信开发者工具的正确使用

**核心原则：** 充分利用小程序与 CloudBase 的深度集成，避免重复实现已有功能，专注于业务逻辑开发。