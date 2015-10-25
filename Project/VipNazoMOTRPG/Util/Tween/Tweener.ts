module util.tween {
    /** */
    export class TweenParameter {
        private time_: TimeUnit;
        private onStart_: () => void;
        private onUpdate_: () => void;
        private onComplete_: () => void;
        private transition_: Easing;
        private delay_: TimeUnit;
        private isLoop_: boolean;

        constructor(parameters: Object) {
            if (parameters) {
                this.time_ = TweenParameter.toTimeUnit(parameters['time'], 1000);
                this.delay_ = TweenParameter.toTimeUnit(parameters['delay'], 0);
                this.onStart_ = parameters['onStart'];
                this.onUpdate_ = parameters['onUpdate'];
                this.onComplete_ = parameters['onComplete'];
                this.transition_ = parameters['transition'] || new Easing('liear');
                this.isLoop_ = parameters['isLoop'] || false;
            }
        }

        private static toTimeUnit(o, defaultMillis: number): TimeUnit {
            var result:TimeUnit = (o instanceof TimeUnit)
                ? (o || TimeUnit.fromMillis(defaultMillis))
                : (TimeUnit.fromMillis((o || defaultMillis) | 0));
            return TimeUnit.fromMillis(Math.abs(result.toMillis()));
        }

        clone(): TweenParameter {
            var result = new TweenParameter(null);
            result.time_ = this.time;
            result.delay_ = this.delay_;
            result.onStart_ = this.onStart;
            result.onUpdate_ = this.onUpdate;
            result.onComplete_ = this.onComplete;
            result.transition_ = this.transition;
            result.isLoop_ = this.isLoop_;
            return result;
        }

        get time(): TimeUnit { return this.time_; }
        get delay(): TimeUnit { return this.delay_; }
        get onStart(): () => void { return this.onStart_; }
        get onUpdate(): () => void { return this.onUpdate_; }
        get onComplete(): () => void { return this.onComplete_; }
        get transition(): Easing { return this.transition_; }
        get isLoop(): boolean { return this.isLoop_; }
    }

    class TweenContext {
        private parameters_: TweenParameter;
        private begin_: Object;
        private end_: Object;
        private instance_: Object;
        private elapsed_: number;
        private isNotifyStart_: boolean;

        constructor(instance: Object, begin: Object, end: Object, parameters: TweenParameter) {
            this.parameters_ = parameters.clone();
            this.begin_ = begin;
            this.end_ = end;
            this.instance_ = instance;
        }

        notifyStart(): void {
            this.elapsed_ = 0;
            this.isNotifyStart_ = false;
            this.tick(0);
        }

        tick(elapsed: number): boolean {
            var isComplete: boolean = false;
            var time: number = this.parameters_.time.toMillis();
            var delay: number = this.parameters_.delay.toMillis();

            var delayedElapsed: number = this.elapsed_ - delay;
            if (delayedElapsed < 0) {
                // まだ遅延が終わっていない
                this.elapsed_ += elapsed;
                return false;
            }

            // 開始通知
            if (!this.isNotifyStart_) {
                if (this.parameters_.onStart) {
                    this.parameters_.onStart();
                }
            }
            this.isNotifyStart_ = true;

            // 完了判定
            if (delayedElapsed < time) {
                this.elapsed_ += elapsed;
                delayedElapsed += elapsed;
                if (delayedElapsed > time) {
                    // 完了
                    this.elapsed_ = time + delay;
                    isComplete = true;
                }
            }

            // 経過時間を0-1に
            var t: number = delayedElapsed / time;

            // いーず
            for (var i in this.begin_) {
                var b = this.begin_[i];
                var e = this.end_[i];
                var v = this.parameters_.transition.ease(b, e, t);
                this.instance_[i] = v;
            }

            if (this.parameters_.onUpdate) {
                // 更新通知
                this.parameters_.onUpdate();
            }

            if (isComplete && this.parameters_.onComplete) {
                // 完了通知
                this.parameters_.onComplete();
                if (this.parameters_.isLoop) {
                    // ループする
                    this.elapsed_ = 0;
                    this.isNotifyStart_ = false;
                    isComplete = false;
                }
            }
            return isComplete;
        }

        get instance(): Object {
            return this.instance_;
        }
    }

    /** Tween */
    export class Tweener {

        /** シングルトン */
        private static instance_: Tweener = null;

        /** コンテキストたち */
        private contexts_: Array<TweenContext> = new Array();

        /** タイマー */
        private timer_: Timer;

        /** FPS */
        private fps_: number = 30;

        /** 前回の呼び出しの時間 */
        private previous_: number;

        constructor() {
            this.previous_ = new Date().getTime();
            this.timer_ = Timer.createTimer('Tweener', this.tick, this);
            this.timer_.setInterval(util.TimeUnit.fromMillis(1000 / this.fps_));
            this.timer_.start();
        }

        /** シングルトン取得 */
        private static instance(): Tweener {
            if (!Tweener.instance_) {
                Tweener.instance_ = new Tweener();
            }
            return Tweener.instance_;
        }

        /**  */
        private tick(timer: Timer): void {
            var now: number = new Date().getTime();
            var diff: number = now - this.previous_;
            this.previous_ = now;

            var uncompleted: Array<TweenContext> = new Array();

            var c = this.contexts_;
            for (var i in c) {
                if (!c[i].tick(diff)) {
                    // 未完了
                    uncompleted.push(c[i]);
                }
            }
            // リスト更新
            this.contexts_ = uncompleted;

            // タイマー継続
            timer.setInterval(util.TimeUnit.fromMillis(1000 / this.fps_));
            timer.start();
        }

        /** FPSの指定 */
        static setFps(fps: number): void {
            Tweener.instance().fps_ = fps;
        }

        /**
         * アニメーションの開始
         * @param instance
         * @param arguments
         * @param parameters
         * @return コンテキスト
         */
        static animate(instance: Object, arguments: Object, parameters: TweenParameter): Object {
            var begin: Object = {};
            var end: Object = {};
            for (var i in arguments) {
                if (instance.hasOwnProperty(i)) {
                    begin[i] = instance[i];
                    end[i] = arguments[i];
                }
            }

            var context = new TweenContext(instance, begin, end, parameters);

            Tweener.instance().contexts_.push(context);
            context.notifyStart();

            return context;
        }

        /**
         * アニメーションの停止
         * @param context animteの返り値
         * @return アニメーションの停止に成功したらtrue
         */
        static stop(context: Object): boolean {
            if (!context) {
                return false;
            }

            if (context instanceof TweenContext) {
                var index: number = Tweener.instance().contexts_.indexOf(<TweenContext> context);
                if (index >= 0) {
                    Tweener.instance().contexts_.splice(index, 1);
                    return true;
                }
            } else {
                return Tweener.stopAtTarget(context);
            }
        }

        /**
         * アニメーションの停止
         * @param instancce animteに指定したインスタンス
         * @return アニメーションの停止に成功したらtrue
         */
        static stopAtTarget(instance: Object): boolean {
            var oldLength = Tweener.instance().contexts_.length;
            Tweener.instance().contexts_ = Tweener.instance().contexts_.filter((v) => {
                return v.instance != instance;
            });
            return Tweener.instance().contexts_.length != length;
        }

        /** 全てのアニメーションの停止 */
        static stopAll(): boolean {
            var result: boolean = Tweener.instance().contexts_.length > 0;
            Tweener.instance().contexts_ = new Array();
            return result;
        }
    }

} 