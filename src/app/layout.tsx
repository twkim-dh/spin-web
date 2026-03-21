import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "돌려돌려 | 뭐든 결정 못 할 때 돌려!",
  description: "점심 메뉴, 벌칙, 순서 정하기 등 뭐든 결정 못 할 때 돌려돌려 룰렛으로 정하자!",
  metadataBase: new URL("https://spin.dhlm-studio.com"),
  openGraph: {
    title: "돌려돌려 | 뭐든 결정 못 할 때 돌려!",
    description: "점심 메뉴, 벌칙, 순서 정하기 등 뭐든 결정 못 할 때 돌려돌려 룰렛으로 정하자!",
    url: "https://spin.dhlm-studio.com",
    siteName: "돌려돌려",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "돌려돌려 | 뭐든 결정 못 할 때 돌려!",
    description: "점심 메뉴, 벌칙, 순서 정하기 등 뭐든 결정 못 할 때 돌려돌려 룰렛으로 정하자!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable}`}>
      <body
        className="min-h-dvh flex flex-col items-center"
        style={{ fontFamily: "var(--font-noto-sans-kr), 'Noto Sans KR', sans-serif" }}
      >
        <div className="w-full max-w-[480px] min-h-dvh flex flex-col">
          {children}
        </div>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakNGPz8bU"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
