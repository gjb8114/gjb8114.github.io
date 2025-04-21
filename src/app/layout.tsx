import React from 'react';
import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google'
import { Inter } from 'next/font/google';
import './globals.css';
import 'prismjs/themes/prism-tomorrow.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GJB 8114-2013 clang-tidy 检查插件',
  description: 'clang-tidy-gjb8114 功能与准则文档',
  verification: {
    google: "QZS-fvpVnIyam1IS3CyZcAwn1SIqGGudssXJVc4IqKc"
  },
  metadataBase: new URL('https://gjb8114.github.io'),
  alternates: {
    canonical: '/',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-HTT3NVZW9E" />
    </html>
  );
}
