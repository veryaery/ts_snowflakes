import { Data } from "ts_bitpattern";

import { Snowflakes } from "./Snowflakes";

export class Snowflake {

    readonly snowflakes: Snowflakes;
    readonly date: Date;
    readonly increment: number;
    readonly data: Data;

    constructor(snowflakes: Snowflakes, date: Date, increment: number, data: Data) {
        this.snowflakes = snowflakes;
        this.date = date;
        this.increment = increment;
        this.data = data;
    }

    to_number(): bigint {
        const data: Data = { ...this.data };

        data[Snowflakes.TIME] = BigInt(this.date.getTime() - this.snowflakes.epoch.getTime());
        data[Snowflakes.INCREMENT] = BigInt(this.increment);

        return this.snowflakes.bitpattern.fill(data);
    }

}