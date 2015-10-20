/// <reference path="./IGraphics.ts" />

module sys {
    module internal {
        export class ColorUtil extends Color {
            getColor(): string {
                return 'rgba(' + ColorUtil.byte(this.r) + ',' + ColorUtil.byte(this.g) + ',' + ColorUtil.byte(this.b) + ',' + this.a + ')';
            }

            private static byte(v: number): string {
                var c: number = Math.floor(v * 0xff);
                return c.toString();
            }

            private static hex(v: number): string {
                var c: number = Math.floor(v * 0xff);
                var t: string = c.toString(16);

                if (t.length == 1) {
                    return '0' + t;
                } else {
                    return t;
                }
            }
        }

        export class FontStyleUtil extends TextStyle {
            getFontStyle():string {
                return (this.italic ? 'italic ' : '') +
                        (this.bold ? 'bold ' : '') +
                        this.size + 'px ' + this.font;
            }

            setAlign(canvas: CanvasRenderingContext2D): void {
                canvas.textAlign = this.horizontalAlign == HorizontalAlign.kCenter
                        ? 'center'
                        : this.horizontalAlign == HorizontalAlign.kRight
                            ? 'left'
                            : 'right';

                canvas.textBaseline = this.verticalAlign == VerticalAlign.kCetner
                        ? 'center'
                        : this.verticalAlign == VerticalAlign.kBottom
                            ? 'bottom'
                            : 'top';
            }
        }
    }

    /** canvasタグへの描画処理 */
    export class CanvasGraphics implements IGraphics {
        private canvas_: CanvasRenderingContext2D;
        private offsetX_: number;
        private offsetY_: number;
        private textStyle_: TextStyle;

        constructor(canvas: CanvasRenderingContext2D) {
            this.canvas_ = canvas;
            this.offsetX_ = 0;
            this.offsetY_ = 0;
            this.textStyle_ = new TextStyle();
        }

        setLineWidth(width: number): void {
            this.canvas_.lineWidth = width;
        }


        drawRect(x: number, y: number, width: number, height: number, color: Color): void {
            this.canvas_.strokeStyle = internal.ColorUtil.prototype.getColor.apply(color);
            this.canvas_.strokeRect(this.offsetX + x, this.offsetY + y, width, height);
        }

        fillRect(x: number, y: number, width: number, height: number, color: Color): void {
            this.canvas_.fillStyle = internal.ColorUtil.prototype.getColor.apply(color);
            this.canvas_.fillRect(this.offsetX + x, this.offsetY + y, width, height);
        }

        setTextStyle(style: TextStyle): void {
            this.textStyle_ = style;
            this.canvas_.font = internal.FontStyleUtil.prototype.getFontStyle.apply(style);
            internal.FontStyleUtil.prototype.setAlign.call(style, this.canvas_);
        }

        getTextStyle(): TextStyle {
            return this.textStyle_;
        }

        drawText(text: string, x: number, y: number, color: Color): void {
            this.canvas_.fillStyle = internal.ColorUtil.prototype.getColor.apply(color);
            this.canvas_.fillText(text, this.offsetX + x, this.offsetY + y);
        }

        setOffset(x: number, y: number): void {
            this.offsetX_ = x;
            this.offsetY_ = y;
        }

        get offsetX(): number {
            return this.offsetX_;
        }

        get offsetY(): number {
            return this.offsetY_;
        }

        getWidth(): number {
            return this.canvas_.canvas.width;
        }

        getHeight(): number {
            return this.canvas_.canvas.height;
        }
    }
} 