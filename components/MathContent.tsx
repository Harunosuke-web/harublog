'use client';

import { useEffect, useState } from 'react';

interface MathContentProps {
  content: string;
  onHeadingsExtracted?: (headings: Array<{ id: string; title: string; level: number }>) => void;
}

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: () => Promise<void>;
    };
  }
}

export default function MathContent({ content, onHeadingsExtracted }: MathContentProps) {
  const [mounted, setMounted] = useState(false);
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Markdownを手動でHTMLに変換（数式を保護）
    const processMarkdown = (md: string) => {
      // 数式を一時的に保護
      const mathBlocks: string[] = [];
      let processed = md;

      // $$...$$を保護
      processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
        mathBlocks.push(match);
        return `__MATH_BLOCK_${mathBlocks.length - 1}__`;
      });

      // $...$を保護
      processed = processed.replace(/\$([^$\n]+)\$/g, (match, math) => {
        mathBlocks.push(match);
        return `__MATH_INLINE_${mathBlocks.length - 1}__`;
      });

      const generateId = (text: string) => {
        return text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      };

      // カスタムスタイル付きのMarkdown変換
      processed = processed
        .replace(/^# (.+)$/gm, (match, title) => {
          const id = generateId(title);
          return `<h1 id="${id}" class="scroll-mt-24 text-3xl font-semibold text-gray-900 dark:text-white mb-8 pb-4 relative">
            ${title}
            <div class="absolute -bottom-4 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </h1>`;
        })
        .replace(/^## (.+)$/gm, (match, title) => {
          const id = generateId(title);
          return `<h2 id="${id}" class="scroll-mt-24 text-2xl font-medium text-gray-800 dark:text-white mb-6 mt-12 relative pb-2">
            ${title}
            <div class="absolute bottom-0 left-0 w-full h-px bg-blue-300 dark:bg-blue-600"></div>
          </h2>`;
        })
        .replace(/^### (.+)$/gm, (match, title) => {
          const id = generateId(title);
          return `<h3 id="${id}" class="scroll-mt-24 text-xl font-medium text-gray-800 dark:text-white mb-4 mt-8 relative pl-4">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
            ${title}
          </h3>`;
        })
        .replace(/^#### (.+)$/gm, (match, title) => {
          const id = generateId(title);
          return `<h4 id="${id}" class="scroll-mt-24 text-lg font-medium text-gray-800 dark:text-white mb-3 mt-6 relative pl-3">
            <div class="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
            ${title}
          </h4>`;
        })
        .replace(/^##### (.+)$/gm, (match, title) => {
          const id = generateId(title);
          return `<h5 id="${id}" class="scroll-mt-24 text-base font-medium text-gray-700 dark:text-white mb-3 mt-5">${title}</h5>`;
        })
        .replace(/^###### (.+)$/gm, (match, title) => {
          const id = generateId(title);
          return `<h6 id="${id}" class="scroll-mt-24 text-sm font-medium text-gray-600 dark:text-white mb-2 mt-4">${title}</h6>`;
        })
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">$1</code>')
        .replace(/^\> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300">$1</blockquote>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[h1-6]|<blockquote|<\/p>)(.+)$/gm, '<p>$1</p>')
        .replace(/<p><\/p>/g, '');

      // 数式を復元
      mathBlocks.forEach((mathBlock, index) => {
        processed = processed.replace(`__MATH_BLOCK_${index}__`, mathBlock);
        processed = processed.replace(`__MATH_INLINE_${index}__`, mathBlock);
      });

      return processed;
    };

    const htmlContent = processMarkdown(content);
    setProcessedContent(htmlContent);

    // 見出しを抽出
    if (onHeadingsExtracted) {
      const headings: Array<{ id: string; title: string; level: number }> = [];
      const headingRegex = /^(#{1,6})\s+(.+)$/gm;
      let match;

      while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const title = match[2].trim();
        const id = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        headings.push({ id, title, level });
      }

      onHeadingsExtracted(headings);
    }
  }, [content, onHeadingsExtracted]);

  useEffect(() => {
    if (mounted && processedContent && typeof window !== 'undefined' && window.MathJax) {
      const processMath = async () => {
        try {
          if (window.MathJax.typesetPromise) {
            await window.MathJax.typesetPromise();
          }
        } catch (error) {
          console.warn('MathJax processing error:', error);
        }
      };

      const timer = setTimeout(processMath, 500);
      return () => clearTimeout(timer);
    }
  }, [mounted, processedContent]);

  // サーバーサイドでは簡単なテキスト表示
  if (!mounted) {
    return <div className="prose prose-lg dark:prose-invert max-w-none">Loading content...</div>;
  }

  // クライアントサイドでHTML表示
  return (
    <div
      className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-medium prose-p:font-light prose-p:text-gray-700 prose-p:leading-relaxed dark:prose-p:text-gray-300"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}