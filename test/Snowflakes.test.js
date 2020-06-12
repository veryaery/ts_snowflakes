const { Snowflakes } = require("../compiled/index.js");

const pattern = [[ 4, "node" ], [ 48, Snowflakes.TIME ], [ 12, Snowflakes.INCREMENT ]];

let snowflakes;

test("construct snowflakes", () => {
    snowflakes = new Snowflakes(pattern, new Date(), { node: 2n });

    expect(snowflakes.date_size).toBe(48);
    expect(snowflakes.increment_size).toBe(12);
});

test("generate snowflake", async () => {
    console.log(await snowflakes.generate());
});

let snowflake;

test("to number", async () => {
    snowflake = await snowflakes.generate();
    console.log(snowflake.to_number());
});

test("from number", () => {
    const n = snowflake.to_number();
    expect(snowflakes.from_number(n)).toStrictEqual(snowflake);
});

test("generate many snowflakes", async () => {
    const promises = [];

    for (let i = 0; i < 100; i++) {
        promises.push(snowflakes.generate());
    }

    const snowflake_numbers = (await Promise.all(promises)).map(snowflake => snowflake.to_number());
    const snowflake_number = snowflake.to_number();

    console.log(snowflake_numbers);

    for (let i = 0; i < snowflake_numbers.length; i++) {
        const n = snowflake_numbers[i];

        for (let j = 0; j < snowflake_numbers.length; j++) {
            if (j == i) {
                continue;
            }

            const n2 = snowflake_numbers[j];

            if (n == n2) {
                throw new Error("Identical Snowflake");
            }
        }

        if (n == snowflake_number) {
            throw new Error("Identical Snowflake");
        }
    }
});