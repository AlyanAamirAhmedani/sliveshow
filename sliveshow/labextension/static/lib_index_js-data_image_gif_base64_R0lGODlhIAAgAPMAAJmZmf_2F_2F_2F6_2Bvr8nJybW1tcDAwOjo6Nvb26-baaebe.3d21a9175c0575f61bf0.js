"use strict";
(self["webpackChunksliveshow"] = self["webpackChunksliveshow"] || []).push([["lib_index_js-data_image_gif_base64_R0lGODlhIAAgAPMAAJmZmf_2F_2F_2F6_2Bvr8nJybW1tcDAwOjo6Nvb26-baaebe"],{

/***/ "./lib/constants.js"
/*!**************************!*\
  !*** ./lib/constants.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PLUGIN_ID: () => (/* binding */ PLUGIN_ID),
/* harmony export */   SlideType: () => (/* binding */ SlideType),
/* harmony export */   Transition: () => (/* binding */ Transition)
/* harmony export */ });
const PLUGIN_ID = 'sliveshow';
var SlideType;
(function (SlideType) {
    SlideType["SLIDE"] = "slide";
    SlideType["SUBSLIDE"] = "subslide";
    SlideType["FRAGMENT"] = "fragment";
    SlideType["NOTES"] = "notes";
    SlideType["SKIP"] = "skip";
    SlideType["HIDDEN"] = "hidden";
    SlideType["VISIBLE"] = "fragment-visible";
})(SlideType || (SlideType = {}));
var Transition;
(function (Transition) {
    Transition["NONE"] = "none";
    Transition["SLIDE"] = "slide";
    Transition["FADE"] = "fade";
    Transition["ZOOM"] = "zoom";
})(Transition || (Transition = {}));



/***/ },

/***/ "./lib/index.js"
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/rendermime */ "webpack/sharing/consume/default/@jupyterlab/rendermime");
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/settingregistry */ "webpack/sharing/consume/default/@jupyterlab/settingregistry");
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "./lib/constants.js");
/* harmony import */ var _plugin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./plugin */ "./lib/plugin.js");
/* harmony import */ var _mathjax4_plugin__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mathjax4/plugin */ "./lib/mathjax4/plugin.js");
/* harmony import */ var _notebookAnimate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./notebookAnimate */ "./lib/notebookAnimate.js");







/**
 * Initialization data for the sliveshow extension.
 */
const plugin = {
    id: `${_constants__WEBPACK_IMPORTED_MODULE_3__.PLUGIN_ID}:plugin`,
    description: 'JupyterLab extension for animated slideshow.',
    autoStart: true,
    requires: [_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__.INotebookTracker, _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_2__.ISettingRegistry],
    optional: [_jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_1__.ILatexTypesetter],
    activate: (app, nbTracker, settingRegistry, typesetter) => {
        console.log('JupyterLab extension sliveshow is activated!');
        (0,_plugin__WEBPACK_IMPORTED_MODULE_4__["default"])(app, nbTracker, settingRegistry, typesetter);
        if (settingRegistry) {
            settingRegistry
                .load(plugin.id)
                .then(settings => {
                console.log('sliveshow settings loaded:', settings.composite);
            })
                .catch(reason => {
                console.error('Failed to load settings for sliveshow.', reason);
            });
        }
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([plugin, _mathjax4_plugin__WEBPACK_IMPORTED_MODULE_5__["default"], _notebookAnimate__WEBPACK_IMPORTED_MODULE_6__["default"]]);


/***/ },

/***/ "./lib/mathjax4/plugin.js"
/*!********************************!*\
  !*** ./lib/mathjax4/plugin.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MathJax4Typesetter: () => (/* binding */ MathJax4Typesetter),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/rendermime */ "webpack/sharing/consume/default/@jupyterlab/rendermime");
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mathjax_src_mjs_mathjax__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mathjax/src/mjs/mathjax */ "./node_modules/@mathjax/src/mjs/mathjax.js");
/* harmony import */ var _mathjax_src_mjs_input_tex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mathjax/src/mjs/input/tex */ "./node_modules/@mathjax/src/mjs/input/tex.js");
/* harmony import */ var _mathjax_src_mjs_input_tex_html_HtmlConfiguration__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mathjax/src/mjs/input/tex/html/HtmlConfiguration */ "./node_modules/@mathjax/src/mjs/input/tex/html/HtmlConfiguration.js");
/* harmony import */ var _mathjax_src_mjs_output_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mathjax/src/mjs/output/svg */ "./node_modules/@mathjax/src/mjs/output/svg.js");
/* harmony import */ var _mathjax_src_mjs_ui_safe_SafeHandler__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mathjax/src/mjs/ui/safe/SafeHandler */ "./node_modules/@mathjax/src/mjs/ui/safe/SafeHandler.js");
/* harmony import */ var _mathjax_src_mjs_handlers_html_HTMLHandler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mathjax/src/mjs/handlers/html/HTMLHandler */ "./node_modules/@mathjax/src/mjs/handlers/html/HTMLHandler.js");
/* harmony import */ var _mathjax_src_mjs_adaptors_browserAdaptor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @mathjax/src/mjs/adaptors/browserAdaptor */ "./node_modules/@mathjax/src/mjs/adaptors/browserAdaptor.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../constants */ "./lib/constants.js");
// MathJax 4 LaTex typesetter, based on jupyterlab-mathjax3 extension
// https://pypi.org/project/jupyterlab-mathjax3




// the cause of source map parsing warnings (https://github.com/webyonet/react-native-mathjax-html-to-svg/issues/15)





_mathjax_src_mjs_mathjax__WEBPACK_IMPORTED_MODULE_1__.mathjax.handlers.register((0,_mathjax_src_mjs_ui_safe_SafeHandler__WEBPACK_IMPORTED_MODULE_5__.SafeHandler)(new _mathjax_src_mjs_handlers_html_HTMLHandler__WEBPACK_IMPORTED_MODULE_6__.HTMLHandler((0,_mathjax_src_mjs_adaptors_browserAdaptor__WEBPACK_IMPORTED_MODULE_7__.browserAdaptor)())));
class MathJax4Typesetter {
    constructor() {
        const svg = new _mathjax_src_mjs_output_svg__WEBPACK_IMPORTED_MODULE_4__.SVG();
        const tex = new _mathjax_src_mjs_input_tex__WEBPACK_IMPORTED_MODULE_2__.TeX({
            inlineMath: [
                ['$', '$'],
                ['\\(', '\\)']
            ],
            displayMath: [
                ['$$', '$$'],
                ['\\[', '\\]']
            ],
            packages: ['base', 'html'],
            processEscapes: true,
            processEnvironments: true
        });
        this._html = _mathjax_src_mjs_mathjax__WEBPACK_IMPORTED_MODULE_1__.mathjax.document(window.document, {
            InputJax: tex,
            OutputJax: svg,
            // The Safe handler strips class/id attributes that don't match mjx-*
            // by default, which silently removes the \class{...} / \cssId{...}
            // tags used to select formula parts for animation. Allow them.
            safeOptions: {
                allow: {
                    URLs: 'safe',
                    classes: 'all',
                    cssIDs: 'all',
                    styles: 'safe'
                }
            }
        });
    }
    typeset(node) {
        this._html
            .clear()
            .findMath({ elements: [node] })
            .compile()
            .getMetrics()
            .typeset()
            .updateDocument();
    }
}
const plugin = {
    id: `${_constants__WEBPACK_IMPORTED_MODULE_8__.PLUGIN_ID}:mathjax`,
    description: 'MathJax 4 typesetter',
    requires: [],
    provides: _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_0__.ILatexTypesetter,
    activate: () => {
        // Diagnostic logging for 0.1.9: if this line never appears, the
        // typesetter was not requested/activated (token dedup problem).
        console.log('sliveshow: MathJax 4 typesetter registered');
        return new MathJax4Typesetter();
    },
    autoStart: true
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);


/***/ },

/***/ "./lib/notebookAnimate.js"
/*!********************************!*\
  !*** ./lib/notebookAnimate.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/rendermime */ "webpack/sharing/consume/default/@jupyterlab/rendermime");
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./lib/constants.js");
// In-notebook animation renderer.
//
// Makes the SAME markdown cells that animate in the Reveal.js slideshow
// (`<div data-animate>` blocks and `:::{svg-animate}` directives) animate in
// the normal notebook view as well — one source, works in both.
//
// Why this is needed: JupyterLab's markdown sanitizer strips `data-animate`
// attributes, inline `<svg>` and the JSON config comments, so the block
// renders empty (or as literal `:::` text) in the notebook, and nothing
// drives svg.js outside of Reveal. This plugin reads the RAW cell source via
// `sharedModel.getSource()` (the same sanitizer bypass the slideshow uses in
// plugin.ts), re-injects the animation block into the rendered cell, typesets
// any math inside it with the MathJax 4 SVG typesetter (so `mj[...]` /
// `\class` selectors work), and drives the animation with a standalone
// svg.js timeline (src/rajgoel/animateStandalone.js) — no Reveal required.



const ANIMATION_CLASS = 'sliveshow-notebook-animation';
// The rendered-markdown container differs by renderer: stock JupyterLab uses
// `.jp-RenderedMarkdown`, while jupyterlab-myst (used on DIVE) renders into a
// `.jp-RenderedHTMLCommon.not-prose` node without the markdown class. Both
// share jp-RenderedHTMLCommon; keep the specific class first for stock Lab.
const RENDERED_SELECTOR = '.jp-RenderedMarkdown, .jp-RenderedHTMLCommon';
// Diagnostic logging. Silent by default; the integration bugs found on the
// DIVE hub (re-render wipes, renderer differences, stale bundles) were all
// diagnosed from these messages, so they stay available on demand. Turn them
// on from the browser console with:
//   window.SLIVESHOW_DEBUG = true    (then re-render the cell)
const log = (...args) => {
    if (window.SLIVESHOW_DEBUG) {
        console.log('sliveshow-nb:', ...args);
    }
};
/**
 * Extract the animation block from raw markdown source as a detached
 * `<div data-animate>` element. Mirrors the two branches of
 * `addToRevealSlide` in plugin.ts (raw HTML and {svg-animate} directive).
 */
const extractAnimateDiv = (src) => {
    if (src.includes('data-animate')) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = src;
        const animDiv = wrapper.querySelector('[data-animate]');
        if (animDiv) {
            return { div: animDiv, kind: 'html' };
        }
    }
    if (src.includes(':::{svg-animate}')) {
        const directiveMatch = src.match(/:::\{svg-animate\}[^\n]*\n(?::[a-z-]+:[^\n]*\n)*([\s\S]*?):::/);
        if (directiveMatch) {
            const animDiv = document.createElement('div');
            animDiv.setAttribute('data-animate', '');
            animDiv.innerHTML = directiveMatch[1].trim();
            return { div: animDiv, kind: 'directive' };
        }
    }
    return null;
};
/** Climb from a matched node to the top-level block inside `rendered`. */
const topLevelBlock = (rendered, el) => {
    let node = el;
    while (node.parentElement && node.parentElement !== rendered) {
        node = node.parentElement;
    }
    return node;
};
/**
 * Find what the renderer left behind of the animation block, so the animated
 * version can take its place. Which strategy applies is decided by the syntax
 * we extracted, not by guessing from the DOM:
 *
 * - `html`: JupyterLab's sanitizer strips `data-animate` and the inline SVG
 *   but keeps the wrapper `<div>` — now attribute-less.
 * - `directive`: with the stock renderer the `:::{svg-animate}` lines survive
 *   as literal text; with jupyterlab-myst (DIVE) myst parses `:::` itself and
 *   replaces the block with an "Unknown Directive" error component. Either
 *   way the rendered output is the only top-level block mentioning
 *   `svg-animate`, so match on that and replace the whole block.
 */
const findSanitizedLeftover = (rendered, kind) => {
    if (kind === 'html') {
        const divs = rendered.querySelectorAll('div');
        for (let i = 0; i < divs.length; i++) {
            if (divs[i].attributes.length === 0) {
                return divs[i];
            }
        }
        return null;
    }
    const paragraphs = rendered.querySelectorAll('p');
    for (let i = 0; i < paragraphs.length; i++) {
        if ((paragraphs[i].textContent || '').trim().startsWith(':::{svg-animate}')) {
            return topLevelBlock(rendered, paragraphs[i]);
        }
    }
    // No literal `:::` text: jupyterlab-myst parsed the directive itself and
    // owns this output. Caller mounts outside its React tree instead.
    return null;
};
const plugin = {
    id: `${_constants__WEBPACK_IMPORTED_MODULE_2__.PLUGIN_ID}:notebook-animate`,
    description: 'Renders sliveshow SVG/MathJax animations in the notebook view.',
    autoStart: true,
    requires: [_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__.INotebookTracker],
    optional: [_jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_1__.ILatexTypesetter],
    activate: (app, tracker, typesetter) => {
        log('activated; typesetter available:', !!typesetter);
        // per-cell animation handles / visibility observers / hook guards
        const handles = new WeakMap();
        const observers = new WeakMap();
        const waiters = new WeakMap();
        const hooked = new WeakSet();
        const disposeHandle = (cell) => {
            var _a, _b, _c;
            const entry = handles.get(cell);
            (_a = entry === null || entry === void 0 ? void 0 : entry.watchdog) === null || _a === void 0 ? void 0 : _a.disconnect();
            (_b = entry === null || entry === void 0 ? void 0 : entry.handle) === null || _b === void 0 ? void 0 : _b.dispose();
            handles.delete(cell);
            (_c = waiters.get(cell)) === null || _c === void 0 ? void 0 : _c.disconnect();
            waiters.delete(cell);
        };
        const process = (cell, attempt = 0) => {
            var _a, _b, _c, _d;
            try {
                disposeHandle(cell);
                if (cell.isDisposed || !cell.rendered) {
                    log('process: cell disposed or unrendered, skipping');
                    return;
                }
                const rendered = cell.node.querySelector(RENDERED_SELECTOR);
                if (!rendered) {
                    // Renderer output not in the DOM yet. On slow hosts (e.g. DIVE)
                    // this can take well over 5s, so don't poll with a deadline —
                    // watch the cell node and continue whenever the output appears.
                    log('process: waiting for rendered markdown (observer)');
                    (_a = waiters.get(cell)) === null || _a === void 0 ? void 0 : _a.disconnect();
                    const waiter = new MutationObserver(() => {
                        if (cell.isDisposed) {
                            waiter.disconnect();
                            waiters.delete(cell);
                            return;
                        }
                        if (cell.node.querySelector(RENDERED_SELECTOR)) {
                            waiter.disconnect();
                            waiters.delete(cell);
                            process(cell, attempt + 1);
                        }
                    });
                    waiters.set(cell, waiter);
                    waiter.observe(cell.node, { childList: true, subtree: true });
                    return;
                }
                // remove a previous injection (e.g. cell was re-rendered)
                cell.node
                    .querySelectorAll(`.${ANIMATION_CLASS}`)
                    .forEach((el) => el.remove());
                const src = (_d = (_c = (_b = cell.model) === null || _b === void 0 ? void 0 : _b.sharedModel) === null || _c === void 0 ? void 0 : _c.getSource()) !== null && _d !== void 0 ? _d : '';
                const extracted = extractAnimateDiv(src);
                if (!extracted) {
                    return;
                }
                const animDiv = extracted.div;
                log('process: injecting animation block (attempt', attempt + ')');
                const container = document.createElement('div');
                container.classList.add(ANIMATION_CLASS);
                container.title = 'Double-click to replay the animation';
                container.appendChild(animDiv);
                // Swap the sanitized leftovers for the live animation block, keeping
                // the rest of the cell (headings, prose) intact.
                const leftover = findSanitizedLeftover(rendered, extracted.kind);
                if (leftover) {
                    leftover.replaceWith(container);
                }
                else if (extracted.kind === 'directive') {
                    // jupyterlab-myst renders markdown with React and restores its own
                    // DOM after any outside change, so anything injected into the
                    // rendered output is wiped immediately (the watchdog and React end
                    // up fighting in a loop). Mount on the cell node instead — outside
                    // React's tree — so the animation survives. myst still shows its
                    // "Unknown Directive" notice above it, since that block belongs to
                    // React; see the README note recommending the `data-animate` form
                    // in myst environments.
                    log('process: myst-managed output, mounting outside the React tree');
                    cell.node.appendChild(container);
                }
                else {
                    rendered.appendChild(container);
                }
                // drop stray closing ':::' paragraphs from the directive syntax
                rendered.querySelectorAll('p').forEach(p => {
                    if ((p.textContent || '').trim() === ':::') {
                        p.remove();
                    }
                });
                // Math inside the injected block was never seen by the markdown
                // renderer, so typeset it now. With the MathJax 4 typesetter this
                // yields SVG with data-latex attributes, so animation configs can
                // target formula parts via mj[...] / \class / \cssId selectors.
                if (typesetter) {
                    try {
                        typesetter.typeset(container);
                    }
                    catch (e) {
                        console.warn('sliveshow-nb: MathJax typeset failed:', e);
                    }
                }
                // dynamic import keeps svg.js out of the critical startup path
                // (same pattern as the Reveal plugins in plugin.ts)
                __webpack_require__.e(/*! import() */ "lib_rajgoel_animateStandalone_js").then(__webpack_require__.bind(__webpack_require__, /*! ./rajgoel/animateStandalone.js */ "./lib/rajgoel/animateStandalone.js"))
                    .then((mod) => {
                    if (cell.isDisposed || !cell.rendered) {
                        return;
                    }
                    if (!animDiv.isConnected) {
                        // JupyterLab re-renders markdown cells shortly after startup,
                        // which wipes the injection between injecting and the driver
                        // chunk loading — re-inject and try again.
                        log('animate: injection wiped by re-render, retrying');
                        if (attempt < 25) {
                            setTimeout(() => process(cell, attempt + 1), 300);
                        }
                        return;
                    }
                    const handle = mod.animateContainer(animDiv);
                    log('animate: driver started:', !!handle);
                    // Watchdog: if a later re-render removes the injected block,
                    // re-inject so the animation survives edits/re-typesetting.
                    const watchdog = new MutationObserver(() => {
                        if (!container.isConnected) {
                            watchdog.disconnect();
                            if (cell.isDisposed || !cell.rendered) {
                                return;
                            }
                            if (cell.node.isConnected) {
                                log('watchdog: injection removed, re-injecting');
                                process(cell);
                            }
                            else {
                                // the whole cell left the DOM (windowing/slideshow);
                                // re-inject when it becomes visible again
                                disposeHandle(cell);
                                scheduleProcess(cell);
                            }
                        }
                    });
                    watchdog.observe(cell.node, { childList: true, subtree: true });
                    handles.set(cell, { handle, watchdog });
                })
                    .catch((e) => {
                    console.error('sliveshow-nb: failed to load animation driver:', e);
                });
            }
            catch (e) {
                console.error('sliveshow-nb: process failed:', e);
            }
        };
        // Defer processing until the cell is actually in the DOM and visible:
        // windowed notebooks keep off-screen cells detached (MathJax cannot
        // measure them), and this also means animations start when the reader
        // scrolls to them.
        const scheduleProcess = (cell) => {
            var _a;
            (_a = observers.get(cell)) === null || _a === void 0 ? void 0 : _a.disconnect();
            observers.delete(cell);
            if (cell.node.isConnected) {
                process(cell);
                return;
            }
            log('schedule: cell detached, waiting for visibility');
            const observer = new IntersectionObserver(entries => {
                var _a;
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        (_a = observers.get(cell)) === null || _a === void 0 ? void 0 : _a.disconnect();
                        observers.delete(cell);
                        process(cell);
                        break;
                    }
                }
            });
            observer.observe(cell.node);
            observers.set(cell, observer);
        };
        const hookCell = (cell) => {
            var _a, _b, _c, _d, _e;
            try {
                if (((_a = cell === null || cell === void 0 ? void 0 : cell.model) === null || _a === void 0 ? void 0 : _a.type) !== 'markdown' || hooked.has(cell)) {
                    return;
                }
                hooked.add(cell);
                const src = (_d = (_c = (_b = cell.model) === null || _b === void 0 ? void 0 : _b.sharedModel) === null || _c === void 0 ? void 0 : _c.getSource()) !== null && _d !== void 0 ? _d : '';
                if (src.includes('data-animate') || src.includes(':::{svg-animate}')) {
                    log('hooked animated markdown cell; rendered:', cell.rendered);
                }
                (_e = cell.renderedChanged) === null || _e === void 0 ? void 0 : _e.connect(() => {
                    if (cell.rendered) {
                        scheduleProcess(cell);
                    }
                    else {
                        disposeHandle(cell);
                    }
                });
                void Promise.resolve(cell.ready).then(() => {
                    if (!cell.isDisposed && cell.rendered) {
                        scheduleProcess(cell);
                    }
                });
            }
            catch (e) {
                console.error('sliveshow-nb: hookCell failed:', e);
            }
        };
        const hookPanel = (panel) => {
            void panel.context.ready.then(() => {
                var _a;
                log('hooking panel:', panel.context.path, '— cells:', panel.content.widgets.length);
                panel.content.widgets.forEach(hookCell);
                (_a = panel.model) === null || _a === void 0 ? void 0 : _a.cells.changed.connect(() => {
                    // widgets for newly added cells exist by the next frame
                    requestAnimationFrame(() => {
                        if (!panel.isDisposed) {
                            panel.content.widgets.forEach(hookCell);
                        }
                    });
                });
            });
        };
        tracker.forEach(hookPanel);
        tracker.widgetAdded.connect((_, panel) => hookPanel(panel));
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);


/***/ },

/***/ "./lib/plugin.js"
/*!***********************!*\
  !*** ./lib/plugin.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./lib/constants.js");
/* harmony import */ var _slideType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./slideType */ "./lib/slideType.js");
/* harmony import */ var reveal_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reveal.js */ "webpack/sharing/consume/default/reveal.js/reveal.js");
/* harmony import */ var reveal_js_dist_reveal_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! reveal.js/dist/reveal.css */ "./node_modules/reveal.js/dist/reveal.css");
/* harmony import */ var _svgdotjs_svg_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @svgdotjs/svg.js */ "webpack/sharing/consume/default/@svgdotjs/svg.js/@svgdotjs/svg.js");





/** Load a script once per page, resolving when it has executed. */
const loadPluginScript = (url) => new Promise((resolve, reject) => {
    const selector = `script[data-sliveshow-plugin="${CSS.escape(url)}"]`;
    const existing = document.querySelector(selector);
    if (existing) {
        if (existing.dataset.sliveshowLoaded === 'true') {
            resolve();
        }
        else {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error(`Failed to load plugin script: ${url}`)));
        }
        return;
    }
    const script = document.createElement('script');
    script.src = url;
    // keep execution order deterministic when several plugins are listed
    script.async = false;
    script.dataset.sliveshowPlugin = url;
    script.addEventListener('load', () => {
        script.dataset.sliveshowLoaded = 'true';
        resolve();
    });
    script.addEventListener('error', () => reject(new Error(`Failed to load plugin script: ${url}`)));
    document.head.appendChild(script);
});
/** Add a stylesheet once per page. */
const loadPluginStyle = (url) => {
    const selector = `link[data-sliveshow-plugin="${CSS.escape(url)}"]`;
    if (document.querySelector(selector)) {
        return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.dataset.sliveshowPlugin = url;
    document.head.appendChild(link);
};
/**
 * Load every configured Reveal plugin, returning the plugin objects to pass
 * to `Reveal.initialize` together with the config they contribute.
 *
 * A plugin that fails to load is reported and skipped: a bad URL or an
 * offline CDN must never stop the slideshow from starting.
 */
const loadRevealPlugins = async (specs) => {
    var _a;
    const plugins = [];
    const config = {};
    for (const spec of specs !== null && specs !== void 0 ? specs : []) {
        if (!spec || spec.enabled === false) {
            continue;
        }
        if (!spec.name || !spec.script) {
            console.warn('sliveshow: ignoring plugin entry without name/script:', spec);
            continue;
        }
        try {
            await loadPluginScript(spec.script);
            const styles = Array.isArray(spec.css)
                ? spec.css
                : spec.css
                    ? [spec.css]
                    : [];
            styles.forEach(loadPluginStyle);
            const instance = window[spec.name];
            if (!instance) {
                console.warn(`sliveshow: plugin script loaded but window.${spec.name} is undefined ` +
                    `(check the "name" setting for ${spec.script})`);
                continue;
            }
            plugins.push(instance);
            Object.assign(config, (_a = spec.config) !== null && _a !== void 0 ? _a : {});
            console.log(`sliveshow: loaded Reveal plugin ${spec.name}`);
        }
        catch (error) {
            console.error('sliveshow: could not load Reveal plugin', spec.name, error);
        }
    }
    return { plugins, config };
};
const plugin = (app, tracker, settings, typesetter = null) => {
    const { commands } = app;
    // console.log('App:');
    // console.log(app);
    // console.log('Tracker:');
    // console.log(tracker);
    // console.log('Settings:');
    // console.log(settings);
    let panel;
    let windowedPanel;
    let windowingMode;
    let csSettings = {};
    let slideToggle = false;
    let layout = [];
    let slides = [];
    let reveal = null;
    // Animate plugin by Asvin Goel (https://github.com/rajgoel/reveal.js-plugins)
    // does not work when imported at the top
    __webpack_require__.e(/*! import() */ "lib_rajgoel_animate_js").then(__webpack_require__.bind(__webpack_require__, /*! ./rajgoel/animate.js */ "./lib/rajgoel/animate.js"));
    __webpack_require__.e(/*! import() */ "lib_rajgoel_loadcontent_js").then(__webpack_require__.bind(__webpack_require__, /*! ./rajgoel/loadcontent.js */ "./lib/rajgoel/loadcontent.js"));
    // settings
    const loadSettings = (setting) => {
        var _a, _b;
        return {
            dummy: setting.get('dummy').composite,
            default_transition: setting.get('default_transition')
                .composite,
            reveal_plugins: ((_b = (_a = setting.get('reveal_plugins')) === null || _a === void 0 ? void 0 : _a.composite) !== null && _b !== void 0 ? _b : [])
        };
    };
    Promise.all([app.restored, settings.load(`${_constants__WEBPACK_IMPORTED_MODULE_0__.PLUGIN_ID}:plugin`)]).then(([, settingRes]) => {
        csSettings = loadSettings(settingRes);
        // update settings
        settingRes.changed.connect(() => {
            console.log('sliveshow settings updated:');
            csSettings = loadSettings(settingRes);
            console.log(csSettings);
        });
        // main menu commands
        commands.addCommand('slideshow:start-first', {
            label: 'Start from first cell',
            isEnabled: () => !slideToggle,
            execute: async () => {
                try {
                    initReveal();
                }
                catch (e) {
                    console.error('Error starting slideshow:');
                    console.error(e);
                }
            }
        });
        commands.addCommand('slideshow:start-current', {
            label: 'Start from current cell',
            isEnabled: () => !slideToggle,
            execute: () => {
                try {
                    initReveal('current');
                }
                catch (e) {
                    console.error('Error starting slideshow:');
                    console.error(e);
                }
            }
        });
        // placeholder command & emergency exit
        commands.addCommand('slideshow:exit', {
            label: 'Exit slideshow',
            isEnabled: () => slideToggle,
            execute: () => {
                try {
                    exitReveal();
                }
                catch (e) {
                    console.error('Error exiting slideshow: ');
                    console.error(e);
                }
            }
        });
    });
    const initReveal = (mode = 'first') => {
        slideToggle = true;
        layout = [];
        slides = [];
        if (tracker.currentWidget) {
            panel = tracker.currentWidget;
            panel.context.ready.then(async () => {
                miscStyles(panel);
                await getCells(panel).then(async (cells) => {
                    var _a;
                    cells.forEach((cell, index) => {
                        var _a, _b, _c, _d, _e;
                        const slideType = (_a = cell.model.metadata.slideshow) === null || _a === void 0 ? void 0 : _a.slide_type;
                        const transition = (_b = cell.model.metadata.slideshow) === null || _b === void 0 ? void 0 : _b.transition;
                        const transitionOut = (_c = cell.model.metadata.slideshow) === null || _c === void 0 ? void 0 : _c.transition_out;
                        const transitionDuration = (_e = (_d = cell.model.metadata.slideshow) === null || _d === void 0 ? void 0 : _d.transition_duration) !== null && _e !== void 0 ? _e : 0.5;
                        switch (slideType) {
                            case _constants__WEBPACK_IMPORTED_MODULE_0__.SlideType.SLIDE: {
                                layout.push(new _slideType__WEBPACK_IMPORTED_MODULE_1__.Slide(index, cell, transition, transitionOut, transitionDuration));
                                break;
                            }
                            case _constants__WEBPACK_IMPORTED_MODULE_0__.SlideType.SUBSLIDE: {
                                layout.push(layout.length === 0
                                    ? new _slideType__WEBPACK_IMPORTED_MODULE_1__.Slide(index, cell, transition, transitionOut, transitionDuration)
                                    : new _slideType__WEBPACK_IMPORTED_MODULE_1__.Subslide(index, cell, transition, transitionOut, transitionDuration));
                                break;
                            }
                            case _constants__WEBPACK_IMPORTED_MODULE_0__.SlideType.FRAGMENT: {
                                if (layout.length === 0) {
                                    layout.push(new _slideType__WEBPACK_IMPORTED_MODULE_1__.Slide(index, cell, transition, transitionOut, transitionDuration));
                                }
                                else {
                                    // add to last slide
                                    layout[layout.length - 1].fragments.push(new _slideType__WEBPACK_IMPORTED_MODULE_1__.Fragment(index, cell, transition, transitionDuration));
                                }
                                break;
                            }
                            case _constants__WEBPACK_IMPORTED_MODULE_0__.SlideType.SKIP: {
                                break;
                            }
                            // no slide type
                            default: {
                                if (layout.length === 0) {
                                    layout.push(new _slideType__WEBPACK_IMPORTED_MODULE_1__.Slide(index, cell, transition, transitionOut, transitionDuration));
                                }
                                else {
                                    const lastSlide = layout[layout.length - 1];
                                    // add to last fragment
                                    if (lastSlide.fragments.length > 0) {
                                        lastSlide.fragments[lastSlide.fragments.length - 1].children.push(new _slideType__WEBPACK_IMPORTED_MODULE_1__.Cell(index, cell));
                                    }
                                    else {
                                        lastSlide.children.push(new _slideType__WEBPACK_IMPORTED_MODULE_1__.Cell(index, cell));
                                    }
                                }
                                break;
                            }
                        }
                    });
                    for (let i = 0; i < layout.length; i++) {
                        if (layout[i] instanceof _slideType__WEBPACK_IMPORTED_MODULE_1__.Slide) {
                            const slideOuter = document.createElement('section');
                            if (layout[i].transition) {
                                let transition = layout[i].transition;
                                if (layout[i].transitionOut) {
                                    transition += `-in ${layout[i].transitionOut}-out`;
                                }
                                slideOuter.setAttribute('data-transition', transition);
                                if ((_a = layout[i].cell.model.metadata.slideshow) === null || _a === void 0 ? void 0 : _a.slide_dir) {
                                    slideOuter.classList.add(layout[i].cell.model.metadata.slideshow.slide_dir);
                                }
                            }
                            slideOuter.style.transitionDuration = `${layout[i].transitionDuration}s`;
                            const slideInner = document.createElement('section');
                            slideOuter.appendChild(slideInner);
                            addToRevealSlide(slideInner, layout[i]);
                            slides.push(slideOuter);
                        }
                        else if (layout[i] instanceof _slideType__WEBPACK_IMPORTED_MODULE_1__.Subslide) {
                            const subslide = document.createElement('section');
                            addToRevealSlide(subslide, layout[i]);
                            slides[slides.length - 1].appendChild(subslide);
                        }
                    }
                    const revealContainer = document.createElement('div');
                    revealContainer.className = 'reveal';
                    const revealSlides = document.createElement('div');
                    revealSlides.className = 'slides';
                    for (let i = 0; i < slides.length; i++) {
                        revealSlides.appendChild(slides[i]);
                    }
                    revealContainer.appendChild(revealSlides);
                    panel.content.node.insertBefore(revealContainer, panel.content.node.firstChild);
                    // Typeset math inside injected animation blocks. Their content was
                    // re-read from the raw cell source (sanitizer bypass), so MathJax
                    // has never seen it. The MathJax 4 typesetter outputs SVG carrying
                    // data-latex attributes (and \class/\cssId names), which the
                    // Animate plugin targets via mj[...] / CSS selectors — this is what
                    // makes math animation work in a plain markdown cell. Must happen
                    // after the container is in the DOM (font metrics) and before
                    // Reveal initializes the Animate plugin.
                    if (typesetter) {
                        revealSlides.querySelectorAll('[data-animate]').forEach(el => {
                            try {
                                typesetter.typeset(el);
                            }
                            catch (e) {
                                console.warn('sliveshow: MathJax typeset failed:', e);
                            }
                        });
                    }
                    // Third-party Reveal plugins (chalkboard, menu, ...) are fetched
                    // now so their globals exist before Reveal initializes. Their
                    // config is spread first so the settings below stay authoritative
                    // — disableLayout in particular is load-bearing for our layout.
                    const external = await loadRevealPlugins(csSettings.reveal_plugins);
                    reveal = new reveal_js__WEBPACK_IMPORTED_MODULE_2__["default"](revealContainer, {
                        ...external.config,
                        // @ts-expect-error: required for Animate plugin to work
                        animate: {
                            autoplay: true
                        },
                        plugins: [
                            window.RevealLoadContent,
                            window.RevealAnimate,
                            ...external.plugins
                        ],
                        transition: csSettings.default_transition || 'slide',
                        // Fix (A1): disable Reveal's auto-scaling/centering so the slideshow
                        // behaves like a normal page. Otherwise Reveal scales content to fit
                        // the viewport, so browser zoom (Cmd +/-) couldn't enlarge content and
                        // only ballooned the fixed nav arrows, and zoom-out didn't reset.
                        // Layout/centering is handled by our own CSS in style/base.css.
                        disableLayout: true
                    });
                    await reveal.initialize().then(() => {
                        var _a;
                        // Fix (A2): reset scroll to top only on an actual slide change.
                        // Reveal's native `slidechanged` event fires once per navigation,
                        // unlike the previous MutationObserver which reset scrollTop on
                        // every class mutation (fragments, Animate-plugin layout calls) and
                        // so kept yanking the slide back to the top while the user scrolled.
                        reveal === null || reveal === void 0 ? void 0 : reveal.on('slidechanged', (event) => {
                            const current = event === null || event === void 0 ? void 0 : event.currentSlide;
                            if (!current) {
                                return;
                            }
                            current.scrollTop = 0;
                            // For vertical (sub-slide) stacks the scrollable element is the
                            // parent <section>, so reset that too.
                            const parent = current.parentElement;
                            if (parent && parent.tagName === 'SECTION') {
                                parent.scrollTop = 0;
                            }
                        });
                        if (reveal !== null) {
                            if (mode === 'first') {
                                reveal.slide(0);
                            }
                            else if (mode === 'current') {
                                let activeIndex = panel.content.activeCellIndex || 0;
                                while (![
                                    _constants__WEBPACK_IMPORTED_MODULE_0__.SlideType.SLIDE,
                                    _constants__WEBPACK_IMPORTED_MODULE_0__.SlideType.SUBSLIDE,
                                    _constants__WEBPACK_IMPORTED_MODULE_0__.SlideType.FRAGMENT
                                ].includes((_a = cells[activeIndex].model.metadata.slideshow) === null || _a === void 0 ? void 0 : _a.slide_type) &&
                                    activeIndex > 0) {
                                    activeIndex--;
                                }
                                const activeCell = cells[activeIndex];
                                const slides = reveal.getHorizontalSlides();
                                let cellFound = false;
                                // find horizontal slide index
                                for (let i = 0; i < slides.length; i++) {
                                    if (cellFound) {
                                        break;
                                    }
                                    // find vertical slide index
                                    for (let j = 0; j < slides[i].children.length; j++) {
                                        if (slides[i].children[j].innerHTML.includes(activeCell.node.innerHTML)) {
                                            // find fragment index
                                            let fragment = undefined;
                                            if (slides[i].children[j].children.length > 1) {
                                                for (let k = 0; k < slides[i].children[j].children.length; k++) {
                                                    if (slides[i].children[j].children[k].innerHTML.includes(activeCell.node.innerHTML)) {
                                                        fragment = k - 1;
                                                        break;
                                                    }
                                                }
                                            }
                                            reveal.slide(i, j, fragment);
                                            cellFound = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    });
                    // console.log(`Reveal.js plugins: ${reveal.getPlugins()}`);
                });
                document.addEventListener('fullscreenchange', exitRevealEvent);
                await panel.content.node.requestFullscreen();
            });
        }
    };
    const exitRevealEvent = () => {
        if (!document.fullscreenElement) {
            exitReveal();
        }
    };
    const addToRevealSlide = (slide, item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (item.cell.model.type === 'code' &&
            ((_a = item.cell.model.metadata.slideshow) === null || _a === void 0 ? void 0 : _a.hide_code)) {
            item.cell.node.classList.add('hide-code');
        }
        // Handle markdown cells with animation directives
        if (item.cell.model.type === 'markdown') {
            const src = item.cell.model.sharedModel.getSource();
            // Fix (Commit 2): handle raw data-animate HTML in markdown cells
            // bypasses JupyterLab's HTML sanitizer which strips data-animate
            if (src.includes('data-animate')) {
                const animWrapper = document.createElement('div');
                animWrapper.innerHTML = src;
                const animDiv = animWrapper.querySelector('[data-animate]');
                if (animDiv) {
                    const container = document.createElement('div');
                    container.appendChild(animDiv);
                    (_b = item.children) === null || _b === void 0 ? void 0 : _b.forEach((child) => {
                        addToRevealSlide(container, child);
                    });
                    slide.appendChild(container);
                    (_c = item.fragments) === null || _c === void 0 ? void 0 : _c.forEach((fragment) => {
                        const fragContainer = document.createElement('div');
                        fragContainer.classList.add('fragment');
                        addToRevealSlide(fragContainer, fragment);
                        slide.appendChild(fragContainer);
                    });
                    return;
                }
            }
            // Fix (Commit 3): handle {svg-animate} MyST directive in markdown cells
            // Allows the same notebook source to work in both the Reveal.js slideshow
            // and a mystmd / Jupyter Book 2 build without duplication.
            // Parses :::{svg-animate} ... ::: and wraps the body in a data-animate div
            // so the Rajgoel animate plugin handles it identically to raw data-animate HTML.
            if (src.includes(':::{svg-animate}')) {
                const directiveMatch = src.match(/:::\{svg-animate\}[^\n]*\n(?::[a-z-]+:[^\n]*\n)*([\s\S]*?):::/);
                if (directiveMatch) {
                    const body = directiveMatch[1].trim();
                    const animDiv = document.createElement('div');
                    animDiv.setAttribute('data-animate', '');
                    animDiv.innerHTML = body;
                    const container = document.createElement('div');
                    container.appendChild(animDiv);
                    (_d = item.children) === null || _d === void 0 ? void 0 : _d.forEach((child) => {
                        addToRevealSlide(container, child);
                    });
                    slide.appendChild(container);
                    (_e = item.fragments) === null || _e === void 0 ? void 0 : _e.forEach((fragment) => {
                        const fragContainer = document.createElement('div');
                        fragContainer.classList.add('fragment');
                        addToRevealSlide(fragContainer, fragment);
                        slide.appendChild(fragContainer);
                    });
                    return;
                }
            }
        }
        if (item.transition) {
            let transition = item.transition;
            if (item.transitionOut) {
                transition += `-in ${item.transitionOut}-out`;
            }
            slide.setAttribute('data-transition', transition);
            if ((_f = item.cell.model.metadata.slideshow) === null || _f === void 0 ? void 0 : _f.slide_dir) {
                slide.classList.add(item.cell.model.metadata.slideshow.slide_dir);
            }
        }
        slide.style.transitionDuration = `${item.transitionDuration}s`;
        const container = document.createElement('div');
        container.appendChild(item.cell.node);
        (_g = item.children) === null || _g === void 0 ? void 0 : _g.forEach((child) => {
            addToRevealSlide(container, child);
        });
        slide.appendChild(container);
        (_h = item.fragments) === null || _h === void 0 ? void 0 : _h.forEach((fragment) => {
            var _a;
            const fragContainer = document.createElement('div');
            fragContainer.classList.add('fragment');
            switch (fragment.transition) {
                case _constants__WEBPACK_IMPORTED_MODULE_0__.Transition.SLIDE: {
                    fragContainer.classList.add(((_a = fragment.cell.model.metadata.slideshow) === null || _a === void 0 ? void 0 : _a.slide_dir) === 'vertical'
                        ? 'fade-up'
                        : 'fade-left');
                    break;
                }
                case _constants__WEBPACK_IMPORTED_MODULE_0__.Transition.ZOOM: {
                    fragContainer.classList.add('zoom');
                    break;
                }
                case _constants__WEBPACK_IMPORTED_MODULE_0__.Transition.NONE: {
                    fragContainer.classList.add('none');
                    break;
                }
            }
            addToRevealSlide(fragContainer, fragment);
            slide.appendChild(fragContainer);
        });
    };
    // init DOM elements
    /*
    <(sub)slide>
      slides
      children
      fragments
      more children
    </(sub)slide>
    */
    // cell styles
    const customStyle = (item, add = true) => {
        var _a, _b;
        // select both rendered and raw cells
        document
            .querySelectorAll(`
      .cell${item.index} .cm-scroller,
      .cell${item.index} .jp-RenderedMarkdown,
      .cell${item.index} .jp-RenderedText *
    `)
            .forEach(child => {
            if (add) {
                // console.log(window.getComputedStyle(child).fontSize);
                // TODO: put in metadata for cell size, position, etc.
                // placeholder style for not having to squeeze eyes
                child.setAttribute('style', 'font-size: 200%;');
            }
            else {
                child.removeAttribute('style');
            }
        });
        if (!add) {
            item.cell.node.classList.remove(`cell${item.index}`);
        }
        (_a = item.children) === null || _a === void 0 ? void 0 : _a.forEach((child) => {
            customStyle(child, add);
        });
        (_b = item.fragments) === null || _b === void 0 ? void 0 : _b.forEach((fragment) => {
            customStyle(fragment, add);
        });
    };
    const exitReveal = () => {
        slideToggle = false;
        clearAll(panel);
        document.removeEventListener('fullscreenchange', exitRevealEvent);
        panel.content.node.removeChild(panel.content.node.firstChild);
        reveal === null || reveal === void 0 ? void 0 : reveal.destroy();
    };
    // clean up notebook layout for slideshow
    const miscStyles = async (panel, start = true) => {
        var _a, _b, _c;
        if (start) {
            panel.content.addClass('slide-container');
            panel.toolbar.addClass(_constants__WEBPACK_IMPORTED_MODULE_0__.SlideType.HIDDEN);
            // stop windowing update, which messes with cell rendering
            // code ref: jupyterlab-rise
            windowingMode = panel.content.notebookConfig.windowingMode;
            panel.content.notebookConfig = {
                ...panel.content.notebookConfig,
                windowingMode: 'none'
            };
            // detach cells
            windowedPanel = document.querySelector('.slide-container .jp-WindowedPanel-viewport');
            await getCells(panel).then(cells => {
                cells.forEach(cell => {
                    try {
                        windowedPanel.removeChild(cell.node);
                    }
                    catch (e) {
                        /* cell is already detached by Jupyter windowing */
                    }
                });
            });
            // for (let i = 0; i < panel.content.node.children.length; i++) {
            //   panel.content.node.children.item(i)?.classList.add(SlideType.HIDDEN);
            // }
            const footers = document.querySelectorAll('.jp-Notebook-footer');
            for (let i = 0; i < footers.length; i++) {
                (_a = footers.item(i)) === null || _a === void 0 ? void 0 : _a.classList.add(_constants__WEBPACK_IMPORTED_MODULE_0__.SlideType.HIDDEN);
            }
        }
        else {
            panel.content.removeClass('slide-container');
            panel.toolbar.removeClass(_constants__WEBPACK_IMPORTED_MODULE_0__.SlideType.HIDDEN);
            // resume windowing update
            panel.content.notebookConfig = {
                ...panel.content.notebookConfig,
                windowingMode: windowingMode
            };
            // reattach cells
            await getCells(panel).then(cells => {
                cells.forEach(cell => {
                    windowedPanel.appendChild(cell.node);
                });
            });
            for (let i = 0; i < panel.content.node.children.length; i++) {
                (_b = panel.content.node.children.item(i)) === null || _b === void 0 ? void 0 : _b.classList.remove(_constants__WEBPACK_IMPORTED_MODULE_0__.SlideType.HIDDEN);
            }
            const footers = document.querySelectorAll('.jp-Notebook-footer');
            for (let i = 0; i < footers.length; i++) {
                (_c = footers.item(i)) === null || _c === void 0 ? void 0 : _c.classList.remove(_constants__WEBPACK_IMPORTED_MODULE_0__.SlideType.HIDDEN);
            }
        }
    };
    const getCells = async (panel) => {
        let cells = [];
        await panel.context.ready;
        await Promise.all(panel.content.widgets.map(cell => cell.ready)).then(() => {
            cells = [...panel.content.widgets];
        });
        return cells;
    };
    const clearStyles = (node, slideType = true) => {
        if (slideType) {
            node.classList.remove(...Object.values(_constants__WEBPACK_IMPORTED_MODULE_0__.SlideType));
        }
        node.style.removeProperty('transition-duration');
        node.classList.remove(_constants__WEBPACK_IMPORTED_MODULE_0__.SlideType.HIDDEN);
        ['in', 'out'].forEach(dir => {
            node.classList.remove(...Object.values(_constants__WEBPACK_IMPORTED_MODULE_0__.Transition).map(name => `${name}-${dir}`));
            ['left', 'right', 'up', 'down'].forEach(side => {
                node.classList.remove(`${_constants__WEBPACK_IMPORTED_MODULE_0__.Transition.SLIDE}-${dir}-${side}`);
            });
        });
    };
    const clearAll = async (panel) => {
        miscStyles(panel, false);
        layout.forEach(slide => {
            customStyle(slide, false);
        });
        await getCells(panel).then(cells => {
            cells.forEach(cell => {
                clearStyles(cell.node);
                cell.node.classList.remove('hide-code');
            });
        });
    };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);


/***/ },

/***/ "./lib/slideType.js"
/*!**************************!*\
  !*** ./lib/slideType.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Cell: () => (/* binding */ Cell),
/* harmony export */   Fragment: () => (/* binding */ Fragment),
/* harmony export */   Slide: () => (/* binding */ Slide),
/* harmony export */   Subslide: () => (/* binding */ Subslide)
/* harmony export */ });
class Cell {
    constructor(index, cell) {
        this.index = index;
        this.cell = cell;
    }
}
class Slide extends Cell {
    constructor(index, cell, transition, transitionOut, transitionDuration) {
        super(index, cell);
        this.transition = transition;
        this.transitionOut = transitionOut;
        this.transitionDuration = transitionDuration;
        this.fragments = [];
        this.children = [];
    }
}
class Subslide extends Cell {
    constructor(index, cell, transition, transitionOut, transitionDuration) {
        super(index, cell);
        this.transition = transition;
        this.transitionOut = transitionOut;
        this.transitionDuration = transitionDuration;
        this.fragments = [];
        this.children = [];
    }
}
class Fragment extends Cell {
    constructor(index, cell, transition, transitionDuration) {
        super(index, cell);
        this.transition = transition;
        this.transitionDuration = transitionDuration;
        this.children = [];
    }
}



/***/ },

/***/ "data:image/gif;base64,R0lGODlhIAAgAPMAAJmZmf%2F%2F%2F6%2Bvr8nJybW1tcDAwOjo6Nvb26ioqKOjo7Ozs%2FLy8vz8%2FAAAAAAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2FhpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh%2BQQJCgAAACwAAAAAIAAgAAAE5xDISWlhperN52JLhSSdRgwVo1ICQZRUsiwHpTJT4iowNS8vyW2icCF6k8HMMBkCEDskxTBDAZwuAkkqIfxIQyhBQBFvAQSDITM5VDW6XNE4KagNh6Bgwe60smQUB3d4Rz1ZBApnFASDd0hihh12BkE9kjAJVlycXIg7CQIFA6SlnJ87paqbSKiKoqusnbMdmDC2tXQlkUhziYtyWTxIfy6BE8WJt5YJvpJivxNaGmLHT0VnOgSYf0dZXS7APdpB309RnHOG5gDqXGLDaC457D1zZ%2FV%2FnmOM82XiHRLYKhKP1oZmADdEAAAh%2BQQJCgAAACwAAAAAIAAgAAAE6hDISWlZpOrNp1lGNRSdRpDUolIGw5RUYhhHukqFu8DsrEyqnWThGvAmhVlteBvojpTDDBUEIFwMFBRAmBkSgOrBFZogCASwBDEY%2FCZSg7GSE0gSCjQBMVG023xWBhklAnoEdhQEfyNqMIcKjhRsjEdnezB%2BA4k8gTwJhFuiW4dokXiloUepBAp5qaKpp6%2BHo7aWW54wl7obvEe0kRuoplCGepwSx2jJvqHEmGt6whJpGpfJCHmOoNHKaHx61WiSR92E4lbFoq%2BB6QDtuetcaBPnW6%2BO7wDHpIiK9SaVK5GgV543tzjgGcghAgAh%2BQQJCgAAACwAAAAAIAAgAAAE7hDISSkxpOrN5zFHNWRdhSiVoVLHspRUMoyUakyEe8PTPCATW9A14E0UvuAKMNAZKYUZCiBMuBakSQKG8G2FzUWox2AUtAQFcBKlVQoLgQReZhQlCIJesQXI5B0CBnUMOxMCenoCfTCEWBsJColTMANldx15BGs8B5wlCZ9Po6OJkwmRpnqkqnuSrayqfKmqpLajoiW5HJq7FL1Gr2mMMcKUMIiJgIemy7xZtJsTmsM4xHiKv5KMCXqfyUCJEonXPN2rAOIAmsfB3uPoAK%2B%2BG%2Bw48edZPK%2BM6hLJpQg484enXIdQFSS1u6UhksENEQAAIfkECQoAAAAsAAAAACAAIAAABOcQyEmpGKLqzWcZRVUQnZYg1aBSh2GUVEIQ2aQOE%2BG%2BcD4ntpWkZQj1JIiZIogDFFyHI0UxQwFugMSOFIPJftfVAEoZLBbcLEFhlQiqGp1Vd140AUklUN3eCA51C1EWMzMCezCBBmkxVIVHBWd3HHl9JQOIJSdSnJ0TDKChCwUJjoWMPaGqDKannasMo6WnM562R5YluZRwur0wpgqZE7NKUm%2BFNRPIhjBJxKZteWuIBMN4zRMIVIhffcgojwCF117i4nlLnY5ztRLsnOk%2BaV%2BoJY7V7m76PdkS4trKcdg0Zc0tTcKkRAAAIfkECQoAAAAsAAAAACAAIAAABO4QyEkpKqjqzScpRaVkXZWQEximw1BSCUEIlDohrft6cpKCk5xid5MNJTaAIkekKGQkWyKHkvhKsR7ARmitkAYDYRIbUQRQjWBwJRzChi9CRlBcY1UN4g0%2FVNB0AlcvcAYHRyZPdEQFYV8ccwR5HWxEJ02YmRMLnJ1xCYp0Y5idpQuhopmmC2KgojKasUQDk5BNAwwMOh2RtRq5uQuPZKGIJQIGwAwGf6I0JXMpC8C7kXWDBINFMxS4DKMAWVWAGYsAdNqW5uaRxkSKJOZKaU3tPOBZ4DuK2LATgJhkPJMgTwKCdFjyPHEnKxFCDhEAACH5BAkKAAAALAAAAAAgACAAAATzEMhJaVKp6s2nIkolIJ2WkBShpkVRWqqQrhLSEu9MZJKK9y1ZrqYK9WiClmvoUaF8gIQSNeF1Er4MNFn4SRSDARWroAIETg1iVwuHjYB1kYc1mwruwXKC9gmsJXliGxc%2BXiUCby9ydh1sOSdMkpMTBpaXBzsfhoc5l58Gm5yToAaZhaOUqjkDgCWNHAULCwOLaTmzswadEqggQwgHuQsHIoZCHQMMQgQGubVEcxOPFAcMDAYUA85eWARmfSRQCdcMe0zeP1AAygwLlJtPNAAL19DARdPzBOWSm1brJBi45soRAWQAAkrQIykShQ9wVhHCwCQCACH5BAkKAAAALAAAAAAgACAAAATrEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiRMDjI0Fd30%2FiI2UA5GSS5UDj2l6NoqgOgN4gksEBgYFf0FDqKgHnyZ9OX8HrgYHdHpcHQULXAS2qKpENRg7eAMLC7kTBaixUYFkKAzWAAnLC7FLVxLWDBLKCwaKTULgEwbLA4hJtOkSBNqITT3xEgfLpBtzE%2FjiuL04RGEBgwWhShRgQExHBAAh%2BQQJCgAAACwAAAAAIAAgAAAE7xDISWlSqerNpyJKhWRdlSAVoVLCWk6JKlAqAavhO9UkUHsqlE6CwO1cRdCQ8iEIfzFVTzLdRAmZX3I2SfZiCqGk5dTESJeaOAlClzsJsqwiJwiqnFrb2nS9kmIcgEsjQydLiIlHehhpejaIjzh9eomSjZR%2BipslWIRLAgMDOR2DOqKogTB9pCUJBagDBXR6XB0EBkIIsaRsGGMMAxoDBgYHTKJiUYEGDAzHC9EACcUGkIgFzgwZ0QsSBcXHiQvOwgDdEwfFs0sDzt4S6BK4xYjkDOzn0unFeBzOBijIm1Dgmg5YFQwsCMjp1oJ8LyIAACH5BAkKAAAALAAAAAAgACAAAATwEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiUd6GGl6NoiPOH16iZKNlH6KmyWFOggHhEEvAwwMA0N9GBsEC6amhnVcEwavDAazGwIDaH1ipaYLBUTCGgQDA8NdHz0FpqgTBwsLqAbWAAnIA4FWKdMLGdYGEgraigbT0OITBcg5QwPT4xLrROZL6AuQAPUS7bxLpoWidY0JtxLHKhwwMJBTHgPKdEQAACH5BAkKAAAALAAAAAAgACAAAATrEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiUd6GAULDJCRiXo1CpGXDJOUjY%2BYip9DhToJA4RBLwMLCwVDfRgbBAaqqoZ1XBMHswsHtxtFaH1iqaoGNgAIxRpbFAgfPQSqpbgGBqUD1wBXeCYp1AYZ19JJOYgH1KwA4UBvQwXUBxPqVD9L3sbp2BNk2xvvFPJd%2BMFCN6HAAIKgNggY0KtEBAAh%2BQQJCgAAACwAAAAAIAAgAAAE6BDISWlSqerNpyJKhWRdlSAVoVLCWk6JKlAqAavhO9UkUHsqlE6CwO1cRdCQ8iEIfzFVTzLdRAmZX3I2SfYIDMaAFdTESJeaEDAIMxYFqrOUaNW4E4ObYcCXaiBVEgULe0NJaxxtYksjh2NLkZISgDgJhHthkpU4mW6blRiYmZOlh4JWkDqILwUGBnE6TYEbCgevr0N1gH4At7gHiRpFaLNrrq8HNgAJA70AWxQIH1%2BvsYMDAzZQPC9VCNkDWUhGkuE5PxJNwiUK4UfLzOlD4WvzAHaoG9nxPi5d%2BjYUqfAhhykOFwJWiAAAIfkECQoAAAAsAAAAACAAIAAABPAQyElpUqnqzaciSoVkXVUMFaFSwlpOCcMYlErAavhOMnNLNo8KsZsMZItJEIDIFSkLGQoQTNhIsFehRww2CQLKF0tYGKYSg%2BygsZIuNqJksKgbfgIGepNo2cIUB3V1B3IvNiBYNQaDSTtfhhx0CwVPI0UJe0%2Bbm4g5VgcGoqOcnjmjqDSdnhgEoamcsZuXO1aWQy8KAwOAuTYYGwi7w5h%2BKr0SJ8MFihpNbx%2B4Erq7BYBuzsdiH1jCAzoSfl0rVirNbRXlBBlLX%2BBP0XJLAPGzTkAuAOqb0WT5AH7OcdCm5B8TgRwSRKIHQtaLCwg1RAAAOwAAAAAAAAAAAA%3D%3D"
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/gif;base64,R0lGODlhIAAgAPMAAJmZmf%2F%2F%2F6%2Bvr8nJybW1tcDAwOjo6Nvb26ioqKOjo7Ozs%2FLy8vz8%2FAAAAAAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2FhpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh%2BQQJCgAAACwAAAAAIAAgAAAE5xDISWlhperN52JLhSSdRgwVo1ICQZRUsiwHpTJT4iowNS8vyW2icCF6k8HMMBkCEDskxTBDAZwuAkkqIfxIQyhBQBFvAQSDITM5VDW6XNE4KagNh6Bgwe60smQUB3d4Rz1ZBApnFASDd0hihh12BkE9kjAJVlycXIg7CQIFA6SlnJ87paqbSKiKoqusnbMdmDC2tXQlkUhziYtyWTxIfy6BE8WJt5YJvpJivxNaGmLHT0VnOgSYf0dZXS7APdpB309RnHOG5gDqXGLDaC457D1zZ%2FV%2FnmOM82XiHRLYKhKP1oZmADdEAAAh%2BQQJCgAAACwAAAAAIAAgAAAE6hDISWlZpOrNp1lGNRSdRpDUolIGw5RUYhhHukqFu8DsrEyqnWThGvAmhVlteBvojpTDDBUEIFwMFBRAmBkSgOrBFZogCASwBDEY%2FCZSg7GSE0gSCjQBMVG023xWBhklAnoEdhQEfyNqMIcKjhRsjEdnezB%2BA4k8gTwJhFuiW4dokXiloUepBAp5qaKpp6%2BHo7aWW54wl7obvEe0kRuoplCGepwSx2jJvqHEmGt6whJpGpfJCHmOoNHKaHx61WiSR92E4lbFoq%2BB6QDtuetcaBPnW6%2BO7wDHpIiK9SaVK5GgV543tzjgGcghAgAh%2BQQJCgAAACwAAAAAIAAgAAAE7hDISSkxpOrN5zFHNWRdhSiVoVLHspRUMoyUakyEe8PTPCATW9A14E0UvuAKMNAZKYUZCiBMuBakSQKG8G2FzUWox2AUtAQFcBKlVQoLgQReZhQlCIJesQXI5B0CBnUMOxMCenoCfTCEWBsJColTMANldx15BGs8B5wlCZ9Po6OJkwmRpnqkqnuSrayqfKmqpLajoiW5HJq7FL1Gr2mMMcKUMIiJgIemy7xZtJsTmsM4xHiKv5KMCXqfyUCJEonXPN2rAOIAmsfB3uPoAK%2B%2BG%2Bw48edZPK%2BM6hLJpQg484enXIdQFSS1u6UhksENEQAAIfkECQoAAAAsAAAAACAAIAAABOcQyEmpGKLqzWcZRVUQnZYg1aBSh2GUVEIQ2aQOE%2BG%2BcD4ntpWkZQj1JIiZIogDFFyHI0UxQwFugMSOFIPJftfVAEoZLBbcLEFhlQiqGp1Vd140AUklUN3eCA51C1EWMzMCezCBBmkxVIVHBWd3HHl9JQOIJSdSnJ0TDKChCwUJjoWMPaGqDKannasMo6WnM562R5YluZRwur0wpgqZE7NKUm%2BFNRPIhjBJxKZteWuIBMN4zRMIVIhffcgojwCF117i4nlLnY5ztRLsnOk%2BaV%2BoJY7V7m76PdkS4trKcdg0Zc0tTcKkRAAAIfkECQoAAAAsAAAAACAAIAAABO4QyEkpKqjqzScpRaVkXZWQEximw1BSCUEIlDohrft6cpKCk5xid5MNJTaAIkekKGQkWyKHkvhKsR7ARmitkAYDYRIbUQRQjWBwJRzChi9CRlBcY1UN4g0%2FVNB0AlcvcAYHRyZPdEQFYV8ccwR5HWxEJ02YmRMLnJ1xCYp0Y5idpQuhopmmC2KgojKasUQDk5BNAwwMOh2RtRq5uQuPZKGIJQIGwAwGf6I0JXMpC8C7kXWDBINFMxS4DKMAWVWAGYsAdNqW5uaRxkSKJOZKaU3tPOBZ4DuK2LATgJhkPJMgTwKCdFjyPHEnKxFCDhEAACH5BAkKAAAALAAAAAAgACAAAATzEMhJaVKp6s2nIkolIJ2WkBShpkVRWqqQrhLSEu9MZJKK9y1ZrqYK9WiClmvoUaF8gIQSNeF1Er4MNFn4SRSDARWroAIETg1iVwuHjYB1kYc1mwruwXKC9gmsJXliGxc%2BXiUCby9ydh1sOSdMkpMTBpaXBzsfhoc5l58Gm5yToAaZhaOUqjkDgCWNHAULCwOLaTmzswadEqggQwgHuQsHIoZCHQMMQgQGubVEcxOPFAcMDAYUA85eWARmfSRQCdcMe0zeP1AAygwLlJtPNAAL19DARdPzBOWSm1brJBi45soRAWQAAkrQIykShQ9wVhHCwCQCACH5BAkKAAAALAAAAAAgACAAAATrEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiRMDjI0Fd30%2FiI2UA5GSS5UDj2l6NoqgOgN4gksEBgYFf0FDqKgHnyZ9OX8HrgYHdHpcHQULXAS2qKpENRg7eAMLC7kTBaixUYFkKAzWAAnLC7FLVxLWDBLKCwaKTULgEwbLA4hJtOkSBNqITT3xEgfLpBtzE%2FjiuL04RGEBgwWhShRgQExHBAAh%2BQQJCgAAACwAAAAAIAAgAAAE7xDISWlSqerNpyJKhWRdlSAVoVLCWk6JKlAqAavhO9UkUHsqlE6CwO1cRdCQ8iEIfzFVTzLdRAmZX3I2SfZiCqGk5dTESJeaOAlClzsJsqwiJwiqnFrb2nS9kmIcgEsjQydLiIlHehhpejaIjzh9eomSjZR%2BipslWIRLAgMDOR2DOqKogTB9pCUJBagDBXR6XB0EBkIIsaRsGGMMAxoDBgYHTKJiUYEGDAzHC9EACcUGkIgFzgwZ0QsSBcXHiQvOwgDdEwfFs0sDzt4S6BK4xYjkDOzn0unFeBzOBijIm1Dgmg5YFQwsCMjp1oJ8LyIAACH5BAkKAAAALAAAAAAgACAAAATwEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiUd6GGl6NoiPOH16iZKNlH6KmyWFOggHhEEvAwwMA0N9GBsEC6amhnVcEwavDAazGwIDaH1ipaYLBUTCGgQDA8NdHz0FpqgTBwsLqAbWAAnIA4FWKdMLGdYGEgraigbT0OITBcg5QwPT4xLrROZL6AuQAPUS7bxLpoWidY0JtxLHKhwwMJBTHgPKdEQAACH5BAkKAAAALAAAAAAgACAAAATrEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiUd6GAULDJCRiXo1CpGXDJOUjY%2BYip9DhToJA4RBLwMLCwVDfRgbBAaqqoZ1XBMHswsHtxtFaH1iqaoGNgAIxRpbFAgfPQSqpbgGBqUD1wBXeCYp1AYZ19JJOYgH1KwA4UBvQwXUBxPqVD9L3sbp2BNk2xvvFPJd%2BMFCN6HAAIKgNggY0KtEBAAh%2BQQJCgAAACwAAAAAIAAgAAAE6BDISWlSqerNpyJKhWRdlSAVoVLCWk6JKlAqAavhO9UkUHsqlE6CwO1cRdCQ8iEIfzFVTzLdRAmZX3I2SfYIDMaAFdTESJeaEDAIMxYFqrOUaNW4E4ObYcCXaiBVEgULe0NJaxxtYksjh2NLkZISgDgJhHthkpU4mW6blRiYmZOlh4JWkDqILwUGBnE6TYEbCgevr0N1gH4At7gHiRpFaLNrrq8HNgAJA70AWxQIH1%2BvsYMDAzZQPC9VCNkDWUhGkuE5PxJNwiUK4UfLzOlD4WvzAHaoG9nxPi5d%2BjYUqfAhhykOFwJWiAAAIfkECQoAAAAsAAAAACAAIAAABPAQyElpUqnqzaciSoVkXVUMFaFSwlpOCcMYlErAavhOMnNLNo8KsZsMZItJEIDIFSkLGQoQTNhIsFehRww2CQLKF0tYGKYSg%2BygsZIuNqJksKgbfgIGepNo2cIUB3V1B3IvNiBYNQaDSTtfhhx0CwVPI0UJe0%2Bbm4g5VgcGoqOcnjmjqDSdnhgEoamcsZuXO1aWQy8KAwOAuTYYGwi7w5h%2BKr0SJ8MFihpNbx%2B4Erq7BYBuzsdiH1jCAzoSfl0rVirNbRXlBBlLX%2BBP0XJLAPGzTkAuAOqb0WT5AH7OcdCm5B8TgRwSRKIHQtaLCwg1RAAAOwAAAAAAAAAAAA%3D%3D ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
(module) {

module.exports = "data:image/gif;base64,R0lGODlhIAAgAPMAAJmZmf%2F%2F%2F6%2Bvr8nJybW1tcDAwOjo6Nvb26ioqKOjo7Ozs%2FLy8vz8%2FAAAAAAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2FhpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh%2BQQJCgAAACwAAAAAIAAgAAAE5xDISWlhperN52JLhSSdRgwVo1ICQZRUsiwHpTJT4iowNS8vyW2icCF6k8HMMBkCEDskxTBDAZwuAkkqIfxIQyhBQBFvAQSDITM5VDW6XNE4KagNh6Bgwe60smQUB3d4Rz1ZBApnFASDd0hihh12BkE9kjAJVlycXIg7CQIFA6SlnJ87paqbSKiKoqusnbMdmDC2tXQlkUhziYtyWTxIfy6BE8WJt5YJvpJivxNaGmLHT0VnOgSYf0dZXS7APdpB309RnHOG5gDqXGLDaC457D1zZ%2FV%2FnmOM82XiHRLYKhKP1oZmADdEAAAh%2BQQJCgAAACwAAAAAIAAgAAAE6hDISWlZpOrNp1lGNRSdRpDUolIGw5RUYhhHukqFu8DsrEyqnWThGvAmhVlteBvojpTDDBUEIFwMFBRAmBkSgOrBFZogCASwBDEY%2FCZSg7GSE0gSCjQBMVG023xWBhklAnoEdhQEfyNqMIcKjhRsjEdnezB%2BA4k8gTwJhFuiW4dokXiloUepBAp5qaKpp6%2BHo7aWW54wl7obvEe0kRuoplCGepwSx2jJvqHEmGt6whJpGpfJCHmOoNHKaHx61WiSR92E4lbFoq%2BB6QDtuetcaBPnW6%2BO7wDHpIiK9SaVK5GgV543tzjgGcghAgAh%2BQQJCgAAACwAAAAAIAAgAAAE7hDISSkxpOrN5zFHNWRdhSiVoVLHspRUMoyUakyEe8PTPCATW9A14E0UvuAKMNAZKYUZCiBMuBakSQKG8G2FzUWox2AUtAQFcBKlVQoLgQReZhQlCIJesQXI5B0CBnUMOxMCenoCfTCEWBsJColTMANldx15BGs8B5wlCZ9Po6OJkwmRpnqkqnuSrayqfKmqpLajoiW5HJq7FL1Gr2mMMcKUMIiJgIemy7xZtJsTmsM4xHiKv5KMCXqfyUCJEonXPN2rAOIAmsfB3uPoAK%2B%2BG%2Bw48edZPK%2BM6hLJpQg484enXIdQFSS1u6UhksENEQAAIfkECQoAAAAsAAAAACAAIAAABOcQyEmpGKLqzWcZRVUQnZYg1aBSh2GUVEIQ2aQOE%2BG%2BcD4ntpWkZQj1JIiZIogDFFyHI0UxQwFugMSOFIPJftfVAEoZLBbcLEFhlQiqGp1Vd140AUklUN3eCA51C1EWMzMCezCBBmkxVIVHBWd3HHl9JQOIJSdSnJ0TDKChCwUJjoWMPaGqDKannasMo6WnM562R5YluZRwur0wpgqZE7NKUm%2BFNRPIhjBJxKZteWuIBMN4zRMIVIhffcgojwCF117i4nlLnY5ztRLsnOk%2BaV%2BoJY7V7m76PdkS4trKcdg0Zc0tTcKkRAAAIfkECQoAAAAsAAAAACAAIAAABO4QyEkpKqjqzScpRaVkXZWQEximw1BSCUEIlDohrft6cpKCk5xid5MNJTaAIkekKGQkWyKHkvhKsR7ARmitkAYDYRIbUQRQjWBwJRzChi9CRlBcY1UN4g0%2FVNB0AlcvcAYHRyZPdEQFYV8ccwR5HWxEJ02YmRMLnJ1xCYp0Y5idpQuhopmmC2KgojKasUQDk5BNAwwMOh2RtRq5uQuPZKGIJQIGwAwGf6I0JXMpC8C7kXWDBINFMxS4DKMAWVWAGYsAdNqW5uaRxkSKJOZKaU3tPOBZ4DuK2LATgJhkPJMgTwKCdFjyPHEnKxFCDhEAACH5BAkKAAAALAAAAAAgACAAAATzEMhJaVKp6s2nIkolIJ2WkBShpkVRWqqQrhLSEu9MZJKK9y1ZrqYK9WiClmvoUaF8gIQSNeF1Er4MNFn4SRSDARWroAIETg1iVwuHjYB1kYc1mwruwXKC9gmsJXliGxc%2BXiUCby9ydh1sOSdMkpMTBpaXBzsfhoc5l58Gm5yToAaZhaOUqjkDgCWNHAULCwOLaTmzswadEqggQwgHuQsHIoZCHQMMQgQGubVEcxOPFAcMDAYUA85eWARmfSRQCdcMe0zeP1AAygwLlJtPNAAL19DARdPzBOWSm1brJBi45soRAWQAAkrQIykShQ9wVhHCwCQCACH5BAkKAAAALAAAAAAgACAAAATrEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiRMDjI0Fd30%2FiI2UA5GSS5UDj2l6NoqgOgN4gksEBgYFf0FDqKgHnyZ9OX8HrgYHdHpcHQULXAS2qKpENRg7eAMLC7kTBaixUYFkKAzWAAnLC7FLVxLWDBLKCwaKTULgEwbLA4hJtOkSBNqITT3xEgfLpBtzE%2FjiuL04RGEBgwWhShRgQExHBAAh%2BQQJCgAAACwAAAAAIAAgAAAE7xDISWlSqerNpyJKhWRdlSAVoVLCWk6JKlAqAavhO9UkUHsqlE6CwO1cRdCQ8iEIfzFVTzLdRAmZX3I2SfZiCqGk5dTESJeaOAlClzsJsqwiJwiqnFrb2nS9kmIcgEsjQydLiIlHehhpejaIjzh9eomSjZR%2BipslWIRLAgMDOR2DOqKogTB9pCUJBagDBXR6XB0EBkIIsaRsGGMMAxoDBgYHTKJiUYEGDAzHC9EACcUGkIgFzgwZ0QsSBcXHiQvOwgDdEwfFs0sDzt4S6BK4xYjkDOzn0unFeBzOBijIm1Dgmg5YFQwsCMjp1oJ8LyIAACH5BAkKAAAALAAAAAAgACAAAATwEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiUd6GGl6NoiPOH16iZKNlH6KmyWFOggHhEEvAwwMA0N9GBsEC6amhnVcEwavDAazGwIDaH1ipaYLBUTCGgQDA8NdHz0FpqgTBwsLqAbWAAnIA4FWKdMLGdYGEgraigbT0OITBcg5QwPT4xLrROZL6AuQAPUS7bxLpoWidY0JtxLHKhwwMJBTHgPKdEQAACH5BAkKAAAALAAAAAAgACAAAATrEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiUd6GAULDJCRiXo1CpGXDJOUjY%2BYip9DhToJA4RBLwMLCwVDfRgbBAaqqoZ1XBMHswsHtxtFaH1iqaoGNgAIxRpbFAgfPQSqpbgGBqUD1wBXeCYp1AYZ19JJOYgH1KwA4UBvQwXUBxPqVD9L3sbp2BNk2xvvFPJd%2BMFCN6HAAIKgNggY0KtEBAAh%2BQQJCgAAACwAAAAAIAAgAAAE6BDISWlSqerNpyJKhWRdlSAVoVLCWk6JKlAqAavhO9UkUHsqlE6CwO1cRdCQ8iEIfzFVTzLdRAmZX3I2SfYIDMaAFdTESJeaEDAIMxYFqrOUaNW4E4ObYcCXaiBVEgULe0NJaxxtYksjh2NLkZISgDgJhHthkpU4mW6blRiYmZOlh4JWkDqILwUGBnE6TYEbCgevr0N1gH4At7gHiRpFaLNrrq8HNgAJA70AWxQIH1%2BvsYMDAzZQPC9VCNkDWUhGkuE5PxJNwiUK4UfLzOlD4WvzAHaoG9nxPi5d%2BjYUqfAhhykOFwJWiAAAIfkECQoAAAAsAAAAACAAIAAABPAQyElpUqnqzaciSoVkXVUMFaFSwlpOCcMYlErAavhOMnNLNo8KsZsMZItJEIDIFSkLGQoQTNhIsFehRww2CQLKF0tYGKYSg%2BygsZIuNqJksKgbfgIGepNo2cIUB3V1B3IvNiBYNQaDSTtfhhx0CwVPI0UJe0%2Bbm4g5VgcGoqOcnjmjqDSdnhgEoamcsZuXO1aWQy8KAwOAuTYYGwi7w5h%2BKr0SJ8MFihpNbx%2B4Erq7BYBuzsdiH1jCAzoSfl0rVirNbRXlBBlLX%2BBP0XJLAPGzTkAuAOqb0WT5AH7OcdCm5B8TgRwSRKIHQtaLCwg1RAAAOwAAAAAAAAAAAA%3D%3D";

/***/ },

/***/ "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTIuODU0IDIuODU0YS41LjUgMCAwIDAtLjcwOC0uNzA4TDcuNSA2Ljc5MyAyLjg1NCAyLjE0NmEuNS41IDAgMSAwLS43MDguNzA4TDYuNzkzIDcuNWwtNC42NDcgNC42NDZhLjUuNSAwIDAgMCAuNzA4LjcwOEw3LjUgOC4yMDdsNC42NDYgNC42NDdhLjUuNSAwIDAgMCAuNzA4LS43MDhMOC4yMDcgNy41bDQuNjQ3LTQuNjQ2WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+"
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTIuODU0IDIuODU0YS41LjUgMCAwIDAtLjcwOC0uNzA4TDcuNSA2Ljc5MyAyLjg1NCAyLjE0NmEuNS41IDAgMSAwLS43MDguNzA4TDYuNzkzIDcuNWwtNC42NDcgNC42NDZhLjUuNSAwIDAgMCAuNzA4LjcwOEw3LjUgOC4yMDdsNC42NDYgNC42NDdhLjUuNSAwIDAgMCAuNzA4LS43MDhMOC4yMDcgNy41bDQuNjQ3LTQuNjQ2WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+ ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
(module) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTIuODU0IDIuODU0YS41LjUgMCAwIDAtLjcwOC0uNzA4TDcuNSA2Ljc5MyAyLjg1NCAyLjE0NmEuNS41IDAgMSAwLS43MDguNzA4TDYuNzkzIDcuNWwtNC42NDcgNC42NDZhLjUuNSAwIDAgMCAuNzA4LjcwOEw3LjUgOC4yMDdsNC42NDYgNC42NDdhLjUuNSAwIDAgMCAuNzA4LS43MDhMOC4yMDcgNy41bDQuNjQ3LTQuNjQ2WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+";

/***/ },

/***/ "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMyAyYTEgMSAwIDAgMC0xIDF2OWExIDEgMCAwIDAgMSAxaDlhMSAxIDAgMCAwIDEtMVY4LjVhLjUuNSAwIDAgMC0xIDBWMTJIM1YzaDMuNWEuNS41IDAgMCAwIDAtMUgzWm05Ljg1NC4xNDZhLjUuNSAwIDAgMSAuMTQ2LjM1MVY1LjVhLjUuNSAwIDAgMS0xIDBWMy43MDdMNi44NTQgOC44NTRhLjUuNSAwIDEgMS0uNzA4LS43MDhMMTEuMjkzIDNIOS41YS41LjUgMCAwIDEgMC0xaDNhLjQ5OS40OTkgMCAwIDEgLjM1NC4xNDZaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4="
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMyAyYTEgMSAwIDAgMC0xIDF2OWExIDEgMCAwIDAgMSAxaDlhMSAxIDAgMCAwIDEtMVY4LjVhLjUuNSAwIDAgMC0xIDBWMTJIM1YzaDMuNWEuNS41IDAgMCAwIDAtMUgzWm05Ljg1NC4xNDZhLjUuNSAwIDAgMSAuMTQ2LjM1MVY1LjVhLjUuNSAwIDAgMS0xIDBWMy43MDdMNi44NTQgOC44NTRhLjUuNSAwIDEgMS0uNzA4LS43MDhMMTEuMjkzIDNIOS41YS41LjUgMCAwIDEgMC0xaDNhLjQ5OS40OTkgMCAwIDEgLjM1NC4xNDZaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4= ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
(module) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMyAyYTEgMSAwIDAgMC0xIDF2OWExIDEgMCAwIDAgMSAxaDlhMSAxIDAgMCAwIDEtMVY4LjVhLjUuNSAwIDAgMC0xIDBWMTJIM1YzaDMuNWEuNS41IDAgMCAwIDAtMUgzWm05Ljg1NC4xNDZhLjUuNSAwIDAgMSAuMTQ2LjM1MVY1LjVhLjUuNSAwIDAgMS0xIDBWMy43MDdMNi44NTQgOC44NTRhLjUuNSAwIDEgMS0uNzA4LS43MDhMMTEuMjkzIDNIOS41YS41LjUgMCAwIDEgMC0xaDNhLjQ5OS40OTkgMCAwIDEgLjM1NC4xNDZaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=";

/***/ }

}]);
//# sourceMappingURL=lib_index_js-data_image_gif_base64_R0lGODlhIAAgAPMAAJmZmf_2F_2F_2F6_2Bvr8nJybW1tcDAwOjo6Nvb26-baaebe.3d21a9175c0575f61bf0.js.map