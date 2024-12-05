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

  const invalidUpdates = updates.reduce(
    (sum, update) => (!isUpdateValid(update, rules) ? [...sum, update] : sum),
    [],
  );

  const correctedUpdates = invalidUpdates.map((update) =>
    correctUpdate(update, rules),
  );

  const middles = validUpdates.map(
    (update) => update[Math.floor(update.length / 2)],
  );
  const sum = middles.reduce((sum, n) => n + sum, 0);

  const middlesCorrected = correctedUpdates.map(
    (update) => update[Math.floor(update.length / 2)],
  );
  const sumInvalids = middlesCorrected.reduce((sum, n) => n + sum, 0);
  console.log({ sum });
  console.log({ sumInvalids });
}

function makeRules(rulesStr) {
  const lines = rulesStr.split("\n");
  const rulesPairs = lines.map((line) =>
    line.split("|").map((n) => parseInt(n)),
  );

  const rules = rulesPairs.map(makeRule);
  return rules;
}

function makeCompareFn(rules) {
  // given rules, return -1 if it goes before,
  return (a, b) => {
    const rule = rules.find(
      ({ pair }) =>
        pair.find((n) => n === a) !== undefined &&
        pair.find((n) => n === b) !== undefined,
    );

		const [first, second] = rule.pair
		if (first === a) {
			return a-b
		}
		if (first === b) {
			return b-a
		}
		throw Error("invalid rule")
  };
}

function correctUpdate(update, rules) {
  const compareFn = makeCompareFn(rules);

  const corrected = update.sort(compareFn);
	return corrected
}

function makeRule(rulePair) {
  const rule = (update) => {
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

  rule.pair = rulePair;
  return rule;
}

function isUpdateValid(update, rules) {
  return rules.every((rule) => rule(update));
}

function makeUpdates(updatesStr) {
  const lines = updatesStr.split("\n").filter((line) => !!line);
  const updates = lines.map((line) => line.split(",").map((n) => parseInt(n)));
  return updates;
}
