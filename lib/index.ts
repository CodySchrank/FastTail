const FastTail = require("./binding");


let fastTail = new FastTail("test.txt");

console.log(fastTail.getLogUri());

fastTail.start((lines: string[]) => {
    console.log(lines);
})

console.log("Async!");