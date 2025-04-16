import Prism from 'prismjs';

// Import additional languages
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-gherkin';
import 'prismjs/components/prism-bash';

// Import a theme (optional)
import 'prismjs/themes/prism-tomorrow.css';

export function highlightAll() {
  if (typeof window !== 'undefined') {
    Prism.highlightAll();
  }
}

export function highlight(code: string, language: string) {
  if (typeof window !== 'undefined') {
    return Prism.highlight(code, Prism.languages[language], language);
  }
  return code;
}