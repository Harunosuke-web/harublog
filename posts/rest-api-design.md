---
title: "RESTful API設計の実践ガイド"
excerpt: "スケーラブルで保守しやすいRESTful APIを設計するためのベストプラクティスと実装例を紹介します。"
date: "2024-11-30"
author: "ハルノスケ"
category: "web-development"
categorySlug: "web-development"
tags: ["API", "REST", "Backend", "Design"]
tagSlugs: ["api", "rest", "backend", "design"]
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&crop=smart"
---

# RESTful API設計の実践ガイド

良いAPI設計は、アプリケーションの成功に不可欠です。RESTful APIの設計原則とベストプラクティスを学びましょう。

## REST APIの基本原則

### 1. リソース指向の設計

```javascript
// 良い例：リソースベースのURL
GET    /api/users           // ユーザー一覧取得
GET    /api/users/123       // 特定ユーザー取得
POST   /api/users           // ユーザー作成
PUT    /api/users/123       // ユーザー更新
DELETE /api/users/123       // ユーザー削除

// 悪い例：動詞ベースのURL
GET /api/getUsers
POST /api/createUser
PUT /api/updateUser/123
```

### 2. 適切なHTTPメソッドの使用

```javascript
// Express.js での実装例
const express = require('express');
const router = express.Router();

// GET: リソースの取得
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const users = await User.findAll({
      where: search ? { name: { [Op.iLike]: `%${search}%` } } : {},
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    const total = await User.count();

    res.json({
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST: リソースの作成
router.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // バリデーション
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: 'Email already exists'
      });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
```

## エラーハンドリング

### 統一されたエラーレスポンス

```javascript
// エラーハンドリングミドルウェア
const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  const errorResponse = {
    error: {
      message: error.message,
      code: error.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method
    }
  };

  // 開発環境でのみスタックトレースを含める
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};

// カスタムエラークラス
class APIError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'APIError';
  }
}

// 使用例
router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      throw new APIError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});
```

## バージョニング戦略

```javascript
// URL パスでのバージョニング
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// ヘッダーでのバージョニング
const versionMiddleware = (req, res, next) => {
  const version = req.headers['api-version'] || 'v1';
  req.apiVersion = version;
  next();
};

// バージョン別のルーティング
const routeByVersion = {
  v1: (req, res) => {
    // v1の処理
    res.json({ version: 'v1', data: 'old format' });
  },
  v2: (req, res) => {
    // v2の処理
    res.json({ version: 'v2', data: { new: 'format' } });
  }
};

router.get('/data', versionMiddleware, (req, res) => {
  const handler = routeByVersion[req.apiVersion] || routeByVersion.v1;
  handler(req, res);
});
```

## 認証とセキュリティ

### JWT認証の実装

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// ログイン
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 認証ミドルウェア
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};
```

## ドキュメント化

### OpenAPI (Swagger) の活用

```yaml
# swagger.yaml
openapi: 3.0.0
info:
  title: User Management API
  version: 1.0.0
  description: REST API for user management

paths:
  /users:
    get:
      summary: Get all users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    $ref: '#/components/schemas/Pagination'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
        createdAt:
          type: string
          format: date-time
```

## パフォーマンス最適化

### レート制限

```javascript
const rateLimit = require('express-rate-limit');

// 基本的なレート制限
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // リクエスト数上限
  message: {
    error: 'Too many requests, please try again later'
  }
});

// API別のレート制限
const createUserLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1時間
  max: 5, // ユーザー作成は1時間に5回まで
  skipSuccessfulRequests: true
});

app.use('/api', limiter);
app.use('/api/users', createUserLimiter);
```

### キャッシュ戦略

```javascript
const redis = require('redis');
const client = redis.createClient();

// キャッシュミドルウェア
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      // レスポンスをキャプチャ
      const originalJson = res.json;
      res.json = function(data) {
        // キャッシュに保存
        client.setex(key, duration, JSON.stringify(data));
        originalJson.call(this, data);
      };

      next();
    } catch (error) {
      next();
    }
  };
};

// 使用例
router.get('/users', cacheMiddleware(600), getUsersHandler);
```

## テスト

```javascript
const request = require('supertest');
const app = require('../app');

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('should return users list', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle pagination', async () => {
      const response = await request(app)
        .get('/api/users?page=2&limit=5')
        .expect(200);

      expect(response.body.pagination.page).toBe(2);
      expect(response.body.pagination.limit).toBe(5);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(userData.email);
    });
  });
});
```

良いAPI設計は、開発者体験を向上させ、長期的な保守性を確保します。これらのプラクティスを参考に、使いやすいAPIを構築してください。