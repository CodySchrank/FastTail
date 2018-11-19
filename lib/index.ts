const FastTail = require("./binding");


let fastTail = new FastTail("test.txt");

console.log(fastTail.getLogUri());

console.log("HERE");

fastTail.tail((line: string) => {
    console.log(line);
}, (eof: any) => {
    console.log("Done!")
})

console.log("Done!");