module util {
    /** 二次元の座標 */
    export class Point {
        /** */
        private x_: number;
        /** */
        private y_: number;

        /** */
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        /** 同じ値を持つ新たなインスタンス生成 */
        clone(): Point {
            return new Point(this.x, this.y);
        }

        /** */
        get x(): number {
            return this.x_;
        }

        /** */
        set x(v: number) {
            this.x_ = v;
        }

        /** */
        get y(): number {
            return this.y_;
        }

        /** */
        set y(v: number) {
            this.y_ = v;
        }
    }
} 