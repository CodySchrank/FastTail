const FastTail = require("../lib/binding.js");
const assert = require("assert");
const fs = require('fs');

assert(FastTail, "The expected function is undefined");

const fastTail = new FastTail("test.txt");
assert.strictEqual(fastTail.getLogUri(), "test.txt", "Unexpected value returned");

fastTail.pollRate = 200;
assert.strictEqual(fastTail.pollRate, 200, "Unexpected value returned");

fastTail.tailFromEnd = false;

const lines = [];
let i = 0;

fastTail.tail((line) => {
    lines.push(line);
}, (index) => {
    assert.strictEqual(lines.length, index, "Unexpected value returned");
    i = index;
})

setTimeout(() => {
    fs.appendFileSync('test.txt', '\nyup');
}, 200);

setTimeout(() => {
    fastTail.readFromIndex(i, (line) => {
        console.log(line);
        assert.strictEqual(line, "yup", "Unexpected value returned");
    }, () => {
        console.log("Tests passed- everything looks OK!");
    })
}, 400);