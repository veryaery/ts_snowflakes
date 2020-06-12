"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snowflakes = void 0;
const ts_bitpattern_1 = require("ts_bitpattern");
const Snowflake_1 = require("./Snowflake");
class Snowflakes {
    constructor(pattern, epoch, data) {
        this.generating = false;
        this.queue = [];
        this.pattern = pattern;
        this.bitpattern = new ts_bitpattern_1.BitPattern(pattern);
        this.epoch = epoch;
        this.data = data || {};
        // Find the sizes of date and increment
        for (const element of pattern) {
            const symbol = element[1];
            const size = element[0];
            switch (symbol) {
                case Snowflakes.TIME:
                    this.date_size = size;
                    break;
                case Snowflakes.INCREMENT:
                    this.increment_size = size;
                    break;
            }
        }
        // Make sure sizes were found
        if (!this.date_size) {
            throw new Error("No size for date specified");
        }
        if (!this.increment_size) {
            throw new Error("No size for increment specified");
        }
    }
    async generate(data) {
        return new Promise((res, rej) => {
            data = data || {};
            this.queue.push({
                res,
                rej,
                data
            });
            // If the generation loop isn't already running, start it
            if (!this.generating) {
                this.generation_loop();
            }
        });
    }
    from_number(n) {
        const data = this.bitpattern.pull(n);
        const date = new Date(this.epoch.getTime() + Number(data[Snowflakes.TIME]));
        const increment = Number(data[Snowflakes.INCREMENT]);
        delete data[Snowflakes.TIME];
        delete data[Snowflakes.INCREMENT];
        return new Snowflake_1.Snowflake(this, date, increment, data);
    }
    generation_loop() {
        this.generating = true;
        while (this.queue.length > 0) {
            const queued_snowflake = this.queue[0];
            const data = {
                ...this.data,
                ...queued_snowflake.data
            };
            const date = new Date();
            const time = date.getTime() - this.epoch.getTime();
            if (time >= 2 ** this.date_size) {
                return queued_snowflake.rej(new Error(`Date time <${time}> with size <${Math.ceil(Math.log2(time) + 1)} bits> has reached it's maximum specified size of <${this.date_size} bits>. Allocate more bits or increase your epoch`));
            }
            if (this.last_date && date.getTime() == this.last_date.getTime()) {
                this.increment++;
                if (this.increment >= 2 ** this.increment_size) {
                    // We can't generate more snowflakes at this time. Try again some other time
                    return setTimeout(this.generation_loop);
                }
            }
            else {
                this.increment = 0;
            }
            this.last_date = date;
            queued_snowflake.res(new Snowflake_1.Snowflake(this, date, this.increment, data));
            this.queue.shift();
        }
        this.generating = false;
    }
}
exports.Snowflakes = Snowflakes;
Snowflakes.TIME = "time";
Snowflakes.INCREMENT = "increment";
//# sourceMappingURL=Snowflakes.js.map