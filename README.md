# Harunosuke Blog

技術とクリエイティブを探求する個人ブログ

Next.js 15、TypeScript、~~MathJax~~を使用して構築されています。

## 特徴

- 🚀 **Next.js 15** - 最新のApp Routerを使用
- 📝 **Markdown** - 記事はMarkdownで執筆
- ~~🧮 **MathJax** - 美しい数式表示~~ → 公式CDNを使用
- 📱 **レスポンシブデザイン** - モバイルフレンドリー
- 🌙 **ダークモード** - ライト/ダークテーマ対応
- 🔍 **目次機能** - スクロール追跡付き目次
- 📤 **SNSシェア** - Twitter、Facebook、--LINE--、はてブ対応
- ⚡ **高速表示** - Server Components、ストリーミング対応

## 技術スタック

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- ~~**数式表示**: MathJax~~  → 公式CDNを使用
- **マークダウン処理**: react-markdown, remark-math, rehype-mathjax
- **デプロイ**: Vercel

## 開発環境のセットアップ

### 必要条件

- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd harunosuke-blog

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

開発サーバーは `http://localhost:3000` で起動します。

### 記事の執筆

1. `posts/` ディレクトリに新しい `.md` ファイルを作成
2. フロントマターを設定：

```markdown
---
title: "記事のタイトル"
excerpt: "記事の概要"
date: "YYYY-MM-DD"
author: "著者名"
tags: ["タグ1", "タグ2"]
---

# 記事の内容

ここに記事の内容を書きます。

## 数式の例

インライン数式: $E = mc^2$

ブロック数式:
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
```

## デプロイ

### Vercelへのデプロイ

1. Vercelアカウントを作成
2. GitHubリポジトリを接続
3. 自動デプロイが設定されます

### 環境変数

必要に応じて以下の環境変数を設定：

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## フォルダ構成

```
.
├── app/                     # App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # ホームページ
│   ├── providers.tsx        # テーマプロバイダー
│   ├── blog/
│   │   ├── page.tsx         # ブログ一覧
│   │   └── [slug]/
│   │       └── page.tsx     # 記事詳細
│   └── about/
│       └── page.tsx         # Aboutページ
├── components/              # Reactコンポーネント
│   ├── Header.tsx           # ヘッダー
│   ├── Footer.tsx           # フッター
│   ├── TableOfContents.tsx  # 目次
│   ├── ShareButtons.tsx     # シェアボタン
│   └── MarkdownRenderer.tsx # マークダウンレンダラー
├── lib/                     # ユーティリティ
│   └── posts.ts             # 記事処理
├── posts/                   # Markdown記事
├── public/                  # 静的ファイル
└── styles/                  # スタイル
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---

お問い合わせ: [Twitter](https://twitter.com/harunosuke_web) | [GitHub](https://github.com/harunosuke-web)
