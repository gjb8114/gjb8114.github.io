import {getAllRules} from '@/lib/rules-server';
import Search from './Search';

export default async function SearchWrapper() {
    // Pre-fetch feature data at build time
    const rules = await getAllRules();
    // Pass pre-fetched data to client component
    return <Search initialData={rules}/>;
}