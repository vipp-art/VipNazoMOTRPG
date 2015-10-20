module sys {
    /** 2D描画 */
    export interface IGraphics {
        /** 線の太さの指定 */
        setLineWidth(width: number): void;

        /** 四角を描画 */
        drawRect(x: number, y: number, width: number, height: number, color: Color): void;
        /** 四角を塗りつぶして描画 */
        fillRect(x: number, y: number, width: number, height: number, color: Color): void;

        /** 文字列描画の設定を行う */
        setTextStyle(style: TextStyle): void;
        /** 文字列描画の設定を取得する */
        getTextStyle(): TextStyle;

        /** 文字列の描画 */
        drawText(text: string, x: number, y: number, color: Color): void;

        /** 描画位置のオフセットを指定する */
        setOffset(x: number, y: number): void;

        /** 描画範囲の横幅を取得する */
        getWidth(): number;
        /** 描画範囲の縦幅を取得する */
        getHeight(): number;
    }

    /** 浮動小数表現の色 */
    export class Color {
        private r_: number = 1;
        private g_: number = 1;
        private b_: number = 1;
        private a_: number = 1;

        constructor(r?: number, g?: number, b?: number, a?: number) {
            if (r != null) { this.r = r; }
            if (g != null) { this.g = g; }
            if (b != null) { this.b = b; }
            if (a != null) { this.a = a; }
        }

        get r() { return this.r_; }
        get g() { return this.g_; }
        get b() { return this.b_; }
        get a() { return this.a_; }

        set r(v: number) { this.r_ = v; }
        set g(v: number) { this.g_ = v; }
        set b(v: number) { this.b_ = v; }
        set a(v: number) { this.a_ = v; }
    }

    /** 整数表現の色 */
    export class IntColor {
        private r_: number = 0xff;
        private g_: number = 0xff;
        private b_: number = 0xff;
        private a_: number = 0xff;

        constructor(r?: number, g?: number, b?: number, a?: number) {
            if (r != null) { this.r = r; }
            if (g != null) { this.g = g; }
            if (b != null) { this.b = b; }
            if (a != null) { this.a = a; }
        }

        get r() { return this.r_; }
        get g() { return this.g_; }
        get b() { return this.b_; }
        get a() { return this.a_; }

        set r(v: number) { this.r_ = Math.floor(v); }
        set g(v: number) { this.g_ = Math.floor(v); }
        set b(v: number) { this.b_ = Math.floor(v); }
        set a(v: number) { this.a_ = Math.floor(v); }

        toColor(): Color {
            var inv:number = 1 / 255.0;
            return new sys.Color(this.r * inv, this.g * inv, this.b * inv, this.a * inv);
        }

        static fromColor(c: Color): IntColor {
            return new IntColor(c.r * 255, c.g * 255, c.b * 255, c.a * 255);
        }
    }

    /** 横方向の配置 */
    export enum HorizontalAlign {
        kLeft,
        kCenter,
        kRight
    }

    /** 縦方向の配置 */
    export enum VerticalAlign {
        kTop,
        kCetner,
        kBottom
    }

    /** 文字列描画の設定 */
    export class TextStyle {
        private size_: number = 16;
        private font_: string = 'sans-serif';
        private italic_: boolean = false;
        private bold_: boolean = false;

        private horizntalAlign_: HorizontalAlign = HorizontalAlign.kLeft;
        private verticalAlign_: VerticalAlign = VerticalAlign.kBottom;

        constructor(size?: number, font?: string, italic?: boolean, bold?: boolean) {
            if (size != null) { this.size_ = size; }
            if (font != null) { this.font_ = font; }
            if (italic != null) { this.italic_ = italic; }
            if (bold != null) { this.bold_ = bold; }
        }

        get size(): number { return this.size_; }
        get font(): string { return this.font_; }
        get italic(): boolean { return this.italic_; }
        get bold(): boolean { return this.bold_; }
        get horizontalAlign(): HorizontalAlign { return this.horizntalAlign_; }
        get verticalAlign(): VerticalAlign { return this.verticalAlign_; }

        set size(v: number) { this.size_ = v; }
        set font(v: string) { this.font_ = v; }
        set italic(v: boolean) { this.italic_ = v; }
        set bold(v: boolean) { this.bold_ = v; }
        set horizontalAlign(v: HorizontalAlign) { this.horizntalAlign_ = v; }
        set verticalAlign(v: VerticalAlign) { this.verticalAlign_ = v; }
    }
} 