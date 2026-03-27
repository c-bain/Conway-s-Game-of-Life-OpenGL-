const canvas = document.getElementById("life-canvas");
const ctx = canvas.getContext("2d");

const generationLabel = document.getElementById("generation");
const liveCellsLabel = document.getElementById("live-cells");
const gridSizeLabel = document.getElementById("grid-size");
const statusPill = document.getElementById("status-pill");
const toggleRunButton = document.getElementById("toggle-run");
const stepButton = document.getElementById("step-once");
const randomizeButton = document.getElementById("randomize");
const clearButton = document.getElementById("clear");
const speedInput = document.getElementById("speed");
const speedLabel = document.getElementById("speed-label");
const densityInput = document.getElementById("density");
const densityLabel = document.getElementById("density-label");
const patternPicker = document.getElementById("pattern-picker");

const COLS = 48;
const ROWS = 32;
const CELL_SIZE = canvas.width / COLS;

const patterns = {
  none: [],
  glider: [
    [1, 0],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  blinker: [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  toad: [
    [1, 0],
    [2, 0],
    [3, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  "lightweight-spaceship": [
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [0, 1],
    [4, 1],
    [4, 2],
    [0, 3],
    [3, 3],
  ],
  pulsar: [
    [2, 0],
    [3, 0],
    [4, 0],
    [8, 0],
    [9, 0],
    [10, 0],
    [0, 2],
    [5, 2],
    [7, 2],
    [12, 2],
    [0, 3],
    [5, 3],
    [7, 3],
    [12, 3],
    [0, 4],
    [5, 4],
    [7, 4],
    [12, 4],
    [2, 5],
    [3, 5],
    [4, 5],
    [8, 5],
    [9, 5],
    [10, 5],
    [2, 7],
    [3, 7],
    [4, 7],
    [8, 7],
    [9, 7],
    [10, 7],
    [0, 8],
    [5, 8],
    [7, 8],
    [12, 8],
    [0, 9],
    [5, 9],
    [7, 9],
    [12, 9],
    [0, 10],
    [5, 10],
    [7, 10],
    [12, 10],
    [2, 12],
    [3, 12],
    [4, 12],
    [8, 12],
    [9, 12],
    [10, 12],
  ],
};

let grid = createGrid();
let running = true;
let generation = 0;
let isPointerDown = false;
let lastTick = 0;
let tickRate = Number(speedInput.value);

function createGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function randomizeGrid(density = Number(densityInput.value) / 100) {
  grid = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => (Math.random() < density ? 1 : 0))
  );
  generation = 0;
  updateStats();
}

function clearGrid() {
  grid = createGrid();
  generation = 0;
  updateStats();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#1c1527";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;

      if (grid[row][col]) {
        ctx.fillStyle = "rgba(124, 255, 134, 0.25)";
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        ctx.fillStyle = "#7cff86";
        ctx.fillRect(x + 1.5, y + 1.5, CELL_SIZE - 3, CELL_SIZE - 3);
      }

      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

function countNeighbors(row, col) {
  let total = 0;

  for (let y = -1; y <= 1; y += 1) {
    for (let x = -1; x <= 1; x += 1) {
      if (x === 0 && y === 0) {
        continue;
      }

      const nextRow = row + y;
      const nextCol = col + x;

      if (
        nextRow >= 0 &&
        nextRow < ROWS &&
        nextCol >= 0 &&
        nextCol < COLS
      ) {
        total += grid[nextRow][nextCol];
      }
    }
  }

  return total;
}

function stepSimulation() {
  const next = createGrid();

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const neighbors = countNeighbors(row, col);
      const alive = grid[row][col] === 1;

      if (!alive && neighbors === 3) {
        next[row][col] = 1;
      } else if (alive && (neighbors === 2 || neighbors === 3)) {
        next[row][col] = 1;
      }
    }
  }

  grid = next;
  generation += 1;
  updateStats();
}

function countLiveCells() {
  return grid.reduce(
    (sum, row) => sum + row.reduce((rowSum, cell) => rowSum + cell, 0),
    0
  );
}

function updateStats() {
  generationLabel.textContent = String(generation);
  liveCellsLabel.textContent = String(countLiveCells());
  gridSizeLabel.textContent = `${COLS} x ${ROWS}`;
  speedLabel.textContent = `${tickRate} ms / generation`;
  densityLabel.textContent = `${densityInput.value}% live cells on randomize`;
  statusPill.textContent = running ? "Running" : "Paused";
  toggleRunButton.textContent = running ? "Pause" : "Run";
  toggleRunButton.classList.toggle("primary", running);
}

function toggleCellAtEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const col = Math.floor(x / CELL_SIZE);
  const row = Math.floor(y / CELL_SIZE);

  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
    return;
  }

  const selectedPattern = patternPicker.value;
  if (selectedPattern !== "none") {
    stampPattern(selectedPattern, row, col);
  } else {
    grid[row][col] = grid[row][col] ? 0 : 1;
  }

  updateStats();
  draw();
}

function stampPattern(name, anchorRow, anchorCol) {
  const offsets = patterns[name];
  if (!offsets) {
    return;
  }

  offsets.forEach(([dx, dy]) => {
    const row = anchorRow + dy;
    const col = anchorCol + dx;

    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      grid[row][col] = 1;
    }
  });
}

function animate(timestamp) {
  if (running && timestamp - lastTick >= tickRate) {
    stepSimulation();
    lastTick = timestamp;
  }

  draw();
  window.requestAnimationFrame(animate);
}

toggleRunButton.addEventListener("click", () => {
  running = !running;
  updateStats();
});

stepButton.addEventListener("click", () => {
  if (running) {
    running = false;
  }

  stepSimulation();
  updateStats();
});

randomizeButton.addEventListener("click", () => {
  randomizeGrid();
});

clearButton.addEventListener("click", () => {
  clearGrid();
});

speedInput.addEventListener("input", (event) => {
  tickRate = Number(event.target.value);
  updateStats();
});

densityInput.addEventListener("input", () => {
  updateStats();
});

canvas.addEventListener("pointerdown", (event) => {
  isPointerDown = true;
  toggleCellAtEvent(event);
});

canvas.addEventListener("pointermove", (event) => {
  if (!isPointerDown || patternPicker.value !== "none") {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const col = Math.floor(x / CELL_SIZE);
  const row = Math.floor(y / CELL_SIZE);

  if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
    grid[row][col] = 1;
    updateStats();
    draw();
  }
});

window.addEventListener("pointerup", () => {
  isPointerDown = false;
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key === " ") {
    event.preventDefault();
    running = !running;
  } else if (key === "c") {
    clearGrid();
  } else if (key === "r") {
    randomizeGrid();
  } else if (key === "n") {
    if (running) {
      running = false;
    }
    stepSimulation();
  }

  updateStats();
});

randomizeGrid();
updateStats();
window.requestAnimationFrame(animate);
