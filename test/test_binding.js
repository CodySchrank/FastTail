const FastTail = require("../dist/binding.js");
const assert = require("assert");

assert(FastTail, "The expected function is undefined");

function testBasic()
{
    const fastTail = new FastTail("test.txt");
    assert.strictEqual(fastTail.getLogUri(), "test.txt", "Unexpected value returned");
}

assert.doesNotThrow(testBasic, undefined, "testBasic threw an expection");

console.log("Tests passed- everything looks OK!");