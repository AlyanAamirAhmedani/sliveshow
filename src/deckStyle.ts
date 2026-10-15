/**
 * Per-folder slide styles.
 *
 * A stylesheet saved next to a notebook (`sliveshow.css` unless the settings
 * say otherwise) styles that notebook's slides and nothing else. Prof. Chan,
 * 5/10: "To contain the styles to individual slides, it is better to have a
 * css file to modify slides in the folder" - rather than patching the
 * extension, or injecting a `<style>` from a cell, both of which restyle every
 * notebook on the site.
 *
 * Three things make the file safe to write without knowing sliveshow's DOM:
 *
 * 1. Scoped. Every selector is rewritten to match only inside this deck's
 *    `.reveal` container, so `h1 { color: red }` recolours the slides and not
 *    the notebook beside them, the file browser, or another open deck.
 * 2. Temporary. The rules live in a `<style>` element inside the deck, so
 *    they go when the deck goes.
 * 3. Relative URLs work. `url(logo.png)` is resolved against the stylesheet's
 *    own folder and served by Jupyter, as a browser would for a linked file.
 */

import type { JupyterFrontEnd } from '@jupyterlab/application';

type ContentsManager = JupyterFrontEnd['serviceManager']['contents'];

/** Marks the `<style>` element that carries a deck's stylesheet. */
const STYLE_ATTRIBUTE = 'data-sliveshow-stylesheet';

/** A stylesheet read for a deck, already scoped to it. */
export interface IDeckStylesheet {
  /** Where the file is, relative to the server root and without a drive. */
  path: string;
  /** The file's modification time when it was read. */
  lastModified: string;
  /** The rules, rewritten to apply inside the deck only. */
  css: string;
}

/**
 * Split a selector list at the commas that separate selectors - not the ones
 * inside `:is(a, b)`, `:has(a, b)`, `[title="a, b"]` or a string.
 */
export const splitSelectorList = (list: string): string[] => {
  const selectors: string[] = [];
  let depth = 0;
  let quote = '';
  let start = 0;
  for (let i = 0; i < list.length; i++) {
    const ch = list[i];
    if (quote) {
      if (ch === '\\') {
        i++;
      } else if (ch === quote) {
        quote = '';
      }
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(' || ch === '[') {
      depth++;
    } else if (ch === ')' || ch === ']') {
      depth--;
    } else if (ch === ',' && depth === 0) {
      selectors.push(list.slice(start, i));
      start = i + 1;
    }
  }
  selectors.push(list.slice(start));
  return selectors.map(s => s.trim()).filter(s => s.length > 0);
};

/**
 * Rewrite one selector so that it can only match inside the deck whose
 * `.reveal` container is matched by `scope`.
 *
 * - `.reveal ...` means this deck's `.reveal`, so a stylesheet written
 *   against sliveshow's own selectors keeps working;
 * - `:root`, `html` and `body` stand for the deck too - they are how a
 *   stylesheet sets a font or a variable for everything;
 * - anything else is looked for inside the deck.
 */
export const scopeSelector = (selector: string, scope: string): string => {
  const rest = selector.replace(/^(?:(?::root|html|body)(?![\w-])\s*)+/i, '');
  if (!rest) {
    return scope;
  }
  if (/^\.reveal(?![\w-])/.test(rest)) {
    return scope + rest.slice('.reveal'.length);
  }
  return `${scope} ${rest}`;
};

/**
 * Scope every style rule in `rules`, including those inside `@media`,
 * `@supports`, `@container` and `@layer` blocks. Rules nested inside a style
 * rule are relative to it and are left alone; `@keyframes` and `@font-face`
 * name things rather than select them, so they stay as they are.
 */
const scopeRules = (rules: CSSRuleList, scope: string): void => {
  Array.from(rules).forEach(rule => {
    if (rule instanceof CSSStyleRule) {
      rule.selectorText = splitSelectorList(rule.selectorText)
        .map(selector => scopeSelector(selector, scope))
        .join(', ');
    } else if (rule instanceof CSSGroupingRule) {
      scopeRules(rule.cssRules, scope);
    }
  });
};

/** Scope a whole stylesheet to `scope`, using the browser's own CSS parser. */
export const scopeStylesheet = (css: string, scope: string): string => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  scopeRules(sheet.cssRules, scope);
  return Array.from(sheet.cssRules)
    .map(rule => rule.cssText)
    .join('\n');
};

/** Resolve `relative` against `folder`, both relative to the server root. */
export const joinPath = (folder: string, relative: string): string => {
  const parts = folder ? folder.split('/') : [];
  relative.split('/').forEach(part => {
    if (part === '..') {
      parts.pop();
    } else if (part && part !== '.') {
      parts.push(part);
    }
  });
  return parts.join('/');
};

/**
 * Point every relative `url(...)` in `css` at the file it names, read from
 * `folder`. Absolute URLs (`https:`, `data:`, `/...`) and `#fragment`
 * references are left as they are.
 */
export const resolveUrls = async (
  css: string,
  folder: string,
  urlFor: (path: string) => Promise<string>
): Promise<string> => {
  const pattern = /url\(\s*(['"]?)([^'")]*?)\1\s*\)/g;
  const relative = new Set<string>();
  for (let match = pattern.exec(css); match; match = pattern.exec(css)) {
    if (match[2] && !/^(?:[a-z][\w+.-]*:|\/|#)/i.test(match[2])) {
      relative.add(match[2]);
    }
  }
  const resolved = new Map<string, string>();
  for (const ref of relative) {
    const [file, fragment] = ref.split('#');
    const path = joinPath(folder, file.split('?')[0]);
    resolved.set(
      ref,
      (await urlFor(path)) + (fragment === undefined ? '' : `#${fragment}`)
    );
  }
  return css.replace(pattern, (whole, _quote, ref) =>
    resolved.has(ref) ? `url("${resolved.get(ref)}")` : whole
  );
};

/** The folder a document lives in, relative to the server root. */
const folderOf = (path: string): string => {
  const slash = path.lastIndexOf('/');
  return slash < 0 ? '' : path.slice(0, slash);
};

/**
 * Where the stylesheet for the notebook at `notebookPath` (relative to the
 * server root, no drive) would be. Empty when stylesheets are switched off.
 */
export const stylesheetPath = (
  notebookPath: string,
  fileName: string
): string => (fileName ? joinPath(folderOf(notebookPath), fileName) : '');

/**
 * Read the stylesheet called `fileName` from the folder of `notebookPath`
 * and scope it to `scope`. Resolves to null when the folder has none.
 *
 * The folder is listed first rather than the file fetched blind, so that a
 * notebook without a stylesheet - most of them - does not put a 404 in the
 * console every time a show starts.
 */
export const readDeckStylesheet = async (
  contents: ContentsManager,
  notebookPath: string,
  fileName: string,
  scope: string
): Promise<IDeckStylesheet | null> => {
  if (!fileName) {
    return null;
  }
  // A collaborative session names the document `RTC:folder/file.ipynb`; the
  // stylesheet is an ordinary file, so read it through the default drive.
  const folder = folderOf(contents.localPath(notebookPath));
  const listing = await contents.get(folder, {
    type: 'directory',
    content: true
  });
  const entry = (listing.content as any[]).find(
    item => item.type === 'file' && item.name === fileName
  );
  if (!entry) {
    return null;
  }
  const file = await contents.get(entry.path, {
    type: 'file',
    format: 'text',
    content: true
  });
  const css = await resolveUrls(String(file.content ?? ''), folder, path =>
    contents.getDownloadUrl(path)
  );
  return {
    path: entry.path,
    lastModified: file.last_modified,
    css: scopeStylesheet(css, scope)
  };
};

/**
 * Show `stylesheet` in the deck, replacing whatever an earlier read put
 * there, or take it out when `stylesheet` is null.
 */
export const applyDeckStylesheet = (
  container: HTMLElement,
  stylesheet: IDeckStylesheet | null
): void => {
  let style = container.querySelector(
    `:scope > style[${STYLE_ATTRIBUTE}]`
  ) as HTMLStyleElement | null;
  if (!stylesheet) {
    style?.remove();
    return;
  }
  if (!style) {
    style = document.createElement('style');
    container.insertBefore(style, container.firstChild);
  }
  style.setAttribute(STYLE_ATTRIBUTE, stylesheet.path);
  style.textContent = stylesheet.css;
};
