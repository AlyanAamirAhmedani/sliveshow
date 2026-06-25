# sliveshow — live demo (JupyterLite)

A browser-only [JupyterLite](https://jupyterlite.readthedocs.io) deployment of
**sliveshow**, so anyone can try the slideshow without installing anything.

**Live site:** https://alyanaamirahmedani.github.io/sliveshow/

## How it works

- `requirements.txt` — installed in CI. `jupyter lite build` automatically
  bundles the `sliveshow` labextension from this environment, so the
  **Sliveshow** menu appears in the Lite interface.
- `environment.yml` — defines a **xeus-python** kernel. Unlike pyodide, xeus
  lets packages (`numpy`, `matplotlib`, …) be **pre-installed** into the kernel,
  available in the browser with no `pip` step.
- `content/` — the notebooks shipped in the site (`sliveshow_demo.ipynb`).

## Deploying

Deployment is automatic via `.github/workflows/deploy-demo.yml` on every push
that touches `jupyterlite-demo/`. One-time setup on the GitHub repo:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. Push a change under `jupyterlite-demo/` (or run the _Deploy demo_ workflow
   manually from the Actions tab).
3. After it succeeds, the site is live at the URL above.

## Building locally (optional)

```bash
cd jupyterlite-demo
python -m pip install -r requirements.txt
jupyter lite build --contents content --output-dir _output
jupyter lite serve --output-dir _output   # open the printed localhost URL
```
