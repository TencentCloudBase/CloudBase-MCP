---
name: "tcb-cloudbase-platform"
displayName: "CloudBase Platform Knowledge"
description: "Comprehensive CloudBase platform knowledge and best practices covering storage, hosting, authentication, cloud functions, database permissions, and data models for all CloudBase projects."
keywords: ["cloudbase platform", "cloud platform", "storage", "hosting", "authentication", "cloud functions", "database permissions", "data models", "云开发平台", "云平台", "存储", "托管", "认证", "云函数", "数据库权限", "数据模型"]
author: "CloudBase Team"
---

# CloudBase Platform Knowledge Power

Comprehensive CloudBase platform knowledge and best practices covering storage, hosting, authentication, cloud functions, database permissions, and data models for all CloudBase projects.

## Overview

This power provides foundational knowledge that applies to all CloudBase projects, regardless of whether they are Web, Mini Program, or backend services. It covers essential platform concepts, authentication strategies, database permissions, and console management.

## Key Features

- **Platform Differences**: Understanding Web vs Mini Program authentication approaches
- **Storage & Hosting**: Static hosting vs cloud storage concepts and usage
- **Authentication Best Practices**: Platform-specific authentication strategies
- **Database Permissions**: Critical permission configuration and security rules
- **Data Models**: MySQL and NoSQL data model management
- **Console Management**: Complete console navigation and management pages
- **Cloud Functions**: Deployment and optimization strategies

## Use Cases

- Understanding CloudBase storage and hosting concepts
- Configuring authentication for different platforms (Web vs Mini Program)
- Deploying and managing cloud functions
- Understanding database permissions and access control
- Working with data models (MySQL and NoSQL)
- Accessing CloudBase console management pages
- Platform-specific SDK initialization and usage

## Getting Started

This power contains comprehensive platform knowledge for CloudBase development. Use this when you need foundational understanding of CloudBase services, platform differences, or console management guidance.

## Important Platform Differences

### Web vs Mini Program Authentication

**Critical**: Authentication methods for different platforms are completely different and must be strictly distinguished:

**Web Authentication:**
- Must use SDK built-in authentication features
- Recommended: SMS login with `auth.getVerification()`
- Forbidden: Using cloud functions for login logic
- User management via `auth.getCurrentUser()`

**Mini Program Authentication:**
- Natural login-free feature - no login flow needed
- User identifier via `wxContext.OPENID` in cloud functions
- Forbidden: Generating login pages or login flows

## Database Permissions (Critical)

**⚠️ Always configure permissions BEFORE writing database operation code!**

### Permission Types:
- **READONLY**: Everyone can read, only creator/admin can write
- **PRIVATE**: Only creator/admin can read/write
- **ADMINWRITE**: Everyone can read, only admin can write (⚠️ NOT for Web SDK!)
- **ADMINONLY**: Only admin can read/write
- **CUSTOM**: Fine-grained control with custom rules

### Platform Compatibility:
- Web SDK cannot use `ADMINWRITE` or `ADMINONLY` for write operations
- For user-generated content in Web apps, use **CUSTOM** rules
- For admin-managed data, use **READONLY**
- Cloud functions have full access regardless of permission type

## Storage and Hosting

### Static Hosting vs Cloud Storage:
- **Static Hosting**: Publicly accessible files with public web addresses
- **Cloud Storage**: Files with privacy requirements, temporary access URLs
- Different buckets with different use cases
- Custom domain configuration available for static hosting

## Console Management

All console URLs follow the pattern: `https://tcb.cloud.tencent.com/dev?envId=${envId}#/{path}`

### Key Console Pages:
- **Overview**: `#/overview` - Main dashboard and resource status
- **Document Database**: `#/db/doc` - NoSQL collection management
- **MySQL Database**: `#/db/mysql` - Relational database management
- **Cloud Functions**: `#/scf` - Function deployment and monitoring
- **CloudRun**: `#/cloudrun` - Container service management
- **Static Hosting**: `#/hosting` - Website deployment and configuration
- **Authentication**: `#/identity` - User authentication configuration
- **Cloud Storage**: `#/storage` - File storage management

## Best Practices

1. **Platform Awareness**: Always distinguish between Web and Mini Program requirements
2. **Permission First**: Configure database permissions before writing code
3. **SDK Usage**: Use correct SDKs for each platform and data model type
4. **Security**: Follow platform-specific authentication patterns
5. **Console Access**: Provide appropriate console links for resource management
6. **Environment Management**: Use `envQuery` tool to get environment IDs

---

**Keywords**: cloudbase platform, cloud platform, storage, hosting, authentication, cloud functions, database permissions, data models, 云开发平台, 云平台, 存储, 托管, 认证, 云函数, 数据库权限, 数据模型