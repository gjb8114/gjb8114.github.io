'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { search, SearchDocument } from '@/lib/search';
import { Rule } from '@/lib/rules';
import {Badge} from "@/components/ui/badge";

interface SearchProps {
  initialData: Rule[]; // Pre-fetched data passed from server component
}

export default function Search({ initialData }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchDocument[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  // Handle search
  useEffect(() => {
    let mounted = true;

    async function performSearch() {
      if (query.trim().length > 0) {
        setIsLoading(true);
        try {
          const searchResults = await search(query, initialData);
          if (mounted) {
            setResults(searchResults);
            setIsOpen(true);
          }
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }

    performSearch();
    return () => {
      mounted = false;
    };
  }, [query, initialData]);

  // Handle result selection
  const handleResultClick = (result: SearchDocument) => {
    setQuery('');
    setIsOpen(false);

    if (result.uri) {
      router.push(result.uri);
    } else {
      console.error('Search result has no valid path or ID:', result);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="编号, 标题, 内容 ..."
        className="w-full p-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 2 && setIsOpen(true)}
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
        {isLoading && (
          <svg
            className="animate-spin absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg max-h-96 overflow-y-auto z-10">
          <ul className="py-1">
            {results.map((result) => (
              <li
                key={result.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-center gap-x-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-normal">
                    <span className="text-muted-foreground">{result.category}</span>
                    <span className="text-xs font-medium">{result.id.toUpperCase()}</span>
                  </Badge>
                </div>
                <div className="px-1">
                  <p className="font-medium">{result.title}</p>
                  <p className="bg-muted py-1 px-2 min-h-4 rounded text-xs text-gray-600 truncate">
                    {result.content.substring(0, 80)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && query.trim().length > 2 && results.length === 0 && (
        <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg p-4">
          <p className="text-gray-500">No results found</p>
        </div>
      )}
    </div>
  );
}