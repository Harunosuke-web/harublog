---
title: "データベース最適化の基本テクニック"
excerpt: "アプリケーションのパフォーマンスを向上させるためのデータベース最適化手法を実例とともに解説します。"
date: "2024-12-04"
author: "ハルノスケ"
category: "Database"
tags: ["Database", "SQL", "Performance", "Optimization"]
tagSlugs: ["database", "sql", "performance", "optimization"]
image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=smart"
---

# データベース最適化の基本テクニック

データベースのパフォーマンスは、アプリケーション全体の性能に大きく影響します。適切な最適化により、レスポンス時間を大幅に改善できます。

## インデックスの効果的な使用

インデックスは、データベース最適化の基本中の基本です。

```sql
-- よく検索される列にインデックスを作成
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_date ON orders(created_at);

-- 複合インデックスの活用
CREATE INDEX idx_user_status_date ON users(status, created_at);

-- 部分インデックス（PostgreSQL）
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
```

### インデックス使用の判断基準

```sql
-- EXPLAIN を使用してクエリプランを確認
EXPLAIN ANALYZE
SELECT * FROM users
WHERE email = 'user@example.com';

-- インデックスが使用されているかチェック
EXPLAIN (ANALYZE, BUFFERS)
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
  AND o.created_at >= '2024-01-01';
```

## クエリの最適化

### N+1問題の解決

```sql
-- 悪い例：N+1クエリ
-- 1回目：全ユーザーを取得
SELECT * FROM users;

-- N回：各ユーザーの注文を個別に取得
SELECT * FROM orders WHERE user_id = 1;
SELECT * FROM orders WHERE user_id = 2;
-- ...

-- 良い例：JOINを使用
SELECT u.*, o.*
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- または：IN句を使用
SELECT * FROM orders
WHERE user_id IN (1, 2, 3, 4, 5);
```

### サブクエリの最適化

```sql
-- 悪い例：相関サブクエリ
SELECT u.name, u.email
FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.user_id = u.id
      AND o.total > 1000
);

-- 良い例：JOINを使用
SELECT DISTINCT u.name, u.email
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.total > 1000;
```

## データ型の最適化

```sql
-- 適切なデータ型の選択
CREATE TABLE optimized_table (
    id SERIAL PRIMARY KEY,
    -- 大きすぎるVARCHARは避ける
    code VARCHAR(10) NOT NULL,
    -- 真偽値はBOOLEAN
    is_active BOOLEAN DEFAULT true,
    -- 日付はTIMESTAMP
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- 数値は適切なサイズ
    count INTEGER DEFAULT 0,
    price DECIMAL(10,2)
);
```

## パーティショニング

大量のデータを効率的に管理するためのパーティショニング：

```sql
-- 日付によるパーティショニング（PostgreSQL）
CREATE TABLE orders_partitioned (
    id SERIAL,
    user_id INTEGER,
    total DECIMAL(10,2),
    created_at DATE
) PARTITION BY RANGE (created_at);

-- 月ごとのパーティション作成
CREATE TABLE orders_2024_01 PARTITION OF orders_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE orders_2024_02 PARTITION OF orders_partitioned
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

## 接続プールの設定

```javascript
// Node.js での接続プール設定例
const { Pool } = require('pg');

const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'mydb',
  password: 'password',
  port: 5432,
  max: 20, // 最大接続数
  idleTimeoutMillis: 30000, // アイドルタイムアウト
  connectionTimeoutMillis: 2000, // 接続タイムアウト
});

// トランザクションの適切な使用
async function transferMoney(fromId, toId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, fromId]
    );

    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, toId]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

## キャッシュ戦略

```javascript
// Redis を使用したクエリキャッシュ
const redis = require('redis');
const client = redis.createClient();

async function getCachedUserData(userId) {
  const cacheKey = `user:${userId}`;

  // キャッシュから取得を試行
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // データベースから取得
  const userData = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );

  // キャッシュに保存（1時間の TTL）
  await client.setex(cacheKey, 3600, JSON.stringify(userData));

  return userData;
}
```

## 監視と分析

定期的なパフォーマンス監視は重要です：

```sql
-- 遅いクエリの特定（MySQL）
SELECT query_time, lock_time, rows_examined, db, sql_text
FROM mysql.slow_log
WHERE query_time > 1
ORDER BY query_time DESC;

-- インデックス使用状況の確認（PostgreSQL）
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

これらの最適化テクニックを段階的に適用することで、データベースのパフォーマンスを大幅に改善できます。