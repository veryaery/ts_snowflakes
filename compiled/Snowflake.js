"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snowflake = void 0;
const Snowflakes_1 = require("./Snowflakes");
class Snowflake {
    constructor(snowflakes, date, increment, data) {
        this.snowflakes = snowflakes;
        this.date = date;
        this.increment = increment;
        this.data = data;
    }
    to_number() {
        const data = { ...this.data };
        data[Snowflakes_1.Snowflakes.TIME] = BigInt(this.date.getTime() - this.snowflakes.epoch.getTime());
        data[Snowflakes_1.Snowflakes.INCREMENT] = BigInt(this.increment);
        return this.snowflakes.bitpattern.fill(data);
    }
}
exports.Snowflake = Snowflake;
//# sourceMappingURL=Snowflake.js.map