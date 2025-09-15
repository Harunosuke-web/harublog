'use client';

import ReactMarkdown from 'react-markdown';
// import remarkMath from 'remark-math';
// import rehypeMathjax from 'rehype-mathjax';
import dynamic from 'next/dynamic';

const MathContent = dynamic(() => import('./MathContent'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

interface MarkdownRendererProps {
  content: string;
  onHeadingsExtracted?: (headings: Array<{ id: string; title: string; level: number }>) => void;
}

// MathJax CDN type declaration
declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: () => Promise<void>;
    };
  }
}

export default function MarkdownRenderer({ content, onHeadingsExtracted }: MarkdownRendererProps) {
  return (
    <MathContent content={content} onHeadingsExtracted={onHeadingsExtracted} />
  );
}