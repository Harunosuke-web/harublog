import Link from 'next/link';

export const metadata = {
  title: 'プライバシーポリシー | ハルノスケのブログ',
  description: 'ハルノスケのブログのプライバシーポリシーです。',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
      {/* Breadcrumb Navigation - outside main for SEO structure */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-4xl mb-8">
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
          <li className="text-gray-700 dark:text-gray-300">Privacy Policy</li>
        </ol>
      </nav>

      <main>
        <div className="mx-auto max-w-4xl">
          <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
          プライバシーポリシー
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          最終更新日: 2025年1月16日
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. はじめに
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              ハルノスケのブログ（以下「当サイト」といいます）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
              本プライバシーポリシーは、当サイトがどのような個人情報を収集し、どのように使用するかについて説明します。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. 収集する情報
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  2.1 アクセス情報
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  当サイトでは、サイトの改善や分析のために以下の情報を自動的に収集する場合があります：
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                  <li>IPアドレス</li>
                  <li>ブラウザの種類とバージョン</li>
                  <li>オペレーティングシステム</li>
                  <li>アクセス日時</li>
                  <li>参照元URL</li>
                  <li>閲覧ページ</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  2.2 Cookie
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  当サイトでは、ユーザーエクスペリエンスの向上やサイト分析のためにCookieを使用する場合があります。
                  Cookieの使用を希望しない場合は、ブラウザの設定で無効にすることができます。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. 情報の使用目的
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              収集した情報は以下の目的で使用します：
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
              <li>サイトの運営・管理</li>
              <li>サイトの改善・分析</li>
              <li>セキュリティの向上</li>
              <li>法的義務の履行</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. 第三者への情報提供
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              当サイトは、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. 外部サービス
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  5.1 Google Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  当サイトでは、サイトの利用状況を分析するためにGoogle Analyticsを使用する場合があります。
                  Google Analyticsは、Cookieを使用してユーザーの行動を分析しますが、個人を特定する情報は収集しません。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. セキュリティ
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              当サイトは、収集した情報の保護のために適切なセキュリティ対策を講じています。
              ただし、インターネット上の通信において完全なセキュリティを保証することはできません。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. プライバシーポリシーの変更
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。
              変更後のプライバシーポリシーは、当サイトに掲載された時点で効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. お問い合わせ
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              本プライバシーポリシーに関するご質問やお問い合わせは、
              <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                コンタクトページ
              </Link>
              からお願いいたします。
            </p>
          </section>
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
      </main>
    </div>
  );
}