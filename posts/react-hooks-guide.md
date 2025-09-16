---
title: "React Hooksの完全ガイド：useStateからuseEffectまで"
excerpt: "React Hooksの基本的な使い方から応用まで、実践的なサンプルコードとともに解説します。"
date: "2024-12-10"
author: "ハルノスケ"
category: "web-development"
categorySlug: "web-development"
tags: ["React", "JavaScript", "Hooks", "Frontend"]
tagSlugs: ["react", "javascript", "hooks", "frontend"]
image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop&crop=smart"
---

# React Hooksの完全ガイド

React Hooksは、関数コンポーネントで状態管理や副作用を扱うための機能です。この記事では、基本的なHooksから応用的な使い方まで詳しく解説します。

## useState

最も基本的なHookの一つであるuseStateは、関数コンポーネントに状態を追加します。

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>現在のカウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        増加
      </button>
    </div>
  );
}
```

## useEffect

useEffectは副作用を扱うためのHookです。データの取得、イベントリスナーの登録、手動でのDOM操作などに使用します。

```jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) return <div>読み込み中...</div>;
  if (!user) return <div>ユーザーが見つかりません</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## カスタムHooks

独自のHooksを作成することで、ロジックを再利用できます。

```jsx
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorageへの保存に失敗しました:', error);
    }
  };

  return [storedValue, setValue];
}
```

React Hooksを使いこなすことで、より読みやすく保守しやすいReactアプリケーションを構築できます。