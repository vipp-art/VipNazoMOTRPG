/// <reference path="../Field/CellCoordinate.ts" />
/// <reference path="../Util/Rect.ts" />
/// <reference path="../Util/Point.ts" />

module player {
    import CellCoordinate = field.CellCoordinate;
    import Rect = util.Rect;
    import Point = util.Point;

    /** プレイヤー */
    export class Player {
        /** マス */
        private x_: number;
        /** マス */
        private y_: number;

        /** ID */
        private id_: number;

        /** 自分かどうか */
        private isSelf_: boolean;

        constructor(isSelf: boolean, initialX: number, initialY:number) {
            this.isSelf_ = isSelf;
            this.x = initialX;
            this.y = initialY;
            this.id_ = 0;
        }

        set id(v: number) {
            this.id_ = v;
        }

        get id(): number {
            return this.id_;
        }

        set x(x: number) {
            this.x_ = x;
        }

        get x(): number {
            return this.x_;
        }

        set y(y: number) {
            this.y_ = y;
        }

        get y(): number {
            return this.y_;
        }

        get rect(): Rect {
            var base: Rect = CellCoordinate.toRect(this.x, this.y);
            var center: Point = base.center;

            return Rect.createWithCenterAndSize(center, 50, 50);
        }

        isSelf(): boolean {
            return this.isSelf_;
        }
    }
}
