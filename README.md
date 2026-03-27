# Conway's Game of Life: Native to Web

This project started as a native OpenGL take on Conway's Game of Life. It now
also includes a browser-based version that keeps the same core interactions
while making the simulation easy to run as a web app.

## Web App

The new default experience is the static browser app:

1. From the project root, start any simple web server.
2. Open the served `index.html` page in your browser.

Examples:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

### Browser Controls

- Click to toggle cells.
- Click and drag to paint live cells.
- Use `Pause`, `Run`, `Step`, `Randomize`, and `Clear`.
- Use the speed and density sliders to shape the simulation.
- Pick a pattern and click the grid to stamp it.
- Keyboard shortcuts:
  - `Space`: pause or run
  - `C`: clear
  - `R`: randomize
  - `N`: step once

## Legacy Native Version

The original GLUT/OpenGL implementation is still here in [`conway.c`](./conway.c)
and can be built with:

```bash
make conway
```
