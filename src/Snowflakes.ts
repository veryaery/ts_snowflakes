import { BitPattern, Pattern, Data } from "ts_bitpattern";

import { Snowflake } from "./Snowflake";

type QueuedSnowflake = {
    res: (value?: Snowflake | PromiseLike<Snowflake>) => void,
    rej: (reason?: any) => void,
    data: Data
}

export class Snowflakes {

    static readonly DATE: string = "date";
    static readonly INCREMENT: string = "increment";

    readonly pattern: Pattern;
    readonly bitpattern: BitPattern;
    readonly epoch: Date;
    readonly data: Data;

    private date_size: number;
    private increment_size: number;

    private generating: boolean = false;
    private queue: QueuedSnowflake[] = [];
    private last_date: Date;
    private increment: number;

    constructor(pattern: Pattern, epoch: Date, data?: Data) {
        this.pattern = pattern;
        this.bitpattern = new BitPattern(pattern);
        this.epoch = epoch;
        this.data = data || {};

        // Find the sizes of date and increment
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

        // Make sure sizes were found
        if (!this.date_size) {
            throw new Error("No size for date specified");
        }
        if (!this.increment_size) {
            throw new Error("No size for increment specified");
        }
    }

    async generate(data?: Data): Promise<Snowflake> {
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

    from_number(n: bigint): Snowflake {
        const data: Data = this.bitpattern.pull(n);

        const date: Date = new Date(this.epoch.getTime() + Number(data[Snowflakes.DATE]));
        const increment: number = Number(data[Snowflakes.INCREMENT]);

        delete data[Snowflakes.DATE];
        delete data[Snowflakes.INCREMENT];

        return new Snowflake(this, date, increment, data);
    }

    private generation_loop() {
        this.generating = true;

        while (this.queue.length > 0) {
            const queued_snowflake: QueuedSnowflake = this.queue[0];

            const data: Data = {
                ...this.data,
                ...queued_snowflake.data
            };

            const date: Date = new Date();
            const delta_time: number = date.getTime() - this.epoch.getTime();

            if (delta_time >= 2 ** this.date_size) {
                return queued_snowflake.rej(new Error(`Date time <${delta_time}> with size <${Math.ceil(Math.log2(delta_time) + 1)} bits> has reached it's maximum specified size of <${this.date_size} bits>. Allocate more bits or increase your epoch`));
            }

            if (date == this.last_date) {
                this.increment++;

                if (this.increment >= 2 ** this.increment_size) {
                    // We can't generate more snowflakes at this time. Try again some other time
                    return setTimeout(this.generation_loop);
                }
            } else {
                this.increment = 0;
            }

            this.last_date = date;

            queued_snowflake.res(new Snowflake(this, date, this.increment, data));
            this.queue.shift();
        }

        this.generating = false;
    }

}