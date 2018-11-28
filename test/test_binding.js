const FastTail = require("../lib/binding.js");
const assert = require("assert");
const fs = require('fs');

assert(FastTail, "The expected function is undefined");

const fastTail = new FastTail("test.txt");
assert.strictEqual(fastTail.getLogUri(), "test.txt", "Unexpected value returned");

fastTail.pollRate = 200;
assert.strictEqual(fastTail.pollRate, 200, "Unexpected value returned");

fastTail.tailFromBeginning = true;

let lines = [];
let i = 0;

fastTail.tailBlock((block, eof) => {
    i = eof;
    lines = lines.concat(block);
    assert.strictEqual(lines[0], "Hello", "Unexpected value returned");
    assert.strictEqual(lines[1], "World", "Unexpected value returned");
});

setTimeout(() => {
    fs.appendFileSync('test.txt', 'yup');
}, 200);

setTimeout(() => {
    //read last value from file via index
    fastTail.readFromIndex(--i, (block) => {
        assert.strictEqual(block[0], "yup", "Unexpected value returned");
    });
}, 400);

setTimeout(() => {
    console.log("Test passed");
}, 600);