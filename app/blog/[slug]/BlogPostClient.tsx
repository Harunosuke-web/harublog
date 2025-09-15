'use client';

import MarkdownRenderer from '@/components/MarkdownRenderer';
// import TableOfContents from '@/components/TableOfContents';
import ShareButtons from '@/components/ShareButtons';
import { Post } from '@/lib/posts';

// interface TocItem {
//   id: string;
//   title: string;
//   level: number;
// }

interface BlogPostClientProps {
  post: Post;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      {/* TableOfContents temporarily disabled for performance */}
      {/* <TableOfContents items={tocItems} /> */}

      <div className="mb-16">
        <MarkdownRenderer
          content={post.content}
          onHeadingsExtracted={undefined}
        />
      </div>

      <ShareButtons title={post.title} url={currentUrl} />
    </>
  );
}