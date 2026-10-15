import {
  joinPath,
  resolveUrls,
  scopeSelector,
  splitSelectorList,
  stylesheetPath
} from '../deckStyle';

const SCOPE = '.reveal.sliveshow-deck-1';

describe('splitSelectorList', () => {
  it('splits a selector list at its top-level commas', () => {
    expect(splitSelectorList('h1, h2 , .a > .b')).toEqual([
      'h1',
      'h2',
      '.a > .b'
    ]);
  });

  it('keeps commas inside :is(), :has(), attributes and strings', () => {
    expect(
      splitSelectorList(
        '.reveal:has(.a, .b), :is(h1, h2) p, [title="x, y"], a[href=\'1,2\']'
      )
    ).toEqual([
      '.reveal:has(.a, .b)',
      ':is(h1, h2) p',
      '[title="x, y"]',
      "a[href='1,2']"
    ]);
  });
});

describe('scopeSelector', () => {
  it('looks for a plain selector inside the deck', () => {
    expect(scopeSelector('h1', SCOPE)).toBe(`${SCOPE} h1`);
    expect(scopeSelector('.slides > section', SCOPE)).toBe(
      `${SCOPE} .slides > section`
    );
  });

  it("reads .reveal as this deck's .reveal", () => {
    expect(scopeSelector('.reveal .slides', SCOPE)).toBe(`${SCOPE} .slides`);
    expect(scopeSelector('.reveal:has(.ppt-slide)', SCOPE)).toBe(
      `${SCOPE}:has(.ppt-slide)`
    );
    expect(scopeSelector('.reveal.overview section', SCOPE)).toBe(
      `${SCOPE}.overview section`
    );
  });

  it('does not mistake a longer class name for .reveal', () => {
    expect(scopeSelector('.reveal-viewport', SCOPE)).toBe(
      `${SCOPE} .reveal-viewport`
    );
  });

  it('reads :root, html and body as the deck itself', () => {
    expect(scopeSelector(':root', SCOPE)).toBe(SCOPE);
    expect(scopeSelector('html body', SCOPE)).toBe(SCOPE);
    expect(scopeSelector('body .x', SCOPE)).toBe(`${SCOPE} .x`);
    expect(scopeSelector('html .reveal h2', SCOPE)).toBe(`${SCOPE} h2`);
  });
});

describe('joinPath', () => {
  it('resolves a relative path against a folder', () => {
    expect(joinPath('a/b', 'logo.png')).toBe('a/b/logo.png');
    expect(joinPath('a/b', './img/x.png')).toBe('a/b/img/x.png');
    expect(joinPath('a/b', '../x.png')).toBe('a/x.png');
    expect(joinPath('', 'x.png')).toBe('x.png');
  });
});

describe('stylesheetPath', () => {
  it('puts the stylesheet next to the notebook', () => {
    expect(stylesheetPath('week1/lecture.ipynb', 'sliveshow.css')).toBe(
      'week1/sliveshow.css'
    );
    expect(stylesheetPath('top.ipynb', 'sliveshow.css')).toBe('sliveshow.css');
  });

  it('is empty when stylesheets are switched off', () => {
    expect(stylesheetPath('week1/lecture.ipynb', '')).toBe('');
  });
});

describe('resolveUrls', () => {
  const urlFor = async (path: string): Promise<string> => `/files/${path}`;

  it('points relative urls at the files they name', async () => {
    const css =
      '.a { background: url(logo.png) } ' +
      ".b { background: url('img/bg.svg#part') } " +
      '.c { src: url("../fonts/f.woff2?v=2") }';
    expect(await resolveUrls(css, 'talks/week1', urlFor)).toBe(
      '.a { background: url("/files/talks/week1/logo.png") } ' +
        '.b { background: url("/files/talks/week1/img/bg.svg#part") } ' +
        '.c { src: url("/files/talks/fonts/f.woff2") }'
    );
  });

  it('leaves absolute, data and fragment urls alone', async () => {
    const css =
      '.a { background: url(https://example.org/x.png) } ' +
      '.b { background: url(data:image/png;base64,AAAA) } ' +
      '.c { background: url(/static/x.png) } ' +
      '.d { fill: url(#gradient) }';
    expect(await resolveUrls(css, 'talks', urlFor)).toBe(css);
  });
});
