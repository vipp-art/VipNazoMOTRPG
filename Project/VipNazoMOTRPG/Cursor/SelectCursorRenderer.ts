/// <reference path="../Sys/IGraphics.ts" />
module cursor {
    /** 選択中マスの描画 */
    export class SelectCursorRenderer implements ISelectCursorRenderer {
        private canvas_: sys.IGraphics;
        private cursor_: SelectCursor;

        constructor(canvas: sys.IGraphics, cursor: SelectCursor) {
            this.canvas_ = canvas;
            this.cursor_ = cursor;
        }
        
        draw(): void {
            if (this.cursor_.isValid()) {
                var rect: Rect = this.cursor_.rect;
                var g: sys.IGraphics = this.canvas_;
                g.setLineWidth(4);
                g.drawRect(rect.x, rect.y, rect.width, rect.height, new sys.Color(1, 0, 0));
            }
        }
    }
}