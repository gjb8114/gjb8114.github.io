import React from 'react';
import {getAllRules} from '@/lib/rules-server';
import Layout from '@/components/Layout';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import Link from 'next/link';
import {GITHUB_REPO_URL} from '@/lib/constants';
import { GitPullRequestIcon, BookOpenIcon, MailIcon } from 'lucide-react';

export default async function About() {
    const allFeatures = await getAllRules();

    return (
        <Layout rules={allFeatures}>
            <div className="py-8">
                <h1 className="text-4xl font-bold text-center mb-8">关于本项目</h1>
                <div className="max-w-4xl mx-auto space-y-8">
                    <p className="text-gray-600 mb-4">
                        本检查插件是基于 clang-tidy 开发的静态代码分析工具，专门用于检查 C/C++ 代码是否符合 GJB 8114-2013
                        编码标准。
                        可以帮助开发者在开发过程中自动检测代码中的潜在问题，提高代码质量和可靠性。
                    </p>

                    {/*make flex for to card split one line*/}
                    <div className="flex flex-wrap gap-0 justify-between">

                        {/* Development and Contribution */}
                        <Card className="gap-y-0 w-[calc(50%-0.5rem)]">
                            <CardHeader>
                                <div className="flex items-center">
                                    <GitPullRequestIcon className="h-6 w-6 text-blue-500 mr-2" />
                                    <h2 className="text-xl font-semibold text-gray-800">开发与贡献</h2>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    本项目是开源的，欢迎社区贡献。您可以通过以下方式参与项目开发：
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    <li>报告 Bug 和提出功能需求</li>
                                    <li>提交代码改进和新功能实现</li>
                                    <li>完善文档和示例</li>
                                    <li>分享您在使用过程中的经验和最佳实践</li>
                                </ul>
                                <p className="text-gray-600 mt-4">
                                    请访问我们的 <Link href={GITHUB_REPO_URL} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">GitHub 仓库</Link> 了解更多关于如何贡献的信息。
                                </p>
                            </CardContent>
                        </Card>

                        <div className="w-[calc(50%-0.5rem)]">
                            {/* GJB 8114 Standard */}
                            <Card className="gap-y-0">
                                <CardHeader>
                                    <div className="flex items-center">
                                        <BookOpenIcon className="h-6 w-6 text-green-500 mr-2" />
                                        <h2 className="text-xl font-semibold text-gray-800">鸣谢</h2>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                                        <li> 《GJB 8114-2013: C/C+＋语言编程安全子集》
                                            <span className="text-sm text-muted-foreground block pl-8">为了遵循了 GJB 8114-2013，部分信息参考了出版物</span>
                                        </li>
                                        <li>clang-tidy
                                            <span className="text-sm text-muted-foreground block pl-8">项目基于 <Link href="https://llvm.org" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">LLVM</Link> clang-tidy 构建</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                            {/* Contact or Support Info */}
                            <Card className="mt-4 gap-y-0">
                                <CardHeader>
                                    <div className="flex items-center">
                                        <MailIcon className="h-6 w-6 text-purple-500 mr-2" />
                                        <h2 className="text-xl font-semibold text-gray-800">联系与支持</h2>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">
                                        如果您有任何问题、建议或需要技术支持，可以通过以下方式联系我们：
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                                        <li>
                                            <Link href={`${GITHUB_REPO_URL}/issues`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                                GitHub Issues
                                            </Link>
                                            ：在项目仓库中提交问题
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-gray-500 text-sm pt-8">
                        <p>© {new Date().getFullYear()} GJB-8114 Clang-Tidy Plugin Team</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}