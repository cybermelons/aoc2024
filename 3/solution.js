const fs = require("node:fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  main(data);
});

function sumOfMults(input) {
  const mulRegex = /mul\((\d+),(\d+)\)/g;
  const mulMatches = [...input.matchAll(mulRegex)];
  const equations = mulMatches.map(([match, leftStr, rightStr]) => [
    parseInt(leftStr),
    parseInt(rightStr),
  ]);

  const total = equations.reduce((sum, [left, right]) => sum + left * right, 0);
  console.log({ equations });
  return total;
}

function main(input) {
  const total = sumOfMults(input);

  const sections = input
    .split(/(do\(\))|(don't\(\))/)
    .filter((d) => d !== undefined);

  let isDoMode = true;
  const sumsOfEnabled = [];
  for (const line of sections) {
    if (line === "don't()") {
      isDoMode = false;
    } else if (line === "do()") {
      isDoMode = true;
    } else {
      if (isDoMode) {
        const sum = sumOfMults(line);
        sumsOfEnabled.push(sum);
      }
    }
  }

	const enabledTotal = sumsOfEnabled.reduce((sum, num) => sum+num, 0)

  // Part 2: dos() and donts()
  // split into do() and dont() sections
  // split by dont()s. each section with a
  // only count the do() sections
  console.log({ total });
  console.log({ enabledTotal });
}
