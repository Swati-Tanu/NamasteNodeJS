const fs = require("fs");

setImmediate(() => console.log("setImmediate"));

setTimeout(() => console.log("Timer expired"), 0);

Promise.resolve("promise").then(console.log);

fs.readFile("file.txt", () => {
  setTimeout(() => console.log("2nd timer"), 0);
  process.nextTick(() => console.log("2nd nextTick"));
  setImmediate(() => console.log("2nd setImmediate"));
  console.log("File reading CB");
});

console.log("Last line of the file.");

//! Output
// Last line of the file.
// Porcess.nextTick
// promise
// Timer expired
// setImmediate
// 2nd setImmediate
// 2nd timer
// File reading CB
