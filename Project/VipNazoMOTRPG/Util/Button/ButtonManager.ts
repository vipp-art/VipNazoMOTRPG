/// <reference path="./Button.ts" />
/// <reference path="../../Event/EventHandler.ts" />
module util.button {
    /** ボタン管理 */
    export class ButtonManager implements eventhandler.IOnClick, eventhandler.IOnMouseMove {

        private buttons_: Array<IButton>;

        constructor() {
            this.buttons_ = new Array();
        }

        /** 管理対象ボタンを追加 */
        add(button: IButton): void {
            if (this.buttons_.indexOf(button) < 0) {
                this.buttons_.push(button);
            }
        }

        /** 管理対象ボタンを削除 */
        remove(button: IButton): void {
            var index = this.buttons_.indexOf(button);
            if (index >= 0) {
                this.buttons_.splice(index, 1);
            }
        }

        /** 管理対象ボタンをすべて削除 */
        removeAll(): void {
            this.buttons_ = new Array();
        }

        /** クリックイベントのハンドラ */
        onClick(event: MouseEvent): void {
            var x = event.offsetX;
            var y = event.offsetY;
            for (var i in this.buttons_) {
                if (this.buttons_[i].intersect(x, y)) {
                    this.buttons_[i].notifyClick();
                    break;
                }
            }
        }

        onMouseMove(event: MouseEvent): void {
            // TODO:
        }
    }
}