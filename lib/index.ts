const FastTail = require("./binding");


let fastTail = new FastTail("output_log.txt");

console.log(fastTail.getLogUri());

console.time('s')

fastTail.tail((buffer: ArrayBuffer) => {
    console.log(buffer);
    console.timeEnd('s')

    console.time("c")
    fastTail.convert(buffer);
    console.timeEnd("c")
})

console.log("Async!");