import {getRuleUri, Rule} from './rules';
import {Document} from 'flexsearch';

// Define the type for our search index
interface SearchIndex {
    rulesDocs?: Document;
}

// Define the search document type
export interface SearchDocument {
    id: string;
    title: string;
    content: string;
    category?: string;
    uri?: string;
}

// Cache the index to prevent rebuilding on each search
const indices: SearchIndex = {};

export function getRulesSearchIndex(rules: Rule[]): Document {
    if (indices.rulesDocs) {
        return indices.rulesDocs;
    }

    const index = new Document({
        tokenize: 'forward',
        encoder: 'CJK',
        document: {
            id: 'id',
            index: ['id', 'title', 'content', 'category'],
            store: ['id', 'title', 'content', 'category', 'uri']
        }
    });

    rules.forEach(rule => {
        index.add({
            id: rule.id,
            title: rule.title,
            content: rule.description,
            category: rule.category,
            uri: getRuleUri(rule)
        });
    });

    indices.rulesDocs = index;
    return index;
}

export async function search(
    query: string,
    features: Rule[]
): Promise<SearchDocument[]> {
    const rulesIndex = getRulesSearchIndex(features);

    // Search the index across all indexed fields and await results
    const [ruleIdResults, titleResults, contentResults, categoryResults] = await Promise.all([
        rulesIndex.search(query, {field: 'id', limit: 20}),
        rulesIndex.search(query, {field: 'title', limit: 20}),
        rulesIndex.search(query, {field: 'content', limit: 20}),
        rulesIndex.search(query, {field: 'category', limit: 20})
    ]);

    // Process search results
    const results: SearchDocument[] = [];
    const ids = new Set<string>();

    type Results = {
        result: string[];
    }[];

    // intended put in the order of ruleId, title, category, content
    // which make results matched the ruleId at front
    [...ruleIdResults as Results, ...titleResults as Results, ...categoryResults as Results, ...contentResults as Results].forEach(resultSet => {
        resultSet.result.forEach((id: string) => {
            if (!ids.has(id)) {
                ids.add(id);
                const doc = rulesIndex.get(id) as unknown as SearchDocument;
                doc.id = id;
                if (doc) results.push(doc);
            }
        });
    });

    return results;
}