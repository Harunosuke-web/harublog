// URLスラッグ変換（SEO対応）
export function getCategorySlug(categoryName: string): string {
  return categoryName.toLowerCase()
    .replace(/\s+/g, '-')  // スペースをハイフンに
    .replace(/\./g, '-');  // ドットをハイフンに
}

export function getTagSlug(tagName: string): string {
  return tagName.toLowerCase()
    .replace(/\s+/g, '-')  // スペースをハイフンに
    .replace(/\./g, '-');  // ドットをハイフンに
}

// URL スラッグから表示名への変換
export function getCategoryDisplayName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getTagDisplayName(slug: string): string {
  return slug.replace(/-/g, '-'); // タグはハイフンをそのまま表示
}