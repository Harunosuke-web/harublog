import Link from 'next/link';

export const metadata = {
  title: 'コンタクト | ハルノスケのブログ',
  description: 'ハルノスケのブログへのお問い合わせページです。',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8 py-24">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <li>
            <Link
              href="/"
              className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
            >
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-700 dark:text-gray-300">Contact</li>
        </ol>
      </nav>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
          コンタクト
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          ハルノスケのブログへのお問い合わせは、以下の方法でお気軽にご連絡ください。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
          {/* Social Media */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ソーシャルメディア
            </h2>
            <div className="space-y-4">
              <a
                href="https://x.com/harunosuke_web"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>@harunosuke_web</span>
              </a>
              <a
                href="https://github.com/harunosuke-web"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span>harunosuke-web</span>
              </a>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              レスポンス時間
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  通常1-3日以内に返信いたします
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  週末・祝日は遅れる場合があります
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            お問い合わせについて
          </h2>

          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                歓迎するお問い合わせ
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>ブログ記事に関する質問やフィードバック</li>
                <li>技術的な内容についての議論</li>
                <li>コラボレーションのご提案</li>
                <li>記事の訂正や補足に関する情報</li>
                <li>その他、建設的なご意見・ご感想</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                注意事項
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>スパムや営業目的のメッセージはお控えください</li>
                <li>個人的なコードの添削は対応いたしかねます</li>
                <li>返信をお約束するものではありません</li>
                <li>内容によっては公開記事として回答する場合があります</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                よくある質問
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Q: 記事の内容について質問があります</h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    A: お気軽にお聞かせください。可能な範囲でお答えいたします。
                  </p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Q: 記事の転載や引用は可能ですか？</h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    A: 適切な出典表記をしていただければ、引用は歓迎です。転載については事前にご相談ください。
                  </p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Q: 寄稿や共同執筆は受け付けていますか？</h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    A: 内容によってはご相談に応じます。まずはお気軽にお声がけください。
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 cursor-pointer"
          >
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}