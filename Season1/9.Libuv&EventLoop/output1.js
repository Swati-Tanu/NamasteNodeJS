const a = 100;

setImmediate(() => {
  console.log("setImmediate");
});

const fs = require("fs");
fs.readFile("yourfile.txt", () => {
  console.log("File Reading CB");
});

setTimeout(() => {
  console.log("Timer expired");
}, 0);

function printA() {
  console.log("a =", a);
}

printA();

console.log("Last line of the file.");

//! Output
// a = 100
// Last line of the file.
// Timer expired
// setImmediate
// File Reading CB
