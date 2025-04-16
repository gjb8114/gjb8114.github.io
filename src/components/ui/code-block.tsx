'use client';

import React from 'react';
import {Highlight, themes} from 'prism-react-renderer';
import {cn} from '@/lib/utils';
import {Prism} from '@/lib/syntax-highlighter';

// Define supported languages manually since the Language type might be causing issues
type SupportedLanguage =
    'cpp'
    | 'c'
    | 'javascript'
    | 'typescript'
    | 'jsx'
    | 'tsx'
    | 'bash'
    | 'sh'
    | 'json'
    | 'yaml'
    | 'css'
    | 'html'
    | 'markdown'
    | 'gherkin'
    | 'ruby'
    | 'plaintext';

export interface Annotation {
    line: number;
    column: number;
    message: string;
    severity: 'warning' | 'error' | 'note' | 'success';
}

interface CodeBlockProps {
    code: string;
    language?: string;
    className?: string;
    annotations?: Annotation[];
}

export function CodeBlock({
                              code,
                              language = 'cpp',
                              className = '',
                              annotations = []
                          }: CodeBlockProps) {
    // Normalize language identifiers
    let safeLanguage = language.toLowerCase() as SupportedLanguage;

    // Handle common aliases
    if (safeLanguage === 'sh') safeLanguage = 'bash';
    if (!safeLanguage) safeLanguage = 'plaintext';

    return (
        <div className={cn("bg-blue-50 my-2 rounded-md overflow-auto", className)}>
            <Highlight
                theme={themes.github}
                code={code}
                language={safeLanguage}
                prism={Prism}
            >
                {({className: highlightClassName, style, tokens, getLineProps, getTokenProps}) => (
                    <pre className={cn(highlightClassName, "p-4 text-sm")}
                         style={{...style, background: 'transparent'}}>
            {tokens.map((line, lineIndex) => {
                const lineNumber = lineIndex + 1;
                const lineAnnotations = annotations?.filter(a => a.line === lineNumber) || [];

                // Get the full line text for column calculation
                const lineText = line.map(token => token.content).join('');

                return (
                    <div key={lineIndex} className="relative">
                        <div {...getLineProps({line})}
                             className={cn(
                                 "flex",
                                 lineAnnotations.length > 0 && "bg-opacity-20",
                                 lineAnnotations.some(a => a.severity === 'error') && "bg-red-500/10",
                                 lineAnnotations.some(a => a.severity === 'warning') && "bg-yellow-500/10",
                                 lineAnnotations.some(a => a.severity === 'note') && "bg-blue-500/10",
                                 lineAnnotations.some(a => a.severity === 'success') && "bg-green-500/10"
                             )}
                        >
                    <span
                        className="flex-shrink-0 text-xs text-muted-foreground w-6 pr-2 select-none text-right pt-[.2rem]">
                      {lineNumber}
                    </span>
                            <span className="flex-grow relative">
                      {/* Column position indicators */}
                                {lineAnnotations.map((annotation, idx) => {
                                    // Ensure column is within bounds
                                    const columnPos = Math.min(
                                        Math.max(annotation.column - 1, 0),
                                        lineText.length
                                    );

                                    return (
                                        <span
                                            key={`col-${idx}`}
                                            className={cn(
                                                "absolute h-full -mb-px opacity-50",
                                                annotation.severity === 'error' && "bg-red-500",
                                                annotation.severity === 'warning' && "bg-yellow-500",
                                                annotation.severity === 'note' && "bg-blue-500",
                                                annotation.severity === 'success' && "bg-green-500"
                                            )}
                                            style={{
                                                width: `calc(1ch)`,
                                                left: `calc(${columnPos}ch)`,
                                                zIndex: 10
                                            }}
                                        />
                                    );
                                })}

                                {line.map((token, tokenKey) => {
                                    const tokenProps = getTokenProps({token});
                                    return <span key={tokenKey} {...tokenProps} />;
                                })}
                    </span>
                        </div>
                        {/* Render annotations on a new line */}
                        {lineAnnotations.length > 0 && (
                            <div className="flex pl-8">
                                <span className="flex-shrink-0 w-6"></span>
                                <span className="flex-grow pt-0.5 pb-1">
                        <span className="flex flex-wrap gap-2">
                          {lineAnnotations.map((annotation, index) => (
                              <span
                                  key={index}
                                  className={cn(
                                      "rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap shadow-md",
                                      annotation.severity === 'error' && "bg-red-600 text-white",
                                      annotation.severity === 'warning' && "bg-yellow-600 text-white",
                                      annotation.severity === 'note' && "bg-blue-600 text-white",
                                      annotation.severity === 'success' && "bg-green-600 text-white"
                                  )}
                              >
                              {`${annotation.message}`}
                            </span>
                          ))}
                        </span>
                      </span>
                            </div>
                        )}
                    </div>
                );
            })}
          </pre>
                )}
            </Highlight>
        </div>
    );
}