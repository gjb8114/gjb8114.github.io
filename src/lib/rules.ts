import {Feature, Scenario, Step, StepKeywordType, Tag} from "@cucumber/messages";

export interface Rule {
    id: string;
    title: string;
    description: string;
    path: string;
    category: string;
    part: 'common' | 'cpp';
    severity: '强制' | '建议';
    feature: Feature;
}

export function getRuleUri(rule: Rule): string {
    return `/rules/${rule.id.toLowerCase()}`;
}

export function isGivenStep(step: Step): boolean {
    return step.keywordType === StepKeywordType.CONTEXT;
}

export function isWhenStep(step: Step): boolean {
    return step.keywordType === StepKeywordType.ACTION;
}

export function isThenStep(step: Step): boolean {
    return step.keywordType === StepKeywordType.OUTCOME;
}

export function isAndStep(step: Step): boolean {
    return step.keywordType === StepKeywordType.CONJUNCTION;
}

export function getAllScenarios(rule: Rule): Scenario[] {
    return rule.feature.children
        .filter((child) => {
            return child.scenario !== undefined;
        }).map((child) => child.scenario) as Scenario[];
}

export function isAcceptanceScenario(scenario: Scenario): boolean {
    return scenario.tags.find((tag: Tag) => tag.name === "@acceptance") !== undefined;
}

export function isSkipScenario(scenario: Scenario): boolean {
    return scenario.tags.find((tag: Tag) => tag.name === "@skip") !== undefined;
}

export function isPositiveScenario(scenario: Scenario): boolean {
    return ["不报告"].some((prefix) => scenario.name.startsWith(prefix));
}

export function isNegativeScenario(scenario: Scenario): boolean {
    return ["报告"].some((prefix) => scenario.name.startsWith(prefix));
}

export function isSkipRule(rule: Rule): boolean {
    return rule.feature.tags.find((tag: Tag) => tag.name === "@skip") !== undefined;
}

export function expandOutlineToScenarios(outline: Scenario): Scenario[] {
    if (outline.examples.length === 0) return [outline];
    const scenarios: Scenario[] = [];
    for (const example of outline.examples) {
        for (const row of example.tableBody) {
            const scenario = JSON.parse(JSON.stringify({
                ...outline,
                id: `${outline.id}-${row.id}`,
            })) as Scenario;
            for (let i = 0; i < row.cells.length; i++) {
                const key = example.tableHeader?.cells[i].value;
                const value = row.cells[i].value;
                const placeholder = `<${key}>`;
                scenario.name = scenario.name.replace(placeholder, value)
                scenario.steps.forEach(step => {
                    if (step.docString) {
                        step.docString.content = step.docString.content.replace(placeholder, value);
                    } else if (step.dataTable) {
                        step.dataTable.rows.forEach(r => {
                            r.cells.forEach(c => {
                                c.value = c.value.replace(placeholder, value);
                            });
                        });
                    }
                    step.text = step.text.replace(placeholder, value);
                })
            }
            scenarios.push(scenario);
        }
    }
    return scenarios;
}

interface SourceFile {
    name: string;
    content: string;
}

export function getContexts(scenario: Scenario): Step[] {
    const contexts: Step[] = [];
    for (const step of scenario.steps) {
        if (isGivenStep(step) || isAndStep(step)) {
            contexts.push(step);
        } else break;
    }
    return contexts;
}

export function getAllSourceFileNameAndContent(scenario: Scenario): SourceFile[] {
    const result = new Array<SourceFile>();
    getContexts(scenario)
        .forEach((step) => {
            const name = step.text.match(/有一个源码文件 "(.*)"，内容如下:/)?.[1];
            const content = step.docString?.content;
            if (name && content) {
                result.push({name, content});
            }
        });
    return result;
}

export function getOutcomes(scenario: Scenario): Step[] {
    return scenario.steps.slice(scenario.steps.findIndex(isThenStep));
}