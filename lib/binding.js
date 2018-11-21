"use strict";
const addon = require('../build/Release/fasttail-native');
;
class FastTail {
    constructor(logUri) {
        this.pollRate = 100;
        this.tailFromEnd = true;
        this._addonInstance = new addon.FastTail(logUri);
    }
    getLogUri() {
        return this._addonInstance.getLogUri();
    }
    readFromIndex(index, lineCb, eof = () => { }) {
        return this._addonInstance.readFromIndex(index, lineCb, eof);
    }
    tail(lineCb, eof = () => { }) {
        this.readFromIndex(0, (line) => {
            //This is hacky and could be much faster if it had dedicated method. but i dont care
            if (!this.tailFromEnd) {
                lineCb(line);
            }
        }, (index) => {
            eof(index);
            let currentIndex = index;
            let prevIndex = currentIndex;
            setInterval(() => {
                this.readFromIndex(currentIndex, lineCb, (newIndex) => {
                    currentIndex = newIndex;
                    if (currentIndex != prevIndex) {
                        eof(newIndex);
                        currentIndex = newIndex;
                        prevIndex = currentIndex;
                    }
                });
            }, this.pollRate);
        });
    }
}
module.exports = FastTail;
