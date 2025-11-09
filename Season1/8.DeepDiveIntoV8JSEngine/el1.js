const fs = require("fs");
const a = 100;

setImmediate(() => console.log("setImmediate"));

fs.readFile("./file.txt", "utf-8", (err, data) => {
  console.log("File reading started...");
  console.log(data);
});

setTimeout(() => console.log("set timeout"), 0);

function printA() {
  console.log("a=", a);
}
printA();

console.log("Last line of program");
