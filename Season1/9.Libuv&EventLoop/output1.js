//* Event Loop is a semi-infinite loop.
//? Because when it has nothing to do it does not keep running but it waits at "Poll Phase".  
//? As it checks if any API calls (or any poll phase operations) are left to be called.
//? This is the reason why in our output 3, setImmediate is printed before setInterval.
//? Other way to put it is if we have some operations inside a particular poll phase operations, then excution starts from "Pool Phase" itself and not from "Timer Phase".

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
