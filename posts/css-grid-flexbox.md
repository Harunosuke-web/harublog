---
title: "CSS GridとFlexboxの使い分け完全ガイド"
excerpt: "CSS GridとFlexboxの特徴を理解し、適切な場面で使い分ける方法を実例とともに解説します。"
date: "2024-12-06"
author: "ハルノスケ"
category: "web-development"
categorySlug: "web-development"
tags: ["CSS", "Grid", "Flexbox", "Layout", "Web Design"]
tagSlugs: ["css", "grid", "flexbox", "layout", "web-design"]
image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=smart"
---

# CSS GridとFlexboxの使い分け完全ガイド

CSS GridとFlexboxは、現代のWebレイアウトには欠かせない技術です。どちらも強力ですが、適切な場面で使い分けることが重要です。

## Flexboxの基本

Flexboxは一次元のレイアウトシステムです。主に以下の場面で使用します：

- ナビゲーションバー
- カードのコンテンツ配置
- センタリング
- 等間隔の配置

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

/* 完璧なセンタリング */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

## CSS Gridの基本

CSS Gridは二次元のレイアウトシステムです。以下の場面で威力を発揮します：

- ページ全体のレイアウト
- 複雑なカードグリッド
- 不規則な配置
- レスポンシブグリッド

```css
/* ページレイアウト */
.page-layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 250px 1fr 200px;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }

/* レスポンシブカードグリッド */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}
```

## 実践的な使い分け例

### ナビゲーションバー（Flexbox）

```css
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #333;
  color: white;
  padding: 1rem 2rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
```

### ダッシュボードレイアウト（Grid + Flexbox）

```css
/* メインレイアウト：Grid */
.dashboard {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content";
  grid-template-rows: auto 1fr;
  grid-template-columns: 250px 1fr;
  height: 100vh;
}

/* カードコンテナ：Grid */
.widget-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

/* 個別カード：Flexbox */
.widget {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.widget-content {
  flex: 1;
  padding: 1rem;
}
```

## レスポンシブデザインでの活用

```css
/* モバイルファースト */
.responsive-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* タブレット */
@media (min-width: 768px) {
  .responsive-layout {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* デスクトップ */
@media (min-width: 1024px) {
  .responsive-layout {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

## まとめ

- **Flexbox**: 一次元レイアウト、コンポーネント内の配置
- **CSS Grid**: 二次元レイアウト、ページ全体の構造
- **組み合わせ**: GridでメインレイアウトTODO、Flexboxでコンポーネント内配置

適切な使い分けにより、保守しやすく美しいレイアウトを実現できます。