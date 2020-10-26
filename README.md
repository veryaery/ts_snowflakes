# Snowflakes

This library generates and decodes Snowflakes.  
The pattern symbols "time" and "increment" are reserved for Snowflakes.TIME and Snowflakes.INCREMENT

## Installing

```
npm i git+https://github.com/nyaaery/ts_snowflakes.git
```

## Examples

```ts
const pattern: Pattern = [[ 42, Snowflakes.TIME ], [ 5, "node" ], [ 5, "process" ], [ 12, Snowflakes.INCREMENT ]];
const snowflakes: Snowflakes = new Snowflakes(pattern, new Date(), {
    node: 2n,
    process: 4n
});

const snowflake: Snowflake = await snowflakes.generate();
/*
    Snowflake {
        ...,
        date: ...,
        increment: 0,
        data: {
            node: 2n,
            process: 4n
        }
    }
*/

const n: bigint = snowflake.to_number();
/*
    BigInt
             time   node = 2   process = 4   increment = 0
    (binary) ...    00010      00100         000000000000
*/

const reconstructed_snowflake: Snowflake = Snowflakes.from_number(n);
/*
    Snowflake {
        ...,
        date: ...,
        increment: 0,
        data: {
            node: 2n,
            process: 4n
        }
    }
*/
```