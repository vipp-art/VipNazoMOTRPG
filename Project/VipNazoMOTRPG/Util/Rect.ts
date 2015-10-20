module util {
    /** AABB */
    export class Rect {
        /** 左 */
        private x_: number;
        /** 上 */
        private y_: number;
        /** 横幅 */
        private width_: number;
        /** 高さ */
        private height_: number;

        /** */
        constructor(x: number, y: number, width: number, height: number) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        /** 中心と幅を指定してAABBを生成 */
        static createWithCenterAndSize(center: Point, width: number, height: number): Rect {
            return new Rect(center.x - width * .5, center.y - height * .5, width, height);
        }

        /** 同じ値を持つ新たなインスタンスの生成 */
        clone(): Rect {
            return new Rect(this.x, this.y, this.width, this.height);
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

        /** */
        get width(): number {
            return this.width_;
        }

        /** */
        set width(v: number) {
            this.width_ = v;
        }

        /** */
        get height(): number {
            return this.height_;
        }

        /** */
        set height(v: number) {
            this.height_ = v;
        }

        /** */
        get right(): number {
            return this.x + this.width;
        }

        /** */
        set right(v: number) {
            this.width = v - this.x;
        }

        /** */
        get bottom(): number {
            return this.y + this.height;
        }

        /** */
        set bottom(v: number) {
            this.height = v - this.y;
        }

        /** */
        get left(): number {
            return this.x;
        }

        /** */
        set left(v: number) {
            this.x = v;
        }

        /** */
        get top(): number {
            return this.y;
        }

        /** */
        set top(v: number) {
            this.y = v;
        }

        /** */
        get center(): Point {
            return new Point(this.x + this.width * .5, this.y + this.height * .5);
        }

        /** 点がAABB内かを判定 */
        isCross(x: number, y: number): boolean {
            return x >= this.left && x <= this.right &&
                y >= this.top && y <= this.bottom;
        }
    }
}