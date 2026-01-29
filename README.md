# Conway-s-Game-of-Life-OpenGL-
Conway's game of life in OpenGL. 

## Running on Desktop
To run the desktop version, navigate to the file and execute:
```bash
make conway
```

## Running on the Web
You can now run Conway's Game of Life directly in your web browser!

### Option 1: Use the pre-built version
1. Open `index.html` in a web browser using a local web server
2. For example, using Python:
   ```bash
   python3 -m http.server 8000
   ```
3. Open your browser and navigate to `http://localhost:8000`

### Option 2: Build it yourself
1. Install Emscripten (if not already installed):
   ```bash
   sudo apt-get install emscripten
   ```
2. Build the WebAssembly version:
   ```bash
   ./build_web.sh
   ```
   Or manually:
   ```bash
   emcc conway_web.c -o conway.js -lglut -s ALLOW_MEMORY_GROWTH=1 -s LEGACY_GL_EMULATION=1 -O3
   ```
3. Serve the files with a local web server (see Option 1 step 2-3)

### Controls (Web Version)
- **C** - Clear the grid
- **R** - Refresh and randomize the grid
- **P** - Pause/Resume the simulation
- **S** - Cycle through speed levels (Normal → Slower → Slower → Slower → Normal)
- **Click** - Toggle individual cells on the grid

