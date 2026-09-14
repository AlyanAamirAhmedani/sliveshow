/**
 * Keep jupyterlab-myst hover previews visible during a sliveshow slideshow.
 *
 * `startReveal` puts the notebook panel into native fullscreen
 * (`panel.content.node.requestFullscreen()`). The Fullscreen API renders that
 * element in the browser's top layer and paints *nothing else* in the document.
 *
 * jupyterlab-myst draws its hover previews (citations, cross-references,
 * footnotes, and the wiki / GitHub / RoR / RRID link cards) with
 * `HoverPopover`, which wraps Radix `HoverCard.Portal`. myst passes no
 * `container`, and Radix's Portal defaults to `document.body` — a sibling of
 * the fullscreen element, not a descendant. So the card mounts, positions
 * itself correctly, and is never painted.
 *
 * Re-parenting is not an option: React unmounts a portal with
 * `container.removeChild(node)` against the *original* container, so once the
 * node has moved out of `document.body` every un-hover throws. Promote each
 * card into the top layer with the Popover API instead — top-layer elements
 * paint above a fullscreen element, and React keeps ownership of the node.
 */

const RADIX_PORTAL = '[data-radix-popper-content-wrapper]';
const PROMOTED = 'sliveshow-top-layer';

function popoverSupported(): boolean {
  return (
    typeof HTMLElement !== 'undefined' &&
    typeof (HTMLElement.prototype as any).showPopover === 'function'
  );
}

function promote(el: HTMLElement): void {
  const fs = document.fullscreenElement;
  // Already inside the painted subtree, or not presenting — leave it alone.
  if (!fs || fs.contains(el)) {
    return;
  }
  try {
    if (!el.hasAttribute('popover')) {
      el.setAttribute('popover', 'manual');
    }
    el.classList.add(PROMOTED);
    (el as any).showPopover();
  } catch {
    // Not connected yet, or already open. Either is harmless.
  }
}

function demote(el: HTMLElement): void {
  try {
    (el as any).hidePopover?.();
  } catch {
    // Already closed.
  }
  el.removeAttribute('popover');
  el.classList.remove(PROMOTED);
}

/**
 * Install the observer. Safe to call once at plugin activation: it does
 * nothing at all unless a slideshow is actually in fullscreen.
 */
export function installTopLayerPortals(): () => void {
  if (!popoverSupported()) {
    console.warn(
      'sliveshow: Popover API unavailable — myst hover previews will stay ' +
        'hidden in fullscreen on this browser.'
    );
    return () => undefined;
  }

  const promoteAllIn = (root: ParentNode): void => {
    root
      .querySelectorAll?.(RADIX_PORTAL)
      .forEach(n => promote(n as HTMLElement));
  };

  const observer = new MutationObserver(records => {
    if (!document.fullscreenElement) {
      return;
    }
    for (const record of records) {
      record.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) {
          return;
        }
        if (node.matches(RADIX_PORTAL)) {
          promote(node);
        } else {
          promoteAllIn(node);
        }
      });
    }
  });

  const onFullscreenChange = (): void => {
    if (document.fullscreenElement) {
      // A card may already be open from the hover that preceded fullscreen.
      promoteAllIn(document.body);
    } else {
      document
        .querySelectorAll(`.${PROMOTED}`)
        .forEach(n => demote(n as HTMLElement));
    }
  };

  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('fullscreenchange', onFullscreenChange);
  onFullscreenChange();

  return () => {
    observer.disconnect();
    document.removeEventListener('fullscreenchange', onFullscreenChange);
    document
      .querySelectorAll(`.${PROMOTED}`)
      .forEach(n => demote(n as HTMLElement));
  };
}

export default installTopLayerPortals;
