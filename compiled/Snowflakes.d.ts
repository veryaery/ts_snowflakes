import { BitPattern, Pattern, Data } from "ts_bitpattern";
import { Snowflake } from "./Snowflake";
export declare class Snowflakes {
    static readonly TIME: string;
    static readonly INCREMENT: string;
    readonly pattern: BitPattern;
    readonly epoch: Date;
    readonly data: Data;
    private date_size;
    private increment_size;
    private generating;
    private queue;
    private last_date;
    private increment;
    constructor(pattern: Pattern, epoch: Date, data?: Data);
    generate(data?: Data): Promise<Snowflake>;
    from_number(n: bigint): Snowflake;
    private generation_loop;
}
