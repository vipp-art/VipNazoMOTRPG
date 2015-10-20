module util {
    /** 経過フレームの計測用 */
    export class Frame {
        /** シングルトン */
        private static instance_: Frame = new Frame();

        /** シングルトン */
        static instance(): Frame {
            return Frame.instance_;
        }

        /** 経過フレーム */
        private current_: number;

        /** 経過フレームのリセット */
        reset(): void {
            this.current_ = 0;
        }

        /** フレーム加算 */
        update(): void {
            ++this.current_;
        }

        /** 現在の経過フレーム取得 */
        get current(): number {
            return this.current_;
        }
    }
}