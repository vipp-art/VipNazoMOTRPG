module util.tween {
    /** */
    export class TweenParameter {
        private time_: number;
        private onStart_: Function;
        private onUpdate_: Function;
        private onComplete_: Function;
        private transition_: Easing;

        constructor(parameters: Object) {
            if (parameters) {
                this.time_ = parameters['time'] || 1;
                this.onStart_ = parameters['onStart'];
                this.onUpdate_ = parameters['onUpdate'];
                this.onComplete_ = parameters['onComplete'];
                this.transition_ = parameters['transition'] || new Easing('liear');
            }
        }

        clone(): TweenParameter {
            var result = new TweenParameter(null);
            result.time_ = this.time;
            result.onStart_ = this.onStart;
            result.onUpdate_ = this.onUpdate;
            result.onComplete_ = this.onComplete;
            result.transition_ = this.transition;
            return result;
        }

        get time(): number { return this.time_; }
        get onStart(): Function { return this.onStart_; }
        get onUpdate(): Function { return this.onUpdate_; }
        get onComplete(): Function { return this.onComplete_; }
        get transition(): Easing { return this.transition_; }
    }

    class TweenContext {
        private parameters_: TweenParameter;
        private begin_: Object;
        private end_: Object;
        private instance_: Object;
        private elapsed_: number;

        constructor(instance: Object, begin: Object, end: Object, parameters: TweenParameter) {
            this.parameters_ = parameters.clone();
            this.begin_ = begin;
            this.end_ = end;
            this.instance_ = instance;
        }

        notifyStart(): void {
            this.elapsed_ = 0;
            if (this.parameters_.onStart) {
                this.parameters_.onStart();
            }
            this.tick(0);
        }

        tick(elapsed: number): boolean {
            var isComplete: boolean = false;
            if (this.elapsed_ < this.parameters_.time) {
                this.elapsed_ += elapsed;
                if (this.elapsed_ > this.parameters_.time) {
                    // 完了
                    this.elapsed_ = this.parameters_.time;
                    isComplete = true;
                }
            }

            // 経過時間を0-1に
            var t: number = this.elapsed_ / this.parameters_.time;

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
            }
            return isComplete;
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

        /** 前回の呼び出しの日時 */
        private previous_: number;

        constructor() {
            this.previous_ = new Date().getTime();
            this.timer_ = Timer.createTimer('Tweener', this.tick, this);
            this.timer_.setInterval(util.TimeUnit.fromMillis(1000 / this.fps_));
            this.timer_.start();
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
            Tweener.instance_.fps_ = fps;
        }

        /**
         * アニメーションの開始
         * @param instance
         * @param arguments
         * poaram parameters
         */
        static animate(instance: Object, arguments: Object, parameters: TweenParameter): void {
            var begin: Object = {};
            var end: Object = {};
            for (var i in arguments) {
                if (instance.hasOwnProperty(i)) {
                    begin[i] = instance[i];
                    end[i] = arguments[i];
                }
            }

            var context = new TweenContext(instance, begin, end, parameters);

            if (!Tweener.instance_) {
                Tweener.instance_ = new Tweener();
            }

            Tweener.instance_.contexts_.push(context);
            context.notifyStart();
        }
    }

} 