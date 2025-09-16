---
title: "MathJaxを使った美しい数式の表示方法"
excerpt: "ブログで複雑な数学的概念を表現する際に欠かせないMathJaxの使用方法について詳しく解説します。基本的な構文から高度な数式まで幅広くカバーします。"
date: "2024-12-01"
author: "ハルノスケ"
category: "math"
categorySlug: "math"
tags: ["math", "mathjax", "web-development", "technical-explanation"]
image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop&crop=smart"
---

# MathJaxを使った美しい数式の表示方法

Web上で数学的な内容を表現する際、数式を美しく表示することは非常に重要です。この記事では、MathJaxを使用してブログやWebサイトで数式を効果的に表示する方法について解説します。

## MathJaxとは

MathJaxは、Webブラウザ上で数式を美しく表示するためのJavaScriptライブラリです。LaTeX記法やMathML、AsciiMathなど、様々な記法をサポートしており、高品質な数式レンダリングを実現します。

## 基本的な数式の書き方

### インライン数式

文章中に数式を埋め込む場合は、`$`記号で囲みます。

例：円の面積は $A = \pi r^2$ で表されます。

### ブロック数式

独立した行に数式を表示する場合は、`$$`記号で囲みます。

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## 高度な数式の例

### 行列の表示

$$
\begin{pmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{pmatrix}
$$

### 複雑な積分

$$
\oint_C \mathbf{F} \cdot d\mathbf{r} = \iint_S (\nabla \times \mathbf{F}) \cdot \mathbf{n} \, dS
$$

### 極限の表記

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

### 総和記号

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

## フーリエ変換の例

連続フーリエ変換は以下のように定義されます：

$$
F(\omega) = \int_{-\infty}^{\infty} f(t) e^{-i\omega t} dt
$$

逆フーリエ変換は：

$$
f(t) = \frac{1}{2\pi} \int_{-\infty}^{\infty} F(\omega) e^{i\omega t} d\omega
$$

## 機械学習でよく使われる数式

### 平均二乗誤差

$$
MSE = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y_i})^2
$$

### ガウス分布の確率密度関数

$$
f(x|\mu,\sigma^2) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

### ロジスティック回帰のシグモイド関数

$$
\sigma(z) = \frac{1}{1 + e^{-z}}
$$

## まとめ

MathJaxを使用することで、Web上でも印刷物と同等の美しい数式表示が可能になります。基本的な記法から高度な数式まで、様々な表現が可能です。

数学的な内容を扱うブログやWebサイトを運営する際は、ぜひMathJaxの導入を検討してみてください。読者にとってより理解しやすいコンテンツを提供できるはずです。