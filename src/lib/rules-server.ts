import {Rule} from './rules';
import {parseAllFeatures} from "@/lib/gherkinParser";
import {PROJECT_ROOT} from "@/lib/constants-server";

export async function getAllRules(): Promise<Rule[]> {
    return parseAllFeatures(PROJECT_ROOT);
}

export async function getRulesOfPart(part: 'common' | 'cpp'): Promise<Rule[]> {
    const rules = await getAllRules();
    return rules.filter(feature => feature.part === part);
}

export async function getRulesByCategory(part: 'common' | 'cpp'): Promise<Record<string, Rule[]>> {
    const rules = await getRulesOfPart(part);
    const categories: Record<string, Rule[]> = {};

    rules.forEach(rule => {
        const category = rule.category;
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(rule);
    });

    return categories;
}

export async function getRulesById(id: string): Promise<Rule | null> {
    const features = await getAllRules();
    return features.find(feature => feature.id === id) || null;
}

export async function getRulesByPath(path: string): Promise<Rule | null> {
    const features = await getAllRules();
    return features.find(feature => feature.path.startsWith(path)) || null;
}