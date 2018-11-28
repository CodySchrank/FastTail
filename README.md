# FastTail

Tail a file or read from an index outside of the node.js event loop.

## Install

`npm install fasttail`

## Usage

```typescript
const FastTail = require("fasttail");

const fastTail = new FastTail("test.txt");

// Tail a file from the end
fastTail.tailBlock((lines: string[], index: number) => {
    // new lines from tail
    // index of end of file line
    // Watches for changes
});

// Or read a file from a certain index (does not watch for changes)
fastTail.readFromIndex(10, (line: string) => {
    //every line after 10 (inclusive)
})
```

## Settings

Change the poll rate
`fastTail.pollRate = 200`

Change tail to beginning of file
`fastTail.tailFromBeginning = true`

## Notes

This is native module so it requires the node.js runtime

Uses memory mapping to quickly find index, so the entire file is loaded into memory for the first pass.