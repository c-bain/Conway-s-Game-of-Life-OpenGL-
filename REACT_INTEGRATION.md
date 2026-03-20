# Running Conway's Game of Life in a React Portfolio

Use the built WebAssembly app inside your existing React site.

## 1. Add the built files to your React app

Copy the Emscripten output into your React project’s **public** folder so they are served as static files:

```bash
# From this repo (Conway-s-Game-of-Life-OpenGL-)
cp conway.js conway.wasm /path/to/your/react-portfolio/public/conway/
```

Create the folder if needed:

```bash
mkdir -p /path/to/your/react-portfolio/public/conway
cp conway.js conway.wasm /path/to/your/react-portfolio/public/conway/
```

Resulting structure:

```
your-react-portfolio/
  public/
    conway/
      conway.js
      conway.wasm
  src/
    ...
```

If your site is deployed at a subpath (e.g. `https://yoursite.com/`), serving from `public/conway/` means the files will be at `/conway/conway.js` and `/conway/conway.wasm`.

## 2. Add the React component

Use the `ConwayGameOfLife` component from `ConwayGameOfLife.jsx` (in this repo) in your React app:

- Copy `ConwayGameOfLife.jsx` into your React project (e.g. `src/components/ConwayGameOfLife.jsx`).
- In that file, set `CONWAY_BASE` to the URL path where you put the files. If they are in `public/conway/`, use `'/conway'` (see the comment in the file).

## 3. Use it on a page/route

Example for a route like `/conway` or `/projects/game-of-life`:

```jsx
import ConwayGameOfLife from './components/ConwayGameOfLife';

// In your router (e.g. React Router):
<Route path="/conway" element={<ConwayGameOfLife />} />
// or
<Route path="/projects/game-of-life" element={<ConwayGameOfLife />} />
```

Or render it directly on any page:

```jsx
<ConwayGameOfLife />
```

## 4. Rebuild after C changes

If you change `conway_web.c` or the build:

1. In this repo: `./build_web.sh` (with Emscripten in PATH).
2. Copy the new `conway.js` and `conway.wasm` into your React app’s `public/conway/` again.

## 5. Deploy

Build and deploy your React app as usual. The game will load `/conway/conway.js` and `/conway/conway.wasm` from your deployed site.

## Optional: base path

If your portfolio is served from a subpath (e.g. `https://yoursite.com/portfolio/`), set the base in the component so the script and WASM URLs are correct (e.g. `CONWAY_BASE = '/portfolio/conway'`). The component uses this for both the script and `Module.locateFile` for the WASM.
