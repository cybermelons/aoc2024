const fs = require("node:fs");

fs.readFile("sample.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  main(data);
});

function main(input) {
}

