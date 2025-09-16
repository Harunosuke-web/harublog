---
title: "コードブロックテスト"
date: "2025-01-16"
excerpt: "コードブロックの表示とコピー機能のテスト"
category: "programming"
categorySlug: "programming"
tags: ["programming", "test"]
author: "ハルノスケ"
readTime: 5
---

# コードブロックテスト

## 複雑な JavaScript/TypeScript の例

```javascript
// React コンポーネントの例
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

interface User {
  id: number;
  name: string;
  email: string;
  roles: Array<'admin' | 'user' | 'moderator'>;
}

const UserSearchComponent: React.FC<{ onUserSelect: (user: User) => void }> = ({
  onUserSelect
}) => {
  const [query, setQuery] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // デバウンス付きの検索関数
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  const handleUserClick = useCallback((user: User) => {
    onUserSelect(user);
    setQuery('');
    setUsers([]);
  }, [onUserSelect]);

  return (
    <div className="user-search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ユーザーを検索..."
        className="search-input"
      />

      {isLoading && <div className="loading">検索中...</div>}
      {error && <div className="error">エラー: {error}</div>}

      <ul className="user-list">
        {users.map(user => (
          <li
            key={user.id}
            onClick={() => handleUserClick(user)}
            className={`user-item ${user.roles.includes('admin') ? 'admin' : ''}`}
          >
            <strong>{user.name}</strong>
            <span>{user.email}</span>
            <div className="roles">
              {user.roles.map(role => (
                <span key={role} className={`role role-${role}`}>
                  {role}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearchComponent;
```

## 複雑な Python の例

```python
import asyncio
import aiohttp
import logging
from typing import List, Dict, Optional, Union, TypeVar, Generic
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
import json

# ログの設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TaskStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

@dataclass
class Task:
    id: str
    name: str
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime = field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None
    result: Optional[Dict] = None
    error: Optional[str] = None

    def to_dict(self) -> Dict:
        return {
            'id': self.id,
            'name': self.name,
            'status': self.status.value,
            'created_at': self.created_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'result': self.result,
            'error': self.error
        }

T = TypeVar('T')

class TaskManager(Generic[T]):
    def __init__(self, max_concurrent_tasks: int = 5):
        self.tasks: Dict[str, Task] = {}
        self.semaphore = asyncio.Semaphore(max_concurrent_tasks)
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def execute_task(self, task: Task) -> None:
        """非同期でタスクを実行"""
        async with self.semaphore:
            try:
                task.status = TaskStatus.RUNNING
                logger.info(f"Starting task: {task.name}")

                # 模擬的な非同期処理
                await asyncio.sleep(2)  # APIコール等をシミュレート

                # HTTPリクエストの例
                if self.session:
                    async with self.session.get(f"https://api.example.com/task/{task.id}") as response:
                        if response.status == 200:
                            data = await response.json()
                            task.result = data
                        else:
                            raise aiohttp.ClientError(f"HTTP {response.status}")

                task.status = TaskStatus.COMPLETED
                task.completed_at = datetime.now()
                logger.info(f"Completed task: {task.name}")

            except Exception as e:
                task.status = TaskStatus.FAILED
                task.error = str(e)
                task.completed_at = datetime.now()
                logger.error(f"Task failed: {task.name}, Error: {e}")

    async def add_task(self, task_id: str, task_name: str) -> Task:
        """新しいタスクを追加して実行"""
        if task_id in self.tasks:
            raise ValueError(f"Task with ID {task_id} already exists")

        task = Task(id=task_id, name=task_name)
        self.tasks[task_id] = task

        # バックグラウンドでタスクを実行
        asyncio.create_task(self.execute_task(task))

        return task

    def get_task_stats(self) -> Dict[str, int]:
        """タスクの統計情報を取得"""
        stats = {status.value: 0 for status in TaskStatus}
        for task in self.tasks.values():
            stats[task.status.value] += 1
        return stats

# 使用例
async def main():
    async with TaskManager[Dict]() as manager:
        # 複数のタスクを並行実行
        task_names = [
            "データベース更新",
            "メール送信",
            "レポート生成",
            "ファイル処理"
        ]

        tasks = []
        for i, name in enumerate(task_names, 1):
            task = await manager.add_task(f"task_{i}", name)
            tasks.append(task)

        # 全タスクの完了を待機
        while any(task.status in [TaskStatus.PENDING, TaskStatus.RUNNING]
                  for task in manager.tasks.values()):
            await asyncio.sleep(0.5)
            stats = manager.get_task_stats()
            print(f"進捗: {json.dumps(stats, indent=2, ensure_ascii=False)}")

        print("全タスクが完了しました！")
        for task in manager.tasks.values():
            print(f"- {task.name}: {task.status.value}")

if __name__ == "__main__":
    asyncio.run(main())
```

## 複雑な HTML/CSS の例

```html
<!DOCTYPE html>
<html lang="ja" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Modern web components example">
    <title>Advanced Web Components</title>
    <style>
        :root {
            --primary-color: hsl(210, 100%, 50%);
            --secondary-color: hsl(280, 100%, 70%);
            --bg-color: hsl(220, 13%, 18%);
            --text-color: hsl(210, 40%, 98%);
            --border-radius: 8px;
            --box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        @media (prefers-color-scheme: light) {
            :root {
                --bg-color: hsl(0, 0%, 98%);
                --text-color: hsl(220, 13%, 18%);
            }
        }

        * {
            box-sizing: border-box;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 2rem;
        }

        .card {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: var(--border-radius);
            padding: 2rem;
            box-shadow: var(--box-shadow);
            position: relative;
            overflow: hidden;
        }

        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1));
            pointer-events: none;
        }

        @keyframes slideIn {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .animate {
            animation: slideIn 0.6s ease-out forwards;
        }
    </style>
</head>
<body>
    <header role="banner">
        <nav aria-label="Main navigation">
            <ul role="menubar">
                <li role="none">
                    <a href="#home" role="menuitem" aria-current="page">Home</a>
                </li>
                <li role="none">
                    <a href="#about" role="menuitem">About</a>
                </li>
            </ul>
        </nav>
    </header>

    <main>
        <section class="grid" aria-label="Content grid">
            <article class="card animate" tabindex="0">
                <h2>Dynamic Content</h2>
                <p>This content is dynamically generated.</p>
                <template id="item-template">
                    <div class="item">
                        <span class="title"></span>
                        <span class="description"></span>
                    </div>
                </template>
            </article>
        </section>
    </main>

    <script>
        // Web Components example
        class CustomCard extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }

            connectedCallback() {
                this.shadowRoot.innerHTML = `
                    <style>
                        :host {
                            display: block;
                            --card-bg: var(--bg-color, #fff);
                        }
                        .card {
                            background: var(--card-bg);
                            padding: 1rem;
                        }
                    </style>
                    <div class="card">
                        <slot name="title"></slot>
                        <slot name="content"></slot>
                    </div>
                `;
            }
        }

        customElements.define('custom-card', CustomCard);

        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.card').forEach(card => {
            observer.observe(card);
        });
    </script>
</body>
</html>
```

## JSON の例

```json
{
  "api": {
    "version": "2.1.0",
    "endpoints": {
      "users": {
        "base_url": "https://api.example.com/v2/users",
        "methods": {
          "GET": {
            "description": "Retrieve user information",
            "parameters": {
              "id": {
                "type": "string",
                "required": true,
                "pattern": "^[a-zA-Z0-9-_]{1,50}$"
              },
              "include": {
                "type": "array",
                "items": {
                  "enum": ["profile", "settings", "permissions"]
                },
                "default": ["profile"]
              }
            },
            "responses": {
              "200": {
                "description": "Success",
                "schema": {
                  "$ref": "#/definitions/User"
                }
              },
              "404": {
                "description": "User not found",
                "schema": {
                  "$ref": "#/definitions/Error"
                }
              }
            }
          }
        }
      }
    }
  },
  "definitions": {
    "User": {
      "type": "object",
      "required": ["id", "email", "created_at"],
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid"
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "name": {
          "type": "string",
          "minLength": 1,
          "maxLength": 100
        },
        "roles": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["admin", "user", "moderator"]
          }
        },
        "metadata": {
          "type": "object",
          "additionalProperties": true
        },
        "created_at": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "Error": {
      "type": "object",
      "required": ["code", "message"],
      "properties": {
        "code": {
          "type": "integer"
        },
        "message": {
          "type": "string"
        },
        "details": {
          "type": "object"
        }
      }
    }
  }
}
```