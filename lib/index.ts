const FastTail = require("./binding");


let fastTail = new FastTail("output_log.txt");

console.log(fastTail.getLogUri());

fastTail.tail((line: string) => {

})

console.log("Async!");