---
title: "数式テスト（シンプル版）"
date: "2025-01-15"
excerpt: "行列と場合分けの表示テスト"
category: "math"
categorySlug: "math"
tags: ["math", "mathjax", "test"]
author: "ハルノスケ"
readTime: 1
---

# 数式テスト（シンプル版）

## 行列のテスト

### 2x2行列（括弧）
$$\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}$$

### 2x2行列（角括弧）
$$\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}$$

### 3x3行列
$$\begin{pmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 1
\end{pmatrix}$$

## 場合分けのテスト

### 基本的な場合分け
$$f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}$$

### より複雑な場合分け
$$|x| = \begin{cases}
x & \text{if } x \geq 0 \\
-x & \text{if } x < 0
\end{cases}$$

## 複数行数式のテスト

### align環境
$$\begin{align}
x + y &= 1 \\
2x - y &= 0
\end{align}$$

### eqnarray環境
$$\begin{eqnarray}
a &=& b + c \\
d &=& e + f
\end{eqnarray}$$

## インライン数式

行列のインライン表示: $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$ はうまく表示される。

場合分けのインライン表示: $f(x) = \begin{cases} 1 & \text{if } x > 0 \\ 0 & \text{if } x = 0 \\ -1 & \text{if } x < 0 \end{cases}$ も確認。