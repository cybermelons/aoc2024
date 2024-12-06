const fs = require("node:fs");

fs.readFile("sample.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  main(data);
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
  map[startY][startX] = ".";

  return {
    map,
    startX,
    startY,
  };
}
function main(input) {
  let { map: startMap, startX, startY } = makeMap(input);

  let processed = processMap(startMap, startX, startY, "up");

  while (!processed.done) {
		printMap(processed.map)
    processed = processMap(
      processed.map,
      processed.nextX,
      processed.nextY,
      processed.direction,
    );
  }

  const numVisited = countVisited(processed.map);
	printMap(processed.map)
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

function processMap(map, x, y, direction) {
  console.log(x, y, direction);
  const currentTile = map[y][x];

  let newDirection = direction;
  let vector = getVector(direction);
  let [nextX, nextY] = [x + vector[0], y + vector[1]];
  console.log({ vector, direction, nextX, nextY });
  try {
    let nextTile = map[nextY][nextX];

    console.log({ nextTile }, `at ${nextX}, ${nextY}`);
    if (nextTile === "#") {
      console.log("reset", { nextTile });
      newDirection = turnRight(direction);
      nextX = x; // reset
      nextY = y;
    }

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
	const str = map.map(rows => rows.join('')).join('\n')
	console.log(str)
}
