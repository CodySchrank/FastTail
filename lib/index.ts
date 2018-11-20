const FastTail = require("./binding");


let fastTail = new FastTail("test.txt");

console.log(fastTail.getLogUri());
const lines: string[] = [];

fastTail.start((line: string) => {
    lines.push(line);
}, (index: number) => {
    console.log(lines);
})

console.log("Async!");

setTimeout(() => {
    
}, 10000000);