import React from 'react';
import { getRulesCategoryData } from '@/components/RulesCategoryPage';
import RulesCategoryPage from '@/components/RulesCategoryPage';

export const metadata = {
  title: 'C++ 专用准则 - GJB-8114 clang-tidy 检查插件',
  description: '浏览 C++ 专用编程语言特性和模式的规则'
};

export default async function CppRulesPage() {
  const { rules, categorizedRules } = await getRulesCategoryData('cpp');
  
  return (
    <RulesCategoryPage
      category="cpp"
      title="C++ 专用准则"
      description="浏览 C++ 专用编程语言特性和模式的规则"
      rules={rules}
      categorizedFeatures={categorizedRules}
    />
  );
}