---
title: "機械学習入門：基本概念から実践まで"
excerpt: "機械学習の基本概念を理解し、実際にPythonを使ってシンプルなモデルを構築する方法を学びましょう。"
date: "2024-12-02"
author: "ハルノスケ"
category: "programming"
categorySlug: "programming"
tags: ["Machine Learning", "Python", "AI", "Data Science"]
tagSlugs: ["machine-learning", "python", "ai", "data-science"]
image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop&crop=smart"
---

# 機械学習入門：基本概念から実践まで

機械学習は現代のテクノロジーの核心部分となっています。基本概念を理解し、実際にコードを書いて学んでいきましょう。

## 機械学習の種類

### 1. 教師あり学習（Supervised Learning）

正解データを使ってモデルを訓練する手法です。

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import numpy as np
import pandas as pd

# サンプルデータの準備
np.random.seed(42)
X = np.random.randn(1000, 1) * 10
y = 2 * X.ravel() + 3 + np.random.randn(1000) * 2

# データの分割
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# モデルの訓練
model = LinearRegression()
model.fit(X_train, y_train)

# 予測
y_pred = model.predict(X_test)

# 評価
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error: {mse:.2f}")
print(f"係数: {model.coef_[0]:.2f}")
print(f"切片: {model.intercept_:.2f}")
```

### 2. 教師なし学習（Unsupervised Learning）

正解データなしでパターンを発見する手法です。

```python
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
import matplotlib.pyplot as plt

# サンプルデータの生成
X, _ = make_blobs(n_samples=300, centers=4, cluster_std=0.60, random_state=0)

# K-meansクラスタリング
kmeans = KMeans(n_clusters=4, random_state=42)
y_kmeans = kmeans.fit_predict(X)

# 結果の可視化
plt.figure(figsize=(10, 6))
plt.scatter(X[:, 0], X[:, 1], c=y_kmeans, cmap='viridis')
plt.scatter(kmeans.cluster_centers_[:, 0],
           kmeans.cluster_centers_[:, 1],
           c='red', marker='x', s=200, linewidths=3)
plt.title('K-means Clustering')
plt.show()
```

## 実践例：住宅価格予測

実際のデータセットを使って住宅価格を予測してみましょう。

```python
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score

# データの読み込み（仮想的なデータセット）
data = pd.DataFrame({
    'bedrooms': np.random.randint(1, 6, 1000),
    'bathrooms': np.random.randint(1, 4, 1000),
    'sqft': np.random.randint(800, 3500, 1000),
    'age': np.random.randint(0, 50, 1000),
    'location_score': np.random.uniform(1, 10, 1000)
})

# 価格の生成（特徴量に基づく）
data['price'] = (
    data['bedrooms'] * 20000 +
    data['bathrooms'] * 15000 +
    data['sqft'] * 100 +
    (50 - data['age']) * 1000 +
    data['location_score'] * 10000 +
    np.random.normal(0, 20000, 1000)
)

# 特徴量と目的変数の分離
X = data.drop('price', axis=1)
y = data['price']

# データの分割
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 特徴量の標準化
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ランダムフォレストモデルの訓練
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train_scaled, y_train)

# 予測と評価
y_pred = rf_model.predict(X_test_scaled)
r2 = r2_score(y_test, y_pred)

print(f"R-squared Score: {r2:.3f}")

# 特徴量の重要度
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)

print("\n特徴量の重要度:")
print(feature_importance)
```

## モデルの評価と改善

### 交差検証

```python
from sklearn.model_selection import cross_val_score

# 5-fold交差検証
cv_scores = cross_val_score(rf_model, X_train_scaled, y_train,
                           cv=5, scoring='r2')

print(f"交差検証スコア: {cv_scores}")
print(f"平均スコア: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
```

### ハイパーパラメータチューニング

```python
from sklearn.model_selection import GridSearchCV

# パラメータグリッドの定義
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [3, 5, 7, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

# グリッドサーチ
grid_search = GridSearchCV(
    RandomForestRegressor(random_state=42),
    param_grid,
    cv=3,
    scoring='r2',
    n_jobs=-1
)

grid_search.fit(X_train_scaled, y_train)

print(f"最適なパラメータ: {grid_search.best_params_}")
print(f"最高スコア: {grid_search.best_score_:.3f}")
```

## ディープラーニングの基礎

```python
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# シンプルなニューラルネットワーク
model = Sequential([
    Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
    Dense(32, activation='relu'),
    Dense(16, activation='relu'),
    Dense(1)  # 回帰問題なのでactivationなし
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])

# モデルの訓練
history = model.fit(
    X_train_scaled, y_train,
    batch_size=32,
    epochs=100,
    validation_split=0.2,
    verbose=0
)

# 予測
y_pred_nn = model.predict(X_test_scaled)
r2_nn = r2_score(y_test, y_pred_nn)

print(f"Neural Network R-squared Score: {r2_nn:.3f}")
```

## まとめ

機械学習の基本的な流れ：

1. **データの準備と前処理**
2. **モデルの選択と訓練**
3. **評価と検証**
4. **ハイパーパラメータチューニング**
5. **本番環境への展開**

適切なアルゴリズムの選択と評価指標の理解が、成功する機械学習プロジェクトの鍵となります。