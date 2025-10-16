import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Todo List',
  description: '할 일 관리 서비스',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  themeColor: '#F1F5F9', // slate/100
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-slate-800 font-nanum antialiased">
        <Header />
        {/**
         * 페이지 공통 레이아웃
         * <Header /> {children} <Footer />
         */}
        {children}
      </body>
    </html>
  );
}
