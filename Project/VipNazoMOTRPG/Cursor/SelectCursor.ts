/// <reference path="../Field/CellCoordinate.ts" />
/// <reference path="../Util/Rect.ts" />
/// <reference path="../Sys/IGraphics.ts" />

module cursor {
    import CellCoordinate = field.CellCoordinate;
    import Rect = util.Rect;

    /** 選択中マス */
    export class SelectCursor {
        private x_: number;
        private y_: number;
        private isValid_: boolean;

        constructor() {
            this.x = 0;
            this.y = 0;
            this.invalid();
        }

        valid(): void {
            this.isValid_ = true;
        }

        invalid(): void {
            this.isValid_ = false;
        }

        isValid(): boolean {
            return this.isValid_;
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
            var cellRect = CellCoordinate.toRect(this.x, this.y);
            return cellRect;
        }

        createRenderer(canvas: sys.IGraphics): ISelectCursorRenderer {
            return new SelectCursorRenderer(canvas, this);
        }
    }

    export interface ISelectCursorRenderer {
        draw(): void;
    }
}
