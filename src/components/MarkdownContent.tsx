import React from 'react';
import {MDXRemote} from 'next-mdx-remote/rsc';
import {CodeBlock} from '@/components/ui/code-block';

interface MarkdownContentProps {
    content: string;
}

const shadcnComponents = {
    h1: (props: React.ComponentProps<"h1">) => <h1
        className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 mt-8" {...props} />,
    h2: (props: React.ComponentProps<"h2">) => <h2
        className="scroll-m-20 text-3xl font-semibold tracking-tight mt-10 mb-4" {...props} />,
    h3: (props: React.ComponentProps<"h3">) => <h3
        className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3" {...props} />,
    h4: (props: React.ComponentProps<"h4">) => <h4
        className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-2" {...props} />,
    h5: (props: React.ComponentProps<"h5">) => <h5
        className="scroll-m-20 text-lg font-semibold tracking-tight mt-4 mb-2" {...props} />,
    h6: (props: React.ComponentProps<"h6">) => <h6
        className="scroll-m-20 text-base font-semibold tracking-tight mt-4 mb-2" {...props} />,
    p: (props: React.ComponentProps<"p">) => <p className="leading-7 [&:not(:first-child)]:mt-6 mb-4" {...props} />,
    a: (props: React.ComponentProps<"a">) => <a
        className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800" {...props} />,
    ul: (props: React.ComponentProps<"ul">) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />,
    ol: (props: React.ComponentProps<"ol">) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />,
    li: (props: React.ComponentProps<"li">) => <li className="mt-2" {...props} />,
    blockquote: (props: React.ComponentProps<"blockquote">) => (
        <blockquote className="mt-6 border-l-2 border-gray-300 pl-6 italic text-gray-600" {...props} />
    ),
    hr: (props: React.ComponentProps<"hr">) => <hr className="my-8 border-gray-200" {...props} />,
    table: (props: React.ComponentProps<"table">) => (
        <div className="my-6 w-full overflow-x-auto">
            <table className="w-full border-collapse" {...props} />
        </div>
    ),
    tr: (props: React.ComponentProps<"tr">) => <tr
        className="m-0 border-t border-gray-300 p-0 even:bg-gray-50" {...props} />,
    th: (props: React.ComponentProps<"th">) => <th
        className="border border-gray-200 px-4 py-2 text-left font-bold" {...props} />,
    td: (props: React.ComponentProps<"td">) => <td className="border border-gray-200 px-4 py-2 text-left" {...props} />,
    pre: (props: React.ComponentProps<"pre">) => {
        const code = props.children as React.ReactElement<React.ComponentProps<"code">>;
        const className = code.props?.className || '';
        // Using a regular regex without named capturing groups
        const matches = className.match(/language-(.*)/);
        const language = matches && matches[1] ? matches[1] : 'plaintext';
        const content = code.props?.children as string;
        return (
            <CodeBlock code={content.trim()} language={language} className="mt-6 mb-6 rounded-lg"/>
        );
    },
    code: (props: React.ComponentProps<"code">) => {
        // For inline code
        return props.className ? (
            // This will be handled by pre
            <code {...props} />
        ) : (
            // This is inline code
            <code
                className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold" {...props} />
        );
    }
};

export function MarkdownContent({content}: MarkdownContentProps) {
    return (
        <div className="max-w-none">
            <MDXRemote source={content} components={shadcnComponents}/>
        </div>
    );
}