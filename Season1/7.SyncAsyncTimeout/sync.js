console.log("Synchronous Code");

var a = 62656954;
var b = 6256546;

function multiply(a, b) {
  const result = a * b;
  return result;
}
var c = multiply(a, b);
console.log("Multiplication of a and b is " + c);
