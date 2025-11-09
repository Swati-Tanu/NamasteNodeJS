const crypto = require("node:crypto");
const { stringify } = require("node:querystring");

console.log("Program started");

//pbkdf2- Password based key derivative function version-2

//This is an synchronous function of pbkdf2 which will block the main thread and these type of synchronus functions does not have any callback functions
const key = crypto.pbkdf2Sync("password", "salt", 5000000, 20, "sha512");
const syncKey = key.toString("hex");
// const syncKey = key.toString("base64")
console.log("Fist synchronous key is generated:", syncKey);

//Asynchronous function
crypto.pbkdf2("password", "salt", 50000, 20, "sha512", (err, key) => {
  console.log("Below is the asynchronous key of your password");
  const asyncKey = key.toString("hex");
  //   const asyncKey = key.toString("base64");

  console.log(
    "Asynchronous key is generated after all synchronous codes are executed:",
    asyncKey
  );
});

function addition(x, y) {
  const result = x + y;
  return result;
}

var c = addition(5, 10);
console.log("Addition is: " + c);
