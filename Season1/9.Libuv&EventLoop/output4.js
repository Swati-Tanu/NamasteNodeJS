const fs = require("fs");

setImmediate(() => console.log("setImmediate"));
setTimeout(() => console.log("Timer expired"), 0);

Promise.resolve("promise").then(console.log);

fs.readFile("file.txt", () => {
  console.log("File reading CB");
});

process.nextTick(() => {
  console.log("Process.nextTick");
  process.nextTick(() => console.log("inner nextTick"));
});

console.log("Last line of the file.");

//! Output
// Last line of the file.
// Process.nextTick
// inner nextTick
// promise
// Timer expired
// setImmediate
// File reading CB
