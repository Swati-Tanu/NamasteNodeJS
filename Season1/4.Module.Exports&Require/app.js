//* cjs requires in sync way
//* mjs has an option for async import as well

// const { calculateMultiply } = require("./calulate/multiply");
// const { x, calculateSum } = require("./calulate/sum");
const { calculateMultiply, calculateSum } = require("./calculate/index");
const data = require("./data.json");

//? The util object contains a variety of useful functions and properties.
const util = require("node:util");

// import { calculateSum } from "./sum.js"
var a = 10;
var b = 20;
console.log(a);
calculateSum(a, b);
calculateMultiply(a, b);
console.log(data.name);
console.log(data.city);
// console.log(x)
