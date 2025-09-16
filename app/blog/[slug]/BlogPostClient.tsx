'use client';

import { useState } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';
import ShareButtons from '@/components/ShareButtons';
import { Post } from '@/lib/types';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface BlogPostClientProps {
  post: Post;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleHeadingsExtracted = (headings: Array<{ id: string; title: string; level: number }>) => {
    setTocItems(headings);
  };

  return (
    <>
      <TableOfContents items={tocItems} />

      <div className="mb-16">
        <MarkdownRenderer
          content={post.content}
          onHeadingsExtracted={handleHeadingsExtracted}
        />
      </div>

      <ShareButtons title={post.title} url={currentUrl} />
    </>
  );
}