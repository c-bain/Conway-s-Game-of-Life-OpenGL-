#!/bin/bash

# Build script for Conway's Game of Life WebAssembly version
echo "Building Conway's Game of Life for the web..."

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
