import React from 'react';
import { getAllRules } from '@/lib/rules-server';
import Layout from '@/components/Layout';
import { MarkdownContent } from '@/components/MarkdownContent';
import { promises as fs } from 'fs';
import path from 'path';
import {PROJECT_ROOT} from "@/lib/constants-server";

async function getReadmeContent() {
    const readmePath = path.join(PROJECT_ROOT, 'README.md');

    try {
        const content = await fs.readFile(readmePath, 'utf8');
        const startOfGuide = '## 使用说明\n';
        const begin = content.indexOf(startOfGuide);
        return content.slice(begin + startOfGuide.length).trim();
    } catch (error) {
        console.error('Error reading README.md:', error);
        return '# Error\nFailed to load development documentation.';
    }
}

export default async function DevPage() {
    const rules = await getAllRules();
    const readmeContent = await getReadmeContent();

    return (
        <Layout rules={rules}>
            <div className="py-8">
                <h1 className="text-4xl font-bold text-center mb-8">指南</h1>
                <div className="max-w-4xl mx-auto">
                    <MarkdownContent content={readmeContent} />
                </div>
            </div>
        </Layout>
    );
}