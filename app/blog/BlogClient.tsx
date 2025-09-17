'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/types';
import PostCard from '@/components/PostCard';
import ViewToggle, { ViewType } from '@/components/ViewToggle';
import Pagination from '@/components/Pagination';
import Button from '@/components/Button';

interface BlogClientProps {
  posts: Post[];
}

export default function BlogClient({ posts }: BlogClientProps) {
  const [viewMode, setViewMode] = useState<ViewType>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0); // Load More用の表示件数
  const [useLoadMore, setUseLoadMore] = useState(true); // Load More機能を常に使用

  // LocalStorageから設定を読み込み（ハイドレーション後）
  useEffect(() => {
    setIsHydrated(true);
    const savedViewMode = localStorage.getItem('blog-view-mode') as ViewType | null;
    if (savedViewMode && (savedViewMode === 'list' || savedViewMode === 'tight')) {
      setViewMode(savedViewMode);
    }
    // 初期表示件数を設定
    const initialPageSize = savedViewMode === 'tight' ? 10 : 5;
    setLoadedCount(initialPageSize);
  }, []);

  // ビューごとのページサイズを定義
  const getPageSize = (view: ViewType) => {
    switch (view) {
      case 'tight': return 10;
      case 'list': return 5;
      default: return 5;
    }
  };

  // 現在のページサイズ
  const pageSize = getPageSize(viewMode);
  const totalPages = Math.ceil(posts.length / pageSize);

  // 現在のページに表示する記事を計算（ページネーション用）
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = posts.slice(startIndex, endIndex);

  // Load More用の記事を計算
  const loadMorePosts = posts.slice(0, loadedCount);
  const hasMorePosts = loadedCount < posts.length;

  // 表示モード変更時にLocalStorageに保存
  const handleViewModeChange = (mode: ViewType) => {
    setViewMode(mode);
    setCurrentPage(1); // ビュー変更時はページを1に戻す
    // Load More用の表示件数もリセット
    const newPageSize = mode === 'tight' ? 10 : 5;
    setLoadedCount(newPageSize);
    if (isHydrated) {
      localStorage.setItem('blog-view-mode', mode);
    }
  };

  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ページ変更時にトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load Moreハンドラー
  const handleLoadMore = () => {
    const increment = getPageSize(viewMode);
    setLoadedCount(prev => prev + increment);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
      <main>
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                ブログ記事一覧
              </h1>
              <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
                技術、数学、デザインに関する記事を投稿しています。
                {posts.length > 0 && (
                  <span className="block mt-1 text-sm">
                    全{posts.length}件中 {Math.min(loadedCount, posts.length)}件を表示
                  </span>
                )}
              </p>
            </div>

            {/* View Mode Toggle */}
            <ViewToggle
              currentView={viewMode}
              availableViews={['list', 'tight']}
              onViewChange={handleViewModeChange}
            />
          </div>
        </div>

      {posts.length === 0 ? (
        <div className="mx-auto max-w-4xl mt-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              記事がありません
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              まだ投稿された記事がありません。新しい記事をお楽しみに！
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Load More Mode */}
          {viewMode === 'tight' ? (
            <div className="mx-auto mt-16 max-w-4xl mb-8">
              {loadMorePosts.map((post) => (
                <PostCard key={post.slug} post={post} variant="tight" />
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-16 max-w-4xl space-y-4 mb-8">
              {loadMorePosts.map((post) => (
                <PostCard key={post.slug} post={post} variant="list" />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMorePosts && (
            <div className="mx-auto max-w-4xl mt-12 text-center">
              <Button onClick={handleLoadMore}>
                さらに読み込む ({getPageSize(viewMode)}件)
              </Button>
            </div>
          )}
        </>
      )}
      </main>
    </div>
  );
}