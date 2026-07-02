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
    // per-cell animation handles / visibility observers / hook guards
    const handles = new WeakMap<any, any>();
    const observers = new WeakMap<any, IntersectionObserver>();
    const hooked = new WeakSet<any>();

    const disposeHandle = (cell: any): void => {
      handles.get(cell)?.dispose();
      handles.delete(cell);
    };

    const process = (cell: any, attempt: number = 0): void => {
      disposeHandle(cell);
      if (cell.isDisposed || !cell.rendered) {
        return;
      }
      const rendered = cell.node.querySelector(
        '.jp-RenderedMarkdown'
      ) as HTMLElement | null;
      if (!rendered) {
        // renderer output not in the DOM yet — retry briefly
        if (attempt < 10) {
          setTimeout(() => process(cell, attempt + 1), 200);
        }
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
          console.warn('sliveshow: MathJax typeset failed:', e);
        }
      }

      // dynamic import keeps svg.js out of the critical startup path
      // (same pattern as the Reveal plugins in plugin.ts)
      import('./rajgoel/animateStandalone.js').then((mod: any) => {
        if (cell.isDisposed || !animDiv.isConnected) {
          return;
        }
        const handle = mod.animateContainer(animDiv);
        if (handle) {
          handles.set(cell, handle);
        }
      });
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
      if (cell?.model?.type !== 'markdown' || hooked.has(cell)) {
        return;
      }
      hooked.add(cell);
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
    };

    const hookPanel = (panel: NotebookPanel): void => {
      void panel.context.ready.then(() => {
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
