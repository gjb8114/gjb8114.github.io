import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-gray-400">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">找不到页面</h2>
          <p className="mt-2 text-sm text-gray-600">
              页面不存在或已被删除。请检查您输入的 URL 是否正确，或者返回主页。
          </p>
        </div>
        <div className="mt-8">
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            返回主页
          </Link>
        </div>
      </div>
    </div>
  );
}