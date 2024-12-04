const fs = require("node:fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  main(data);
});

function makeGrid(inputStr) {
  const lines = inputStr.split("\n");
  const grid = lines.map((line) => line.split(""));
  return grid;
}

function isLeftToRight(grid, x, y) {
  try {
    const leftToRight = [
      grid[x][y],
      grid[x + 1][y],
      grid[x + 2][y],
      grid[x + 3][y],
    ].join("");
    return leftToRight === "XMAS";
  } catch (e) {
    return false;
  }
}
function isUpDown(grid, x, y) {
  try {
    const upDown = [
      grid[x][y],
      grid[x][y + 1],
      grid[x][y + 2],
      grid[x][y + 3],
    ].join("");
    return upDown === "XMAS";
  } catch (e) {
    return false;
  }
}

function isDownUp(grid, x, y) {
  try {
    const upDown = [
      grid[x][y],
      grid[x][y - 1],
      grid[x][y - 2],
      grid[x][y - 3],
    ].join("");
    return upDown === "XMAS";
  } catch (e) {
    return false;
  }
}
function isDiagRight(grid, x, y) {
  try {
    const word = [
      grid[x][y],
      grid[x + 1][y + 1],
      grid[x + 2][y + 2],
      grid[x + 3][y + 3],
    ].join("");
    return word === "XMAS";
  } catch (e) {
    return false;
  }
}
function isDiagRight(grid, x, y) {
  try {
    const word = [
      grid[x][y],
      grid[x + 1][y + 1],
      grid[x + 2][y + 2],
      grid[x + 3][y + 3],
    ].join("");
    return word === "XMAS";
  } catch (e) {
    return false;
  }
}

function isRightToLeft(grid, x, y) {
  try {
    const rightToLeft = [
      grid[x][y],
      grid[x - 1][y],
      grid[x - 2][y],
      grid[x - 3][y],
    ].join("");
    return rightToLeft === "XMAS";
  } catch (e) {
    return false;
  }
}
function isInVector(grid, x, y, vector) {
  const [vecX, vecY] = vector;
  try {
    const rightToLeft = [
      grid[x][y],
      grid[x + vecX * 1][y + vecY * 1],
      grid[x + vecX * 2][y + vecY * 2],
      grid[x + vecX * 3][y + vecY * 3],
    ].join("");
    return rightToLeft === "XMAS";
  } catch (e) {
    return false;
  }
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
  console.log({ x, y, counts });
  return counts;
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
