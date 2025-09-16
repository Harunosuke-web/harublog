import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ハルノスケブログ",
  description: "技術とクリエイティブを探求するブログ",
  keywords: ["技術", "プログラミング", "数学", "クリエイティブ", "ブログ"],
  authors: [{ name: "ハルノスケ" }],
  openGraph: {
    title: "ハルノスケのブログ",
    description: "技術とクリエイティブを探求するブログ",
    url: "https://harmodify.jp",
    siteName: "ハルノスケのブログ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ハルノスケのブログ",
    description: "技術とクリエイティブを探求するブログ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: {
                  inlineMath: [['$', '$']],
                  displayMath: [['$$', '$$']],
                  processEnvironments: true,
                  processEscapes: true,
                  packages: {'[+]': ['base', 'ams', 'newcommand', 'configmacros', 'mathtools', 'amsmath', 'amssymb']},
                  tags: 'ams',
                  maxBuffer: 5 * 1024,
                  macros: {
                    RR: "{\\bf R}",
                    bold: ["{\\bf #1}", 1]
                  }
                },
                chtml: {
                  displayAlign: 'center',
                  displayIndent: '0',
                  matchFontHeight: false,
                  scale: 1.0
                },
                options: {
                  skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
                  ignoreHtmlClass: 'tex2jax_ignore',
                  processHtmlClass: 'tex2jax_process'
                },
                startup: {
                  ready: () => {
                    MathJax.startup.defaultReady();
                  }
                }
              };
            `,
          }}
        />
        <script
          type="text/javascript"
          id="MathJax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${poppins.variable} font-inter antialiased bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
