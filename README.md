# Conway-s-Game-of-Life-OpenGL-
Conway's game of life in OpenGL. 

## Running on Desktop
To run the desktop version, navigate to the file and execute:
```bash
make conway
```

## Running on the Web 🌐

You can now run Conway's Game of Life directly in your web browser using WebAssembly!

### Quick Start

1. **Start a local web server** in the project directory:
   ```bash
   python3 -m http.server 8000
   ```
   
2. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

3. The game will load in your browser! Use the on-screen controls to interact with the simulation.

### Building from Source

The repository includes pre-built WebAssembly files (`conway.js` and `conway.wasm`). To rebuild:

#### Prerequisites
Install Emscripten:
```bash
sudo apt-get install emscripten
```

#### Build
Run the build script:
```bash
./build_web.sh
```

Or manually:
```bash
emcc conway_web.c -o conway.js -lglut -s ALLOW_MEMORY_GROWTH=1 -s FULL_ES2=1 -O2
```

### Web Controls
- **C** - Clear the grid
- **R** - Refresh and randomize the grid  
- **P** - Pause/Resume the simulation
- **S** - Cycle through speed levels (Normal → Slower → Slower → Slower → Normal)
- **Click** - Toggle individual cells on the grid

### Technical Notes

The web version uses:
- **Emscripten** - Compiles C code to WebAssembly
- **WebGL** - For OpenGL rendering in the browser
- **GLUT** - Cross-platform windowing (emulated by Emscripten)

The original desktop OpenGL code has been adapted for web compatibility:
- Removed dependency on `unistd.h` (not available in web environment)
- Replaced `usleep()` with frame-based timing for smoother browser performance
- Added responsive HTML5 canvas interface

### Known Limitations

The system version of Emscripten (3.1.6 from apt) has limited support for legacy OpenGL immediate-mode rendering functions. For the best experience with full graphics rendering, consider using Emscripten 3.1.20 or later from the official Emscripten SDK.

### Files

- `index.html` - Web interface with styled controls
- `conway_web.c` - Web-compatible C source code
- `conway.js` - Compiled JavaScript (generated)
- `conway.wasm` - WebAssembly binary (generated)
- `build_web.sh` - Build script for WebAssembly version

