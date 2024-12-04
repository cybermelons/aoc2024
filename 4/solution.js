const fs = require("node:fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  main(data);
  mainCrossMas(data);
});

function makeGrid(inputStr) {
  const lines = inputStr.split("\n");
  const grid = lines.map((line) => line.split(""));
  return grid;
}

function isInVector(grid, x, y, vector) {
  const [vecX, vecY] = vector;
  try {
    const word = [
      grid[x][y],
      grid[x + vecX * 1][y + vecY * 1],
      grid[x + vecX * 2][y + vecY * 2],
      grid[x + vecX * 3][y + vecY * 3],
    ].join("");
    return word === "XMAS";
  } catch (e) {
    return false;
  }
}
function isCrossmasAt(grid, x, y) {
  // in 3x3, the corners must be two Ms and two S
  const center = grid[x][y];
  try {
    let corners = [
      grid[x - 1][y + 1], // keep this order
      grid[x + 1][y + 1],
      grid[x + 1][y - 1],
      grid[x - 1][y - 1],
    ];

    const joined = corners.join('');
    if (joined.startsWith("SS")) {
      return joined === "SSMM";
    } else if (joined.startsWith("SM")) {
      return joined === "SMMS";
    } else if (joined.startsWith("MS")) {
      return joined === "MSSM";
    } else {
      return joined === "MMSS";
    }
  } catch (e) {
    return false;
  }

  return false;
}

function countXmasAt(grid, x, y) {
  const directions = [
    isInVector(grid, x, y, [1, 0]),
    isInVector(grid, x, y, [-1, 0]),
    isInVector(grid, x, y, [0, 1]),
    isInVector(grid, x, y, [0, -1]),

    isInVector(grid, x, y, [1, 1]),
    isInVector(grid, x, y, [1, -1]),
    isInVector(grid, x, y, [-1, 1]),
    isInVector(grid, x, y, [-1, -1]),
  ];
  const counts = directions.reduce(
    (sum, result) => (result ? sum + 1 : sum),
    0,
  );
  return counts;
}

function mainCrossMas(input) {
  // find each X and do a floodfill from it to find xmas
  // run on every x
  const grid = makeGrid(input);
  const startLocations = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      const letter = grid[i][j];
      if (letter === "A") {
        startLocations.push([i, j]);
      }
    }
  }

  const xmasCountsPerLocation = startLocations.map(([x, y]) => {
    return isCrossmasAt(grid, x, y) ? 1 : 0;
  });

  const crossmasCounts = xmasCountsPerLocation.reduce(
    (sum, count) => sum + count,
    0,
  );
  console.log({ crossmasCounts });
}

function main(input) {
  // find each X and do a floodfill from it to find xmas
  // run on every x
  const grid = makeGrid(input);
  const startLocations = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      const letter = grid[i][j];
      if (letter === "X") {
        startLocations.push([i, j]);
      }
    }
  }

  const xmasCountsPerLocation = startLocations.map(([x, y]) => {
    return countXmasAt(grid, x, y);
  });
  const xmasCounts = xmasCountsPerLocation.reduce(
    (sum, count) => sum + count,
    0,
  );
  console.log({ xmasCounts });
}
