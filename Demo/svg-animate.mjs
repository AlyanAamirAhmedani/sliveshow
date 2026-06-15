/**
 * svg-animate.mjs
 * A standalone mystmd / Jupyter Book 2 plugin for SVG animations.
 *
 * Adds a {svg-animate} directive that embeds data-animate style SVG
 * animations using SVG.js. Works by packaging the animation into a
 * self-contained data URI iframe — no external files, no mystmd
 * internal imports, robust against future mystmd updates.
 *
 * Usage in a markdown cell or .md file:
 *
 *   :::{svg-animate}
 *   :height: 300px
 *   <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
 *     <circle id="c1" cx="150" cy="150" r="60" fill="steelblue"/>
 *   </svg>
 *   <!--
 *   {
 *     "setup": [{
 *       "element": "#c1",
 *       "modifier": "attr",
 *       "parameters": [{ "fill": "tomato", "r": 100 }],
 *       "duration": 1500,
 *       "begin": 0
 *     }]
 *   }
 *   -->
 *   :::
 *
 * Register in myst.yml:
 *   project:
 *     plugins:
 *       - svg-animate.mjs
 */

// Pinned to a specific version for stability.
// Upgrade intentionally by bumping this string.
const SVG_JS_CDN = 'https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.1.2/dist/svg.min.js';

/**
 * Build a fully self-contained HTML page that runs the data-animate animation.
 * This page is embedded as a data URI inside an iframe, so it is completely
 * isolated from the parent page's CSS and JS.
 */
function buildAnimationPage(svgContent, bgColor) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: ${bgColor};
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  svg { max-width: 100%; max-height: 100%; }
</style>
<script src="${SVG_JS_CDN}"></script>
</head>
<body>
<div data-animate>
${svgContent}
</div>
<script>
(function () {
  function tryAnimate() {
    if (typeof SVG === 'undefined') { setTimeout(tryAnimate, 100); return; }
    document.querySelectorAll('[data-animate]').forEach(function (el) {
      var match = el.innerHTML.match(/<!--([\\s\\S]*?)-->/);
      if (!match) return;
      var config;
      try { config = JSON.parse(match[1].trim()); } catch (e) {
        console.error('svg-animate: invalid JSON config', e);
        return;
      }
      var svgEl = el.querySelector('svg');
      if (!svgEl) return;
      var draw = SVG(svgEl);
      (config.setup || []).forEach(function (step) {
        var target = draw.findOne(step.element);
        if (!target) return;
        var anim = target.animate(step.duration || 1000, step.begin || 0);
        if (typeof anim[step.modifier] === 'function') {
          anim[step.modifier](step.parameters[0]);
        }
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryAnimate);
  } else {
    tryAnimate();
  }
})();
</script>
</body>
</html>`;
}

/**
 * Encode a unicode string as base64.
 * Works in Node.js 16+ and modern browsers.
 */
function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach(function (b) { binary += String.fromCharCode(b); });
  return btoa(binary);
}

const svgAnimateDirective = {
  name: 'svg-animate',
  doc: [
    'Embed an SVG animation using data-animate syntax (SVG.js).',
    'The animation runs in a self-contained iframe and works in',
    'mystmd jupyterbooks, Jupyter Book 2, and static HTML exports.',
  ].join(' '),
  alias: ['animate-svg'],
  arg: {
    type: String,
    doc: 'Optional accessible title for the animation frame.',
  },
  options: {
    width: {
      type: String,
      doc: 'Width of the animation frame in CSS units (default: 100%).',
    },
    height: {
      type: String,
      doc: 'Height of the animation frame in CSS units (default: 300px).',
    },
    background: {
      type: String,
      doc: 'Background colour of the animation frame (default: transparent).',
    },
  },
  body: {
    type: String,
    required: true,
    doc: [
      'SVG element with animation config. Place the JSON config inside',
      'an HTML comment (<!-- ... -->) inside or after the SVG, following',
      'the data-animate convention.',
    ].join(' '),
  },
  run(data) {
    const svgContent = data.body || '';
    const width     = (data.options && data.options.width)      || '100%';
    const height    = (data.options && data.options.height)     || '300px';
    const bg        = (data.options && data.options.background) || 'transparent';
    const title     = data.arg || 'SVG Animation';

    const htmlPage = buildAnimationPage(svgContent, bg);
    const encoded  = toBase64(htmlPage);
    const src      = 'data:text/html;base64,' + encoded;

    return [{
      type:   'iframe',
      src:    src,
      width:  width,
      height: height,
      title:  title,
    }];
  },
};

const plugin = {
  name:    'SVG Animate',
  author:  'Alyan Ahmedani',
  license: 'MIT',
  directives: [svgAnimateDirective],
};

export default plugin;
