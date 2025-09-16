// カテゴリーやタグのスラッグ変換（SEO対応）
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