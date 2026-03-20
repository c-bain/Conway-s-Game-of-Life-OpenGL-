import { useEffect, useRef, useState } from 'react';

/**
 * Base URL for conway.js and conway.wasm.
 * - If files are in public/conway/ on the same origin: use '/conway'
 * - If portfolio is at a subpath (e.g. /portfolio): use '/portfolio/conway'
 */
const CONWAY_BASE = '/conway';

export default function ConwayGameOfLife() {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Emscripten expects a global Module before the script runs
    const canvas = document.createElement('canvas');
    canvas.id = 'conway-canvas';
    canvas.width = 700;
    canvas.height = 700;
    canvas.style.display = 'none';

    const outputDiv = document.createElement('div');
    outputDiv.id = 'conway-output';
    outputDiv.style.cssText =
      'background:#2d3748;color:#48bb78;padding:15px;border-radius:10px;font-family:monospace;font-size:12px;max-height:200px;overflow-y:auto;margin-top:12px;';

    const base = CONWAY_BASE.replace(/\/$/, '');
    window.Module = {
      preRun: [],
      postRun: [],
      locateFile: (path) => `${base}/${path}`,
      print: (function () {
        return function (text) {
          if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
          console.log(text);
          if (outputDiv) {
            outputDiv.innerHTML += text + '\n';
            outputDiv.scrollTop = outputDiv.scrollHeight;
          }
        };
      })(),
      canvas,
      onRuntimeInitialized: () => {
        setLoading(false);
        canvas.style.display = 'block';
      },
    };

    container.appendChild(canvas);
    container.appendChild(outputDiv);

    const script = document.createElement('script');
    script.src = `${base}/conway.js`;
    script.async = true;
    script.onerror = () => {
      setError('Failed to load Conway script. Ensure conway.js and conway.wasm are in public/conway/.');
      setLoading(false);
    };
    script.onload = () => {
      scriptLoadedRef.current = true;
    };
    document.body.appendChild(script);

    return () => {
      script.remove();
      if (container.contains(canvas)) container.removeChild(canvas);
      if (container.contains(outputDiv)) container.removeChild(outputDiv);
      if (window.Module && window.Module.canvas === canvas) {
        window.Module = undefined;
      }
    };
  }, []);

  return (
    <div className="conway-container" style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Conway's Game of Life</h1>
      <div
        style={{
          background: '#f5f5f5',
          borderRadius: 10,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h3 style={{ marginTop: 0, color: '#555' }}>Controls</h3>
        <p><kbd>C</kbd> Clear · <kbd>R</kbd> Randomize · <kbd>P</kbd> Pause · <kbd>S</kbd> Speed · Click grid to toggle</p>
      </div>
      {error && (
        <div style={{ color: '#c53030', padding: 12, background: '#fff5f5', borderRadius: 8 }}>
          {error}
        </div>
      )}
      {loading && !error && (
        <div style={{ textAlign: 'center', padding: 24, color: '#667eea' }}>
          Loading Conway's Game of Life…
        </div>
      )}
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      />
    </div>
  );
}
