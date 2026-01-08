# TCB Web Development Power

## 安装步骤

在打开的Powers面板中：

1. 点击顶部的 "Add Custom Power" 按钮
2. 选择 "Local Directory" 选项  
3. 输入完整路径：`D:\ai\jwtt_yq\tcb\web-development`
4. 点击 "Add" 安装

## 测试Power功能

安装后，尝试在聊天中提到以下关键词：
- "web development" / "前端开发" / "网页开发"
- "frontend" / "前端"
- "cloudbase" / "云开发"
- "static hosting" / "静态托管"
- "web sdk"
- "authentication" / "用户认证" / "登录"
- "vite" / "构建"
- "deployment" / "部署"
- "routing" / "路由"

Power应该会自动激活并提供相应的开发指导。

## 验证内容

检查Power是否包含：
- ✅ 项目结构规范（src/, dist/, cloudfunctions/）
- ✅ CloudBase Web SDK集成模式
- ✅ 认证最佳实践（禁止云函数实现登录）
- ✅ 静态托管部署流程
- ✅ Hash路由配置
- ✅ 构建系统要求（Vite等）
- ✅ 相对路径配置规则

## 🎯 使用示例

安装完成后，你可以这样使用这个Power：

### 示例对话：

**用户**: "我需要创建一个CloudBase前端项目" / "我要开发一个网页应用"
**Power**: 提供项目结构规范和初始化指导

**用户**: "如何集成CloudBase Web SDK进行用户认证？" / "怎么实现用户登录功能？"
**Power**: 提供SDK集成模式和认证最佳实践

**用户**: "我的项目部署到静态托管后资源加载失败" / "部署后页面打不开"
**Power**: 提供相对路径配置和部署故障排除指导

**用户**: "如何配置路由避免刷新404问题？" / "页面刷新后显示404怎么办？"
**Power**: 提供Hash路由配置方案

### 主要功能

1. **项目脚手架指导** - 标准目录结构和构建配置
2. **SDK集成规范** - CloudBase Web SDK正确使用方式  
3. **认证模式** - 强制使用SDK内置认证，禁止云函数实现
4. **部署优化** - 静态托管最佳实践和故障排除
5. **性能优化** - 代码分割、资源优化建议
6. **错误处理** - 完整的错误处理模式

Power会根据具体场景自动提供相应的开发规范和最佳实践指导。