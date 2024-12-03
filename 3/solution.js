const fs = require("node:fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
	main(data)
});

function main(input) {
  const mulRegex = /mul\((\d+),(\d+)\)/g;
  const mulMatches = [...input.matchAll(mulRegex)];
  const equations = mulMatches.map(([match, leftStr, rightStr]) => [
    parseInt(leftStr),
    parseInt(rightStr),
  ]);

  const total = equations.reduce((sum, [left, right]) => sum + left * right, 0);

  console.log({ equations });
  console.log({ total });
}
