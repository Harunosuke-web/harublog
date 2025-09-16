---
title: "TypeScriptジェネリクスの活用法"
excerpt: "TypeScriptのジェネリクスを使って、型安全で再利用可能なコードを書く方法を学びましょう。"
date: "2024-12-08"
author: "ハルノスケ"
category: "programming"
categorySlug: "programming"
tags: ["TypeScript", "JavaScript", "Programming"]
tagSlugs: ["typescript", "javascript", "programming"]
image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop&crop=smart"
---

# TypeScriptジェネリクスの活用法

ジェネリクスは、TypeScriptの最も強力な機能の一つです。型安全性を保ちながら、再利用可能なコードを書くことができます。

## 基本的なジェネリクス

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// 使用例
const stringResult = identity<string>("Hello");
const numberResult = identity<number>(42);
const booleanResult = identity<boolean>(true);
```

## インターフェースでのジェネリクス

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

// 使用例
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "太郎", email: "taro@example.com" },
  status: 200,
  message: "Success"
};

const productResponse: ApiResponse<Product[]> = {
  data: [
    { id: 1, name: "商品A", price: 1000 },
    { id: 2, name: "商品B", price: 2000 }
  ],
  status: 200,
  message: "Success"
};
```

## 制約付きジェネリクス

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// 使用例
loggingIdentity("Hello"); // OK: stringにはlengthプロパティがある
loggingIdentity([1, 2, 3]); // OK: 配列にはlengthプロパティがある
loggingIdentity({ length: 10, value: 3 }); // OK: lengthプロパティがある
```

## 実践的な例：データフェッチャー

```typescript
class DataFetcher<T> {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<U = T>(endpoint: string): Promise<U> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async post<U = T>(endpoint: string, data: Partial<T>): Promise<U> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

// 使用例
const userFetcher = new DataFetcher<User>('/api/users');
const users = await userFetcher.get<User[]>('/');
const newUser = await userFetcher.post('/', { name: '花子', email: 'hanako@example.com' });
```

ジェネリクスを活用することで、型安全性を保ちながら柔軟なコードを書くことができます。