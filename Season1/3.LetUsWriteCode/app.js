var greeting = "Namaste Duniya";
var a = 10;
var b = 20;
var c = a + b;

console.log(greeting);
console.log(c);

//? The name of the global object of NodeJS is global. In browser we have same thing that is called window. 
//! Global object is not a part of V8 engine. In NodeJS's case it is given by NodeJS and in browser's case given by browsers.
// console.log("Global Object", global)

//* Here "this" (this is an empty object here) is not equal to global unlike this === window in browser. 

//* Over the time there were a lot of different terms global object, e.g., window, this, self, frames, etc. 

//* So now, globalThis is a standard way of accessing the global this value acroos environment. Therefore, globalThis === global 
// console.log(globalThis);
// console.log(globalThis === global);
