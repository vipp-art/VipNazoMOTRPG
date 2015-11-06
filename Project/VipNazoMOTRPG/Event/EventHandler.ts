module eventhandler {
    /** キーボード押下イベント用リスナー */
    export interface IOnKeyDown {
        onKeyDown(event: KeyboardEvent): void;
    }

    /** クリックイベント用リスナー */
    export interface IOnClick {
        onClick(event: MouseEvent): void;
    }

    /** マウス移動イベント用リスナー */
    export interface IOnMouseMove {
        onMouseMove(event: MouseEvent): void;
    }

    /** イベント処理用 */
    export class EventHandler {
        private keyDownEvent_: KeyboardEvent;
        private clickEvent_: MouseEvent;
        private mouseMoveEvent_: MouseEvent;

        private keyDownCallback_: Array<IOnKeyDown>;
        private clickCallback_: Array<IOnClick>;
        private mouseMoveCallback_: Array<IOnMouseMove>;

        constructor(element: HTMLElement) {
            this.keyDownCallback_ = new Array<IOnKeyDown>();
            this.clickCallback_ = new Array<IOnClick>();
            this.mouseMoveCallback_ = new Array<IOnMouseMove>();

            element.onmousemove = (e) => this.onMouseMove(e);
            element.onclick = (e) => this.onClick(e);
            element.onkeydown = (e) => this.onKeyDown(e);
        }

        /** リスナーを登録する */
        addEventListener(object): void {
            if (object.onClick) {
                this.clickCallback_.push(object);
            }
            if (object.onMouseMove) {
                this.mouseMoveCallback_.push(object);
            }
            if (object.onKeyDown) {
                this.keyDownCallback_.push(object);
            }
        }

        /** リスナーを削除する */
        removeEventListener(object): void {
            EventHandler.remove(this.clickCallback_, object);
            EventHandler.remove(this.mouseMoveCallback_, object);
            EventHandler.remove(this.keyDownCallback_, object);
        }

        private static remove(array:Array<any>, object):void
        {
            var i: number = array.indexOf(object);
            if (i >= 0) {
                array.splice(i, 1);
            }
        }

        update(doseFire: boolean): void {
            if (doseFire) {
                if (this.keyDownEvent_) {
                    for (var i in this.keyDownCallback_) {
                        var keyDown = this.keyDownCallback_[i];
                        if (keyDown) {
                            keyDown.onKeyDown(this.keyDownEvent_);
                        }
                    }
                }
                if (this.clickEvent_) {
                    for (var i in this.clickCallback_) {
                        var click = this.clickCallback_[i];
                        if (click) {
                            click.onClick(this.clickEvent_);
                        }
                    }
                }
                if (this.mouseMoveEvent_) {
                    for (var i in this.mouseMoveCallback_) {
                        var move = this.mouseMoveCallback_[i];
                        if (move) {
                            move.onMouseMove(this.mouseMoveEvent_);
                        }
                    }
                }
            }

            this.keyDownEvent_ = null;
            this.clickEvent_ = null;
            this.mouseMoveEvent_ = null;
        }

        onMouseMove(event: MouseEvent) {
            this.mouseMoveEvent_ = event;
        }

        onClick(event: MouseEvent) {
            this.clickEvent_ = event;
        }

        onKeyDown(event: KeyboardEvent) {
            this.keyDownEvent_ = event;
        }
    }
} 