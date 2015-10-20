/// <reference path="../util/Rect.ts" />
/// <reference path="../Sys/IGraphics.ts" />

module player {
    import Rect = util.Rect;

    /** プレイヤーの描画 */
    export class CanvasPlayerRenderer implements IPlayerRenderer, IPlayerTraverser {
        private canvas_: sys.IGraphics;
        private players_: PlayerHolder;

        constructor(canvas: sys.IGraphics, players: PlayerHolder) {
            this.canvas_ = canvas;
            this.players_ = players;
        }

        draw(): void {
            this.players_.traverse(this);
        }

        execPlayer(no: number, player: Player): void {
            if (player.isSelf()) {
                this.drawSelf(player);
            } else {
                this.drawOther(player);
            }
        }

        drawSelf(player: Player): void {
            var rect: Rect = player.rect;
            var g = this.canvas_;
            g.fillRect(rect.x, rect.y, rect.width, rect.height, new sys.Color(1, .5, 1));
        }

        drawOther(player: Player): void {
            var rect: Rect = player.rect;
            var g = this.canvas_;

            g.fillRect(rect.x, rect.y, rect.width, rect.height, new sys.Color(.9, .9, .9));
        }
    }
}