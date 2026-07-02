/*****************************************************************
 ** Standalone driver for Rajgoel-style SVG animations.
 **
 ** Runs the same `data-animate` blocks as animate.js (the Reveal.js
 ** plugin by Asvin Goel) but WITHOUT a Reveal deck, so animations can
 ** play directly inside the normal JupyterLab notebook view (see
 ** src/notebookAnimate.ts). Reveal fragments don't exist here, so all
 ** animation stages are played back-to-back on a single timeline.
 **
 ** Config format is identical to animate.js: a JSON object in an HTML
 ** comment with optional `setup`, `animation` and `loop` keys, and the
 ** same `mj[...]` → `g[data-latex=...]` MathJax selector shorthand.
 **
 ** Derived from animate.js, MIT license, Copyright (C) 2023 Asvin Goel.
 ******************************************************************/

'use strict';

import { SVG, Timeline } from '@svgdotjs/svg.js';

function parseJSON(str) {
  str = str.replace(/(\r\n|\n|\r|\t)/gm, ''); // remove line breaks and tabs
  var json;
  try {
    json = JSON.parse(str, function (key, value) {
      if (
        value &&
        typeof value === 'string' &&
        value.indexOf('function') === 0
      ) {
        // we can only pass a function as string in JSON ==> doing a real function
        var jsFunc = new Function('return ' + value)();
        return jsFunc;
      }
      return value;
    });
  } catch (e) {
    return null;
  }
  return json;
}

function parseComments(element) {
  var config = {};
  var comments = element.innerHTML.trim().match(/<!--[\s\S]*?-->/g);
  if (comments !== null) {
    for (var k = 0; k < comments.length; k++) {
      comments[k] = comments[k].replace(/<!--/, '');
      comments[k] = comments[k].replace(/-->/, '');
      config = parseJSON(comments[k]);

      if (config && typeof config === 'object') {
        if (
          config.animation &&
          Array.isArray(config.animation) &&
          config.animation.length &&
          !Array.isArray(config.animation[0])
        ) {
          // without fragments, the animation can be specified as a single
          // array (animation steps)
          config.animation = [config.animation];
        }
        break;
      }
    }
  }
  return config;
}

// Same selector preprocessing as animate.js: escape backslashes for
// querySelector and expand the mj[...] MathJax shorthand to the data-latex
// attributes MathJax 4 puts on its SVG output.
function formatSelector(selector) {
  var formatted = selector.replaceAll('\\', '\\\\');
  if (formatted.includes('mj[')) {
    formatted = formatted.replaceAll('mj[', 'g[data-latex=');
  }
  return formatted;
}

/**
 * Set up and play the animation of a single `[data-animate]` container.
 *
 * Applies the `setup` steps immediately, then builds one svg.js Timeline
 * from all `animation` stages and autoplays it. If the config contains
 * `"loop": true` the timeline restarts when it finishes. Double-clicking
 * the container replays the animation from the start.
 *
 * Returns a handle with a `dispose()` method (or null if the container
 * has no SVG to animate), so the caller can stop the animation when the
 * cell is re-rendered or removed.
 */
export function animateContainer(container) {
  var config = parseComments(container) || {};
  var svgs = [...container.querySelectorAll('svg')].map(svg => SVG(svg));
  if (!svgs.length) {
    return null;
  }

  // --- setup steps (identical semantics to animate.js) ---
  var setup = config.setup;
  if (setup) {
    for (var i = 0; i < setup.length; i++) {
      try {
        if (setup[i].element) {
          var formattedElement = formatSelector(setup[i].element);
          var elements = svgs.map(svg => svg.find(formattedElement));
          if (!elements.some(list => list.length)) {
            console.warn(
              'Cannot find element to set up with selector: ' +
                formattedElement +
                '!'
            );
          }
          for (var j = 0; j < elements.length; j++) {
            if (typeof setup[i].modifier === 'function') {
              setup[i].modifier.apply(elements[j], setup[i].parameters);
            } else {
              elements[j][setup[i].modifier].apply(
                elements[j],
                setup[i].parameters
              );
            }
          }
        } else {
          svgs.forEach(svg => {
            if (typeof setup[i].modifier === 'function') {
              setup[i].modifier.apply(svg, setup[i].parameters);
            } else {
              svg[setup[i].modifier].apply(svg, setup[i].parameters);
            }
          });
        }
      } catch (error) {
        console.error(
          "Error '" + error + "' setting up element " + JSON.stringify(setup[i])
        );
      }
    }
  }

  // --- build the timeline (all stages played sequentially) ---
  var animations = config.animation;
  if (!animations || !animations.length) {
    // setup-only block: applied above, nothing to drive
    return null;
  }

  var timeline = new Timeline().persist(true);
  var totalEnd = 0;
  for (var stage = 0; stage < animations.length; stage++) {
    for (var s = 0; s < animations[stage].length; s++) {
      var step = animations[stage][s];
      try {
        var stepSelector = formatSelector(step.element);
        var found = svgs.map(svg => svg.find(stepSelector));
        if (!found.some(list => list.length)) {
          console.warn(
            'Cannot find element to animate with selector: ' +
              stepSelector +
              '!'
          );
        }
        for (var f = 0; f < found.length; f++) {
          found[f].timeline(timeline);
          var anim = found[f].animate(step.duration, step.delay, step.when);
          anim[step.modifier].apply(anim, step.parameters);
        }
      } catch (error) {
        console.error(
          "Error '" + error + "' setting up animation " + JSON.stringify(step)
        );
      }
    }
    var schedule = timeline.schedule();
    if (schedule.length) {
      totalEnd = schedule[schedule.length - 1].end;
    }
  }
  timeline.stop();

  // --- playback control ---
  var state = { disposed: false, timer: null };

  function playFromStart() {
    if (state.disposed) {
      return;
    }
    if (state.timer) {
      clearTimeout(state.timer);
      state.timer = null;
    }
    timeline.time(0);
    timeline.play();
    // At the end of the timeline: restart when looping, else freeze on the
    // final frame (persist(true) keeps it).
    state.timer = setTimeout(function () {
      state.timer = null;
      if (state.disposed) {
        return;
      }
      if (config.loop) {
        playFromStart();
      } else {
        timeline.pause();
      }
    }, totalEnd + 50);
  }

  function restart() {
    playFromStart();
  }

  playFromStart();
  // double-click replays the animation (handy in the notebook view)
  container.addEventListener('dblclick', restart);

  return {
    dispose: function () {
      state.disposed = true;
      if (state.timer) {
        clearTimeout(state.timer);
        state.timer = null;
      }
      try {
        timeline.stop();
      } catch (e) {
        /* SVG may already be gone from the DOM */
      }
      container.removeEventListener('dblclick', restart);
    }
  };
}
