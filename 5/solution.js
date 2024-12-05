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

function correctUpdate(update, rules) {
  for (const rule of rules) {
    if (!rule(update)) {
      console.log({ update, pair: rule.pair });

      for (const num of rule.pair) {
        const others = update.filter((n) => n !== num);

        console.log({ update, num });
        for (let i = 0; i < others.length; i++) {
          const left = others.slice(0, i);
          const right = others.slice(i, others.length);
          const newUpdate = [...left, num, ...right];

          console.log(newUpdate);
          if (rules.every((doesPass) => doesPass(newUpdate))) {
            return newUpdate;
          }
        }
      }
    }
  }

  throw Error("no proper order for update given rules");
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
