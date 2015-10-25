module util {
    /** イージング */
    export interface IEaser {
        /** イージング */
        ease(begin: number, end: number, t: number): number;
    }

    /** イージング */
    export class Easing {
        /**
         * イージングによる数値変換
         * @param t 時間 (0 <= t <= 1)
         * @return 変換結果
         */
        static ease(t: number): number {
            return Easing.kDefaultEasing(0, 1, t);
        }

        /** */
        private ease_: Function;

        /** */
        constructor(easing) {
            if (easing instanceof String) {
                // 文字列で指定された連想配列から取得
                this.ease_ = Easing.easings[(<string> easing).toLowerCase()];
                if (!this.ease_) {
                    this.ease_ = Easing.kDefaultEasing;
                }
            } else if (easing instanceof Function) {
                // 関数で指定
                this.ease_ = easing;
            } else {
                // 不正値
                this.ease_ = Easing.kDefaultEasing;
            }
        }

        /** */
        ease(begin: number, end: number, t: number): number {
            return this.ease_(begin, end, t);
        }

        /** イージング達 */
        private static easings: Object = {
            'linear': easing.linear,
            'inquads':easing.inQuads,
            'outquads':easing.outQuads,
            'inoutquads':easing.inOutQuads,
            'outinquads': easing.outInQuads,
            'incubic': easing.inCubic,
            'outcubic': easing.outCubic,
            'insine': easing.inSine,
            'insine2': easing.inSine2,
            'outsine': easing.outSine,
            'inoutsine': easing.inOutSine,
            'inoutsine2': easing.inOutSine2,
            'inexp': easing.inExp,
            'outexp': easing.outExp,
            'inoutexp': easing.inOutExp
        };

        /** 基本のイージング */
        private static kDefaultEasing: Function = easing.inSine2;
    }
}