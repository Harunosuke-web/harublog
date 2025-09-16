---
title: "Next.js 15の新機能とApp Routerの完全ガイド"
excerpt: "Next.js 15がリリースされました。App Routerの新機能や改善点、実際の使用方法について詳しく解説します。"
date: "2024-11-28"
author: "ハルノスケ"
category: "web-development"
categorySlug: "web-development"
tags: ["nextjs", "react", "typescript", "web-development"]
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=smart"
---

# Next.js 15の新機能とApp Routerの完全ガイド

Next.js 15がリリースされ、多くの新機能と改善が加えられました。この記事では、特にApp Routerに焦点を当てて、新機能と実践的な使用方法について詳しく解説します。

## App Routerとは

App Routerは、Next.js 13で導入された新しいルーティングシステムです。従来のPages Routerと比較して、より柔軟で直感的なファイルベースルーティングを提供します。

### 基本的なファイル構造

```
app/
├── page.tsx          # ホームページ
├── layout.tsx        # ルートレイアウト
├── loading.tsx       # ローディングページ
├── error.tsx         # エラーページ
├── blog/
│   ├── page.tsx      # /blog
│   ├── [slug]/
│   │   └── page.tsx  # /blog/[slug]
│   └── loading.tsx   # /blog専用ローディング
└── about/
    └── page.tsx      # /about
```

## 新機能の詳細

### 1. Server Components

Server Componentsは、サーバーサイドでレンダリングされるコンポーネントです。

```typescript
// app/blog/page.tsx
import { getPosts } from '@/lib/posts';

export default async function BlogPage() {
  const posts = await getPosts(); // サーバーサイドで実行

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### 2. 並列ルーティング

複数のページを同時に表示できます。

```typescript
// app/@sidebar/page.tsx
export default function Sidebar() {
  return <aside>サイドバー</aside>;
}

// app/@main/page.tsx
export default function Main() {
  return <main>メインコンテンツ</main>;
}

// app/layout.tsx
export default function Layout({
  children,
  sidebar,
  main,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  main: React.ReactNode;
}) {
  return (
    <div>
      {sidebar}
      {main}
      {children}
    </div>
  );
}
```

### 3. インターセプトルーティング

モーダルやオーバーレイの実装が簡単になります。

```typescript
// app/@modal/(.)photo/[id]/page.tsx
export default function PhotoModal({ params }: { params: { id: string } }) {
  return (
    <div className="modal">
      <img src={`/photos/${params.id}`} alt="Photo" />
    </div>
  );
}
```

## 実践的な実装例

### ブログアプリケーションの構築

#### 1. レイアウトの設定

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'My Blog',
  description: 'A blog built with Next.js 15',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <nav>ナビゲーション</nav>
        <main>{children}</main>
        <footer>フッター</footer>
      </body>
    </html>
  );
}
```

#### 2. 動的ルーティング

```typescript
// app/blog/[slug]/page.tsx
import { getPost } from '@/lib/posts';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { slug: string };
}

export default async function BlogPost({ params }: PageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}

// 静的パラメータ生成
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

#### 3. ローディング状態の管理

```typescript
// app/blog/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
    </div>
  );
}
```

#### 4. エラーハンドリング

```typescript
// app/blog/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <p>{error.message}</p>
      <button onClick={reset}>リトライ</button>
    </div>
  );
}
```

## パフォーマンスの最適化

### 1. ストリーミング

```typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>ページタイトル</h1>
      <Suspense fallback={<div>読み込み中...</div>}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
```

### 2. メタデータの動的生成

```typescript
export async function generateMetadata({ params }: PageProps) {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}
```

## まとめ

Next.js 15のApp Routerは、従来のPages Routerと比較して：

- より直感的なファイル構造
- Server Componentsによる効率的なレンダリング
- 並列ルーティングによる柔軟なレイアウト
- ストリーミングによる高速なページ表示

これらの機能を活用することで、パフォーマンスが高く、保守性の良いWebアプリケーションを構築できます。

ぜひNext.js 15を使った開発にチャレンジしてみてください！