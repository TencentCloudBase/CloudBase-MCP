# TCB Cloud Storage Web 指南

## 概述

这个 Power 提供了在 Web 应用中使用 CloudBase 云存储的完整指南，通过 `@cloudbase/js-sdk`（Web SDK）实现。涵盖文件存储操作的所有方面，包括上传、下载、临时 URL 生成、文件管理和安全最佳实践。

无论你是在构建文件上传功能、管理用户生成的内容，还是实现文件共享功能，这个 Power 都提供了 CloudBase 云存储操作的核心模式和 API。

## 适用场景

当你需要在 Web 应用中进行**文件存储操作**时使用此指南：

- 从 Web 浏览器上传文件到 CloudBase 云存储
- 为存储的文件生成临时下载 URL
- 从云存储删除文件
- 从云存储下载文件到本地浏览器

## 核心功能

### 1. 文件上传
- **基础上传**：支持单文件和多文件上传
- **进度跟踪**：实时显示上传进度
- **路径管理**：支持文件夹结构组织
- **格式验证**：文件类型和大小验证

### 2. 临时下载链接
- **安全访问**：为私有文件生成临时访问链接
- **过期控制**：自定义链接有效期
- **批量处理**：同时处理多个文件的链接生成

### 3. 文件管理
- **删除操作**：单个或批量删除文件
- **下载功能**：直接下载文件到浏览器
- **错误处理**：完善的错误处理机制

## 快速开始

### 1. SDK 初始化

```javascript
import cloudbase from "@cloudbase/js-sdk";

const app = cloudbase.init({
  env: "your-env-id", // 替换为你的 CloudBase 环境 ID
});
```

**初始化规则：**
- 始终使用上述模式进行同步初始化
- 不要使用动态导入延迟加载 SDK
- 在整个应用中保持单一共享的 `app` 实例

### 2. 基础文件上传

```javascript
// HTML 文件输入
// <input type="file" id="fileInput" />

const fileInput = document.getElementById('fileInput');
const selectedFile = fileInput.files[0];

try {
  const result = await app.uploadFile({
    cloudPath: "uploads/avatar.jpg", // 云存储中的文件路径
    filePath: selectedFile,          // HTML 文件输入对象
  });

  console.log("文件上传成功:", result.fileID);
  // result.fileID: "cloud://env-id/uploads/avatar.jpg"
} catch (error) {
  console.error("上传失败:", error);
}
```

### 3. 带进度的文件上传

```javascript
const result = await app.uploadFile({
  cloudPath: "uploads/document.pdf",
  filePath: selectedFile,
  method: "put", // "post" 或 "put"（默认："put"）
  onUploadProgress: (progressEvent) => {
    const percent = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    console.log(`上传进度: ${percent}%`);
    
    // 更新 UI 进度条
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${percent}%`;
    progressBar.textContent = `${percent}%`;
  }
});
```

### 4. 生成临时下载链接

```javascript
try {
  const result = await app.getTempFileURL({
    fileList: [
      {
        fileID: "cloud://env-id/uploads/avatar.jpg",
        maxAge: 3600 // URL 有效期 1 小时（秒）
      }
    ]
  });

  // 访问下载 URL
  result.fileList.forEach(file => {
    if (file.code === "SUCCESS") {
      console.log("下载链接:", file.tempFileURL);
      // 可以用这个 URL 下载或显示文件
      
      // 例如：在图片标签中显示
      const img = document.getElementById('preview');
      img.src = file.tempFileURL;
    }
  });
} catch (error) {
  console.error("生成临时链接失败:", error);
}
```

### 5. 删除文件

```javascript
try {
  const result = await app.deleteFile({
    fileList: [
      "cloud://env-id/uploads/old-avatar.jpg",
      "cloud://env-id/uploads/temp-file.jpg"
    ]
  });

  // 检查删除结果
  result.fileList.forEach(file => {
    if (file.code === "SUCCESS") {
      console.log("文件删除成功:", file.fileID);
    } else {
      console.error("删除失败:", file.fileID);
    }
  });
} catch (error) {
  console.error("删除操作失败:", error);
}
```

## 高级功能

### 1. 文件路径规则

**有效字符：**
- 字母数字：`[0-9a-zA-Z]`
- 特殊字符：`/`、`!`、`-`、`_`、`.`、` `、`*`
- 中文字符

**路径结构：**
```javascript
// 根目录文件
"avatar.jpg"

// 文件夹结构
"uploads/avatar.jpg"
"user/123/documents/report.pdf"
"images/2024/01/photo.jpg"
```

### 2. 批量操作

```javascript
// 批量生成临时链接
const result = await app.getTempFileURL({
  fileList: [
    {
      fileID: "cloud://env-id/image1.jpg",
      maxAge: 7200 // 2 小时
    },
    {
      fileID: "cloud://env-id/document.pdf",
      maxAge: 86400 // 24 小时
    },
    {
      fileID: "cloud://env-id/video.mp4",
      maxAge: 3600 // 1 小时
    }
  ]
});

// 处理结果
result.fileList.forEach(file => {
  if (file.code === "SUCCESS") {
    console.log(`${file.fileID} 的临时链接:`, file.tempFileURL);
  } else {
    console.error(`${file.fileID} 生成链接失败`);
  }
});
```

### 3. 文件下载到本地

```javascript
// 直接下载文件到浏览器默认下载位置
try {
  await app.downloadFile({
    fileID: "cloud://env-id/uploads/document.pdf"
  });
  
  console.log("文件下载已开始");
} catch (error) {
  console.error("下载失败:", error);
}
```

### 4. 完整的文件上传组件示例

```javascript
class FileUploader {
  constructor(app) {
    this.app = app;
  }

  async uploadFile(file, folder = 'uploads') {
    // 文件验证
    if (!this.validateFile(file)) {
      throw new Error('文件格式或大小不符合要求');
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const cloudPath = `${folder}/${timestamp}.${extension}`;

    try {
      const result = await this.app.uploadFile({
        cloudPath: cloudPath,
        filePath: file,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          this.updateProgress(percent);
        }
      });

      return {
        success: true,
        fileID: result.fileID,
        cloudPath: cloudPath
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  validateFile(file) {
    // 文件大小限制（10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return false;
    }

    // 文件类型限制
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return false;
    }

    return true;
  }

  updateProgress(percent) {
    console.log(`上传进度: ${percent}%`);
    // 更新 UI 进度条
  }
}

// 使用示例
const uploader = new FileUploader(app);
const result = await uploader.uploadFile(selectedFile, 'user-uploads');
```

## CORS 配置

**⚠️ 重要：** 为防止 CORS 错误，需要在 CloudBase 控制台添加域名：

1. 进入 CloudBase 控制台 → 环境 → 安全来源 → 安全域名
2. 添加你的前端域名（如 `https://your-app.com`、`http://localhost:3000`）
3. 如果出现 CORS 错误，尝试删除后重新添加域名

## 错误处理

### 标准错误处理模式

```javascript
async function handleFileOperation() {
  try {
    const result = await app.uploadFile({
      cloudPath: "uploads/file.jpg",
      filePath: selectedFile
    });

    if (result.code) {
      // 处理业务错误
      console.error("上传失败:", result.message);
      showErrorMessage("文件上传失败，请重试");
    } else {
      // 成功处理
      console.log("文件上传成功:", result.fileID);
      showSuccessMessage("文件上传成功");
    }
  } catch (error) {
    // 处理网络或系统错误
    console.error("存储操作失败:", error);
    showErrorMessage("网络错误，请检查网络连接");
  }
}
```

### 常见错误码

- `INVALID_PARAM` - 参数无效
- `PERMISSION_DENIED` - 权限不足
- `RESOURCE_NOT_FOUND` - 文件未找到
- `SYS_ERR` - 系统错误

## 最佳实践

### 文件组织
1. **文件夹结构**：使用一致的文件夹结构（`uploads/`、`avatars/`、`documents/`）
2. **命名规范**：使用描述性文件名，必要时添加时间戳
3. **路径规划**：合理规划文件路径，便于管理和查找

### 性能优化
1. **文件大小限制**：了解 CloudBase 文件大小限制
2. **并发上传控制**：限制并发上传数量，防止浏览器过载
3. **进度监控**：对大文件上传使用进度回调
4. **临时 URL 管理**：仅在需要时生成 URL，设置合适的过期时间

### 用户体验
1. **进度反馈**：显示上传进度以改善用户体验
2. **错误提示**：提供清晰的错误信息和解决建议
3. **文件预览**：上传前提供文件预览功能
4. **批量操作**：支持多文件选择和批量上传

### 安全考虑
1. **域名白名单**：始终配置安全域名以防止 CORS 问题
2. **访问控制**：使用适当的文件权限（公开 vs 私有）
3. **URL 过期**：为临时 URL 设置合理的过期时间
4. **用户权限**：确保用户只能访问自己的文件

## 常见问题

### Q: 文件操作时出现 CORS 错误
**原因：** 域名未在 CloudBase 控制台白名单中
**解决方案：**
1. 进入 CloudBase 控制台安全域名设置
2. 将前端域名添加到白名单
3. 如果错误持续，删除后重新添加域名

### Q: 文件上传失败，提示权限错误
**原因：** 存储权限不足或认证问题
**解决方案：**
1. 确保用户已正确认证
2. 检查 CloudBase 存储权限配置
3. 验证文件大小未超过限制

### Q: 临时 URL 无法访问
**原因：** URL 已过期或 fileID 无效
**解决方案：**
1. 检查 URL 是否已过期（遵守 maxAge 设置）
2. 验证 fileID 正确且文件存在
3. 如需要，生成新的临时 URL

## 相关资源

- [CloudBase 官方文档](https://docs.cloudbase.net/)
- [CloudBase 云存储文档](https://docs.cloudbase.net/storage/)
- [CloudBase Web SDK 文档](https://docs.cloudbase.net/api-reference/webv2/storage/)

## 总结

这个技能涵盖了 CloudBase 云存储 Web SDK 的所有场景：

- **文件上传** - 带进度跟踪和错误处理的文件上传
- **临时链接** - 生成安全的临时下载链接
- **文件管理** - 高效的删除和下载文件
- **安全配置** - CORS 配置和访问控制
- **最佳实践** - 性能优化和安全指导

**核心原则：** 所有示例都基于官方 CloudBase Web SDK 接口，具有适当的错误处理和安全考虑。