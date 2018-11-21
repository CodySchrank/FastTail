# FastTail

Tail a file or read from an index outside of the node.js event loop.

## Install

`npm install fasttail`

## Usage

```typescript
const FastTail = require("fasttail");

const fastTail = new FastTail("test.txt");

// Tail a file from the end
fastTail.tail((line: string) => {
    // new lines from tail
    // Watches for changes
}, (index: number) => {
    // Optionally callback index of last line of file
    // Ie. Called once every time there is a change and tail reaches end of file (including first pass)
})

// Or read a file from a certain index (does not watch for changes)
fastTail.readFromIndex(10, (line: string) => {
    //every line after 10 (inclusive)
})
```

## Settings

Change the poll rate
`fastTail.pollRate = 200`

Change tail to beginning of file
`fastTail.tailFromEnd = false`