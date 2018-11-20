const FastTail = require("../dist/binding.js");
const assert = require("assert");
const fs = require('fs');

assert(FastTail, "The expected function is undefined");

function testBasic()
{
    const fastTail = new FastTail("test.txt");
    assert.strictEqual(fastTail.getLogUri(), "test.txt", "Unexpected value returned");

    fastTail.pollRate = 200;
    assert.strictEqual(fastTail.pollRate, 200, "Unexpected value returned");

    const lines = [];

    fastTail.start((line) => {
        lines.push(line);
    }, (index) => {
        assert.strictEqual(lines.length, index, "Unexpected value returned");
    })

    setTimeout(() => {
        fs.appendFileSync('test.txt', '\nyup');
    }, 200);
}

assert.doesNotThrow(testBasic, undefined, "testBasic threw an expection");

console.log("Tests passed- everything looks OK!");