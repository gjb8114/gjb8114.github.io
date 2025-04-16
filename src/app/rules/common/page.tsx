import React from 'react';
import { getRulesCategoryData } from '@/components/RulesCategoryPage';
import RulesCategoryPage from '@/components/RulesCategoryPage';

export const metadata = {
  title: 'C/C++ 共用准则 - GJB-8114 clang-tidy 检查插件',
  description: '浏览 C/C++ 共用编程语言特性和模式的规则'
};

export default async function CommonRulesPage() {
  const { rules, categorizedRules } = await getRulesCategoryData('common');
  
  return (
    <RulesCategoryPage
      category="common"
      title="C/C++ 共用准则"
      description="浏览 C/C++ 共用编程语言特性和模式的规则"
      rules={rules}
      categorizedFeatures={categorizedRules}
    />
  );
}