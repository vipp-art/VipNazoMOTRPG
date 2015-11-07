/// <reference path="../Point.ts" />
/// <reference path="../Rect.ts" />
module util.button {
    export interface IButton {
        /** イベントの通知 */
        notifyClick(): void;

        /** 交差判定 */
        intersect(x: number, y: number): boolean;
    }

    /** ボタンの共通 */
    export class Button implements IButton {
        /** 押下時コールバック */
        private onClick_: (button: Button) => void;
        /** タグ */
        private tag_: string;

        /** コールバックの指定 */
        setOnClickHandler(callback: (button: Button) => void): void {
            this.onClick_ = callback;
        }

        /** タグ */
        set tag(v: string) { this.tag_ = v; }
        /** タグ */
        get tag(): string { return this.tag_; }

        /** イベントの通知 */
        notifyClick(): void {
            if (this.onClick_ != null) {
                this.onClick_(this);
            }
        }

        /** 交差判定 */
        intersect(x: number, y: number): boolean {
            return false;
        }
    }

    /** 四角いボタン */
    export class RectButton extends Button {
        private rect_: Rect;

        constructor(rect: Rect) {
            super();
            this.rect_ = rect;
        }

        intersect(x: number, y: number): boolean {
            return this.rect_.isCross(x, y);
        }

        get rect(): Rect {
            return this.rect_.clone();
        }
    }

    /** 円のボタン */
    export class CircleButton extends Button {
        private center_: Point;
        private radius_: number;

        constructor(center: Point, radius: number) {
            super();
            this.center_ = center.clone();
            this.radius_ = radius;
        }

        intersect(x: number, y: number): boolean {
            var dx: number = x - this.center_.x;
            var dy: number = y - this.center_.y;

            return (dx * dx + dy * dy) < (this.radius_ * this.radius_);
        }

        get center(): Point {
            return this.center_.clone();
        }

        get radius(): number {
            return this.radius_;
        }
    }
}