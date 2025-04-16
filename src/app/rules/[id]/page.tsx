import React from 'react';
import {getAllRules} from '@/lib/rules-server';
import RuleDetailPage from "@/components/RuleDetailPage";

export async function generateStaticParams() {
    try {
        return (await getAllRules()).map((rule) => ({
            id: rule.id,
        }));
    } catch (error) {
        console.error('Error generating static params for rules:', error);
        return [];
    }
}

export default async function RuleDetailPageId({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    return <RuleDetailPage id={id}/>;
}