#!/bin/bash

# Build script for Conway's Game of Life WebAssembly version
echo "Building Conway's Game of Life for the web..."

# Try to load Emscripten if emcc is not in PATH
if ! command -v emcc &>/dev/null; then
    for emsdk in "$HOME/emsdk/emsdk_env.sh" "/opt/emsdk/emsdk_env.sh"; do
        if [ -f "$emsdk" ]; then
            echo "Sourcing Emscripten from $emsdk"
            # shellcheck source=/dev/null
            source "$emsdk" 2>/dev/null || . "$emsdk" 2>/dev/null
            break
        fi
    done
fi

if ! command -v emcc &>/dev/null; then
    echo "Error: emcc (Emscripten) not found."
    echo ""
    echo "Install Emscripten SDK (emsdk), then run this script again:"
    echo "  git clone https://github.com/emscripten-core/emsdk.git \$HOME/emsdk"
    echo "  cd \$HOME/emsdk"
    echo "  ./emsdk install latest"
    echo "  ./emsdk activate latest"
    echo "  source ./emsdk_env.sh"
    echo "  cd - && ./build_web.sh"
    exit 1
fi

emcc conway_web.c \
    -o conway.js \
    -lglut \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s FULL_ES2=1 \
    -O2

if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo ""
    echo "To run the game:"
    echo "1. Start a local web server:"
    echo "   python3 -m http.server 8000"
    echo ""
    echo "2. Open http://localhost:8000 in your browser"
    echo ""
    echo "Note: The system version of Emscripten (3.1.6) has limited"
    echo "OpenGL support. For best results, use Emscripten 3.1.20 or later"
    echo "which has better GLUT/OpenGL emulation."
else
    echo "Build failed!"
    exit 1
fi
