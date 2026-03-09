import { renderMarkdown } from './markdown';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function stripMdExtension(name: string) {
  return name.replace(/\.md$/i, '') || 'document';
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// Standalone HTML document builder
// ---------------------------------------------------------------------------

const HTML_STYLES = `
  :root {
    --neutral-900: hsl(225, 9%, 9%);
    --neutral-700: hsl(216, 9%, 23%);
    --neutral-300: hsl(222, 9%, 78%);
    --neutral-200: hsl(0, 0%, 89%);
    --neutral-100: hsl(0, 0%, 96%);
    --zinc-900:    hsl(216, 8%, 12%);
    --zinc-800:    hsl(220, 7%, 18%);
    --zinc-500:    hsl(213, 4%, 51%);
    --gray-600:    hsl(216, 8%, 38%);
    --orange-500:  hsl(13, 75%, 58%);
    --orange-300:  hsl(21, 86%, 67%);

    --bg:              #fff;
    --text-body:       var(--zinc-500);
    --text-heading:    var(--neutral-700);
    --bg-code:         var(--neutral-200);
    --color-code:      var(--orange-500);
    --bg-pre:          var(--neutral-100);
    --bg-blockquote:   var(--neutral-100);
    --border-bq:       var(--orange-500);
    --border-hr:       var(--neutral-300);
    --bg-table-head:   var(--neutral-200);
    --border-table:    var(--neutral-300);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg:           var(--neutral-900);
      --text-body:    var(--neutral-300);
      --text-heading: #fff;
      --bg-code:      var(--zinc-800);
      --color-code:   var(--orange-300);
      --bg-pre:       var(--zinc-800);
      --bg-blockquote:var(--zinc-800);
      --border-bq:    var(--orange-300);
      --border-hr:    var(--gray-600);
      --bg-table-head:var(--zinc-800);
      --border-table: var(--gray-600);
    }
  }

  /* Explicit theme override — takes priority over prefers-color-scheme */
  :root[data-theme="dark"] {
    --bg:           var(--neutral-900);
    --text-body:    var(--neutral-300);
    --text-heading: #fff;
    --bg-code:      var(--zinc-800);
    --color-code:   var(--orange-300);
    --bg-pre:       var(--zinc-800);
    --bg-blockquote:var(--zinc-800);
    --border-bq:    var(--orange-300);
    --border-hr:    var(--gray-600);
    --bg-table-head:var(--zinc-800);
    --border-table: var(--gray-600);
  }
  :root[data-theme="light"] {
    --bg:              #fff;
    --text-body:       var(--zinc-500);
    --text-heading:    var(--neutral-700);
    --bg-code:         var(--neutral-200);
    --color-code:      var(--orange-500);
    --bg-pre:          var(--neutral-100);
    --bg-blockquote:   var(--neutral-100);
    --border-bq:       var(--orange-500);
    --border-hr:       var(--neutral-300);
    --bg-table-head:   var(--neutral-200);
    --border-table:    var(--neutral-300);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Roboto', sans-serif;
    background: var(--bg);
    color: var(--text-body);
    padding: 2rem;
    max-width: 52rem;
    margin: 0 auto;
    line-height: 1.6;
  }

  h1 { font-family: 'Roboto Slab', serif; font-weight: 700; font-size: 2rem;    color: var(--text-heading); margin-bottom: 1.25rem; }
  h2 { font-family: 'Roboto Slab', serif; font-weight: 300; font-size: 1.75rem; color: var(--text-heading); margin-bottom: 1rem; }
  h3 { font-family: 'Roboto Slab', serif; font-weight: 700; font-size: 1.5rem;  color: var(--text-heading); margin-bottom: 1rem; }
  h4 { font-family: 'Roboto Slab', serif; font-weight: 700; font-size: 1.25rem; color: var(--text-heading); margin-bottom: 0.75rem; }
  h5 { font-family: 'Roboto Slab', serif; font-weight: 700; font-size: 1rem;    color: var(--text-heading); margin-bottom: 0.75rem; }
  h6 { font-family: 'Roboto Slab', serif; font-weight: 700; font-size: 0.875rem;color: var(--text-heading); margin-bottom: 0.5rem; }

  p  { font-size: 0.875rem; line-height: 1.5rem; color: var(--text-body); margin-bottom: 1rem; }

  ul { list-style: disc;    list-style-position: inside; margin-bottom: 1rem; padding-left: 1rem; }
  ol { list-style: decimal; list-style-position: inside; margin-bottom: 1rem; padding-left: 1rem; }
  li { font-size: 0.875rem; line-height: 1.5rem; margin-bottom: 0.5rem; }

  a  { color: var(--orange-500); text-decoration: none; }
  a:hover { text-decoration: underline; }

  strong { font-weight: 700; color: var(--text-heading); }
  em     { font-style: italic; }

  blockquote {
    border-left: 4px solid var(--border-bq);
    background: var(--bg-blockquote);
    font-family: 'Roboto Slab', serif;
    font-weight: 700;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    color: var(--text-body);
  }

  code {
    font-family: 'Roboto Mono', monospace;
    font-size: 0.875rem;
    background: var(--bg-code);
    color: var(--color-code);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
  }

  pre {
    background: var(--bg-pre);
    color: var(--text-heading);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    overflow-x: auto;
  }

  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
    font-size: 0.875rem;
    display: block;
  }

  hr {
    border: none;
    border-top: 1px solid var(--border-hr);
    margin: 1.5rem 0;
  }

  table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
  thead { background: var(--bg-table-head); }
  th    { border: 1px solid var(--border-table); padding: 0.5rem 1rem; text-align: left; font-weight: 700; color: var(--text-heading); }
  td    { border: 1px solid var(--border-table); padding: 0.5rem 1rem; }
  tr    { border-bottom: 1px solid var(--border-table); }

  img   { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }

  @media print {
    body { padding: 0; max-width: 100%; }
    a    { color: var(--orange-500); }
  }
`;

function buildHtmlDocument(markup: string, title: string, isDark = false): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="${isDark ? 'dark' : 'light'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;700&family=Roboto+Mono:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    ${HTML_STYLES}
  </style>
</head>
<body>
  <main>${markup}</main>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Public export functions
// ---------------------------------------------------------------------------

export async function exportAsMarkdown(content: string, filename: string): Promise<void> {
  const name = stripMdExtension(filename);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  triggerDownload(blob, `${name}.md`);
}

export async function exportAsStyledHTML(content: string, filename: string): Promise<void> {
  const { markup } = await renderMarkdown(content);
  const name = stripMdExtension(filename);
  const isDark = document.documentElement.classList.contains('dark');
  const html = buildHtmlDocument(markup, name, isDark);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  triggerDownload(blob, `${name}.html`);
}

export function exportAsPDF(filename: string): void {
  const name = stripMdExtension(filename);

  // Grab the already-rendered preview HTML straight from the DOM
  // (preserves mermaid SVGs, syntax-highlighted code, etc.)
  const previewEl = document.querySelector<HTMLElement>('[data-print-preview]');
  if (!previewEl) return;
  const previewHTML = previewEl.innerHTML;

  const isDark = document.documentElement.classList.contains('dark');

  // Build a fully self-contained HTML document using the standalone styles
  // so the theme is forced correctly regardless of OS/browser settings
  const html = buildHtmlDocument(previewHTML, name, isDark);

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const popup = window.open(url, '_blank', 'width=900,height=700');
  if (!popup) {
    URL.revokeObjectURL(url);
    return;
  }

  popup.onload = () => {
    URL.revokeObjectURL(url);
    popup.focus();
    popup.onafterprint = () => popup.close();
    popup.print();
  };
}
