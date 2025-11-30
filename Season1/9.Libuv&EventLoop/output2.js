const fs = require("fs");
const a = 100;

setImmediate(() => console.log("setImmediate"));

Promise.resolve("promise").then(console.log);

fs.readFile("yourfile.txt", () => {
  console.log("File Reading CB");
});

setTimeout(() => console.log("Timer expired"), 0);

process.nextTick(() => console.log("Process.nextTick"));

function printA() {
  console.log("a =", a);
}
printA();

console.log("Last line of the file.");

//! Output
// a = 100
// Last line of the file.
// Process.nextTick
// promise
// Timer expired
// setImmediate
// File Reading CB
