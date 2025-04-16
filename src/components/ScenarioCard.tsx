import {Scenario} from "@cucumber/messages";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {
    getAllSourceFileNameAndContent,
    getOutcomes, isNegativeScenario, isPositiveScenario, isSkipScenario
} from "@/lib/rules";
import {Annotation, CodeBlock} from "@/components/ui/code-block";
import React from "react";
import {Badge} from "@/components/ui/badge";
import {AlertCircle, CheckCircle} from "lucide-react";

function getVariant(scenario: Scenario): { background: string, text: string } {
    if (isPositiveScenario(scenario)) {
        return {
            background: "bg-green-50",
            text: "text-green-700"
        }
    } else if (isNegativeScenario(scenario)) {
        return {
            background: "bg-orange-50",
            text: "text-orange-700"
        }
    }
    return {
        background: "bg-white-50",
        text: "text-white-800"
    }
}

function parseOutcomeText(text: string): [string, Annotation] | null {
    const positionRegex = /^应该报告 "([^:]+):(\d+):(\d+):\s*([^:]+):\s(.*)"/;
    const matches = text.match(positionRegex);

    if (matches && matches.length >= 5) {
        return [
            matches[1],
            {
                line: parseInt(matches[2]),
                column: parseInt(matches[3]),
                severity: matches[4] as 'warning' | 'error' | 'note' | 'success',
                message: matches[5]
            }
        ];
    }

    return null;
}

export function ScenarioCard({scenario, skip, showTitle}: { scenario: Scenario, skip: boolean, showTitle?: boolean }) {
    const variant = getVariant(scenario);
    const cardColorClass = variant.background;
    const titleColorClass = variant.text;
    const sources = getAllSourceFileNameAndContent(scenario);
    const outcomes = getOutcomes(scenario);
    const isSkip = skip || isSkipScenario(scenario);

    const isPositive = isPositiveScenario(scenario);
    const isNegative = isNegativeScenario(scenario);

    return <Card className={cardColorClass}>
        <CardHeader className={cn("relative", titleColorClass)}>
            <div className="flex items-center justify-center">
                {isPositive && <div className="flex items-center"><CheckCircle className="h-6 w-6"/></div>}
                {isNegative && <div className="flex items-center"><AlertCircle className="h-6 w-6"/></div>}
                {showTitle && <CardTitle className="ml-2 text-center text-base font-medium">
                    {scenario.name.replace(/^不?报告/, '')}
                </CardTitle>}
            </div>
            {isSkip && isNegative && <Badge className="secondary bg-blue-600 absolute right-4 top-0">未实现</Badge>}
        </CardHeader>
        <CardContent>
            {sources.map((source) => {
                const annotations = outcomes
                    .map(outcome => parseOutcomeText(outcome.text))
                    .filter((item): item is [string, Annotation] => item !== null)
                    .filter(([name]) => name === source.name)
                    .map(([, annotation]) => annotation);
                return (
                    <div key={source.name} className="text-sm text-muted-foreground mb-4">
                        <span className="font-semibold">{source.name}</span>
                        <CodeBlock code={source.content} language="cpp" annotations={annotations}/>
                    </div>
                );
            })}
        </CardContent>
    </Card>
}