'use client';

import { useEffect, useState } from 'react';

interface PrismCodeBlockProps {
  code: string;
  language: string;
}

export default function PrismCodeBlock({ code, language }: PrismCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const highlightCode = () => {
      const languageMap: { [key: string]: string } = {
        js: 'javascript',
        ts: 'typescript',
        py: 'python',
        sh: 'bash',
        shell: 'bash',
        yml: 'yaml',
        md: 'markdown',
        html: 'markup',
        xml: 'markup',
        jsx: 'javascript',
        tsx: 'typescript',
      };

      const normalizedLanguage = languageMap[language.toLowerCase()] || language.toLowerCase();

      // Simple manual highlighting for common languages
      let highlighted = code;

      switch (normalizedLanguage) {
        case 'javascript':
        case 'typescript':
        case 'jsx':
        case 'tsx':
          highlighted = highlightJavaScript(code);
          break;
        case 'python':
          highlighted = highlightPython(code);
          break;
        case 'markup':
        case 'html':
          highlighted = highlightHTML(code);
          break;
        case 'css':
          highlighted = highlightCSS(code);
          break;
        case 'json':
          highlighted = highlightJSON(code);
          break;
        default:
          // For unsupported languages, just escape HTML
          highlighted = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }

      setHighlightedCode(highlighted);
      setIsLoading(false);
    };

    highlightCode();
  }, [code, language]);

  const highlightJavaScript = (code: string) => {
    // 1. Escape HTML first, before any highlighting
    let result = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Store protected content to avoid conflicts
    const protectedContent: Array<{placeholder: string, content: string}> = [];
    let placeholderCounter = 0;

    const createPlaceholder = (content: string) => {
      const placeholder = `__UNIQUE_PLACEHOLDER_${placeholderCounter++}_${Date.now()}__`;
      protectedContent.push({ placeholder, content });
      return placeholder;
    };

    // 2. Process React hooks FIRST (before anything else) - including generic types
    result = result.replace(/\b(useState|useEffect|useCallback|useMemo|useContext|useRef|useReducer|useImperativeHandle|useLayoutEffect|useDebugValue)(?=\s*(?:<[^>]*>)?\s*\()/g, (match) => {
      return createPlaceholder(`<span class="token hook">${match}</span>`);
    });

    // 3. Process React imports (after hooks are protected)
    result = result.replace(/(import\s+)(React)(\s*,?\s*\{[^}]*\}\s+from\s+['"]react['"])/g, (match, importPart, reactName, restPart) => {
      return `${createPlaceholder(`<span class="token import-keyword">${importPart.trim()}</span>`)} ${createPlaceholder(`<span class="token import-name">${reactName}</span>`)}${restPart}`;
    });

    // 3. Protect comments
    result = result.replace(/\/\/.*$/gm, (match) => {
      return createPlaceholder(`<span class="token comment">${match}</span>`);
    });
    result = result.replace(/\/\*[\s\S]*?\*\//g, (match) => {
      return createPlaceholder(`<span class="token comment">${match}</span>`);
    });

    // 4. Protect strings
    result = result.replace(/`([^`]*)`/g, (match, p1) => {
      return createPlaceholder(`<span class="token string">\`${p1}\`</span>`);
    });
    result = result.replace(/"([^"]*)"/g, (match, p1) => {
      return createPlaceholder(`<span class="token string">"${p1}"</span>`);
    });
    result = result.replace(/'([^']*)'/g, (match, p1) => {
      return createPlaceholder(`<span class="token string">'${p1}'</span>`);
    });

    // 4. Regular expressions
    result = result.replace(/\/([^\/\\\r\n]|\\.)+\/[gimuy]*/g, (match) => {
      return createPlaceholder(`<span class="token regex">${match}</span>`);
    });

    // 5. Numbers
    result = result.replace(/\b(0x[0-9a-fA-F]+|0b[01]+|0o[0-7]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g, (match) => {
      return createPlaceholder(`<span class="token number">${match}</span>`);
    });

    // 6. Booleans and special values
    result = result.replace(/\b(true|false|null|undefined|NaN|Infinity)\b/g, (match) => {
      return createPlaceholder(`<span class="token boolean">${match}</span>`);
    });


    // 8. Import/export keywords (C586C0 - pink/purple) - General import/export handling
    result = result.replace(/\b(import|export|from|as|default)\b/g, (match) => {
      return createPlaceholder(`<span class="token import-keyword">${match}</span>`);
    });

    // 8. Storage type keywords (569CD6 - light blue)
    result = result.replace(/\b(const|let|var|function|class|interface|type|enum|abstract|declare|namespace|module)\b/g, (match) => {
      return createPlaceholder(`<span class="token storage-keyword">${match}</span>`);
    });

    // 9. Control flow keywords (C586C0 - pink/purple)
    result = result.replace(/\b(if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|async|await)\b/g, (match) => {
      return createPlaceholder(`<span class="token control-keyword">${match}</span>`);
    });

    // 10. Language constants (569CD6 - light blue)
    result = result.replace(/\b(this|super|new|delete|typeof|instanceof|in|of)\b/g, (match) => {
      return createPlaceholder(`<span class="token language-keyword">${match}</span>`);
    });

    // 11. Access modifiers (569CD6 - light blue)
    result = result.replace(/\b(private|protected|public|readonly|static|extends|implements|get|set)\b/g, (match) => {
      return createPlaceholder(`<span class="token modifier-keyword">${match}</span>`);
    });

    // 12. Type keywords (4EC9B0 - cyan)
    result = result.replace(/\b(string|number|boolean|object|any|unknown|never|void|bigint|symbol|unique|asserts|infer|keyof|is|debugger|with|yield)\b/g, (match) => {
      return createPlaceholder(`<span class="token type-keyword">${match}</span>`);
    });

    // 8. Built-in objects
    result = result.replace(/\b(Array|Boolean|Date|Error|Function|JSON|Math|Number|Object|Promise|RegExp|String|Symbol|console|document|window|global|process|Buffer|require|module|exports|__dirname|__filename)\b/g, (match) => {
      return createPlaceholder(`<span class="token builtin">${match}</span>`);
    });


    // 10. React as type (green - when used as type)
    result = result.replace(/\b(React)\s*\.\s*(FC|Component|ReactElement|ReactNode|JSX)/g, (match, react, type) => {
      return createPlaceholder(`<span class="token type-name">${react}</span>.${createPlaceholder(`<span class="token type-keyword">${type}</span>`)}`);
    });

    // 11. Function calls (general - should not interfere with protected hooks)
    result = result.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, (match, p1) => {
      return createPlaceholder(`<span class="token function">${p1}</span>`);
    });

    // 11. Class names (PascalCase, but not if already processed)
    result = result.replace(/\b([A-Z][a-zA-Z0-9_$]*)\b(?![^<]*<\/span>)/g, (match) => {
      return createPlaceholder(`<span class="token class-name">${match}</span>`);
    });

    // 12. Properties (after other processing)
    result = result.replace(/\.([a-zA-Z_$][a-zA-Z0-9_$]*)\b(?![^<]*<\/span>)/g, (match, p1) => {
      return `.${createPlaceholder(`<span class="token property">${p1}</span>`)}`;
    });

    // Restore protected content (reverse order to avoid conflicts)
    for (let i = protectedContent.length - 1; i >= 0; i--) {
      const { placeholder, content } = protectedContent[i];
      result = result.replace(new RegExp(placeholder, 'g'), content);
    }
    return result;
  };

  const highlightPython = (code: string) => {
    let result = code;

    // 1. Escape HTML
    result = result.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Store protected content to avoid conflicts
    const protectedContent: Array<{placeholder: string, content: string}> = [];
    let placeholderCounter = 0;

    const createPlaceholder = (content: string) => {
      const placeholder = `__PY_PLACEHOLDER_${placeholderCounter++}__`;
      protectedContent.push({ placeholder, content });
      return placeholder;
    };

    // 2. Protect comments
    result = result.replace(/#.*$/gm, (match) => {
      return createPlaceholder(`<span class="token comment">${match}</span>`);
    });

    // 3. Protect docstrings and multiline strings
    result = result.replace(/"""[\s\S]*?"""/g, (match) => {
      return createPlaceholder(`<span class="token string">${match}</span>`);
    });
    result = result.replace(/'''[\s\S]*?'''/g, (match) => {
      return createPlaceholder(`<span class="token string">${match}</span>`);
    });

    // 4. Protect F-strings
    result = result.replace(/f"([^"]*)"/g, (match, p1) => {
      return createPlaceholder(`<span class="token string">f"${p1}"</span>`);
    });
    result = result.replace(/f'([^']*)'/g, (match, p1) => {
      return createPlaceholder(`<span class="token string">f'${p1}'</span>`);
    });

    // 5. Protect regular strings
    result = result.replace(/"([^"]*)"/g, (match, p1) => {
      return createPlaceholder(`<span class="token string">"${p1}"</span>`);
    });
    result = result.replace(/'([^']*)'/g, (match, p1) => {
      return createPlaceholder(`<span class="token string">'${p1}'</span>`);
    });

    // 6. Numbers
    result = result.replace(/\b(0x[0-9a-fA-F]+|0b[01]+|0o[0-7]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[jJ]?)\b/g, '<span class="token number">$1</span>');

    // 7. Booleans and special values
    result = result.replace(/\b(True|False|None)\b/g, '<span class="token boolean">$1</span>');

    // 8. Keywords
    result = result.replace(/\b(and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g, '<span class="token keyword">$1</span>');

    // 9. Built-in functions
    result = result.replace(/\b(abs|all|any|ascii|bin|bool|breakpoint|bytearray|bytes|callable|chr|classmethod|compile|complex|delattr|dict|dir|divmod|enumerate|eval|exec|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|isinstance|issubclass|iter|len|list|locals|map|max|memoryview|min|next|object|oct|open|ord|pow|print|property|range|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|vars|zip|__import__)\b/g, '<span class="token builtin">$1</span>');

    // 10. Decorators
    result = result.replace(/@([a-zA-Z_][a-zA-Z0-9_.]*)/g, '<span class="token decorator">@$1</span>');

    // 11. Function calls (before class names)
    result = result.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="token function">$1</span>');

    // 12. Class names (PascalCase, but not if already processed)
    result = result.replace(/\b([A-Z][a-zA-Z0-9_]*)\b(?![^<]*<\/span>)/g, '<span class="token class-name">$1</span>');

    // 13. Properties (after other processing)
    result = result.replace(/\.([a-zA-Z_][a-zA-Z0-9_]*)\b(?![^<]*<\/span>)/g, '.<span class="token property">$1</span>');

    // Restore protected content
    protectedContent.forEach(({ placeholder, content }) => {
      result = result.replace(placeholder, content);
    });

    return result;
  };

  const highlightHTML = (code: string) => {
    let result = code;

    // 1. Escape HTML
    result = result.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Store protected content
    const protectedContent: Array<{placeholder: string, content: string}> = [];
    let placeholderCounter = 0;

    const createPlaceholder = (content: string) => {
      const placeholder = `__HTML_PLACEHOLDER_${placeholderCounter++}__`;
      protectedContent.push({ placeholder, content });
      return placeholder;
    };

    // 2. Protect comments
    result = result.replace(/&lt;!--[\s\S]*?--&gt;/g, (match) => {
      return createPlaceholder(`<span class="token comment">${match}</span>`);
    });

    // 3. Protect DOCTYPE
    result = result.replace(/&lt;!DOCTYPE[^&gt;]*&gt;/gi, (match) => {
      return createPlaceholder(`<span class="token doctype">${match}</span>`);
    });

    // 4. Protect <style> tags content as plain text (don't try to highlight CSS within HTML)
    result = result.replace(/(&lt;style[^&gt;]*&gt;)([\s\S]*?)(&lt;\/style&gt;)/gi, (match, openTag, cssContent, closeTag) => {
      return createPlaceholder(`${openTag}<span class="token plain-text">${cssContent}</span>${closeTag}`);
    });

    // 5. Protect attribute values (strings)
    result = result.replace(/"([^"]*)"/g, (match, p1) => {
      return createPlaceholder(`<span class="token string">"${p1}"</span>`);
    });
    result = result.replace(/'([^']*)'/g, (match, p1) => {
      return createPlaceholder(`<span class="token string">'${p1}'</span>`);
    });

    // 6. HTML tags with more detailed processing
    result = result.replace(/&lt;(\/??)([a-zA-Z][a-zA-Z0-9-]*)\b([^&gt;]*)&gt;/g, (match, slash, tagName, attrs) => {
      let processedAttrs = attrs;
      let tagColorClass;

      // Different colors for different tag types
      if (['html', 'head', 'body', 'meta', 'title', 'link', 'script', 'style'].includes(tagName.toLowerCase())) {
        tagColorClass = 'html-structure';
      } else if (['div', 'span', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav'].includes(tagName.toLowerCase())) {
        tagColorClass = 'html-container';
      } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'em', 'b', 'i', 'u'].includes(tagName.toLowerCase())) {
        tagColorClass = 'html-text';
      } else if (['a', 'img', 'video', 'audio', 'source', 'picture'].includes(tagName.toLowerCase())) {
        tagColorClass = 'html-media';
      } else if (['form', 'input', 'button', 'select', 'option', 'textarea', 'label'].includes(tagName.toLowerCase())) {
        tagColorClass = 'html-form';
      } else if (['table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot'].includes(tagName.toLowerCase())) {
        tagColorClass = 'html-table';
      } else if (['ul', 'ol', 'li', 'dl', 'dt', 'dd'].includes(tagName.toLowerCase())) {
        tagColorClass = 'html-list';
      } else if (/^[A-Z]/.test(tagName)) {
        tagColorClass = 'component';
      } else {
        tagColorClass = 'tag';
      }

      // First handle class/id attributes specially
      processedAttrs = processedAttrs.replace(/\b(class|id)=(["'])([^'"]*)\2/g, (attrMatch: string, attrName: string, quote: string, value: string) => {
        let highlightedValue = value;

        if (attrName === 'class') {
          // Highlight multiple class names separated by spaces
          highlightedValue = value.replace(/\b([a-zA-Z][a-zA-Z0-9_-]*)\b/g, '<span class="token class-value">$1</span>');
        } else if (attrName === 'id') {
          // Highlight ID name
          highlightedValue = value.replace(/\b([a-zA-Z][a-zA-Z0-9_-]*)\b/g, '<span class="token id-value">$1</span>');
        }

        return ` <span class="token attr-special">${attrName}</span>=<span class="token punctuation">${quote}</span>${highlightedValue}<span class="token punctuation">${quote}</span>`;
      });

      // Then handle other attributes
      processedAttrs = processedAttrs.replace(/\b(href|src|alt|title|type|name|value|placeholder)(?==)/g, '<span class="token attr-important">$1</span>');
      processedAttrs = processedAttrs.replace(/\b([a-zA-Z-]+)(?==)/g, '<span class="token attr-name">$1</span>');

      // Handle remaining attribute values (not class/id since they're already processed)
      processedAttrs = processedAttrs.replace(/(?<!<span[^>]*>)=(["'])([^'"<]*)\1/g, '=<span class="token attr-value">$1$2$1</span>');

      const slashSpan = slash ? `<span class="token punctuation">/</span>` : '';
      return `<span class="token punctuation">&lt;</span>${slashSpan}<span class="token ${tagColorClass}">${tagName}</span>${processedAttrs}<span class="token punctuation">&gt;</span>`;
    });

    // 7. Entities
    result = result.replace(/&amp;[a-zA-Z][a-zA-Z0-9]*;/g, '<span class="token entity">$&</span>');
    result = result.replace(/&amp;#\d+;/g, '<span class="token entity">$&</span>');

    // Restore protected content
    protectedContent.forEach(({ placeholder, content }) => {
      result = result.replace(placeholder, content);
    });

    return result;
  };

  const highlightCSS = (code: string) => {
    let result = code;

    // 1. Escape HTML
    result = result.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Store protected content
    const protectedContent: Array<{placeholder: string, content: string}> = [];
    let placeholderCounter = 0;

    const createPlaceholder = (content: string) => {
      const placeholder = `__CSS_PLACEHOLDER_${placeholderCounter++}__`;
      protectedContent.push({ placeholder, content });
      return placeholder;
    };

    // 2. Protect comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, (match) => {
      return createPlaceholder(`<span class="token comment">${match}</span>`);
    });

    // 3. Protect strings
    result = result.replace(/"([^"]*)"/g, (match, p1) => {
      return createPlaceholder(`<span class="token string">"${p1}"</span>`);
    });
    result = result.replace(/'([^']*)'/g, (match, p1) => {
      return createPlaceholder(`<span class="token string">'${p1}'</span>`);
    });

    // 4. At-rules (@media, @keyframes, etc.)
    result = result.replace(/@([a-zA-Z-]+)/g, '<span class="token atrule">@$1</span>');

    // 5. Enhanced selectors with different colors
    result = result.replace(/(\.([a-zA-Z][a-zA-Z0-9_-]*))(?=\s*[,{])/g, '<span class="token css-class">$1</span>');
    result = result.replace(/(#([a-zA-Z][a-zA-Z0-9_-]*))(?=\s*[,{])/g, '<span class="token css-id">$1</span>');
    result = result.replace(/\b([a-zA-Z][a-zA-Z0-9_-]*)(?=\s*[,{])/g, '<span class="token css-element">$1</span>');
    result = result.replace(/(\*)(?=\s*[,{])/g, '<span class="token css-universal">$1</span>');

    // 6. Pseudo-elements and pseudo-classes
    result = result.replace(/::(before|after|first-line|first-letter|selection|placeholder)/g, '<span class="token pseudo-element">::$1</span>');
    result = result.replace(/:(hover|focus|active|visited|first-child|last-child|nth-child|nth-of-type|not|root|target|disabled|enabled|checked|valid|invalid|required|optional)/g, '<span class="token pseudo-class">:$1</span>');

    // 7. Properties
    result = result.replace(/\b(background|background-color|background-image|background-size|background-position|background-repeat|color|font|font-family|font-size|font-weight|font-style|text-align|text-decoration|text-transform|line-height|letter-spacing|word-spacing|margin|margin-top|margin-right|margin-bottom|margin-left|padding|padding-top|padding-right|padding-bottom|padding-left|border|border-top|border-right|border-bottom|border-left|border-color|border-style|border-width|border-radius|width|height|min-width|min-height|max-width|max-height|display|position|top|right|bottom|left|float|clear|overflow|overflow-x|overflow-y|visibility|opacity|z-index|box-sizing|cursor|pointer-events|user-select|transition|transform|animation|box-shadow|text-shadow|outline|resize|content|list-style|table-layout|border-collapse|border-spacing|caption-side|empty-cells|vertical-align|white-space|word-break|word-wrap|flex|flex-direction|flex-wrap|flex-flow|justify-content|align-items|align-content|order|flex-grow|flex-shrink|flex-basis|align-self|grid|grid-template|grid-template-columns|grid-template-rows|grid-template-areas|grid-column|grid-row|grid-area|gap|grid-gap|place-items|place-content|place-self)\s*:/g, '<span class="token property">$1</span>:');

    // 8. Values and units
    result = result.replace(/:\s*([^;{}]+)/g, (match, value) => {
      // Numbers with units
      value = value.replace(/(\d+(?:\.\d+)?)(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax|deg|rad|turn|s|ms|Hz|kHz|fr)/g, '<span class="token number">$1</span><span class="token unit">$2</span>');

      // Plain numbers
      value = value.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="token number">$1</span>');

      // Color values
      value = value.replace(/#([0-9a-fA-F]{3,8})\b/g, '<span class="token color">#$1</span>');
      value = value.replace(/\b(rgb|rgba|hsl|hsla)\s*\([^)]+\)/g, '<span class="token function">$&</span>');

      // Named colors
      value = value.replace(/\b(red|blue|green|yellow|orange|purple|pink|brown|black|white|gray|grey|silver|gold|cyan|magenta|lime|maroon|navy|olive|teal|aqua|fuchsia|transparent|currentColor|inherit|initial|unset|auto|none)\b/g, '<span class="token color">$1</span>');

      // Functions
      value = value.replace(/\b([a-zA-Z-]+)\s*\(/g, '<span class="token function">$1</span>(');

      // Important
      value = value.replace(/!\s*important/g, '<span class="token important">!important</span>');

      return `: ${value}`;
    });

    // 9. Punctuation
    result = result.replace(/([{}();,.])/g, '<span class="token punctuation">$1</span>');

    // Restore protected content
    protectedContent.forEach(({ placeholder, content }) => {
      result = result.replace(placeholder, content);
    });

    return result;
  };

  const highlightJSON = (code: string) => {
    return code
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"([^"]+)":/g, '<span class="token property">"$1"</span>:')
      .replace(/:\s*"([^"]*)"/g, ': <span class="token string">"$1"</span>')
      .replace(/:\s*(true|false|null)\b/g, ': <span class="token boolean">$1</span>')
      .replace(/:\s*(\d+(?:\.\d+)?)\b/g, ': <span class="token number">$1</span>');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLanguageDisplay = (lang: string) => {
    const displayNames: { [key: string]: string } = {
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      python: 'Python',
      java: 'Java',
      css: 'CSS',
      html: 'HTML',
      markup: 'HTML',
      json: 'JSON',
      bash: 'Shell',
      yaml: 'YAML',
      markdown: 'Markdown',
      sql: 'SQL',
      php: 'PHP',
      rust: 'Rust',
      go: 'Go',
      c: 'C',
      cpp: 'C++',
      jsx: 'React',
      tsx: 'React',
    };
    return displayNames[lang.toLowerCase()] || lang.toUpperCase();
  };

  return (
    <div className="relative group my-8">
      {/* Code content */}
      <pre className="bg-gray-900 dark:bg-black p-6 rounded-lg overflow-x-auto text-sm leading-relaxed border border-gray-700 dark:border-gray-800 relative">
        <code
          className="text-gray-300"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
          }}
          dangerouslySetInnerHTML={{
            __html: isLoading ? 'Loading...' : (highlightedCode || code.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
          }}
        />

        {/* Copy button and language label */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-sm text-gray-400 bg-gray-800 dark:bg-gray-900 px-3 py-1.5 rounded font-medium">
            {getLanguageDisplay(language)}
          </span>
          <button
            onClick={copyToClipboard}
            className="group relative flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-600 text-gray-600 dark:text-gray-400 hover:text-white border border-gray-200 dark:border-gray-600 hover:border-gray-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
            aria-label={copied ? 'コピー済み!' : 'コードをコピー'}
          >
            {copied ? (
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
      </pre>

      {/* VSCode Dark Modern Theme syntax highlighting */}
      <style jsx global>{`
        .token.import-keyword {
          color: #C586C0 !important;
          font-weight: 500;
        }

        .token.storage-keyword {
          color: #569CD6 !important;
          font-weight: 500;
        }

        .token.control-keyword {
          color: #C586C0 !important;
          font-weight: 500;
        }

        .token.language-keyword {
          color: #569CD6 !important;
          font-weight: 500;
        }

        .token.modifier-keyword {
          color: #569CD6 !important;
          font-weight: 500;
        }

        .token.type-keyword {
          color: #4EC9B0 !important;
          font-weight: 500;
        }

        .token.hook {
          color: #DCDCAA !important;
          font-weight: 500;
        }

        .token.type-name {
          color: #4EC9B0 !important;
          font-weight: 500;
        }

        .token.import-name {
          color: #9CDCFE !important;
          font-weight: 500;
        }

        .token.keyword {
          color: #569CD6 !important;
          font-weight: 500;
        }

        .token.string {
          color: #ce9178 !important;
        }

        .token.number {
          color: #b5cea8 !important;
        }

        .token.boolean {
          color: #569cd6 !important;
        }

        .token.function {
          color: #dcdcaa !important;
          font-weight: 500;
        }

        .token.comment {
          color: #6a9955 !important;
          font-style: italic;
        }

        .token.property {
          color: #9cdcfe !important;
        }

        .token.tag {
          color: #569cd6 !important;
        }

        .token.attr-name {
          color: #92c5f8 !important;
        }

        .token.builtin {
          color: #4ec9b0 !important;
          font-weight: 500;
        }

        .token.class-name {
          color: #4ec9b0 !important;
          font-weight: 500;
        }

        .token.react {
          color: #61dafb !important;
          font-weight: 600;
        }

        .token.operator {
          color: #d4d4d4 !important;
        }

        .token.punctuation {
          color: #d4d4d4 !important;
        }

        .token.regex {
          color: #d16969 !important;
        }

        .token.decorator {
          color: #dcdcaa !important;
          font-weight: 500;
        }

        .token.type {
          color: #4ec9b0 !important;
          font-style: italic;
        }

        /* HTML specific styles */
        .token.doctype {
          color: #808080 !important;
          font-weight: bold;
        }

        .token.component {
          color: #4ec9b0 !important;
          font-weight: 600;
        }

        .token.html-structure {
          color: #569cd6 !important;
          font-weight: 600;
        }

        .token.html-container {
          color: #4fc1ff !important;
          font-weight: 500;
        }

        .token.html-text {
          color: #ff6b6b !important;
          font-weight: 500;
        }

        .token.html-media {
          color: #ffd93d !important;
          font-weight: 500;
        }

        .token.html-form {
          color: #6bcf7f !important;
          font-weight: 500;
        }

        .token.html-table {
          color: #c586c0 !important;
          font-weight: 500;
        }

        .token.html-list {
          color: #ff8a50 !important;
          font-weight: 500;
        }

        .token.attr-special {
          color: #f92672 !important;
          font-weight: 600;
        }

        .token.attr-important {
          color: #a6e22e !important;
          font-weight: 500;
        }

        .token.attr-value {
          color: #ce9178 !important;
        }

        .token.class-value {
          color: #4fc1ff !important;
          font-weight: 500;
        }

        .token.id-value {
          color: #ffd93d !important;
          font-weight: 500;
        }

        .token.entity {
          color: #ffd700 !important;
        }

        /* CSS specific styles */
        .token.atrule {
          color: #c586c0 !important;
          font-weight: 600;
        }

        .token.selector {
          color: #d7ba7d !important;
          font-weight: 500;
        }

        .token.css-class {
          color: #d7ba7d !important;
          font-weight: 600;
        }

        .token.css-id {
          color: #ffd93d !important;
          font-weight: 600;
        }

        .token.css-element {
          color: #f92672 !important;
          font-weight: 500;
        }

        .token.css-universal {
          color: #ae81ff !important;
          font-weight: 600;
        }

        .token.pseudo-element {
          color: #d7ba7d !important;
          font-weight: 500;
        }

        .token.pseudo-class {
          color: #d7ba7d !important;
          font-weight: 500;
        }

        .token.unit {
          color: #b5cea8 !important;
          font-weight: 500;
        }

        .token.color {
          color: #ce9178 !important;
          font-weight: 500;
        }

        .token.important {
          color: #f44747 !important;
          font-weight: bold;
        }

        .token.plain-text {
          color: #d4d4d4 !important;
        }
      `}</style>

    </div>
  );
}