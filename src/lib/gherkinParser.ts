import {AstBuilder, GherkinClassicTokenMatcher, Parser} from '@cucumber/gherkin';
import {Rule} from './rules';
import * as fs from 'fs';
import * as path from 'path';
import {IdGenerator} from "@cucumber/messages";

/**
 * Parse a Gherkin feature file into our Feature interface
 */
export function parseFeatureFile(filePath: string): Rule {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        const uuidFn = IdGenerator.uuid();
        const builder = new AstBuilder(uuidFn);
        const matcher = new GherkinClassicTokenMatcher(); // or Gherkin.GherkinInMarkdownTokenMatcher()
        const parser = new Parser(builder, matcher);

        const document = parser.parse(content);

        if (!document || !document.feature) {
            throw new Error(`Invalid feature file: ${filePath}`);
        }

        const feature = document.feature;

        // Extract metadata from file path to determine categories
        const pathParts = filePath.split(path.sep);
        const featureIndex = pathParts.indexOf('features');

        let part: 'common' | 'cpp' = 'common';
        let category = '';

        if (featureIndex >= 0 && pathParts.length > featureIndex + 1) {
            part = pathParts[featureIndex + 1] as 'common' | 'cpp';

            if (pathParts.length > featureIndex + 2) {
                category = pathParts[featureIndex + 2];
            }
        }

        // Determine rule ID from filename
        const filename = path.basename(filePath);
        const ruleId = filename.split('.')[0].toLowerCase();
        const title = feature.name.replace(/^([ra]-[\d-]+)/i, '').trim();

        return {
            id: ruleId,
            title: title,
            description: feature.description || '',
            feature,
            path: filePath.replace(/^.*\/features\//, ''),
            category: category,
            part: part,
            severity: determineSeverity(ruleId),
        };
    } catch (error) {
        console.error(`Error parsing feature file ${filePath}:`, error);
        throw error;
    }
}

function compareId(a: Rule, b: Rule): number {
    const digitsA = a.id.split('-').slice(1);
    const digitsB = b.id.split('-').slice(1);
    for (let i = 0; i < Math.min(digitsA.length, digitsA.length); i++) {
        const numA = parseInt(digitsA[i], 10);
        const numB = parseInt(digitsB[i], 10);
        if (numA !== numB) {
            return numA - numB;
        }
    }
    return 0;
}

/**
 * Parse all feature files in a directory (recursively)
 */
export async function parseAllFeatures(baseDir: string): Promise<Rule[]> {
    const features: Rule[] = [];
    const dirs = ['common', 'cpp'];

    for (const dir of dirs) {
        const featuresDir = path.join(baseDir, 'features', dir);
        await processDirectory(featuresDir, features);
    }
    return features.sort((a, b) => {
        if (a.severity === "强制" && b.severity === "建议")
            return -1;
        else if (a.severity === "建议" && b.severity === "强制")
            return 1;
        else
            return compareId(a, b);
    });
}

/**
 * Process a directory recursively to find feature files
 */
async function processDirectory(dir: string, features: Rule[]): Promise<void> {
    try {
        const entries = fs.readdirSync(dir, {withFileTypes: true});

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await processDirectory(fullPath, features);
            } else if (entry.name.endsWith('.feature')) {
                features.push(parseFeatureFile(fullPath));
            }
        }
    } catch (error) {
        console.error(`Error processing directory ${dir}:`, error);
    }
}

function determineSeverity(id: string): '强制' | '建议' {
    return id[0].toLowerCase() === 'r' ? '强制' : '建议';
}