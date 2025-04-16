import React from 'react';
import Link from 'next/link';
import {Rule, getRuleUri} from '@/lib/rules';
import Layout from '@/components/Layout';
import {getAllRules, getRulesByCategory} from "@/lib/rules-server";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {SeverityBadge} from '@/components/SeverityBadge';

interface RuleCardProps {
    rule: Rule;
    showCategory?: boolean;
}

const RuleCard: React.FC<RuleCardProps> = ({rule, showCategory}) => {
    const descriptionLines = rule.description.split('\n');
    return (
        <Link href={getRuleUri(rule)}>
            <Card
                className="h-full transition-all hover:shadow-md hover:border-primary/50 flex flex-col gap-0 pt-3 pb-4">
                <CardHeader className="px-4 pb-1 mb-0">
                    <div className="flex justify-between">
                        <div>
                            <Badge variant="secondary" className="text-xs font-normal bg-blue-50">
                                <span className="font-semibold">{rule.id.toUpperCase()}</span>
                                {showCategory && <span
                                  className="font-light text-muted-foreground">{rule.category}</span>}
                            </Badge>
                        </div>
                        <div>
                            <SeverityBadge severity={rule.severity} size="sm"/>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow pt-0 min-h-16">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-medium">{rule.title}</h3>
                    </div>

                    {rule.description && (
                        <p className="bg-muted rounded-md text-xs p-2 text-muted-foreground line-clamp-2 mt-2">
                            {descriptionLines[0].substring(0, 50)}
                            {(descriptionLines[0].length > 50 || descriptionLines.length > 1) ? ' ...' : ''}
                        </p>
                    )}
                </CardContent>
                <CardFooter className="mt-4">
                    <p className="text-xs font-light text-muted-foreground">
                        {rule.feature.children.length} scenario{rule.feature.children.length !== 1 ? 's' : ''}
                    </p>
                </CardFooter>
            </Card>
        </Link>
    );
};

interface RulesCategoryPageProps {
    category: 'common' | 'cpp';
    title: string;
    description: string;
    rules: Rule[];
    categorizedFeatures: Record<string, Rule[]>;
}

export default function RulesCategoryPage({
                                              category,
                                              title,
                                              description,
                                              rules,
                                              categorizedFeatures
                                          }: RulesCategoryPageProps) {
    // Get all the category names and sort them
    const categories = Object.keys(categorizedFeatures).sort();

    return (
        <Layout
            rules={rules}
            activeCategory={category}
        >
            <div className="py-4 container mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{title}</h1>
                <p className="text-muted-foreground mb-8">
                    {description}
                </p>

                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-6 flex flex-wrap h-auto gap-2">
                        <TabsTrigger value="all">全部</TabsTrigger>
                        {categories.map(category => (
                            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="all">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {rules
                                .filter(f => f.part === category)
                                .map((feature) => (
                                    <RuleCard key={feature.id} rule={feature} showCategory={true}/>
                                ))}
                        </div>
                    </TabsContent>

                    {categories.map(category => (
                        <TabsContent key={category} value={category}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categorizedFeatures[category].map((feature) => (
                                    <RuleCard key={feature.id} rule={feature}/>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </Layout>
    );
}

// Helper function to get data for a category page
export async function getRulesCategoryData(category: 'common' | 'cpp') {
    const [rules, categorizedRules] = await Promise.all([
        getAllRules(),
        getRulesByCategory(category)
    ]);

    return {
        rules,
        categorizedRules
    };
}