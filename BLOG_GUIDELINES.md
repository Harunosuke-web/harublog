# ブログ記事作成ガイドライン

## 📝 記事作成の基本ルール

### 必須フィールド
- `title`: 記事タイトル
- `date`: 公開日（YYYY-MM-DD形式）
- `excerpt`: 記事の要約
- `category`: カテゴリ（**必須**）
- `author`: 著者名（デフォルト: ハルノスケ）

### オプショナルフィールド
- `tags`: タグ配列（空でも可）
- `image`: アイキャッチ画像URL

## 🏷️ カテゴリの仕様

### 有効なカテゴリ一覧
- `Programming`
- `Web Development`
- `Frontend Development`
- `Mathematics`
- `Machine Learning`
- `Apple`
- `Design`
- `DevOps`
- `Database`
- `Security`
- `Mobile Development`
- `Backend Development`

### カテゴリの自動変換
以下の記述は自動的に変換されます：

| 記事内での記述 | 変換後 |
|-------------|--------|
| `programming` | `Programming` |
| `web-development` | `Web Development` |
| `フロントエンド` | `Frontend Development` |
| `math` | `Mathematics` |
| `machine-learning` | `Machine Learning` |
| `apple` | `Apple` |

### ⚠️ 注意事項
- マップに定義されていないカテゴリは**エラーで停止**
- 新しいカテゴリを追加したい場合は開発者に相談
- TypeScript補完は効かないため、上記一覧を参考に記述

## 🏷️ タグの仕様

### ルール
- 記事作成者の記述をそのまま尊重（`TypeScript`, `React` など）
- 空配列でも問題なし
- 大文字小文字の違いは自動で統一（`Programming` と `programming` は同一扱い）

### 表示形式
- **記事内**: 記事作成者の記述通り（`TypeScript`）
- **タグページURL**: 小文字スラッグ（`/blog/tag/typescript`）
- **タグページタイトル**: `tag: typescript`

## 📁 ファイル配置
```
posts/
├── article-slug.md
└── another-article.md
```

## 🔄 URL生成ルール

### カテゴリ
- **記事内**: `Web Development` → **URL**: `/blog/category/web-development`
- **表示**: `Web Development`（タイトルケース）

### タグ
- **記事内**: `TypeScript` → **URL**: `/blog/tag/typescript`
- **表示**: `TypeScript`（記事作成者の記述を尊重）

## 📋 記事作成テンプレート

```markdown
---
title: "記事のタイトル"
date: "2025-01-17"
excerpt: "記事の要約文（省略可能 - 本文から自動生成）"
category: "Programming"
tags: ["TypeScript", "React"]
author: "ハルノスケ"
image: "https://example.com/image.jpg"
---

# 記事本文

記事の内容をここに書きます。
```

## 🚀 VSCode スニペット

以下のスニペットを `.vscode/markdown.code-snippets` に追加すると便利です：

```json
{
  "Blog Post Template": {
    "prefix": "blogpost",
    "body": [
      "---",
      "title: \"${1:記事のタイトル}\"",
      "date: \"${2:$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE}\"",
      "excerpt: \"${3:記事の要約文（省略可能）}\"",
      "category: \"${4|Programming,Web Development,Frontend Development,Mathematics,Machine Learning,Apple,Design,DevOps,Database,Security,Mobile Development,Backend Development|}\"",
      "tags: [${5:\"TypeScript\", \"React\"}]",
      "author: \"ハルノスケ\"",
      "image: \"${6:https://example.com/image.jpg}\"",
      "---",
      "",
      "# ${7:記事見出し}",
      "",
      "${8:記事の内容をここに書きます。}",
      "",
      "## ${9:セクション見出し}",
      "",
      "${10}"
    ],
    "description": "ブログ記事のテンプレート"
  },
  "Minimal Blog Post": {
    "prefix": "blogmin",
    "body": [
      "---",
      "title: \"${1:記事のタイトル}\"",
      "date: \"${2:$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE}\"",
      "category: \"${3|Programming,Web Development,Frontend Development,Mathematics,Machine Learning,Apple,Design,DevOps,Database,Security,Mobile Development,Backend Development|}\"",
      "tags: [${4}]",
      "---",
      "",
      "# ${5:記事見出し}",
      "",
      "${6:記事の内容をここに書きます。}",
      ""
    ],
    "description": "最小構成のブログ記事テンプレート"
  }
}
```

### スニペットの使い方
1. Markdownファイルで `blogpost` と入力
2. Tabキーで補完
3. 各フィールドをTabで移動しながら入力
4. カテゴリは選択式で補完される

### スニペットの特徴
- **日付自動入力**: 今日の日付が自動で入る
- **カテゴリ選択**: 有効なカテゴリから選択可能
- **タブ移動**: 効率的な入力が可能

## 🚀 新しいカテゴリの追加手順（開発者向け）

1. `lib/types.ts`の`ValidCategory`型に追加
2. `lib/posts.ts`の`categoryMap`に変換ルール追加
3. 記事作成可能になる

---

**💡 Tips**: カテゴリは構造的分類、タグは内容ラベルとして使い分けてください。