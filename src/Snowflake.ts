import { Data } from "ts_bitpattern";

export class Snowflake {

    readonly date: Date;
    readonly increment: number;
    readonly data: Data;

    constructor(date: Date, increment: number, data: Data) {
        this.date = date;
        this.increment = increment;
        this.data = data;
    }

}