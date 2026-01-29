#!/bin/bash

# Build script for Conway's Game of Life WebAssembly version
echo "Building Conway's Game of Life for the web..."

emcc conway_web.c \
    -o conway.js \
    -s USE_GLUT=3 \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s LEGACY_GL_EMULATION=1 \
    -s GL_UNSAFE_OPTS=0 \
    --shell-file index.html \
    -O3

if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "Open index.html in a web browser to run the game."
    echo "You can use a local web server like:"
    echo "  python3 -m http.server 8000"
    echo "Then open http://localhost:8000 in your browser."
else
    echo "Build failed!"
    exit 1
fi
