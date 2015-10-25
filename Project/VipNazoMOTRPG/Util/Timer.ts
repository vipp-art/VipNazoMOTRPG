module util {
    /** 一定時間後に呼ばれるタイマー */
    export class Timer {
        /** イベント発火時のコールバック */
        private callback_: Function;
        /** コールバックの所有者 */
        private owner_: Object;
        /** イベント感覚 */
        private interval_: TimeUnit = TimeUnit.fromMillis(100);

        /** タグ */
        private tag_: string = '';

        /**
         * タイマーの生成
         * @param tag タグ
         * @param callback イベント発火時に呼ばれる関数 プロトタイプはfunction(eventTarget:Timer)
         * @param owner callbackの親となるオブジェクト
         */
        static createTimer(tag: string, callback: Function, owner?: Object): Timer {
            var result: Timer = new __internal.HTMLTimer();
            result.tag_ = tag;
            result.callback_ = callback;
            result.owner_ = owner;
            return result;
        }

        /** */
        get interval(): TimeUnit {
            return this.interval_;
        }

        /** */
        get callback(): Function {
            return this.callback_;
        }

        /** */
        get owner(): Object {
            return this.owner_;
        }

        /** 期間の設定 */
        setInterval(interval: TimeUnit): void {
            this.interval_ = interval;
        }

        /** タグの指定 */
        set tag(tag: string) {
            this.tag_ = tag;
        }

        /** タグの取得 */
        get tag(): string {
            return this.tag_;
        }

        /** タイマーの開始 */
        start(): void {
            throw '未実装';
        }

        /** 停止 */
        stop(): void {
            throw '未実装';
        }
    }
}