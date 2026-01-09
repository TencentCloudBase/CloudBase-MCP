---
name: "tcb-web-development"
displayName: "TCB Web Development"
description: "Comprehensive web frontend development guidelines for CloudBase projects. Includes project structure conventions, CloudBase Web SDK integration, static hosting deployment, and authentication best practices."
keywords: ["web development", "frontend", "cloudbase", "static hosting", "web sdk", "authentication", "vite", "deployment", "前端开发", "网页开发", "前端", "静态托管", "云开发", "用户认证", "登录", "部署", "构建", "路由"]
author: "TCB Team"
---

# TCB Web Development Guidelines

## Overview

Professional web frontend development guidelines specifically designed for CloudBase projects. This power provides comprehensive rules and best practices for developing modern web applications with CloudBase integration, including project structure, SDK usage, deployment strategies, and authentication patterns.

**Key Features:**
- Modern frontend build system setup (Vite, Webpack)
- CloudBase Web SDK integration patterns
- Static hosting deployment workflows
- Authentication best practices with SDK built-in features
- Project structure conventions
- Hash routing for static hosting compatibility

## When to Use This Power

Use this power for **Web frontend project development** when you need to:

- Develop web frontend pages and interfaces
- Deploy static websites to CloudBase static hosting
- Integrate CloudBase Web SDK for database, cloud functions, and authentication
- Set up modern frontend build systems (Vite, Webpack, etc.)
- Handle routing and build configurations for static hosting

**Do NOT use for:**
- Mini-program development (use miniprogram-development skill)
- Backend service development (use cloudrun-development skill)
- UI design only (use ui-design skill, but may combine with this skill)

## Project Structure Conventions

### Directory Organization

```
project-root/
├── src/                    # Frontend source code
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── main.js
├── dist/                   # Build output directory
├── cloudfunctions/         # Cloud functions directory
├── package.json
└── vite.config.js         # Build configuration
```

**Rules:**
1. **Frontend source code** should be stored in `src` directory
2. **Build output** should be placed in `dist` directory  
3. **Cloud functions** should be in `cloudfunctions` directory

### Build System Requirements

- Projects should use **modern frontend build systems** like Vite
- Always install dependencies via `npm install` before building
- Ensure build process is documented in project

## CloudBase Web SDK Integration

### SDK Installation and Setup

```bash
npm install @cloudbase/js-sdk@latest
```

### Initialization Pattern

**⚠️ CRITICAL: Always use synchronous initialization pattern:**

```js
import cloudbase from "@cloudbase/js-sdk";

const app = cloudbase.init({
  env: "xxxx-yyy", // Query environment ID via envQuery tool
});
const auth = app.auth();

// Keep single shared app/auth instance - reuse instead of re-initializing
```

**Initialization Rules:**
- Always use **synchronous initialization** with the pattern above
- Do **not** lazy-load the SDK with `import("@cloudbase/js-sdk")`
- Do **not** wrap SDK initialization in async helpers such as `initCloudBase()` with internal `initPromise` caches
- Keep a single shared `app`/`auth` instance in your frontend app; reuse it instead of re-initializing

### Web SDK API Usage Rules

- Only use **documented** CloudBase Web SDK methods
- Before calling any method on `app`, `auth`, `db`, or other SDK objects, **confirm it exists in the official CloudBase Web SDK documentation**
- If a method or option is **not** mentioned in the official docs, **do NOT invent or use it**

## Authentication Best Practices

### ⚠️ CRITICAL RULE: Use SDK Built-in Authentication

**It is strictly forbidden to implement login authentication logic using cloud functions!**

CloudBase Web SDK provides complete authentication features including:
- SMS login
- Anonymous login  
- Custom login
- Social login

### Authentication Implementation Pattern

```js
// Check current login state
let loginState = await auth.getLoginState();

if (loginState && loginState.user) {
  // User is logged in
  const user = await auth.getCurrentUser();
  console.log("Current user:", user);
} else {
  // User not logged in - use SDK built-in authentication
  
  // Collect user's phone number into variable `phoneNum` by providing input UI
  
  // Send SMS code
  const verificationInfo = await auth.getVerification({
    phone_number: `+86 ${phoneNum}`,
  });
  
  // Collect verification code into variable `verificationCode` by providing input UI
  
  // Sign in with SMS
  await auth.signInWithSms({
    verificationInfo,
    verificationCode,
    phoneNum,
  });
}
```

### Authentication Rules

1. **Must use SDK built-in authentication**: CloudBase Web SDK provides complete authentication features
2. **Forbidden to implement login using cloud functions**: Do not create cloud functions to handle login logic
3. **User data management**: After login, user information can be obtained via `auth.getCurrentUser()`, then stored to database
4. **Error handling**: All authentication operations should include complete error handling logic

## Routing Configuration

### Hash Routing for Static Hosting

**Default routing strategy: Use hash routing**

Hash routing solves the 404 refresh issue and is more suitable for static website hosting deployment.

```js
// Vue Router example
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // your routes
  ]
})

// React Router example  
import { HashRouter } from 'react-router-dom'

function App() {
  return (
    <HashRouter>
      {/* your routes */}
    </HashRouter>
  )
}
```

## Deployment and Preview

### Public Path Configuration

**⚠️ CRITICAL: Use relative paths for publicPath**

When web projects are deployed to static hosting CDN, since paths cannot be known in advance, `publicPath` and similar configurations should use relative paths instead of absolute paths.

```js
// vite.config.js
export default {
  base: './', // Use relative path
  build: {
    outDir: 'dist'
  }
}

// webpack.config.js
module.exports = {
  output: {
    publicPath: './' // Use relative path
  }
}
```

### Local Preview Process

To preview static web pages locally:

1. Navigate to the build output directory (usually `dist`)
2. Use `npx live-server` to start local server

```bash
cd dist
npx live-server
```

### Static Hosting Deployment

**Deployment Process:**

1. **Build the project first**:
   ```bash
   npm install  # Ensure dependencies are installed
   npm run build
   ```

2. **Start local preview** to verify build
3. **Confirm with user** if deployment to CloudBase static hosting is needed
4. **Deploy to subdirectory** (if user has no special requirements, generally do not deploy directly to root directory)
5. **Return deployed address** in markdown link format

### Deployment Best Practices

- Always test locally before deploying
- Use subdirectory deployment unless specifically requested otherwise
- Verify all resources load correctly with relative paths
- Provide deployment URL in accessible format

## Build Process Guidelines

### Standard Build Process

```bash
# 1. Install dependencies (MUST be executed first)
npm install

# 2. Build project (refer to project documentation)
npm run build

# 3. Verify build output in dist directory
ls dist/

# 4. Local preview (optional)
cd dist && npx live-server
```

### Build Configuration Requirements

- Ensure `package.json` has proper build scripts
- Configure build output to `dist` directory
- Use relative paths for all asset references
- Optimize for static hosting deployment

## Database and Cloud Functions Integration

### Database Operations

```js
const db = app.database();

// Query data
const result = await db.collection('users').get();

// Add data
await db.collection('users').add({
  name: 'John',
  email: 'john@example.com'
});

// Update data
await db.collection('users').doc('user-id').update({
  name: 'Jane'
});
```

### Cloud Functions Integration

```js
const functions = app.functions();

// Call cloud function
const result = await functions.callFunction({
  name: 'myFunction',
  data: {
    param1: 'value1'
  }
});
```

## Error Handling Patterns

### Authentication Error Handling

```js
try {
  await auth.signInWithSms({
    verificationInfo,
    verificationCode,
    phoneNum,
  });
} catch (error) {
  console.error('Login failed:', error);
  // Handle specific error cases
  if (error.code === 'INVALID_VERIFICATION_CODE') {
    // Show error message to user
  }
}
```

### API Error Handling

```js
try {
  const result = await db.collection('users').get();
} catch (error) {
  console.error('Database query failed:', error);
  // Implement retry logic or show user-friendly error
}
```

## Performance Optimization

### Code Splitting

```js
// Dynamic imports for code splitting
const LazyComponent = lazy(() => import('./LazyComponent'));

// Route-based code splitting
const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('./Dashboard'))
  }
];
```

### Asset Optimization

- Optimize images and static assets
- Use appropriate image formats (WebP, AVIF)
- Implement lazy loading for images
- Minimize bundle size with tree shaking

## Security Best Practices

### Environment Variables

```js
// Use environment variables for sensitive configuration
const app = cloudbase.init({
  env: process.env.CLOUDBASE_ENV_ID
});
```

### Input Validation

```js
// Always validate user input
function validatePhoneNumber(phone) {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}
```

## Testing Guidelines

### Unit Testing

```js
// Test authentication logic
describe('Authentication', () => {
  test('should validate phone number format', () => {
    expect(validatePhoneNumber('13800138000')).toBe(true);
    expect(validatePhoneNumber('invalid')).toBe(false);
  });
});
```

### Integration Testing

- Test CloudBase SDK integration
- Verify authentication flows
- Test database operations
- Validate deployment process

## Troubleshooting Common Issues

### 404 Errors on Refresh

**Solution**: Use hash routing instead of history routing

### Resource Loading Issues

**Solution**: Ensure `publicPath` uses relative paths (`./')

### Authentication Failures

**Solution**: Verify environment ID and SDK initialization

### Build Failures

**Solution**: Ensure `npm install` was executed before building

## Best Practices Summary

1. **Project Structure**: Follow standard directory conventions (src/, dist/, cloudfunctions/)
2. **Build System**: Use modern tools like Vite with proper configuration
3. **Authentication**: Always use SDK built-in features, never implement in cloud functions
4. **Routing**: Use hash routing for static hosting compatibility
5. **Deployment**: Use relative paths and test locally before deploying
6. **SDK Usage**: Only use documented CloudBase Web SDK methods
7. **Error Handling**: Implement comprehensive error handling for all operations
8. **Performance**: Optimize assets and implement code splitting
9. **Security**: Validate inputs and use environment variables properly
10. **Testing**: Include unit and integration tests for critical functionality

---

**Framework**: CloudBase Web SDK + Modern Frontend Build Tools  
**Deployment**: CloudBase Static Hosting