"use strict";
(self["webpackChunksliveshow"] = self["webpackChunksliveshow"] || []).push([["style_index_js"],{

/***/ "./node_modules/css-loader/dist/runtime/api.js"
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
(module) {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ },

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js"
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
(module) {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
(module) {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js"
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
(module) {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js"
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
(module) {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js"
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
(module) {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js"
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
(module) {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ },

/***/ "./style/index.js"
/*!************************!*\
  !*** ./style/index.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.css */ "./style/base.css");
/* harmony import */ var _reveal_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reveal.css */ "./style/reveal.css");




/***/ },

/***/ "./node_modules/css-loader/dist/cjs.js!./style/base.css"
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./style/base.css ***!
  \**************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*
    See the JupyterLab Developer Guide for useful CSS Patterns:

    https://jupyterlab.readthedocs.io/en/stable/developer/css.html
*/

.hidden {
  opacity: 0;
}

.slide-container {
  overflow: scroll;
  scrollbar-width: none;
}

/* ============================================
   Alyan Ahmedani — Slideshow Bug Fixes
   ============================================ */

/* Fix 1 & 3: slides scrollable, content not clipped, no extra padding.
   \`overflow-y: auto\` (not \`hidden scroll\`) so the scrollbar only appears when
   the slide actually overflows — matches the reworked layout block below. */
.reveal .slides > section.present {
  overflow: hidden auto !important;
  overscroll-behavior: contain !important;
}

/* Fix 2: outputs not clipped */
.reveal .slides .jp-OutputArea {
  overflow: visible !important;
}

/* Fix 4: collapse empty output areas causing whitespace */
.reveal .slides .jp-OutputArea:empty {
  display: none !important;
}

/* Fix 5: remove bottom padding from last cell in slide */
.reveal .slides section .jp-Cell:last-child,
.reveal .slides section .jp-MarkdownCell:last-child,
.reveal .slides section .jp-CodeCell:last-child {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

/* Fix 6: navigation arrows not clipped */
.reveal .controls {
  position: fixed !important;
  bottom: 16px !important;
  right: 16px !important;
  z-index: 9999 !important;
}

/* Fix 7 (A1 + A2, reworked 0.1.6): Reveal's auto-layout is disabled
   (disableLayout: true), so reveal applies NO transform/scaling and we own the
   layout. Two rules from 0.1.5 were the source of the remaining zoom + scroll
   bugs Prof. Chan reported:

   1. ZOOM (Bug A): under hard browser zoom the title/content drifted off-centre
      (and tall cells clipped). The cause was horizontal alignment, NOT the width
      unit: 0.1.5 set \`text-align: left\` on full-width slides, so short prose like
      a title hugged the left edge and looked progressively more off-centre as
      zoom reflowed the wrap. FIX: \`text-align: center\` for prose + a
      \`text-align: left\` override for code/editor/output/pre/table, so titles
      stay centred at any zoom while code stays left.
      NB: width stays \`100vw\` (NOT \`100%\`) on purpose — \`.reveal\`'s parent is only
      ~1250px wide even in fullscreen, so \`100%\` clips wide content and pushes it
      off-centre on wide screens (regression noted in 0.1.5). \`100vw\` = the full
      screen width, which is what we want here.

   2. SCROLL (Bug B): \`justify-content: safe center\` keeps free space inside the
      scroll container, so a fast flick + momentum / rubber-band could leave the
      content scrolled up into that empty gap (the "unusable blank space").
      Replaced with flexible \`::before\`/\`::after\` spacers (\`margin: auto\`): they
      centre content when it fits and collapse to zero when it overflows, so the
      slide top-aligns and scrolls cleanly from the top with no phantom space
      and no top-clipping. \`overscroll-behavior: contain\` kills the rubber-band
      overshoot/scroll-chaining that caused the overshoot in the first place. */

.reveal {
  width: 100vw !important;
  height: 100% !important;
  max-width: 100vw !important;
  overflow: hidden !important;
}

.reveal .slides {
  position: absolute !important;
  inset: 0 !important;
  width: 100vw !important;
  max-width: 100vw !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  transform: none !important;

  /* centre prose horizontally; code/output overridden to left below */
  text-align: center;
}

.reveal .slides > section,
.reveal .slides > section > section {
  width: 100vw !important;
  max-width: 100vw !important;
  height: 100% !important;
  box-sizing: border-box !important;
  padding: 3% 4% !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;

  /* stop momentum/rubber-band overshoot and scroll-chaining (Bug B) */
  overflow: hidden auto !important;
  overscroll-behavior: contain !important;
  transform: none !important;
}

/* Flexible vertical spacers replace \`justify-content: center\`. With zero
   intrinsic size and \`margin: auto\`, they share the free space equally when
   content fits (=> vertically centred) and collapse to 0 when content
   overflows (=> top-aligned, fully scrollable, never clipped at the top). */
.reveal .slides > section::before,
.reveal .slides > section::after,
.reveal .slides > section > section::before,
.reveal .slides > section > section::after {
  content: '';
  flex: 0 0 auto;
  margin: auto 0;
}

/* Cap slide content to the slide width so long lines wrap instead of
   overflowing horizontally (which got clipped at high zoom). \`min-width: 0\`
   overrides the flex default of \`min-width: auto\`, which otherwise refuses to
   shrink below the content's intrinsic width and breaks wrapping. */
/* stylelint-disable no-descending-specificity */
.reveal .slides > section > *,
.reveal .slides > section > section > *,
.reveal .slides .jp-Cell,
.reveal .slides .jp-RenderedMarkdown {
  max-width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
  overflow-wrap: break-word;
}
/* stylelint-enable no-descending-specificity */

/* Keep code, editor content, text output and tables left-aligned even though
   prose (titles/markdown) is centred by the slides rule above. */
/* stylelint-disable no-descending-specificity */
.reveal .slides .jp-Editor,
.reveal .slides .cm-editor,
.reveal .slides .jp-RenderedText,
.reveal .slides .jp-OutputArea,
.reveal .slides pre,
.reveal .slides table {
  text-align: left !important;
}
/* stylelint-enable no-descending-specificity */

/* Hide notebook cell chrome (toolbar, prompts) inside the slideshow.
   Also hide the jupyterlab-execute-time "Last executed at … in Xms" footer
   (class \`execute-time\` on older builds, \`jp-ExecuteTime\` on newer) for a
   cleaner lecture look. */
.reveal .slides .jp-cell-toolbar,
.reveal .slides .jp-CellToolbar,
.reveal .slides .jp-InputPrompt,
.reveal .slides .jp-OutputPrompt,
.reveal .slides .execute-time,
.reveal .slides .jp-ExecuteTime {
  display: none !important;
}

/* ============================================
   In-notebook animations (0.1.8)
   ============================================ */

/* Container injected into rendered markdown cells for data-animate /
   {svg-animate} blocks (see src/notebookAnimate.ts). Centre the animation
   and keep it inside the cell width; double-click replays it. */
.sliveshow-notebook-animation {
  text-align: center;
}

.sliveshow-notebook-animation svg {
  max-width: 100%;
  height: auto;
}
`, "",{"version":3,"sources":["webpack://./style/base.css"],"names":[],"mappings":"AAAA;;;;CAIC;;AAED;EACE,UAAU;AACZ;;AAEA;EACE,gBAAgB;EAChB,qBAAqB;AACvB;;AAEA;;iDAEiD;;AAEjD;;4EAE4E;AAC5E;EACE,gCAAgC;EAChC,uCAAuC;AACzC;;AAEA,+BAA+B;AAC/B;EACE,4BAA4B;AAC9B;;AAEA,0DAA0D;AAC1D;EACE,wBAAwB;AAC1B;;AAEA,yDAAyD;AACzD;;;EAGE,2BAA2B;EAC3B,4BAA4B;AAC9B;;AAEA,yCAAyC;AACzC;EACE,0BAA0B;EAC1B,uBAAuB;EACvB,sBAAsB;EACtB,wBAAwB;AAC1B;;AAEA;;;;;;;;;;;;;;;;;;;;;;;;+EAwB+E;;AAE/E;EACE,uBAAuB;EACvB,uBAAuB;EACvB,2BAA2B;EAC3B,2BAA2B;AAC7B;;AAEA;EACE,6BAA6B;EAC7B,mBAAmB;EACnB,uBAAuB;EACvB,2BAA2B;EAC3B,uBAAuB;EACvB,oBAAoB;EACpB,qBAAqB;EACrB,0BAA0B;;EAE1B,oEAAoE;EACpE,kBAAkB;AACpB;;AAEA;;EAEE,uBAAuB;EACvB,2BAA2B;EAC3B,uBAAuB;EACvB,iCAAiC;EACjC,yBAAyB;EACzB,wBAAwB;EACxB,iCAAiC;EACjC,8BAA8B;;EAE9B,oEAAoE;EACpE,gCAAgC;EAChC,uCAAuC;EACvC,0BAA0B;AAC5B;;AAEA;;;4EAG4E;AAC5E;;;;EAIE,WAAW;EACX,cAAc;EACd,cAAc;AAChB;;AAEA;;;oEAGoE;AACpE,gDAAgD;AAChD;;;;EAIE,0BAA0B;EAC1B,uBAAuB;EACvB,iCAAiC;EACjC,yBAAyB;AAC3B;AACA,+CAA+C;;AAE/C;iEACiE;AACjE,gDAAgD;AAChD;;;;;;EAME,2BAA2B;AAC7B;AACA,+CAA+C;;AAE/C;;;0BAG0B;AAC1B;;;;;;EAME,wBAAwB;AAC1B;;AAEA;;iDAEiD;;AAEjD;;gEAEgE;AAChE;EACE,kBAAkB;AACpB;;AAEA;EACE,eAAe;EACf,YAAY;AACd","sourcesContent":["/*\n    See the JupyterLab Developer Guide for useful CSS Patterns:\n\n    https://jupyterlab.readthedocs.io/en/stable/developer/css.html\n*/\n\n.hidden {\n  opacity: 0;\n}\n\n.slide-container {\n  overflow: scroll;\n  scrollbar-width: none;\n}\n\n/* ============================================\n   Alyan Ahmedani — Slideshow Bug Fixes\n   ============================================ */\n\n/* Fix 1 & 3: slides scrollable, content not clipped, no extra padding.\n   `overflow-y: auto` (not `hidden scroll`) so the scrollbar only appears when\n   the slide actually overflows — matches the reworked layout block below. */\n.reveal .slides > section.present {\n  overflow: hidden auto !important;\n  overscroll-behavior: contain !important;\n}\n\n/* Fix 2: outputs not clipped */\n.reveal .slides .jp-OutputArea {\n  overflow: visible !important;\n}\n\n/* Fix 4: collapse empty output areas causing whitespace */\n.reveal .slides .jp-OutputArea:empty {\n  display: none !important;\n}\n\n/* Fix 5: remove bottom padding from last cell in slide */\n.reveal .slides section .jp-Cell:last-child,\n.reveal .slides section .jp-MarkdownCell:last-child,\n.reveal .slides section .jp-CodeCell:last-child {\n  margin-bottom: 0 !important;\n  padding-bottom: 0 !important;\n}\n\n/* Fix 6: navigation arrows not clipped */\n.reveal .controls {\n  position: fixed !important;\n  bottom: 16px !important;\n  right: 16px !important;\n  z-index: 9999 !important;\n}\n\n/* Fix 7 (A1 + A2, reworked 0.1.6): Reveal's auto-layout is disabled\n   (disableLayout: true), so reveal applies NO transform/scaling and we own the\n   layout. Two rules from 0.1.5 were the source of the remaining zoom + scroll\n   bugs Prof. Chan reported:\n\n   1. ZOOM (Bug A): under hard browser zoom the title/content drifted off-centre\n      (and tall cells clipped). The cause was horizontal alignment, NOT the width\n      unit: 0.1.5 set `text-align: left` on full-width slides, so short prose like\n      a title hugged the left edge and looked progressively more off-centre as\n      zoom reflowed the wrap. FIX: `text-align: center` for prose + a\n      `text-align: left` override for code/editor/output/pre/table, so titles\n      stay centred at any zoom while code stays left.\n      NB: width stays `100vw` (NOT `100%`) on purpose — `.reveal`'s parent is only\n      ~1250px wide even in fullscreen, so `100%` clips wide content and pushes it\n      off-centre on wide screens (regression noted in 0.1.5). `100vw` = the full\n      screen width, which is what we want here.\n\n   2. SCROLL (Bug B): `justify-content: safe center` keeps free space inside the\n      scroll container, so a fast flick + momentum / rubber-band could leave the\n      content scrolled up into that empty gap (the \"unusable blank space\").\n      Replaced with flexible `::before`/`::after` spacers (`margin: auto`): they\n      centre content when it fits and collapse to zero when it overflows, so the\n      slide top-aligns and scrolls cleanly from the top with no phantom space\n      and no top-clipping. `overscroll-behavior: contain` kills the rubber-band\n      overshoot/scroll-chaining that caused the overshoot in the first place. */\n\n.reveal {\n  width: 100vw !important;\n  height: 100% !important;\n  max-width: 100vw !important;\n  overflow: hidden !important;\n}\n\n.reveal .slides {\n  position: absolute !important;\n  inset: 0 !important;\n  width: 100vw !important;\n  max-width: 100vw !important;\n  height: 100% !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  transform: none !important;\n\n  /* centre prose horizontally; code/output overridden to left below */\n  text-align: center;\n}\n\n.reveal .slides > section,\n.reveal .slides > section > section {\n  width: 100vw !important;\n  max-width: 100vw !important;\n  height: 100% !important;\n  box-sizing: border-box !important;\n  padding: 3% 4% !important;\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: center !important;\n\n  /* stop momentum/rubber-band overshoot and scroll-chaining (Bug B) */\n  overflow: hidden auto !important;\n  overscroll-behavior: contain !important;\n  transform: none !important;\n}\n\n/* Flexible vertical spacers replace `justify-content: center`. With zero\n   intrinsic size and `margin: auto`, they share the free space equally when\n   content fits (=> vertically centred) and collapse to 0 when content\n   overflows (=> top-aligned, fully scrollable, never clipped at the top). */\n.reveal .slides > section::before,\n.reveal .slides > section::after,\n.reveal .slides > section > section::before,\n.reveal .slides > section > section::after {\n  content: '';\n  flex: 0 0 auto;\n  margin: auto 0;\n}\n\n/* Cap slide content to the slide width so long lines wrap instead of\n   overflowing horizontally (which got clipped at high zoom). `min-width: 0`\n   overrides the flex default of `min-width: auto`, which otherwise refuses to\n   shrink below the content's intrinsic width and breaks wrapping. */\n/* stylelint-disable no-descending-specificity */\n.reveal .slides > section > *,\n.reveal .slides > section > section > *,\n.reveal .slides .jp-Cell,\n.reveal .slides .jp-RenderedMarkdown {\n  max-width: 100% !important;\n  min-width: 0 !important;\n  box-sizing: border-box !important;\n  overflow-wrap: break-word;\n}\n/* stylelint-enable no-descending-specificity */\n\n/* Keep code, editor content, text output and tables left-aligned even though\n   prose (titles/markdown) is centred by the slides rule above. */\n/* stylelint-disable no-descending-specificity */\n.reveal .slides .jp-Editor,\n.reveal .slides .cm-editor,\n.reveal .slides .jp-RenderedText,\n.reveal .slides .jp-OutputArea,\n.reveal .slides pre,\n.reveal .slides table {\n  text-align: left !important;\n}\n/* stylelint-enable no-descending-specificity */\n\n/* Hide notebook cell chrome (toolbar, prompts) inside the slideshow.\n   Also hide the jupyterlab-execute-time \"Last executed at … in Xms\" footer\n   (class `execute-time` on older builds, `jp-ExecuteTime` on newer) for a\n   cleaner lecture look. */\n.reveal .slides .jp-cell-toolbar,\n.reveal .slides .jp-CellToolbar,\n.reveal .slides .jp-InputPrompt,\n.reveal .slides .jp-OutputPrompt,\n.reveal .slides .execute-time,\n.reveal .slides .jp-ExecuteTime {\n  display: none !important;\n}\n\n/* ============================================\n   In-notebook animations (0.1.8)\n   ============================================ */\n\n/* Container injected into rendered markdown cells for data-animate /\n   {svg-animate} blocks (see src/notebookAnimate.ts). Centre the animation\n   and keep it inside the cell width; double-click replays it. */\n.sliveshow-notebook-animation {\n  text-align: center;\n}\n\n.sliveshow-notebook-animation svg {\n  max-width: 100%;\n  height: auto;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./node_modules/css-loader/dist/cjs.js!./style/reveal.css"
/*!****************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./style/reveal.css ***!
  \****************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.reveal .slides {
  text-align: inherit !important;
  width: 1250px !important;
}

.reveal .hide-code .jp-Cell-inputWrapper {
  display: none;
}

.reveal .slides section[data-transition='slide'].horizontal.past,
.reveal .slides section[data-transition~='slide-out'].horizontal.past {
  transform: translate(-150%, 0);
}

.reveal .slides section[data-transition='slide'].horizontal.future,
.reveal .slides section[data-transition~='slide-in'].horizontal.future {
  transform: translate(150%, 0);
}

.reveal .slides section[data-transition='slide'].vertical.past,
.reveal .slides section[data-transition~='slide-out'].vertical.past {
  transform: translate(0, -150%);
}

.reveal .slides section[data-transition='slide'].vertical.future,
.reveal .slides section[data-transition~='slide-in'].vertical.future {
  transform: translate(0, 150%);
}

.reveal .fragment.zoom {
  opacity: 0;
  transform: scale(0);
}

.reveal .fragment.zoom.visible {
  opacity: 1;
  transform: scale(1);
}

.reveal .fragment.none {
  transition: none;
}
`, "",{"version":3,"sources":["webpack://./style/reveal.css"],"names":[],"mappings":"AAAA;EACE,8BAA8B;EAC9B,wBAAwB;AAC1B;;AAEA;EACE,aAAa;AACf;;AAEA;;EAEE,8BAA8B;AAChC;;AAEA;;EAEE,6BAA6B;AAC/B;;AAEA;;EAEE,8BAA8B;AAChC;;AAEA;;EAEE,6BAA6B;AAC/B;;AAEA;EACE,UAAU;EACV,mBAAmB;AACrB;;AAEA;EACE,UAAU;EACV,mBAAmB;AACrB;;AAEA;EACE,gBAAgB;AAClB","sourcesContent":[".reveal .slides {\n  text-align: inherit !important;\n  width: 1250px !important;\n}\n\n.reveal .hide-code .jp-Cell-inputWrapper {\n  display: none;\n}\n\n.reveal .slides section[data-transition='slide'].horizontal.past,\n.reveal .slides section[data-transition~='slide-out'].horizontal.past {\n  transform: translate(-150%, 0);\n}\n\n.reveal .slides section[data-transition='slide'].horizontal.future,\n.reveal .slides section[data-transition~='slide-in'].horizontal.future {\n  transform: translate(150%, 0);\n}\n\n.reveal .slides section[data-transition='slide'].vertical.past,\n.reveal .slides section[data-transition~='slide-out'].vertical.past {\n  transform: translate(0, -150%);\n}\n\n.reveal .slides section[data-transition='slide'].vertical.future,\n.reveal .slides section[data-transition~='slide-in'].vertical.future {\n  transform: translate(0, 150%);\n}\n\n.reveal .fragment.zoom {\n  opacity: 0;\n  transform: scale(0);\n}\n\n.reveal .fragment.zoom.visible {\n  opacity: 1;\n  transform: scale(1);\n}\n\n.reveal .fragment.none {\n  transition: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./style/base.css"
/*!************************!*\
  !*** ./style/base.css ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./base.css */ "./node_modules/css-loader/dist/cjs.js!./style/base.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ },

/***/ "./style/reveal.css"
/*!**************************!*\
  !*** ./style/reveal.css ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_reveal_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./reveal.css */ "./node_modules/css-loader/dist/cjs.js!./style/reveal.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_reveal_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_reveal_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_reveal_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_reveal_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }

}]);
//# sourceMappingURL=style_index_js.386677e1a29cdb9e601d.js.map