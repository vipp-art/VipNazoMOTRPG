/// <reference path="../Timer.ts" />
module util.__internal {
    export class HTMLTimer extends util.Timer {
        private id_: number = -1;

        /** イベント発火 */
        private tick(): void {
            this.callback.call(this.owner, this);
        }

        /** タイマーの開始 */
        start(): void {
            this.id_ = setTimeout(() => { this.tick(); }, this.interval.toMillis());
        }

        /** 停止 */
        stop(): void {
            if (this.id_ >= 0) {
                clearTimeout(this.id_);
            }
            this.id_ = -1;
        }

    }
}