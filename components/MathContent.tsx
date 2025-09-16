'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import PrismCodeBlock from './PrismCodeBlock';

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
  const processedContentRef = useRef('');
  const contentRef = useRef('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize content to prevent unnecessary re-processing
  const memoizedContent = useMemo(() => content, [content]);

  useEffect(() => {
    // Only process if content actually changed
    if (memoizedContent === contentRef.current) return;

    contentRef.current = memoizedContent;
    // Markdownを手動でHTMLに変換（数式とコードブロックを保護）
    const processMarkdown = (md: string) => {
      // 数式とコードブロックを一時的に保護
      const mathBlocks: string[] = [];
      const codeBlocks: Array<{ language: string; code: string; id: string }> = [];
      let processed = md;

      // コードブロック（```）を保護
      processed = processed.replace(/```(\w+)?\s*\n([\s\S]*?)\n```/g, (match, language, code) => {
        const codeBlockId = `__CODE_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push({ language: language || '', code: code.trim(), id: codeBlockId });
        return codeBlockId;
      });

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
          .replace(/[^\w\s-ァ-ヶー々〇-龯]/g, '') // Allow Japanese characters
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
          .trim();
      };

      // カスタムスタイル付きのMarkdown変換
      processed = processed
        .replace(/^# (.+)$/gm, (match, title) => {
          const id = generateId(title);
          return `<h1 id="${id}" class="scroll-mt-24 text-3xl font-poppins font-bold text-gray-900 dark:text-gray-200 mb-8 pb-2 relative">
            ${title}
            <div class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </h1>`;
        })
        .replace(/^## (.+)$/gm, (match, title) => {
          const id = generateId(title);
          return `<h2 id="${id}" class="scroll-mt-24 text-2xl font-poppins font-medium text-gray-800 dark:text-gray-200 mb-6 mt-12 relative pb-2">
            ${title}
            <div class="absolute bottom-0 left-0 w-full h-px bg-gray-300 dark:bg-gray-600"></div>
          </h2>`;
        })
        .replace(/^### (.+)$/gm, (match, title) => {
          const id = generateId(title);
          return `<h3 id="${id}" class="scroll-mt-24 text-xl font-poppins font-medium text-gray-800 dark:text-gray-200 mb-4 mt-8 relative pl-4">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-blue-400"></div>
            ${title}
          </h3>`;
        })
        .replace(/^#### (.+)$/gm, (match, title) => {
          const id = generateId(title);
          return `<h4 id="${id}" class="scroll-mt-24 text-lg font-poppins font-medium text-gray-800 dark:text-gray-200 mb-3 mt-6">
            ${title}
          </h4>`;
        })
        .replace(/^##### (.+)$/gm, (match, title) => {
          const id = generateId(title);
          return `<h5 id="${id}" class="scroll-mt-24 text-base font-poppins font-medium text-gray-700 dark:text-gray-200 mb-3 mt-5">${title}</h5>`;
        })
        .replace(/^###### (.+)$/gm, (match, title) => {
          const id = generateId(title);
          return `<h6 id="${id}" class="scroll-mt-24 text-sm font-poppins font-medium text-gray-600 dark:text-gray-200 mb-2 mt-4">${title}</h6>`;
        })
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">$1</code>')
        .replace(/^\> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300">$1</blockquote>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[h1-6]|<blockquote|<\/p>)(.+)$/gm, '<p class="text-gray-700 dark:text-gray-300">$1</p>')
        .replace(/<p><\/p>/g, '');

      // コードブロックを復元 - React コンポーネントへの置き換えマーカーとして残す
      codeBlocks.forEach((codeBlock, index) => {
        const codeBlockHtml = `<div data-code-block='${JSON.stringify(codeBlock).replace(/'/g, "&apos;")}'></div>`;
        processed = processed.replace(codeBlock.id, codeBlockHtml);
      });

      // 数式を復元
      mathBlocks.forEach((mathBlock, index) => {
        processed = processed.replace(`__MATH_BLOCK_${index}__`, mathBlock);
        processed = processed.replace(`__MATH_INLINE_${index}__`, mathBlock);
      });

      return processed;
    };

    const htmlContent = processMarkdown(memoizedContent);

    // Only update state if content actually changed
    if (htmlContent !== processedContentRef.current) {
      processedContentRef.current = htmlContent;
      setProcessedContent(htmlContent);
    }

    // 見出しを抽出
    if (onHeadingsExtracted) {
      const headings: Array<{ id: string; title: string; level: number }> = [];

      // コードブロックを除外してから見出しを抽出
      let contentWithoutCodeBlocks = memoizedContent;

      // コードブロック（```）を除外
      contentWithoutCodeBlocks = contentWithoutCodeBlocks.replace(/```[\w]*\s*\n[\s\S]*?\n```/g, '');

      const headingRegex = /^(#{1,6})\s+(.+)$/gm;
      let match;

      const generateIdForHeading = (text: string) => {
        return text
          .toLowerCase()
          .replace(/[^\w\s-ァ-ヶー々〇-龯]/g, '') // Allow Japanese characters
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
          .trim();
      };

      while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
        const level = match[1].length;
        const title = match[2].trim();
        const id = generateIdForHeading(title);

        headings.push({ id, title, level });
      }

      onHeadingsExtracted(headings);
    }
  }, [memoizedContent, onHeadingsExtracted]);

  useEffect(() => {
    if (!mounted || !processedContent || typeof window === 'undefined') return;

    const processMath = async () => {
      // Wait for MathJax to be available
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait

      while (!window.MathJax && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (window.MathJax && window.MathJax.typesetPromise) {
        try {
          await window.MathJax.typesetPromise();
        } catch (error) {
          console.warn('MathJax processing error:', error);
        }
      }
    };

    const timer = setTimeout(processMath, 100);
    return () => clearTimeout(timer);
  }, [mounted, processedContent]);

  // サーバーサイドでは簡単なテキスト表示
  if (!mounted) {
    return <div className="prose prose-lg dark:prose-invert max-w-none">Loading content...</div>;
  }

  // コードブロックを抽出してReactコンポーネントに変換
  const renderContentWithCodeBlocks = () => {
    // コードブロックのマーカーを探して分割
    const parts = processedContent.split(/(<div data-code-block='[^']*'><\/div>)/);

    return parts.map((part, index) => {
      // コードブロックマーカーかどうか判定
      const codeBlockMatch = part.match(/^<div data-code-block='([^']*)'><\/div>$/);

      if (codeBlockMatch) {
        try {
          // JSONデコードして元のコードブロック情報を取得
          const jsonString = codeBlockMatch[1].replace(/&apos;/g, "'");

          // 空文字列や無効なJSONをチェック
          if (!jsonString || jsonString.trim() === '') {
            console.warn('Empty JSON string for code block');
            return <div key={`code-empty-${index}`}>Empty code block</div>;
          }

          const codeBlock = JSON.parse(jsonString);

          // コードブロックの必要なプロパティをチェック
          if (!codeBlock || typeof codeBlock.code !== 'string') {
            console.warn('Invalid code block structure:', codeBlock);
            return <div key={`code-invalid-${index}`}>Invalid code block</div>;
          }

          return (
            <PrismCodeBlock
              key={`code-block-${index}`}
              code={codeBlock.code || ''}
              language={codeBlock.language || 'text'}
            />
          );
        } catch (error) {
          console.warn('Failed to parse code block:', error, 'Raw:', codeBlockMatch[1]);
          return <div key={`code-error-${index}`}>Code block parsing error</div>;
        }
      } else {
        // 通常のHTMLコンテンツ
        return (
          <div
            key={`html-${index}`}
            dangerouslySetInnerHTML={{ __html: part }}
          />
        );
      }
    });
  };

  // クライアントサイドでコンテンツを表示
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-medium prose-p:font-light prose-p:text-gray-700 prose-p:leading-relaxed dark:prose-p:text-gray-300 dark:prose-invert:text-gray-300">
      {renderContentWithCodeBlocks()}
    </div>
  );
}