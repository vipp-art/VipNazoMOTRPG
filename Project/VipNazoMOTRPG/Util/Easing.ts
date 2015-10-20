module util {
    /** イージング */
    export class Easing {
        /**
         * イージングによる数値変換
         * @param t 時間 (0 <= t <= 1)
         * @return 変換結果
         */
        static ease(t: number): number {
            return t * (2 - t);
        }
    }
}