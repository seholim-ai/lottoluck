import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "LottoLuck - 로또 추천 & 통계 서비스",
    description: "과거 당첨 데이터를 분석하여 최적의 로또 번호를 추천해드립니다. 행운의 슬롯으로 즐겁게 번호를 뽑아보세요.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className="dark" suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
