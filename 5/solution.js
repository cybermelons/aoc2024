const fs = require("node:fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  main(data);
});

function main(input) {
  const [rulesStr, updatesStr] = input.split("\n\n");

  const rules = makeRules(rulesStr);

  const updates = makeUpdates(updatesStr);
  const validUpdates = updates.reduce(
    (sum, update) => (isUpdateValid(update, rules) ? [...sum, update] : sum),
    [],
  );
  const middles = validUpdates.map(
    (update) => update[Math.floor(update.length / 2)],
  );
  const sum = middles.reduce((sum, n) => n + sum, 0);
  console.log({ sum });
}

function makeRules(rulesStr) {
  const lines = rulesStr.split("\n");
  const rulesPairs = lines.map((line) =>
    line.split("|").map((n) => parseInt(n)),
  );

  const rules = rulesPairs.map(makeRule);
  return rules;
}

function makeRule(rulePair) {
  return (update) => {
    const indices = rulePair.map((num) => {
      return update.findIndex((n) => n === num);
    });

    if (indices.some((idx) => idx === -1)) {
      // rule doesn't apply to this update.
      return true;
    }

    const [firstIdx, secondIdx] = indices;
    return firstIdx < secondIdx;
  };
}

function isUpdateValid(update, rules) {
  return rules.every((rule) => rule(update));
}

function makeUpdates(updatesStr) {
  const lines = updatesStr.split("\n").filter((line) => !!line);
  const updates = lines.map((line) => line.split(",").map((n) => parseInt(n)));
  return updates;
}
