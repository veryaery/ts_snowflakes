import { BitPattern, Pattern, Data } from "ts_bitpattern";
import { Snowflake } from "./Snowflake";

export class Snowflakes {

    static readonly DATE: string = "date";
    static readonly INCREMENT: string = "increment";

    readonly pattern: Pattern;
    readonly epoch: Date;
    readonly data: Data;

    private bitpattern: BitPattern;
    private date_size: number = 0;
    private increment_size: number = 0;

    constructor(pattern: Pattern, epoch?: Date, data?: Data) {
        for (const element of pattern) {
            const symbol: string = element[1];
            const size: number = element[0];

            switch (symbol) {
                case Snowflakes.DATE:
                    this.date_size = size;
                    break;
                case Snowflakes.INCREMENT:
                    this.increment_size = size;
                    break;
            }
        }

        this.pattern = pattern;
        this.bitpattern = new BitPattern(pattern);
        this.epoch = epoch;
    }

}