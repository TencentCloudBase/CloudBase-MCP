---
name: auth-web-cloudbase
description: CloudBase Auth v3 Web SDK - Quick Reference Guide
alwaysApply: false
---

## Overview

**Prerequisites**: CloudBase environment ID (`env`)
**Prerequisites**: CloudBase environment Region (`region`)

---

## When to Use

Web frontend authentication with `@cloudbase/js-sdk@2.24.0+`, Compatible with `supabase-js` Auth API and type declarations. **NOT for** server-side or direct HTTP API.

`@cloudbase/js-sdk` cdn source `https://static.cloudbase.net/cloudbase-js-sdk/latest/cloudbase.full.js`

## Quick Start

```js
import cloudbase from '@cloudbase/js-sdk'

const app = cloudbase.init({
  env: `env`, // CloudBase environment ID
  region: `region`,  // CloudBase environment Region, default 'ap-shanghai'
  accessKey: 'publishable key', // required, get publishable key from auth-tool-cloudbase('Get Publishable Key')
  auth: { detectSessionInUrl: true }, // required
})

const auth = app.auth
```

**⚠️ Console Setup Required**: `https://tcb.cloud.tencent.com/dev?envId={envId}#/identity/login-manage`
- Enable login methods, configure templates, add domain to whitelist

**Tokens**: `access_token` (2h), `refresh_token` (30d, auto-refresh), stored in localStorage

---

## Login Methods

**1. Phone OTP (Recommended)**
```js
const { data, error } = await auth.signInWithOtp({ phone: '13800138000' })
const { data: loginData, error: loginError } = await data.verifyOtp({ token:'123456' })
```

**2. Email OTP**
```js
const { data, error } = await auth.signInWithOtp({ email: 'user@example.com' })
const { data: loginData, error: loginError } = await data.verifyOtp({ token: '654321' })
```

**3. Password**
```js
const { data, error } = await auth.signInWithPassword({ username: 'test_user', password: 'pass123' })
const { data, error } = await auth.signInWithPassword({ email: 'user@example.com', password: 'pass123' })
const { data, error } = await auth.signInWithPassword({ phone: '13800138000', password: 'pass123' })
```

**4. Registration (Smart: auto-login if exists)**
- only support email and phone otp registration
```js
// Email Otp
const { data, error } = await auth.signUp({ email: 'new@example.com', nickname: 'User' })
const { data: loginData, error: loginError } = await data.verifyOtp({ token: '123456' })

// Phone Otp
const { data, error } = await auth.signUp({ phone: '13800138000', nickname: 'User' })
const { data: loginData, error: loginError } = await data.verifyOtp({ token: '123456' })
```

**5. Anonymous**
```js
const { data, error } = await auth.signInAnonymously()
```

**6. OAuth (Google/WeChat)**
```js
const { data, error } = await auth.signInWithOAuth({ provider: 'google' })
window.location.href = data.url // Auto-complete after callback
```

**7. Custom Ticket**
```js
await auth.signInWithCustomTicket(async () => {
  const res = await fetch('/api/ticket')
  return (await res.json()).ticket
})
```

**8. Upgrade Anonymous**
```js
const { data, error } = await auth.getSession()
const { data: signUpData, error: signUpError} = await auth.signUp({
  phone: '13800000000',
  anonymous_token: data.session.access_token,
})
await signUpData.verifyOtp({ token: '123456' })
```

---

## User Management

```js
// Sign out
const { data, error } = await auth.signOut()

// Get user
const { data, error } = await auth.getUser()
console.log(data.user.email, data.user.phone, data.user.user_metadata?.nickName)

// Update user (except email, phone)
const { data, error } = await auth.updateUser({ nickname: 'New Name', gender: 'MALE', avatar_url: 'url' })

// Update user (email or phone)
const { data, error } = await auth.updateUser({ email: 'new@example.com' })
const { data, error } = await data.verifyOtp({ email: "new@example.com", token: "123456" });

// Change password (logged in)
const { data, error } = await auth.resetPasswordForOld({ old_password: 'old', new_password: 'new' })

// Reset password (forgot)
const { data, error } = await auth.reauthenticate()
const { data, error } = await data.updateUser({ nonce: '123456', password: 'new' })

// Link third-party
const { data, error } = await auth.linkIdentity({ provider: 'google' })

// View/Unlink identities
const { data, error } = await auth.getUserIdentities()
const { data, error } = await auth.unlinkIdentity({ provider: data.identities[0].id })

// Delete account
const { data, error } = await auth.deleteMe({ password: 'current' })

// Listen to state changes
const { data, error } = auth.onAuthStateChange((event, session, info) => {
  // INITIAL_SESSION, SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED, PASSWORD_RECOVERY, BIND_IDENTITY
})

// Get access token
const { data, error } = const { data, error } = await auth.getSession()
fetch('/api/protected', { headers: { Authorization: `Bearer ${data.session?.access_token}` } })

// Refresh user
const { data, error } = await auth.refreshUser()
```

---

## User Type

```ts
declare type User = {
  id: any
  aud: string
  role: string[]
  email: any
  email_confirmed_at: string
  phone: any
  phone_confirmed_at: string
  confirmed_at: string
  last_sign_in_at: string
  app_metadata: {
    provider: any
    providers: any[]
  }
  user_metadata: {
    name: any
    picture: any
    username: any
    gender: any
    locale: any
    uid: any
    nickName: any
    avatarUrl: any
    location: any
    hasPassword: any
  }
  identities: any
  created_at: string
  updated_at: string
  is_anonymous: boolean
}
```

---

## Complete Example

```js
class PhoneLoginPage {
  async sendCode() {
    const phone = document.getElementById('phone').value
    if (!/^1[3-9]\d{9}$/.test(phone)) return alert('Invalid phone')

    const { data, error } = await auth.signInWithOtp({ phone })
    if (error) return alert('Send failed: ' + error.message)

    this.verifyFunction = data.verify
    document.getElementById('codeSection').style.display = 'block'
    this.startCountdown(60)
  }

  async verifyCode() {
    const code = document.getElementById('code').value
    if (!code) return alert('Enter code')

    const { data, error } = await this.verifyFunction(code)
    if (error) return alert('Verification failed: ' + error.message)

    console.log('Login successful:', data.user)
    window.location.href = '/dashboard'
  }

  startCountdown(seconds) {
    let countdown = seconds
    const btn = document.getElementById('resendBtn')
    btn.disabled = true

    const timer = setInterval(() => {
      countdown--
      btn.innerText = `Resend in ${countdown}s`
      if (countdown <= 0) {
        clearInterval(timer)
        btn.disabled = false
        btn.innerText = 'Resend'
      }
    }, 1000)
  }
}
```

---

## WeChat Mini Program

```js
// Silent login with OpenID
const { data, error } = await auth.signInWithOpenId() // WeChat Cloud mode (default)
const { data, error } = await auth.signInWithOpenId({ useWxCloud: false }) // HTTP mode

// Phone authorization login
const { data, error } = await auth.signInWithPhoneAuth({ phoneCode: 'xxx' })
```

---
