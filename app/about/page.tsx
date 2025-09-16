import PageLayout from '@/components/PageLayout';

export default function AboutPage() {
  return (
    <PageLayout maxWidth="medium">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
          About
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-8">
            こんにちは、ハルノスケです。技術とクリエイティブの境界を探求することに情熱を注いでいる個人ブロガーです。
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            このブログについて
          </h2>
          <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-6">
            このブログでは、プログラミング、数学、デザインに関する知識や体験を共有しています。
            複雑な技術的概念をわかりやすく説明し、実用的なソリューションを提供することを心がけています。
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            扱うトピック
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-600 dark:text-gray-300 mb-8">
            <li>
              <strong>プログラミング:</strong>
              React, Next.js, TypeScript, Python, Rustなどの最新技術
            </li>
            <li>
              <strong>数学:</strong>
              線形代数、微積分、統計学、機械学習の数学的基礎
            </li>
            <li>
              <strong>デザイン:</strong>
              UI/UXデザイン、データ可視化、インフォグラフィック
            </li>
            <li>
              <strong>その他:</strong>
              アルゴリズム、データ構造、システム設計
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            技術スタック
          </h2>
          <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-4">
            このブログは以下の技術を使用して構築されています：
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-600 dark:text-gray-300 mb-8">
            <li>Next.js 15 (App Router)</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
            <li>MathJax (数式表示)</li>
            <li>Markdown (記事執筆)</li>
            <li>Vercel (デプロイ)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            お問い合わせ
          </h2>
          <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-4">
            記事に関するご質問やフィードバック、コラボレーションのご相談などがございましたら、
            以下のSNSからお気軽にご連絡ください。
          </p>

          <div className="flex space-x-6 mt-8">
            <a
              href="https://twitter.com/harunosuke"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a
              href="https://github.com/harunosuke"
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>

          <div className="mt-16 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              読者の皆様へ
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              このブログを読んでいただき、ありがとうございます。
              技術の世界は日々変化していますが、一緒に学び成長していけるようなコミュニティを
              築いていければと思います。記事が役に立ったら、ぜひSNSでシェアしてください！
            </p>
          </div>
        </div>
    </PageLayout>
  );
}