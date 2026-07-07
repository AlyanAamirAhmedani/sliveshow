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

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { ILatexTypesetter } from '@jupyterlab/rendermime';
import { PLUGIN_ID } from './constants';

const ANIMATION_CLASS = 'sliveshow-notebook-animation';

// The rendered-markdown container differs by renderer: stock JupyterLab uses
// `.jp-RenderedMarkdown`, while jupyterlab-myst (used on DIVE) renders into a
// `.jp-RenderedHTMLCommon.not-prose` node without the markdown class. Both
// share jp-RenderedHTMLCommon; keep the specific class first for stock Lab.
const RENDERED_SELECTOR = '.jp-RenderedMarkdown, .jp-RenderedHTMLCommon';

// Diagnostic logging for 0.1.9 — remove/quiet once stable.
const log = (...args: any[]): void => {
  console.log('sliveshow-nb:', ...args);
};

/**
 * Extract the animation block from raw markdown source as a detached
 * `<div data-animate>` element. Mirrors the two branches of
 * `addToRevealSlide` in plugin.ts (raw HTML and {svg-animate} directive).
 */
const extractAnimateDiv = (src: string): HTMLElement | null => {
  if (src.includes('data-animate')) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = src;
    const animDiv = wrapper.querySelector('[data-animate]');
    if (animDiv) {
      return animDiv as HTMLElement;
    }
  }
  if (src.includes(':::{svg-animate}')) {
    const directiveMatch = src.match(
      /:::\{svg-animate\}[^\n]*\n(?::[a-z-]+:[^\n]*\n)*([\s\S]*?):::/
    );
    if (directiveMatch) {
      const animDiv = document.createElement('div');
      animDiv.setAttribute('data-animate', '');
      animDiv.innerHTML = directiveMatch[1].trim();
      return animDiv;
    }
  }
  return null;
};

/**
 * Find what the sanitizer left behind of the animation block in the rendered
 * markdown, so the animated version can take its place:
 * - raw HTML path: the wrapper `<div>` survives but loses all attributes
 *   (and its SVG/config), so look for the first attribute-less div;
 * - directive path: the `:::{svg-animate}` lines render as literal text.
 */
const findSanitizedLeftover = (rendered: HTMLElement): Element | null => {
  const divs = rendered.querySelectorAll('div');
  for (let i = 0; i < divs.length; i++) {
    if (divs[i].attributes.length === 0) {
      return divs[i];
    }
  }
  const paragraphs = rendered.querySelectorAll('p');
  for (let i = 0; i < paragraphs.length; i++) {
    if (
      (paragraphs[i].textContent || '').trim().startsWith(':::{svg-animate}')
    ) {
      return paragraphs[i];
    }
  }
  return null;
};

const plugin: JupyterFrontEndPlugin<void> = {
  id: `${PLUGIN_ID}:notebook-animate`,
  description: 'Renders sliveshow SVG/MathJax animations in the notebook view.',
  autoStart: true,
  requires: [INotebookTracker],
  optional: [ILatexTypesetter],
  activate: (
    app: JupyterFrontEnd,
    tracker: INotebookTracker,
    typesetter: ILatexTypesetter | null
  ) => {
    log('activated; typesetter available:', !!typesetter);

    // per-cell animation handles / visibility observers / hook guards
    const handles = new WeakMap<any, any>();
    const observers = new WeakMap<any, IntersectionObserver>();
    const waiters = new WeakMap<any, MutationObserver>();
    const hooked = new WeakSet<any>();

    const disposeHandle = (cell: any): void => {
      const entry = handles.get(cell);
      entry?.watchdog?.disconnect();
      entry?.handle?.dispose();
      handles.delete(cell);
      waiters.get(cell)?.disconnect();
      waiters.delete(cell);
    };

    const process = (cell: any, attempt: number = 0): void => {
      try {
        disposeHandle(cell);
        if (cell.isDisposed || !cell.rendered) {
          log('process: cell disposed or unrendered, skipping');
          return;
        }
        const rendered = cell.node.querySelector(
          RENDERED_SELECTOR
        ) as HTMLElement | null;
        if (!rendered) {
          // Renderer output not in the DOM yet. On slow hosts (e.g. DIVE)
          // this can take well over 5s, so don't poll with a deadline —
          // watch the cell node and continue whenever the output appears.
          log('process: waiting for rendered markdown (observer)');
          waiters.get(cell)?.disconnect();
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
        rendered
          .querySelectorAll(`.${ANIMATION_CLASS}`)
          .forEach(el => el.remove());

        const src: string = cell.model?.sharedModel?.getSource() ?? '';
        const animDiv = extractAnimateDiv(src);
        if (!animDiv) {
          return;
        }
        log('process: injecting animation block (attempt', attempt + ')');

        const container = document.createElement('div');
        container.classList.add(ANIMATION_CLASS);
        container.title = 'Double-click to replay the animation';
        container.appendChild(animDiv);

        // Swap the sanitized leftovers for the live animation block, keeping
        // the rest of the cell (headings, prose) intact.
        const leftover = findSanitizedLeftover(rendered);
        if (leftover) {
          leftover.replaceWith(container);
        } else {
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
          } catch (e) {
            console.warn('sliveshow-nb: MathJax typeset failed:', e);
          }
        }

        // dynamic import keeps svg.js out of the critical startup path
        // (same pattern as the Reveal plugins in plugin.ts)
        import('./rajgoel/animateStandalone.js')
          .then((mod: any) => {
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
                } else {
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
          .catch((e: any) => {
            console.error('sliveshow-nb: failed to load animation driver:', e);
          });
      } catch (e) {
        console.error('sliveshow-nb: process failed:', e);
      }
    };

    // Defer processing until the cell is actually in the DOM and visible:
    // windowed notebooks keep off-screen cells detached (MathJax cannot
    // measure them), and this also means animations start when the reader
    // scrolls to them.
    const scheduleProcess = (cell: any): void => {
      observers.get(cell)?.disconnect();
      observers.delete(cell);
      if (cell.node.isConnected) {
        process(cell);
        return;
      }
      log('schedule: cell detached, waiting for visibility');
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observers.get(cell)?.disconnect();
            observers.delete(cell);
            process(cell);
            break;
          }
        }
      });
      observer.observe(cell.node);
      observers.set(cell, observer);
    };

    const hookCell = (cell: any): void => {
      try {
        if (cell?.model?.type !== 'markdown' || hooked.has(cell)) {
          return;
        }
        hooked.add(cell);
        const src: string = cell.model?.sharedModel?.getSource() ?? '';
        if (src.includes('data-animate') || src.includes(':::{svg-animate}')) {
          log('hooked animated markdown cell; rendered:', cell.rendered);
        }
        cell.renderedChanged?.connect(() => {
          if (cell.rendered) {
            scheduleProcess(cell);
          } else {
            disposeHandle(cell);
          }
        });
        void Promise.resolve(cell.ready).then(() => {
          if (!cell.isDisposed && cell.rendered) {
            scheduleProcess(cell);
          }
        });
      } catch (e) {
        console.error('sliveshow-nb: hookCell failed:', e);
      }
    };

    const hookPanel = (panel: NotebookPanel): void => {
      void panel.context.ready.then(() => {
        log(
          'hooking panel:',
          panel.context.path,
          '— cells:',
          panel.content.widgets.length
        );
        panel.content.widgets.forEach(hookCell);
        panel.model?.cells.changed.connect(() => {
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

export default plugin;
