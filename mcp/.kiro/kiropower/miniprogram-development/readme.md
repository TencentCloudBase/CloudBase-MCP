# TCB 小程序开发指南

## 概述

这个 Power 提供了微信小程序开发的完整指南，特别是与 CloudBase 云开发能力的集成。涵盖小程序项目结构、CloudBase 集成、身份认证特性、AI 模型调用、微信步数获取等核心功能。

无论你是在开发全新的小程序项目，还是为现有小程序集成云开发能力，这个 Power 都提供了必要的开发规范和最佳实践。

## 适用场景

当你需要进行**微信小程序开发**时使用此指南：

- 开发微信小程序页面和组件
- 集成 CloudBase 能力（数据库、云函数、存储）
- 部署和预览小程序项目
- 处理小程序身份认证和用户身份
- 在小程序中调用 AI 模型
- 获取微信步数数据

## 核心特性

### 1. 天然免登录
- **重要特性**：小程序与 CloudBase 天然免登录，无需实现登录流程
- **用户标识**：通过云函数中的 `cloud.getWXContext().OPENID` 获取用户身份
- **严禁行为**：不要生成登录页面或登录流程代码

### 2. CloudBase 深度集成
- 数据库操作：直接使用 `wx.cloud.database()` 进行数据操作
- 云函数调用：通过 `wx.cloud.callFunction()` 调用后端逻辑
- 云存储：使用 `wx.cloud.uploadFile()` 和 `wx.cloud.downloadFile()` 管理文件

### 3. 现代化功能
- **AI 模型调用**：基础库 3.7.1+ 支持直接调用 AI 模型
- **微信步数**：安全获取用户运动数据
- **实时数据**：支持数据库实时监听

## 快速开始

### 1. 项目初始化

```javascript
// app.js - 应用入口
App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'your-env-id', // 环境 ID
        traceUser: true,
      });
    }
  }
});
```

### 2. 页面开发示例

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
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'error'
      });
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
      wx.showToast({
        title: '加载数据失败',
        icon: 'error'
      });
    }
  },

  // 添加待办事项
  async addTodo(event) {
    const title = event.detail.value.title;
    if (!title.trim()) {
      wx.showToast({
        title: '请输入待办事项',
        icon: 'error'
      });
      return;
    }

    try {
      const db = wx.cloud.database();
      await db.collection('todos').add({
        data: {
          title: title,
          completed: false,
          createTime: new Date()
        }
      });

      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });

      // 重新加载数据
      this.loadTodos();
    } catch (error) {
      console.error('添加失败', error);
      wx.showToast({
        title: '添加失败',
        icon: 'error'
      });
    }
  }
});
```

### 3. 云函数示例

```javascript
// cloudfunctions/getUserInfo/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  // 获取微信上下文
  const wxContext = cloud.getWXContext();
  
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    // 可以在这里添加更多用户信息处理逻辑
  };
};
```

## 高级功能

### 1. AI 模型调用

```javascript
// 在页面中调用 AI 模型
Page({
  data: {
    aiResponse: ''
  },

  async callAI() {
    try {
      // 创建 AI 模型实例
      const model = wx.cloud.extend.AI.createModel("deepseek");

      // 设置系统提示词
      const systemPrompt = "你是一个专业的助手，请根据用户需求提供准确的回答。";
      const userInput = "请帮我写一首关于春天的诗";

      // 调用 AI 模型
      const res = await model.streamText({
        data: {
          model: "deepseek-v3",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userInput },
          ],
        },
      });

      // 处理流式响应
      let fullResponse = '';
      for await (let str of res.textStream) {
        fullResponse += str;
        this.setData({
          aiResponse: fullResponse
        });
      }
    } catch (error) {
      console.error('AI 调用失败', error);
      wx.showToast({
        title: 'AI 调用失败',
        icon: 'error'
      });
    }
  }
});
```

### 2. 微信步数获取

```javascript
// 前端：获取微信步数
Page({
  data: {
    stepCount: 0
  },

  async getWeRunData() {
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
      
      if (result.result.success) {
        this.setData({
          stepCount: result.result.stepCount
        });
      } else {
        throw new Error(result.result.error);
      }
    } catch (error) {
      console.error('获取步数失败', error);
      // 实现回退机制
      this.setData({
        stepCount: '暂无数据'
      });
      
      wx.showToast({
        title: '获取步数失败',
        icon: 'error'
      });
    }
  }
});
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

### 3. 云存储操作

```javascript
// 文件上传和管理
Page({
  // 选择并上传图片
  async chooseAndUploadImage() {
    try {
      // 选择图片
      const chooseResult = await wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });

      // 显示上传进度
      wx.showLoading({
        title: '上传中...'
      });

      // 上传到云存储
      const uploadResult = await wx.cloud.uploadFile({
        cloudPath: `images/${Date.now()}.jpg`,
        filePath: chooseResult.tempFilePaths[0],
      });

      wx.hideLoading();
      wx.showToast({
        title: '上传成功',
        icon: 'success'
      });

      console.log('上传成功', uploadResult.fileID);
      return uploadResult.fileID;
    } catch (error) {
      wx.hideLoading();
      console.error('上传失败', error);
      wx.showToast({
        title: '上传失败',
        icon: 'error'
      });
    }
  },

  // 下载文件
  async downloadFile(fileID) {
    try {
      const res = await wx.cloud.downloadFile({
        fileID: fileID,
      });
      
      return res.tempFilePath;
    } catch (error) {
      console.error('下载失败', error);
      wx.showToast({
        title: '下载失败',
        icon: 'error'
      });
    }
  }
});
```

## 项目配置

### project.config.json 配置

```json
{
  "miniprogramRoot": "miniprogram/",
  "cloudfunctionRoot": "cloudfunctions/",
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
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
  "cloudfunctionTemplateRoot": "cloudfunctionTemplate"
}
```

## 开发工具使用

### 微信开发者工具

**打开项目：**

```bash
# Windows
"C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat" open --project "项目根目录路径"

# macOS
/Applications/wechatwebdevtools.app/Contents/MacOS/cli open --project "/path/to/project/root"
```

**主要功能：**
- 代码编辑和调试
- 小程序预览和真机调试
- 云函数部署和管理
- 数据库管理
- 云存储管理

## 最佳实践

### 开发规范
1. **项目结构**：遵循标准的小程序项目结构
2. **基础库版本**：使用 `latest` 获得最新功能
3. **页面配置**：每个页面都要有对应的 .json 配置文件
4. **错误处理**：所有异步操作都要有适当的错误处理

### 性能优化
1. **数据缓存**：合理使用 `wx.setStorageSync()` 缓存数据
2. **分页加载**：大数据集使用分页加载
3. **图片优化**：使用合适的图片尺寸和格式
4. **云函数优化**：减少云函数调用次数，合并相关操作

### 用户体验
1. **加载状态**：显示适当的加载提示
2. **错误反馈**：提供清晰的错误信息
3. **操作反馈**：及时反馈用户操作结果
4. **网络异常**：处理网络异常情况

## 常见问题

### Q: 小程序无法连接到云开发环境
**解决方案：**
1. 检查环境 ID 是否正确
2. 确认云开发环境已开通
3. 验证小程序 AppID 与云开发环境匹配

### Q: 云函数调用失败
**解决方案：**
1. 确认云函数已正确部署
2. 检查云函数代码是否有语法错误
3. 在开发者工具中查看云函数日志

### Q: 数据库操作权限错误
**解决方案：**
1. 检查数据库集合的安全规则配置
2. 确认用户身份认证状态
3. 使用云函数进行需要特殊权限的操作

## 相关资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [CloudBase 小程序开发文档](https://docs.cloudbase.net/quick-start/miniprogram/)
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

## 总结

微信小程序与 CloudBase 的结合提供了强大的开发能力：

- **天然免登录** - 简化用户身份管理
- **云开发集成** - 数据库、云函数、云存储一体化
- **现代化功能** - AI 模型、微信数据获取等
- **开发工具** - 完整的开发、调试、部署工具链

**核心原则：** 充分利用小程序与 CloudBase 的深度集成，专注于业务逻辑开发，避免重复造轮子。