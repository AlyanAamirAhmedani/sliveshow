import { JupyterFrontEnd } from '@jupyterlab/application';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { ILatexTypesetter } from '@jupyterlab/rendermime';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { PLUGIN_ID, SlideType, Transition } from './constants';
import { Cell, Slide, Subslide, Fragment } from './slideType';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import '@svgdotjs/svg.js';

// avoid implicit any error
declare const window: any;

/** Marks the `.reveal` container of a deck that is NOT in fullscreen. */
const WINDOWED_CLASS = 'sliveshow-windowed';
/** Marks the notebook panel that is currently hosting a deck. */
const DECK_CLASS = 'sliveshow-deck';
/** Marks that panel's tab, so the presenter can tell the two views apart. */
const DECK_TAB_CLASS = 'sliveshow-deck-tab';

/**
 * Description of a third-party Reveal.js plugin to load at runtime.
 *
 * Reveal plugins (e.g. rajgoel's chalkboard) ship as a classic script that
 * registers a global — `RevealChalkboard`, `RevealMenu`, ... — plus an
 * optional stylesheet. They cannot be bundled ahead of time, so they are
 * fetched from a URL when the slideshow starts and their global is handed to
 * Reveal's `plugins` array.
 */
interface IRevealPluginSpec {
  /** Global variable the plugin registers, e.g. 'RevealChalkboard'. */
  name: string;
  /** URL of the plugin script. */
  script: string;
  /** Optional stylesheet URL(s) required by the plugin. */
  css?: string | string[];
  /** Config merged into Reveal's config, e.g. { chalkboard: { ... } }. */
  config?: { [key: string]: any };
  /** Set false to keep the entry but skip loading it. */
  enabled?: boolean;
}

/**
 * One running slideshow.
 *
 * Everything that used to live in module-level variables is held here instead,
 * because a windowed slideshow means two notebook panels are in play at once
 * (the notebook you keep editing, and the second view that shows the deck) and
 * more than one deck can be open across notebooks.
 */
interface ISlideshowSession {
  /** Panel whose content node holds the Reveal container. */
  deck: NotebookPanel;
  /** Panel the presenter drives. Same as `deck` for a fullscreen slideshow. */
  source: NotebookPanel;
  /** True when the deck lives in a split panel instead of fullscreen. */
  windowed: boolean;
  reveal: Reveal.Api | null;
  /** The `.reveal` element inserted into `deck.content.node`. */
  container: HTMLElement | null;
  /** Slide/Subslide/Fragment tree, kept for style clean-up on exit. */
  layout: any[];
  /** Cell index -> the `<section>` that cell ended up in. */
  sections: Map<number, HTMLElement>;
  /** The deck panel's windowing mode before we turned it off. */
  windowingMode: 'defer' | 'full' | 'none' | 'contentVisibility';
  /** The deck panel's cell viewport, where cell nodes live outside a show. */
  viewport: HTMLElement | null;
  /** Signal disconnects, listener removals, timers. */
  cleanups: Array<() => void>;
  released: boolean;
  rebuilding: boolean;
}

/** Resolve after the next animation frame. */
const nextFrame = (): Promise<void> =>
  new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

/** Load a script once per page, resolving when it has executed. */
const loadPluginScript = (url: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const selector = `script[data-sliveshow-plugin="${CSS.escape(url)}"]`;
    const existing = document.querySelector(
      selector
    ) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.sliveshowLoaded === 'true') {
        resolve();
      } else {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () =>
          reject(new Error(`Failed to load plugin script: ${url}`))
        );
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
    script.addEventListener('error', () =>
      reject(new Error(`Failed to load plugin script: ${url}`))
    );
    document.head.appendChild(script);
  });

/** Add a stylesheet once per page. */
const loadPluginStyle = (url: string): void => {
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
const loadRevealPlugins = async (
  specs: IRevealPluginSpec[]
): Promise<{ plugins: any[]; config: { [key: string]: any } }> => {
  const plugins: any[] = [];
  const config: { [key: string]: any } = {};
  for (const spec of specs ?? []) {
    if (!spec || spec.enabled === false) {
      continue;
    }
    if (!spec.name || !spec.script) {
      console.warn(
        'sliveshow: ignoring plugin entry without name/script:',
        spec
      );
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
        console.warn(
          `sliveshow: plugin script loaded but window.${spec.name} is undefined ` +
            `(check the "name" setting for ${spec.script})`
        );
        continue;
      }
      plugins.push(instance);
      Object.assign(config, spec.config ?? {});
      console.log(`sliveshow: loaded Reveal plugin ${spec.name}`);
    } catch (error) {
      console.error(
        'sliveshow: could not load Reveal plugin',
        spec.name,
        error
      );
    }
  }
  return { plugins, config };
};

const plugin = (
  app: JupyterFrontEnd,
  tracker: INotebookTracker,
  settings: ISettingRegistry,
  typesetter: ILatexTypesetter | null = null
) => {
  const { commands } = app;

  /** Running slideshows, keyed by the panel that hosts the deck. */
  const sessions = new Map<NotebookPanel, ISlideshowSession>();
  let csSettings: any = {};

  // Animate plugin by Asvin Goel (https://github.com/rajgoel/reveal.js-plugins)
  // does not work when imported at the top
  import('./rajgoel/animate.js');
  import('./rajgoel/loadcontent.js');

  /** The session a widget belongs to, whether it is the deck or the source. */
  const findSession = (widget: any): ISlideshowSession | undefined => {
    if (!widget) {
      return undefined;
    }
    for (const session of sessions.values()) {
      if (session.deck === widget || session.source === widget) {
        return session;
      }
    }
    return undefined;
  };

  /** The session the Sliveshow menu should act on right now. */
  const activeSession = (): ISlideshowSession | undefined => {
    const byNotebook = findSession(tracker.currentWidget);
    if (byNotebook) {
      return byNotebook;
    }
    const byShell = findSession(app.shell.currentWidget);
    if (byShell) {
      return byShell;
    }
    return sessions.size === 1 ? sessions.values().next().value : undefined;
  };

  // settings
  const loadSettings = (setting: any) => {
    return {
      dummy: setting.get('dummy').composite as boolean,
      default_transition: setting.get('default_transition')
        .composite as Transition,
      reveal_plugins: (setting.get('reveal_plugins')?.composite ??
        []) as IRevealPluginSpec[]
    };
  };

  Promise.all([app.restored, settings.load(`${PLUGIN_ID}:plugin`)]).then(
    ([, settingRes]) => {
      csSettings = loadSettings(settingRes);
      // update settings
      settingRes.changed.connect(() => {
        console.log('sliveshow settings updated:');
        csSettings = loadSettings(settingRes);
        console.log(csSettings);
      });

      const canStart = () => {
        const current = tracker.currentWidget;
        return !!current && !findSession(current);
      };
      const isPresenting = () => !!activeSession();

      const start = async (
        mode: 'first' | 'current',
        windowed: boolean
      ): Promise<void> => {
        try {
          await startSlideshow(mode, windowed);
        } catch (e) {
          console.error('Error starting slideshow:');
          console.error(e);
        }
      };

      // main menu commands
      commands.addCommand('slideshow:start-first', {
        label: 'Start from first cell (full screen)',
        caption: 'Present the whole notebook full screen, from the first cell.',
        isEnabled: canStart,
        execute: () => start('first', false)
      });

      commands.addCommand('slideshow:start-current', {
        label: 'Start from current cell (full screen)',
        caption:
          'Present full screen, starting at the slide that holds the selected cell.',
        isEnabled: canStart,
        execute: () => start('current', false)
      });

      // Windowed presenting: a second view of the SAME notebook opens to the
      // right and shows the deck, so the notebook stays visible and editable
      // beside it. Both views share one model and one kernel, so an edit or a
      // cell execution on the left is on the slide immediately.
      commands.addCommand('slideshow:start-beside', {
        label: 'Open beside notebook',
        caption:
          'Open the slides in a panel beside the notebook, from the first cell. Edits and outputs appear on the slides live.',
        isEnabled: canStart,
        execute: () => start('first', true)
      });

      commands.addCommand('slideshow:start-beside-current', {
        label: 'Open beside notebook from current cell',
        caption:
          'Open the slides beside the notebook, starting at the slide that holds the selected cell.',
        isEnabled: canStart,
        execute: () => start('current', true)
      });

      commands.addCommand('slideshow:refresh', {
        label: 'Rebuild slides',
        caption:
          'Rebuild the deck from the notebook as it is now, keeping the current slide.',
        isEnabled: isPresenting,
        execute: async () => {
          const session = activeSession();
          if (!session) {
            return;
          }
          try {
            await refreshSession(session);
          } catch (e) {
            console.error('Error rebuilding slides:');
            console.error(e);
          }
        }
      });

      // placeholder command & emergency exit
      commands.addCommand('slideshow:exit', {
        label: 'Exit slideshow',
        isEnabled: isPresenting,
        execute: async () => {
          const session = activeSession();
          if (!session) {
            return;
          }
          try {
            await exitSession(session);
          } catch (e) {
            console.error('Error exiting slideshow: ');
            console.error(e);
          }
        }
      });

      autoStartFromUrl();
    }
  );

  /**
   * Start the slideshow straight from the URL.
   *
   * `?sliveshow=1` starts from the first cell, `?sliveshow=current` from the
   * current one, `?sliveshow=beside` opens the slides in a panel next to the
   * notebook, and any other value (or none) does nothing. It is meant to be
   * combined with JupyterLab's own `?path=` so that a single link - in a
   * handout, in the docs, in a message to a class - lands the reader inside
   * the slideshow rather than on a notebook they have to drive:
   *
   *   .../lab/?path=lecture.ipynb&sliveshow=1
   *
   * Every other part of JupyterLab ignores the parameter, so a link carrying it
   * still works where sliveshow is not installed: the notebook just opens.
   */
  function autoStartFromUrl(): void {
    let flag: string | null = null;
    try {
      flag = new URLSearchParams(window.location.search).get('sliveshow');
    } catch (e) {
      return; // no URL API - nothing to do
    }
    if (!flag || flag === '0' || flag === 'false') {
      return;
    }
    const id =
      flag === 'current'
        ? 'slideshow:start-current'
        : flag === 'beside'
          ? 'slideshow:start-beside'
          : flag === 'beside-current'
            ? 'slideshow:start-beside-current'
            : 'slideshow:start-first';

    let started = false;
    const startWhenReady = (notebook: NotebookPanel | null): void => {
      if (started || !notebook) {
        return;
      }
      started = true;
      // `revealed` comes from MainAreaWidget; guard it so this keeps working
      // whatever JupyterLab minor version the host is on.
      const revealed: Promise<void> =
        (notebook as any).revealed instanceof Promise
          ? (notebook as any).revealed
          : Promise.resolve();
      notebook.context.ready
        .then(() => revealed)
        .then(
          () =>
            new Promise<void>(resolve => {
              // Building the deck MOVES the live cell nodes, so it must not
              // run while JupyterLab is still laying them out. Wait for the
              // notebook to report a non-zero cell count, then one more frame.
              let tries = 0;
              const poll = (): void => {
                const ready =
                  notebook.content.widgets.length > 0 &&
                  notebook.content.node.clientHeight > 0;
                if (ready || ++tries > 60) {
                  window.setTimeout(resolve, 250);
                } else {
                  window.setTimeout(poll, 100);
                }
              };
              poll();
            })
        )
        .then(() => commands.execute(id))
        .catch((e: any) => {
          console.error('sliveshow: could not auto-start from the URL');
          console.error(e);
        });
    };

    if (tracker.currentWidget) {
      startWhenReady(tracker.currentWidget);
    } else {
      // ?path=... opens the notebook during restore, which can land after this
      tracker.widgetAdded.connect((_, notebook) => startWhenReady(notebook));
    }
  }

  /**
   * Open a second view of `source` in a split panel to its right.
   *
   * `docmanager:clone` is executed by its string id on purpose: importing
   * `@jupyterlab/docmanager` would add a dependency that can resolve to a
   * different JupyterLab minor than the host's and duplicate
   * `@lumino/coreutils`, which silently breaks token-based wiring (this bit us
   * in 0.1.9). The clone shares the document context, so it shares the model
   * and the kernel with the original.
   */
  const cloneBeside = async (
    source: NotebookPanel
  ): Promise<NotebookPanel | null> => {
    let created: NotebookPanel | null = null;
    const onAdded = (_: any, nb: NotebookPanel) => {
      created = nb;
    };
    tracker.widgetAdded.connect(onAdded);
    try {
      // `docmanager:clone` resolves its target from the last context-menu hit
      // and otherwise from the current shell widget.
      app.shell.activateById(source.id);
      await commands.execute('docmanager:clone', {
        options: { mode: 'split-right', ref: source.id }
      });
    } finally {
      tracker.widgetAdded.disconnect(onAdded);
    }

    let deck: NotebookPanel | null = created;
    if (!deck) {
      // Fall back to looking for another view of the same document.
      const widgets = Array.from(app.shell.widgets('main') as any) as any[];
      for (const widget of widgets) {
        if (
          widget !== source &&
          tracker.has(widget) &&
          (widget as NotebookPanel).context === source.context
        ) {
          deck = widget as NotebookPanel;
        }
      }
    }
    if (!deck || deck === source) {
      console.error(
        'sliveshow: could not open a second view of the notebook — is the ' +
          'document manager available?'
      );
      return null;
    }

    // Turn windowing off before the new panel starts rendering cells lazily:
    // the deck needs every cell node, and a windowing pass that lands while we
    // are moving nodes into slides would move them back out.
    deck.content.notebookConfig = {
      ...deck.content.notebookConfig,
      windowingMode: 'none'
    };
    deck.addClass(DECK_CLASS);
    // NEVER assign to `deck.title.label`. DocumentWidget treats a label that
    // differs from the file name as a rename request and renames the file on
    // disk — an end-to-end test caught it renaming `deck.ipynb` to
    // `deck.ipynb — slides`. Mark the tab with a class instead; `className`
    // and `caption` both leave the label alone, so the rename handler returns
    // immediately.
    deck.title.className =
      `${deck.title.className ?? ''} ${DECK_TAB_CLASS}`.trim();
    deck.title.caption = `Sliveshow slides — ${source.context.path}`;

    const revealed = (deck as any).revealed;
    if (revealed instanceof Promise) {
      await revealed;
    }
    await deck.context.ready;
    return deck;
  };

  const startSlideshow = async (
    mode: 'first' | 'current',
    windowed: boolean
  ): Promise<void> => {
    const source = tracker.currentWidget;
    if (!source) {
      return;
    }
    const running = findSession(source);
    if (running) {
      // Already presenting this notebook — just bring the deck forward.
      app.shell.activateById(running.deck.id);
      return;
    }
    await source.context.ready;

    // Remember where the presenter is before the clone steals focus.
    const startIndex = source.content.activeCellIndex || 0;

    const deck = windowed ? await cloneBeside(source) : source;
    if (!deck) {
      return;
    }

    const session: ISlideshowSession = {
      deck,
      source,
      windowed,
      reveal: null,
      container: null,
      layout: [],
      sections: new Map<number, HTMLElement>(),
      windowingMode: deck.content.notebookConfig.windowingMode,
      viewport: null,
      cleanups: [],
      released: false,
      rebuilding: false
    };
    sessions.set(deck, session);

    try {
      await buildDeck(session, mode, startIndex);
    } catch (e) {
      console.error('sliveshow: could not build the slideshow');
      console.error(e);
      await exitSession(session);
      return;
    }

    if (windowed) {
      wireWindowedSession(session);
      app.shell.activateById(deck.id);
    } else {
      const onFullscreenChange = () => {
        if (!document.fullscreenElement) {
          void exitSession(session);
        }
      };
      document.addEventListener('fullscreenchange', onFullscreenChange);
      session.cleanups.push(() =>
        document.removeEventListener('fullscreenchange', onFullscreenChange)
      );
      await deck.content.node.requestFullscreen();
    }
  };

  /**
   * Connect a windowed deck to the notebook beside it.
   *
   * Three links: selecting a cell on the left moves the deck to that slide;
   * adding or deleting cells rebuilds the deck (text edits and outputs need no
   * rebuild — both views render the same cell models); and closing either tab
   * tears the session down.
   */
  const wireWindowedSession = (session: ISlideshowSession): void => {
    const notebook = session.source.content;

    const onActiveCellChanged = () => {
      if (!session.rebuilding) {
        gotoCell(session, notebook.activeCellIndex);
      }
    };
    notebook.activeCellChanged.connect(onActiveCellChanged);
    session.cleanups.push(() =>
      notebook.activeCellChanged.disconnect(onActiveCellChanged)
    );

    const cells = session.source.context.model.cells;
    let rebuildTimer: number | null = null;
    const onCellsChanged = () => {
      if (rebuildTimer !== null) {
        window.clearTimeout(rebuildTimer);
      }
      rebuildTimer = window.setTimeout(() => {
        rebuildTimer = null;
        void refreshSession(session);
      }, 500);
    };
    cells.changed.connect(onCellsChanged);
    session.cleanups.push(() => {
      cells.changed.disconnect(onCellsChanged);
      if (rebuildTimer !== null) {
        window.clearTimeout(rebuildTimer);
      }
    });

    const onDeckDisposed = () => releaseSession(session);
    session.deck.disposed.connect(onDeckDisposed);
    session.cleanups.push(() =>
      session.deck.disposed.disconnect(onDeckDisposed)
    );

    const onSourceDisposed = () => void exitSession(session);
    session.source.disposed.connect(onSourceDisposed);
    session.cleanups.push(() =>
      session.source.disposed.disconnect(onSourceDisposed)
    );
  };

  /**
   * Build the Reveal deck inside `session.deck`.
   *
   * The deck is inserted into the notebook panel's own content node and the
   * live cell nodes are MOVED into it, which is what keeps the cells attached
   * to the kernel while they are on a slide. Fullscreen is applied by the
   * caller, not here, so the same build serves both modes.
   */
  const buildDeck = async (
    session: ISlideshowSession,
    mode: 'first' | 'current',
    startIndex = 0
  ): Promise<void> => {
    const panel = session.deck;
    session.layout = [];
    session.sections = new Map<number, HTMLElement>();
    const slides: any[] = [];

    await panel.context.ready;
    await miscStyles(session, true);

    const cells = await getCells(panel);
    const layout = session.layout;

    cells.forEach((cell, index) => {
      const slideType = cell.model.metadata.slideshow?.slide_type;
      const transition = cell.model.metadata.slideshow?.transition;
      const transitionOut = cell.model.metadata.slideshow?.transition_out;
      const transitionDuration =
        cell.model.metadata.slideshow?.transition_duration ?? 0.5;
      switch (slideType) {
        case SlideType.SLIDE: {
          layout.push(
            new Slide(
              index,
              cell,
              transition,
              transitionOut,
              transitionDuration
            )
          );
          break;
        }
        case SlideType.SUBSLIDE: {
          layout.push(
            layout.length === 0
              ? new Slide(
                  index,
                  cell,
                  transition,
                  transitionOut,
                  transitionDuration
                )
              : new Subslide(
                  index,
                  cell,
                  transition,
                  transitionOut,
                  transitionDuration
                )
          );
          break;
        }
        case SlideType.FRAGMENT: {
          if (layout.length === 0) {
            layout.push(
              new Slide(
                index,
                cell,
                transition,
                transitionOut,
                transitionDuration
              )
            );
          } else {
            // add to last slide
            layout[layout.length - 1].fragments.push(
              new Fragment(index, cell, transition, transitionDuration)
            );
          }
          break;
        }
        case SlideType.SKIP: {
          break;
        }
        // no slide type
        default: {
          if (layout.length === 0) {
            layout.push(
              new Slide(
                index,
                cell,
                transition,
                transitionOut,
                transitionDuration
              )
            );
          } else {
            const lastSlide = layout[layout.length - 1];
            // add to last fragment
            if (lastSlide.fragments.length > 0) {
              lastSlide.fragments[lastSlide.fragments.length - 1].children.push(
                new Cell(index, cell)
              );
            } else {
              lastSlide.children.push(new Cell(index, cell));
            }
          }
          break;
        }
      }
    });

    for (let i = 0; i < layout.length; i++) {
      if (layout[i] instanceof Slide) {
        const slideOuter = document.createElement('section');
        if (layout[i].transition) {
          let transition = layout[i].transition;
          if (layout[i].transitionOut) {
            transition += `-in ${layout[i].transitionOut}-out`;
          }
          slideOuter.setAttribute('data-transition', transition);
          if (layout[i].cell.model.metadata.slideshow?.slide_dir) {
            slideOuter.classList.add(
              layout[i].cell.model.metadata.slideshow.slide_dir
            );
          }
        }
        slideOuter.style.transitionDuration = `${layout[i].transitionDuration}s`;
        const slideInner = document.createElement('section');
        slideOuter.appendChild(slideInner);
        addToRevealSlide(slideInner, layout[i]);
        mapCellsToSection(session, layout[i], slideInner);
        slides.push(slideOuter);
      } else if (layout[i] instanceof Subslide) {
        const subslide = document.createElement('section');
        addToRevealSlide(subslide, layout[i]);
        mapCellsToSection(session, layout[i], subslide);
        slides[slides.length - 1].appendChild(subslide);
      }
    }

    const revealContainer = document.createElement('div');
    revealContainer.className = 'reveal';
    if (session.windowed) {
      revealContainer.classList.add(WINDOWED_CLASS);
    }
    const revealSlides = document.createElement('div');
    revealSlides.className = 'slides';
    for (let i = 0; i < slides.length; i++) {
      revealSlides.appendChild(slides[i]);
    }
    revealContainer.appendChild(revealSlides);
    panel.content.node.insertBefore(
      revealContainer,
      panel.content.node.firstChild
    );
    session.container = revealContainer;
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
          typesetter.typeset(el as HTMLElement);
        } catch (e) {
          console.warn('sliveshow: MathJax typeset failed:', e);
        }
      });
    }
    // Third-party Reveal plugins (chalkboard, menu, ...) are fetched
    // now so their globals exist before Reveal initializes. Their
    // config is spread first so the settings below stay authoritative
    // — disableLayout in particular is load-bearing for our layout.
    const external = await loadRevealPlugins(csSettings.reveal_plugins);
    const reveal = new Reveal(revealContainer, {
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
      disableLayout: true,
      // A windowed deck shares the page with a notebook the presenter is
      // typing in, and Reveal binds its keyboard shortcuts to the document.
      // Without this, every space or arrow key pressed on the left would also
      // drive the slides. Keys reach the deck only while the deck panel is the
      // active tab, and never while the caret is in an editor inside it. A
      // fullscreen deck owns the page, so it keeps the usual navigation.
      keyboardCondition: session.windowed
        ? () => {
            if (app.shell.currentWidget !== session.deck) {
              return false;
            }
            const active = document.activeElement as HTMLElement | null;
            if (!active) {
              return true;
            }
            return (
              !active.isContentEditable &&
              !['INPUT', 'TEXTAREA'].includes(active.tagName)
            );
          }
        : null
    });
    session.reveal = reveal;

    await reveal.initialize();

    // Fix (A2): reset scroll to top only on an actual slide change.
    // Reveal's native `slidechanged` event fires once per navigation,
    // unlike the previous MutationObserver which reset scrollTop on
    // every class mutation (fragments, Animate-plugin layout calls) and
    // so kept yanking the slide back to the top while the user scrolled.
    reveal.on('slidechanged', (event: any) => {
      const current = event?.currentSlide as HTMLElement | undefined;
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

    if (mode === 'first') {
      reveal.slide(0);
    } else {
      gotoCell(session, startIndex);
    }
  };

  /**
   * Record which `<section>` every cell of `item` was placed in, so a cell
   * index can be turned into a slide later (starting from the current cell,
   * and following the presenter's selection in windowed mode).
   *
   * This replaces comparing the `innerHTML` of every section against the
   * active cell: that was quadratic on a long notebook, and with two views of
   * one notebook open it could not tell the two copies apart.
   */
  const mapCellsToSection = (
    session: ISlideshowSession,
    item: any,
    section: HTMLElement
  ): void => {
    session.sections.set(item.index, section);
    item.children?.forEach((child: any) =>
      mapCellsToSection(session, child, section)
    );
    item.fragments?.forEach((fragment: any) =>
      mapCellsToSection(session, fragment, section)
    );
  };

  /** Move the deck to the slide holding `cellIndex` (or the nearest before). */
  const gotoCell = (session: ISlideshowSession, cellIndex: number): void => {
    const reveal = session.reveal;
    if (!reveal) {
      return;
    }
    let index = cellIndex;
    while (index >= 0 && !session.sections.has(index)) {
      index--;
    }
    const section = index >= 0 ? session.sections.get(index) : undefined;
    if (!section) {
      return;
    }
    try {
      const indices = reveal.getIndices(section as any);
      reveal.slide(indices.h, indices.v);
    } catch (e) {
      console.warn('sliveshow: could not navigate to cell', cellIndex, e);
    }
  };

  /**
   * Rebuild the deck from the notebook as it is now, keeping the position.
   *
   * Text edits and outputs need no rebuild: both views render the same cell
   * models, so they update themselves. Adding, deleting or moving a cell does
   * need one, because the deck holds cell nodes it has already grouped into
   * slides.
   */
  const refreshSession = async (session: ISlideshowSession): Promise<void> => {
    if (session.released || session.rebuilding || !session.reveal) {
      return;
    }
    session.rebuilding = true;
    let position = { h: 0, v: 0 };
    try {
      const indices = session.reveal.getIndices();
      position = { h: indices.h ?? 0, v: indices.v ?? 0 };
    } catch (e) {
      // no current slide; start from the top
    }
    try {
      await teardownDeck(session);
      await buildDeck(session, 'first');
      session.reveal?.slide(position.h, position.v);
    } catch (e) {
      console.error('sliveshow: could not rebuild the slides');
      console.error(e);
    } finally {
      session.rebuilding = false;
    }
  };

  /** Destroy Reveal and put the deck panel back to being a notebook. */
  const teardownDeck = async (session: ISlideshowSession): Promise<void> => {
    try {
      session.reveal?.destroy();
    } catch (e) {
      console.warn('sliveshow: Reveal.destroy failed', e);
    }
    session.reveal = null;
    if (session.deck.isDisposed) {
      session.container = null;
      return;
    }
    await clearAll(session);
    const container = session.container;
    if (container && container.parentElement) {
      container.parentElement.removeChild(container);
    }
    session.container = null;
    session.sections = new Map<number, HTMLElement>();
  };

  /**
   * Drop the session's listeners and Reveal instance without touching the DOM.
   * Used when the deck panel is disposed out from under us (tab closed).
   */
  const releaseSession = (session: ISlideshowSession): void => {
    if (session.released) {
      return;
    }
    session.released = true;
    sessions.delete(session.deck);
    session.cleanups.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.warn('sliveshow: cleanup failed', e);
      }
    });
    session.cleanups = [];
    try {
      session.reveal?.destroy();
    } catch (e) {
      console.warn('sliveshow: Reveal.destroy failed', e);
    }
    session.reveal = null;
  };

  /** End a slideshow: restore the notebook, or close the side panel. */
  const exitSession = async (session: ISlideshowSession): Promise<void> => {
    const { windowed, deck } = session;
    const alreadyReleased = session.released;
    releaseSession(session);
    if (alreadyReleased) {
      return;
    }

    if (windowed) {
      // The deck is a second view of the notebook; the notebook itself was
      // never touched, so the panel can simply go away.
      if (!deck.isDisposed) {
        deck.dispose();
      }
      return;
    }

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (e) {
        console.warn('sliveshow: could not leave fullscreen', e);
      }
    }
    await teardownDeck(session);
  };

  const addToRevealSlide = (slide: any, item: any) => {
    if (
      item.cell.model.type === 'code' &&
      item.cell.model.metadata.slideshow?.hide_code
    ) {
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
          item.children?.forEach((child: any) => {
            addToRevealSlide(container, child);
          });
          slide.appendChild(container);
          item.fragments?.forEach((fragment: any) => {
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
        const directiveMatch = src.match(
          /:::\{svg-animate\}[^\n]*\n(?::[a-z-]+:[^\n]*\n)*([\s\S]*?):::/
        );
        if (directiveMatch) {
          const body = directiveMatch[1].trim();
          const animDiv = document.createElement('div');
          animDiv.setAttribute('data-animate', '');
          animDiv.innerHTML = body;
          const container = document.createElement('div');
          container.appendChild(animDiv);
          item.children?.forEach((child: any) => {
            addToRevealSlide(container, child);
          });
          slide.appendChild(container);
          item.fragments?.forEach((fragment: any) => {
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
      if (item.cell.model.metadata.slideshow?.slide_dir) {
        slide.classList.add(item.cell.model.metadata.slideshow.slide_dir);
      }
    }
    slide.style.transitionDuration = `${item.transitionDuration}s`;
    const container = document.createElement('div');
    container.appendChild(item.cell.node);
    item.children?.forEach((child: any) => {
      addToRevealSlide(container, child);
    });
    slide.appendChild(container);
    item.fragments?.forEach((fragment: any) => {
      const fragContainer = document.createElement('div');
      fragContainer.classList.add('fragment');
      switch (fragment.transition) {
        case Transition.SLIDE: {
          fragContainer.classList.add(
            fragment.cell.model.metadata.slideshow?.slide_dir === 'vertical'
              ? 'fade-up'
              : 'fade-left'
          );
          break;
        }
        case Transition.ZOOM: {
          fragContainer.classList.add('zoom');
          break;
        }
        case Transition.NONE: {
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
  const customStyle = (
    root: HTMLElement,
    item: any,
    add: boolean = true
  ): void => {
    // select both rendered and raw cells
    root
      .querySelectorAll(
        `
      .cell${item.index} .cm-scroller,
      .cell${item.index} .jp-RenderedMarkdown,
      .cell${item.index} .jp-RenderedText *
    `
      )
      .forEach(child => {
        if (add) {
          // TODO: put in metadata for cell size, position, etc.
          // placeholder style for not having to squeeze eyes
          child.setAttribute('style', 'font-size: 200%;');
        } else {
          child.removeAttribute('style');
        }
      });
    if (!add) {
      item.cell.node.classList.remove(`cell${item.index}`);
    }
    item.children?.forEach((child: any) => {
      customStyle(root, child, add);
    });
    item.fragments?.forEach((fragment: any) => {
      customStyle(root, fragment, add);
    });
  };

  /**
   * Make the deck panel survive a cell being deleted while it is presenting.
   *
   * While a slideshow runs, the cell nodes live on slides rather than in the
   * notebook's viewport. When a cell is then removed from the model, Lumino's
   * `WindowedLayout.detachWidget` does `viewportNode.removeChild(widget.node)`
   * and throws `NotFoundError: The node to be removed is not a child of this
   * node` — which also aborts the rest of that message dispatch. Put the node
   * back in the viewport first so the detach Lumino wants to do can actually
   * happen; the cell is on its way out either way.
   */
  const guardLayoutDetach = (session: ISlideshowSession): void => {
    const notebook = session.deck.content;
    const layout = notebook.layout as any;
    if (!layout || typeof layout.detachWidget !== 'function') {
      return;
    }
    if (layout.__sliveshowDetachGuard) {
      return;
    }
    const original = layout.detachWidget.bind(layout);
    layout.__sliveshowDetachGuard = original;
    layout.detachWidget = (index: number, widget: any) => {
      const node = widget?.node as HTMLElement | undefined;
      const viewport = notebook.node.querySelector(
        '.jp-WindowedPanel-viewport'
      ) as HTMLElement | null;
      if (
        node &&
        viewport &&
        node.parentElement &&
        node.parentElement !== viewport
      ) {
        viewport.appendChild(node);
      }
      return original(index, widget);
    };
    session.cleanups.push(() => {
      if (layout.__sliveshowDetachGuard) {
        layout.detachWidget = layout.__sliveshowDetachGuard;
        delete layout.__sliveshowDetachGuard;
      }
    });
  };

  // clean up notebook layout for slideshow
  const miscStyles = async (
    session: ISlideshowSession,
    start: boolean = true
  ) => {
    const panel = session.deck;
    if (start) {
      panel.content.addClass('slide-container');
      panel.toolbar.addClass(SlideType.HIDDEN);
      if (session.windowed) {
        // Give the deck the toolbar's height too: a second view of the
        // notebook has no use for a toolbar nobody can see.
        panel.toolbar.hide();
      }

      guardLayoutDetach(session);

      // stop windowing update, which messes with cell rendering
      // code ref: jupyterlab-rise
      session.windowingMode = panel.content.notebookConfig.windowingMode;
      panel.content.notebookConfig = {
        ...panel.content.notebookConfig,
        windowingMode: 'none'
      };

      // Let any windowing work already scheduled for the next frame finish.
      // `_runOnIdleTime` queues `layout.removeWidget(cell)` inside a
      // requestAnimationFrame and only checks the windowing mode *before*
      // queueing it, so a callback queued a moment ago still runs. Removing a
      // widget whose node we have since moved into a slide both throws and
      // un-registers the cell, after which the next windowing pass steals the
      // node back out of the deck.
      await nextFrame();
      await nextFrame();

      // Register every cell in the layout at its own index. A cell missing
      // from the layout would be attached — i.e. moved back into the viewport
      // — by the next update; one already there at the right index makes that
      // update a no-op, which is what we want once the nodes live in the deck.
      const layout = panel.content.layout as any;
      if (layout?.insertWidget) {
        panel.content.widgets.forEach((cell: any, index: number) => {
          try {
            layout.insertWidget(index, cell);
          } catch (e) {
            console.warn('sliveshow: could not realise cell', index, e);
          }
        });
      }

      // detach cells
      session.viewport = panel.content.node.querySelector(
        '.jp-WindowedPanel-viewport'
      ) as HTMLElement | null;
      const cells = await getCells(panel);
      const viewport = session.viewport;
      if (viewport) {
        cells.forEach(cell => {
          try {
            viewport.removeChild(cell.node);
          } catch (e) {
            /* cell is already detached by Jupyter windowing */
          }
        });
      }

      panel.content.node
        .querySelectorAll('.jp-Notebook-footer')
        .forEach(footer => footer.classList.add(SlideType.HIDDEN));
    } else {
      panel.content.removeClass('slide-container');
      panel.toolbar.removeClass(SlideType.HIDDEN);
      if (session.windowed) {
        panel.toolbar.show();
      }

      // resume windowing update
      panel.content.notebookConfig = {
        ...panel.content.notebookConfig,
        windowingMode: session.windowingMode
      };
      // reattach cells
      const cells = await getCells(panel);
      const viewport =
        session.viewport ??
        (panel.content.node.querySelector(
          '.jp-WindowedPanel-viewport'
        ) as HTMLElement | null);
      if (viewport) {
        cells.forEach(cell => {
          viewport.appendChild(cell.node);
        });
      }

      for (let i = 0; i < panel.content.node.children.length; i++) {
        panel.content.node.children.item(i)?.classList.remove(SlideType.HIDDEN);
      }
      panel.content.node
        .querySelectorAll('.jp-Notebook-footer')
        .forEach(footer => footer.classList.remove(SlideType.HIDDEN));
    }
  };

  const getCells = async (panel: NotebookPanel) => {
    let cells: any[] = [];
    await panel.context.ready;
    await Promise.all(panel.content.widgets.map(cell => cell.ready)).then(
      () => {
        cells = [...panel.content.widgets];
      }
    );
    return cells;
  };

  const clearStyles = (node: any, slideType: boolean = true) => {
    if (slideType) {
      node.classList.remove(...Object.values(SlideType));
    }
    node.style.removeProperty('transition-duration');
    node.classList.remove(SlideType.HIDDEN);
    ['in', 'out'].forEach(dir => {
      node.classList.remove(
        ...Object.values(Transition).map(name => `${name}-${dir}`)
      );
      ['left', 'right', 'up', 'down'].forEach(side => {
        node.classList.remove(`${Transition.SLIDE}-${dir}-${side}`);
      });
    });
  };

  const clearAll = async (session: ISlideshowSession) => {
    const panel = session.deck;
    await miscStyles(session, false);
    session.layout.forEach(slide => {
      customStyle(panel.content.node, slide, false);
    });
    const cells = await getCells(panel);
    cells.forEach(cell => {
      clearStyles(cell.node);
      cell.node.classList.remove('hide-code');
    });
    session.layout = [];
  };
};

export default plugin;
