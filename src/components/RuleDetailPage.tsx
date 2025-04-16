import React from 'react';
import {getAllRules, getRulesById} from '@/lib/rules-server';
import Layout from '@/components/Layout';
import {notFound} from 'next/navigation';
import {SeverityBadge} from "@/components/SeverityBadge";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
    expandOutlineToScenarios,
    getAllScenarios,
    isAcceptanceScenario,
    isSkipRule
} from "@/lib/rules";
import {ScenarioCard} from "@/components/ScenarioCard";
import {Button} from "@/components/ui/button";
import {ExternalLink} from "lucide-react";
import {GITHUB_REPO_URL} from "@/lib/constants";
import {MarkdownContent} from "@/components/MarkdownContent";
import {Scenario} from "@cucumber/messages";

interface RuleDetailProps {
    id: string;
    category?: 'common' | 'cpp';
}

function ScenarioCardList({scenarios, skip}: { scenarios: Scenario[], skip: boolean }) {
    const expandedScenarios = scenarios.map((scenario: Scenario) => expandOutlineToScenarios(scenario)).flat();
    return (
        <div className="flex flex-wrap justify-around gap-4">
            {expandedScenarios.map(scenario => (
                <div key={scenario.id} className="w-[calc(50%-0.5rem)]">
                    <ScenarioCard key={scenario.id} scenario={scenario} skip={skip} showTitle={true}/>
                </div>
            ))}
        </div>
    );
}

function ScenariosView({scenarios, skip}: { scenarios: Scenario[], skip: boolean }) {
    const acceptances = scenarios.filter(isAcceptanceScenario);
    const more = scenarios.filter(s => !isAcceptanceScenario(s));
    return (
        <Tabs defaultValue="scenarios" className="mt-4">
            <div className="flex justify-center">
                <TabsList className="my-2">
                    <TabsTrigger value="scenarios">基础场景</TabsTrigger>
                    {more.length > 0 && <TabsTrigger value="more">更多场景</TabsTrigger>}
                </TabsList>
            </div>

            <TabsContent value="scenarios"><ScenarioCardList scenarios={acceptances} skip={skip}/></TabsContent>
            {more.length > 0 &&
              <TabsContent value="more"><ScenarioCardList scenarios={more} skip={skip}/></TabsContent>}
        </Tabs>);
}

export default async function RuleDetailPage({id, category}: RuleDetailProps) {
    try {
        const [rule, allFeatures] = await Promise.all([
            getRulesById(id),
            getAllRules()
        ]);

        if (!rule) {
            return notFound();
        }
        if (category) {
            if (rule.part !== category) return notFound();
        } else {
            category = rule.part;
        }

        const scenarios = getAllScenarios(rule);
        const githubFeatureUrl = `${GITHUB_REPO_URL}/blob/main/features/${rule.path}`;

        return (
            <Layout
                rules={allFeatures}
                currentId={id}
                activeCategory={category}
            >
                <div className="py-4 max-w-6xl mx-auto">
                    <div className="px-48 min-h-32">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <Badge variant="secondary" className="bg-blue-50 font-normal">
                                    <span className="text-muted-foreground">{rule.category}</span>
                                    <span className="text-xs font-medium">{rule.id.toUpperCase()}</span>
                                </Badge>
                                <SeverityBadge severity={rule.severity} size="md"/>
                            </div>
                            <h1 className="text-xl font-bold mb-4">{rule.title}</h1>
                        </div>
                        {rule.description && (<MarkdownContent content={rule.description}/>)}
                    </div>

                    {/*<div className="text-sm text-muted-foreground">*/}
                    {/*    <span className="font-semibold">检查命令</span>*/}
                    {/*    <CodeBlock code={getActionCommands(scenarios[0]).join("\n")} language="bash"/>*/}
                    {/*</div>*/}

                    {scenarios.length > 0 && <ScenariosView scenarios={scenarios} skip={isSkipRule(rule)}/>}

                    <div className="flex mt-6 justify-center">
                        <Button variant="ghost" size="sm" asChild>
                            <a href={githubFeatureUrl} target="_blank" rel="noopener noreferrer"
                               className="flex items-center gap-2">
                                <ExternalLink size={16}/>
                                查看特性文件
                            </a>
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    } catch (error) {
        console.error(`Error rendering ${category} rule page for ${id}:`, error);
        return notFound();
    }
}