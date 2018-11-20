const FastTail = require("./binding");


let fastTail = new FastTail("output_log.txt");

console.log(fastTail.getLogUri());
const lines: string[] = [];

console.time("s")

fastTail.tail((line: string) => {
    lines.push(line);
}, () => {
    console.log("EOF");
    console.timeEnd("s");
})

console.log("Async!");