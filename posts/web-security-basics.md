---
title: "Webアプリケーションセキュリティの基礎"
excerpt: "現代のWebアプリケーションで必要なセキュリティ対策と実装方法を、実例とともに詳しく解説します。"
date: "2024-11-28"
author: "ハルノスケ"
category: "web-development"
categorySlug: "web-development"
tags: ["Security", "Web Development", "HTTPS", "Authentication"]
tagSlugs: ["security", "web-development", "https", "authentication"]
image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop&crop=smart"
---

# Webアプリケーションセキュリティの基礎

Webアプリケーションのセキュリティは、ユーザーデータを守るために不可欠です。主要な脅威と対策方法を学びましょう。

## OWASP Top 10

### 1. インジェクション攻撃の防止

```javascript
// 悪い例：SQLインジェクションの脆弱性
const getUserByEmail = (email) => {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  return db.query(query);
};

// 良い例：パラメータ化クエリ
const getUserByEmail = (email) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  return db.query(query, [email]);
};

// Sequelize を使用した安全な実装
const User = require('../models/User');

const getUserByEmail = async (email) => {
  return await User.findOne({
    where: { email: email }
  });
};
```

### 2. XSS (Cross-Site Scripting) 対策

```javascript
// フロントエンドでのエスケープ処理
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// React での自動エスケープ
const UserProfile = ({ user }) => {
  return (
    <div>
      {/* Reactは自動的にエスケープする */}
      <h1>{user.name}</h1>
      <p>{user.bio}</p>

      {/* HTMLを直接挿入する場合は要注意 */}
      <div dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(user.htmlContent)
      }} />
    </div>
  );
};

// サーバーサイドでのサニタイズ
const DOMPurify = require('isomorphic-dompurify');

const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input);
};
```

### 3. CSRF (Cross-Site Request Forgery) 対策

```javascript
const csrf = require('csurf');
const express = require('express');
const app = express();

// CSRFミドルウェアの設定
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

app.use(csrfProtection);

// CSRFトークンをクライアントに送信
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// フォーム送信時のトークン検証
app.post('/api/transfer', (req, res) => {
  // CSRFミドルウェアが自動的にトークンを検証
  const { amount, toAccount } = req.body;
  // 処理続行...
});
```

## 認証とセッション管理

### 安全なパスワード管理

```javascript
const bcrypt = require('bcrypt');
const zxcvbn = require('zxcvbn');

// パスワードの強度チェック
const validatePassword = (password) => {
  const result = zxcvbn(password);

  return {
    isValid: result.score >= 3,
    score: result.score,
    feedback: result.feedback,
    crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second
  };
};

// パスワードのハッシュ化
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// パスワードの検証
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// ユーザー登録時の実装
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  // パスワード強度チェック
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({
      error: 'Password is too weak',
      feedback: passwordValidation.feedback
    });
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    email,
    password: hashedPassword
  });

  res.status(201).json({ message: 'User created successfully' });
};
```

### セッション管理

```javascript
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

const redisClient = redis.createClient();

// セッション設定
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS必須
    httpOnly: true, // XSS対策
    maxAge: 1000 * 60 * 60 * 24, // 24時間
    sameSite: 'strict' // CSRF対策
  }
}));

// セッション無効化
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
};
```

## HTTPS とセキュリティヘッダー

```javascript
const helmet = require('helmet');

// セキュリティヘッダーの設定
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// 追加のセキュリティヘッダー
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
```

## 入力検証とサニタイゼーション

```javascript
const Joi = require('joi');
const validator = require('validator');

// Joi を使用したスキーマ検証
const userSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().integer().min(18).max(100)
});

// バリデーションミドルウェア
const validateUser = (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  req.validatedData = value;
  next();
};

// ファイルアップロードのセキュリティ
const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
  // 許可するファイルタイプ
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB制限
  },
  fileFilter: fileFilter
});
```

## レート制限とDDoS対策

```javascript
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// 基本的なレート制限
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // リクエスト上限
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false
});

// ログイン試行の制限
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 15分間に5回まで
  skipSuccessfulRequests: true
});

// レスポンス速度制限
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 2,
  delayMs: 500
});

app.use('/api/', limiter);
app.use('/api/auth/login', loginLimiter);
app.use('/api/', speedLimiter);
```

## ログ記録とモニタリング

```javascript
const winston = require('winston');

// ログ設定
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// セキュリティイベントのログ記録
const logSecurityEvent = (event, req, additional = {}) => {
  logger.warn('Security Event', {
    event,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id,
    timestamp: new Date().toISOString(),
    ...additional
  });
};

// 使用例
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    logSecurityEvent('FAILED_LOGIN_ATTEMPT', req, { email });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    logSecurityEvent('FAILED_LOGIN_ATTEMPT', req, { email, userId: user.id });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  logSecurityEvent('SUCCESSFUL_LOGIN', req, { userId: user.id });
  // ログイン処理続行...
});
```

## 定期的なセキュリティ監査

```bash
# npm audit でパッケージの脆弱性チェック
npm audit

# 自動修正
npm audit fix

# セキュリティアップデートの確認
npm outdated

# OWASP ZAP を使用したペネトレーションテスト
# スクリプト例
zap-baseline.py -t http://localhost:3000 -r zap-report.html
```

セキュリティは継続的なプロセスです。定期的な監査と最新の脅威情報の確認を怠らないようにしましょう。