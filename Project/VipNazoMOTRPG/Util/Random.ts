module util {
    /** 乱数:めんどくさいのでMath.randomを使用 */
    export class Random {
        private static globalRandom_: Random;

        static instance(): Random {
            return Random.globalRandom_ || (Random.globalRandom_ = new Random());
        }

        constructor() {
        }

        setSeed(seed: number): void {
        }

        /** 整数値の乱数 */
        generateInt(): number {
            return Math.abs(Math.round(Math.random() * 1000000));
        }

        /** (min >= 値 >= max)の間の整数値の乱数を返す */
        generate(min: number, max: number) {
            var l: number = min;
            var r: number = max;
            if (max < min) {
                l = max;
                r = min;
            }
            var dif: number = (r + 1) - l;
            if (dif == 0) {
                return 0;
            }

            return this.generateInt() % dif + l;
        }

        private static randomSeed(): number {
            return Math.random() * 100000;
        }
    }
}