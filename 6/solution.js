const fs = require("node:fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  main(data);
  findLoopSpots(data);
});

// tiles are accessed as map[Y][X] actually. confusing.
function makeMap(mapStr) {
  const rows = mapStr.split("\n").filter((str) => !!str);
  const map = rows.map((row) => row.split(""));

  const startChar = "^";
  const startY = map.findIndex(
    (row) => row.findIndex((c) => c === startChar) !== -1,
  );

  const startX = map[startY].findIndex((c) => c === startChar);

  return {
    map,
    startX,
    startY,
  };
}

function findLoopSpots(input) {
  const guardPath = getGuardPath(input);
  guardPath.shift(); // start position can't be used

  const possibleMaps = guardPath.reduce((sum, obstacleLocation, i) => {
    let [obsX, obsY] = obstacleLocation;
    let { map, startX, startY } = makeMap(input);

    map[obsY][obsX] = "O";

    if (detectLoop(map, startX, startY)) {
      return [...sum, map];
    }
    return sum;
  }, []);

  const numLoops = possibleMaps.length;
  console.log({ numLoops });
}

function detectLoop(map, startX, startY) {
  // run simulation until either:
  // we detect loop in the path
  // we terminate normally
  let processed = processMap(map, startX, startY, "up");

  let path = [
    {
      direction: "up",
      x: startX,
      y: startY,
    },
  ];

  while (!processed.done) {
    processed = processMap(
      processed.map,
      processed.nextX,
      processed.nextY,
      processed.direction,
    );

    const { nextX, nextY, direction } = processed;
    if (nextX !== undefined && nextY !== undefined) {
      path.push({
        direction,
        x: nextX,
        y: nextY,
      });
    }

    if (pathHasLoop(path)) {
      return true;
    }
  }

  return false;
}

function pathHasLoop(path) {
  if (path.length < 4) return false;

  // only need to check if the last element is a dupe
  const { direction, x, y } = path[path.length - 1];

  // path has loop if the path has hit the spot, same direction.
  const otherIdx = path.findIndex(
    (other, j) =>
      j !== path.length - 1 &&
      other.direction === direction &&
      other.x === x &&
      other.y === y,
  );


  return otherIdx >= 0;
}

function getGuardPath(input) {
  let { map: startMap, startX, startY } = makeMap(input);

  let processed = processMap(startMap, startX, startY, "up");
  let path = [[startX, startY]];

  while (!processed.done) {
    processed = processMap(
      processed.map,
      processed.nextX,
      processed.nextY,
      processed.direction,
    );
  }

  for (let i = 0; i < processed.map.length; i++) {
    const row = processed.map[i];
    for (let j = 0; j < row.length; j++) {
      const char = row[j];
      if (char === "X") {
        path.push([j, i]);
      }
    }
  }
  return path;
}

function main(input) {
  let { map: startMap, startX, startY } = makeMap(input);

  let processed = processMap(startMap, startX, startY, "up");

  while (!processed.done) {
    processed = processMap(
      processed.map,
      processed.nextX,
      processed.nextY,
      processed.direction,
    );
  }

  const numVisited = countVisited(processed.map);
  //printMap(processed.map);
  console.log({ numVisited });
}

function countVisited(map) {
  let numVisited = 0;

  for (const row of map) {
    for (const char of row) {
      if (char === "X") {
        numVisited += 1;
      }
    }
  }
  return numVisited;
}

function getVector(direction) {
  let vector = [0, 0];
  if (direction === "up") {
    vector = [0, -1];
  } else if (direction === "down") {
    vector = [0, 1];
  } else if (direction === "left") {
    vector = [-1, 0];
  } else if (direction === "right") {
    vector = [1, 0];
  }
  return vector;
}

// each step, either turn or travel.
function processMap(map, x, y, direction) {
  const currentTile = map[y][x];

  let newDirection = direction;
  let vector = getVector(direction);
  let [nextX, nextY] = [x + vector[0], y + vector[1]];
  try {
    let nextTile = map[nextY][nextX];

    if (nextTile === "#" || nextTile === "O") {
      // turn
      return {
        map,
        direction: turnRight(direction),
        nextX: x,
        nextY: y,
        done: false,
      };
    } else if (nextTile === undefined) {
      // finished
      return {
        map,
        direction: newDirection,
        done: true,
      };
    }

    // moved
    return {
      nextX,
      nextY,
      direction: newDirection,
      map,
      done: false,
    };
  } catch (e) {
    return {
      map,
      direction: newDirection,
      done: true,
    };
  } finally {
    map[y][x] = "X";
  }
}

function turnRight(direction) {
  // turn right, so up->right->down->left
  if (direction === "up") {
    return "right";
  } else if (direction === "right") {
    return "down";
  } else if (direction === "down") {
    return "left";
  } else if (direction === "left") {
    return "up";
  }
}
function printMap(map) {
  const str = map.map((rows) => rows.join("")).join("\n");
  console.log(str);
}
