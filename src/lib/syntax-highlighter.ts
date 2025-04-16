import { Prism } from 'prism-react-renderer';

// Add Gherkin language definition to Prism
(Prism.languages.gherkin = {
  comment: {
    pattern: /(^|[^\\])#.*/,
    lookbehind: true,
  },
  string: {
    pattern: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/,
    inside: {
      'string-delimiter': {
        pattern: /^"|"$/,
        alias: 'punctuation',
      },
    },
  },
  keyword: {
    pattern: /((?:^|\r?\n|\r)[ \t]*(?:Scenario(?: Outline)?|Feature|Background|Examples|Given|When|Then|And|But))(?=:|$)/,
    lookbehind: true,
  },
  table: {
    pattern: /\|(.+)\|/,
    inside: {
      'table-bar': {
        pattern: /\|/,
        alias: 'punctuation',
      },
    },
  },
  tag: {
    pattern: /@\S*/,
    alias: 'keyword',
  },
  'step-placeholder': {
    pattern: /<(.+?)>/,
    alias: 'variable',
  },
} as Prism.Grammar);

// Define a complete Bash syntax highlighting
(Prism.languages.bash = {
  'shebang': {
    pattern: /^#!\s*\/.*/,
    alias: 'important'
  },
  'comment': {
    pattern: /(^|[^"{\\])#.*/,
    lookbehind: true
  },
  'string': [
    {
      pattern: /((?:^|[^<])<<\s*)["']?(\w+?)["']?\s*\r?\n(?:[\s\S])*?\r?\n\2/,
      lookbehind: true,
      greedy: true,
      inside: {
        'bash': {
          pattern: /(.+)/
        }
      }
    },
    {
      pattern: /(["'])(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|(?!\1)[^\\`$])*\1/,
      greedy: true
    },
    {
      pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
      greedy: true
    }
  ],
  'variable': [
    {
      pattern: /\$(?:\w+|[#?*!@$])/
    },
    {
      pattern: /\$\{[^}]+\}/,
      inside: {
        'operator': /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
        'punctuation': /[\[\]]/,
        'environment': {
          pattern: /\w+/
        }
      }
    }
  ],
  'function-name': {
    pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
    lookbehind: true,
    alias: 'function'
  },
  'keyword': {
    pattern: /(^|[\s;|&])(?:if|then|else|elif|fi|for|while|in|do|done|case|esac|function)(?=[\s;|&]|$)/,
    lookbehind: true
  },
  'builtin': {
    pattern: /(^|[\s;|&])(?:let|:|\.|cd|echo|cat|export|pwd|sudo|make|mkdir|rm|rmdir|cp|mv|touch|grep|ls|ps|kill|chmod|chown)(?=[\s;|&]|$)/,
    lookbehind: true
  },
  'boolean': {
    pattern: /(^|[\s;|&])(?:true|false)(?=[\s;|&]|$)/,
    lookbehind: true
  },
  'operator': {
    pattern: /&&?|\|\|?|==?|!=?|<<<?|>>|>=?|<=?|=~/,
    inside: {
      'punctuation': /[|&]/
    }
  },
  'punctuation': /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/
} as Prism.Grammar);

// Ensure sh is an alias to bash
Prism.languages.sh = Prism.languages.bash;

export { Prism };