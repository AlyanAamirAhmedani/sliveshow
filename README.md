# sliveshow

[![Github Actions Status](https://github.com/AlyanAamirAhmedani/sliveshow/workflows/Build/badge.svg)](https://github.com/AlyanAamirAhmedani/sliveshow/actions/workflows/build.yml)

A JupyterLab extension that turns Jupyter notebooks into live, animated Reveal.js slideshows — with scrollable slides, SVG animations, and MyST directive support for Jupyter Book 2.

**Install:**

```bash
pip install sliveshow
```

**PyPI:** https://pypi.org/project/sliveshow/  
**Demo:** https://ltshum.github.io/jupyterlite/lab/index.html  
_(Run all cells before starting the slideshow to display animations correctly.)_

---

## Requirements

- JupyterLab >= 4.0.0

## Install

```bash
pip install sliveshow
```

## Uninstall

```bash
pip uninstall sliveshow
```

---

## Usage

### Slideshow

The slideshow uses the [Reveal.js](https://revealjs.com/) framework. Set the slide type of each cell via **COMMON TOOLS > Slide Type**. Available types: **Slide**, **Sub-Slide**, **Fragment**, **Skip**.

![Slide type panel](https://github.com/ltshum/fyp-custom-slideshow/blob/main/Demo/common_tools.png?raw=true)

Transition type and duration are set per-cell in **SLIDESHOW TOOLS**. Available types: **Slide**, **Fade**, **Zoom**. The default can be changed in Settings.

For **Slide** transitions, direction is **Horizontal** (Slides) or **Vertical** (Sub-Slides) by default.

![Transition settings](https://github.com/ltshum/fyp-custom-slideshow/blob/main/Demo/transition.png?raw=true)

Code cell input can be hidden via **Hide Code Cell**, showing only the output.

![Hide code cell](https://github.com/ltshum/fyp-custom-slideshow/blob/main/Demo/code_cell.png?raw=true)

To start a slideshow, use the **Slideshow** menu → **Start from first cell** or **Start from current cell**. To exit, press Escape or use **Exit slideshow**.

![Start slideshow](https://github.com/ltshum/fyp-custom-slideshow/blob/main/Demo/start_slideshow.png?raw=true)

---

### SVG Animation

SVG animations use the [Reveal.js Animate plugin by Asvin Goel](https://github.com/rajgoel/reveal.js-plugins). Animations load after the slideshow starts.

#### Method A — Raw HTML in a markdown cell

Add a `<div data-animate>` block containing your SVG and a JSON config comment directly in a markdown cell:

```markdown
<div data-animate>
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
  <circle id="c1" cx="150" cy="150" r="60" style="fill:steelblue"/>
</svg>
<!--
{
  "setup": [{
    "element": "#c1",
    "modifier": "attr",
    "parameters": [{ "r": 100 }],
    "duration": 1500,
    "begin": 0
  }]
}
-->
</div>
```

#### Method B — `{svg-animate}` MyST directive _(recommended)_

Use the `{svg-animate}` directive in a markdown cell. The same cell works in both the live Reveal.js slideshow **and** a static [Jupyter Book 2](https://jupyterbook.org) / [mystmd](https://mystmd.org) export:

```
:::{svg-animate} Circle animation
:height: 320px
:background: white
<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
  <circle id='c1' cx='150' cy='150' r='60' style='fill:steelblue'/>
</svg>
<!--
{
  "setup": [{ "element": "#c1", "modifier": "attr", "parameters": [{ "r": 100 }], "duration": 1500, "begin": 0 }]
}
-->
:::
```

To enable `{svg-animate}` in a mystmd/Jupyter Book 2 build, add the plugin to your `myst.yml`:

```yaml
project:
  plugins:
    - svg-animate.mjs
```

The `svg-animate.mjs` plugin file is included in the `Demo/` folder.

![SVG animation](https://github.com/ltshum/fyp-custom-slideshow/blob/main/Demo/SVG.png?raw=true)

The JSON config controls the animation. `setup` runs on load; `animation` runs per fragment. See the [Animate plugin README](https://github.com/rajgoel/reveal.js-plugins/blob/master/animate/README.md) for full options.

![SVG animation config](https://github.com/ltshum/fyp-custom-slideshow/blob/main/Demo/SVG_anim.png?raw=true)

---

### MathJax SVG

MathJax 4 converts math expressions into SVG, which can be animated. Select components with `g[data-latex='x']`, shortened to `mj['x']`.

![MathJax](https://github.com/ltshum/fyp-custom-slideshow/blob/main/Demo/mathjax.png?raw=true)

---

## Contributing

### Development install

You will need Node.js and JupyterLab installed.

```bash
# Clone the repo
git clone https://github.com/AlyanAamirAhmedani/sliveshow
cd sliveshow

# Install in development mode
pip install -e "."

# Link with JupyterLab
jupyter labextension develop . --overwrite

# Build TypeScript
jlpm build
```

Watch mode (auto-rebuild on save):

```bash
# Terminal 1
jlpm watch

# Terminal 2
jupyter lab
```

### Development uninstall

```bash
pip uninstall sliveshow
```

Remove the symlink created by `jupyter labextension develop`:

```bash
jupyter labextension list  # find labextensions folder
# remove the sliveshow symlink from that folder
```

### Packaging

See [RELEASE](RELEASE.md).
