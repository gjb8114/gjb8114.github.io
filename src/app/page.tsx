import React from 'react';
import Link from 'next/link';
import {getAllRules, getRulesOfPart} from '@/lib/rules-server';
import Layout from '@/components/Layout';

export default async function Home() {
    const [allRules, commonFeatures, cppFeatures] = await Promise.all([
        getAllRules(),
        getRulesOfPart('common'),
        getRulesOfPart('cpp')
    ]);

    return (
        <Layout rules={allRules}>
            <div className="py-12">
                <h1 className="text-4xl font-bold text-center mb-8">clang-tidy GJB-8114 检查插件</h1>
                <div className="max-w-3xl mx-auto">
                    <p className="text-lg text-gray-600 mb-8 text-center">
                        本页面可浏览所有 GJB-8114 规则，搜索特定内容
                    </p>

                    {/* Features Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
                        <div className="flex items-center mb-4">
                            <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                            </svg>
                            <h2 className="text-xl font-semibold ml-3">主要特点</h2>
                        </div>
                        <ul className="list-disc list-inside space-y-3 text-gray-600 pl-4">
                            <li>基于 LLVM/Clang 的强大编译器基础设施，提供精确的代码分析</li>
                            <li>与现代 C/C++ 开发工具链集成，包括 CMake、VS Code 等</li>
                            <li>详细的诊断信息，帮助开发者理解并修复代码问题</li>
                            <li>支持自定义检查规则的启用和禁用，部分提供自动修复建议</li>
                            <li>不依赖编译过程</li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* C/C++ Common Rules Card */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <div className="flex items-center mb-4">
                                <svg
                                    className="h-8 w-8 text-blue-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                </svg>
                                <h2 className="text-xl font-semibold ml-3">C/C++ 共用准则</h2>
                            </div>
                            <p className="text-gray-600 mb-4">
                                适用于 C/C++ 编程共用准则。
                            </p>
                            <Link
                                href="/rules/common"
                                className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-md font-medium hover:bg-blue-200 transition-colors"
                            >
                                浏览 {commonFeatures.length} 条准则
                            </Link>
                        </div>

                        {/* C++ Specific Rules Card */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <div className="flex items-center mb-4">
                                <svg
                                    className="h-8 w-8 text-purple-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                                </svg>
                                <h2 className="text-xl font-semibold ml-3">C++ 专用准则</h2>
                            </div>
                            <p className="text-gray-600 mb-4">
                                C++ 语言特性和模式设计的专用用准则。
                            </p>
                            <Link
                                href="/rules/cpp"
                                className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-md font-medium hover:bg-purple-200 transition-colors"
                            >
                                浏览 {cppFeatures.length} 条准则
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
