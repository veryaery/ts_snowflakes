import { Data } from "ts_bitpattern";
import { Snowflakes } from "./Snowflakes";
export declare class Snowflake {
    readonly snowflakes: Snowflakes;
    readonly date: Date;
    readonly increment: number;
    readonly data: Data;
    constructor(snowflakes: Snowflakes, date: Date, increment: number, data: Data);
    to_number(): bigint;
}
