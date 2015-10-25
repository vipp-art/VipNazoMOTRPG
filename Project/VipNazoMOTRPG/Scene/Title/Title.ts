/// <reference path="../Game/Game.ts" />
/// <reference path="../../Event/EventHandler.ts" />
/// <reference path="../../Util/Easing.ts" />
/// <reference path="../../Util/Frame.ts" />
/// <reference path="../IScene.ts" />

module scene.title {
    import IOnClick = eventhandler.IOnClick;
    import IOnMouseMove = eventhandler.IOnMouseMove;
    import IOnKeyDown = eventhandler.IOnKeyDown;
    import Game = game.Game;
    import Easing = util.Easing;

    /** タイトル画面 */
    export class Title
        implements IScene, IOnClick
    {
        private isClicked_: boolean;

        constructor() {
        }

        initialize(): void {
            this.isClicked_ = false;
            var player = AudioManager.getPlayer();
            player.setSource(1, AudioManager.getLoader().load('Res/piko'));
        }


        update(): IScene {
            // クリックでGameシーンへ
            return this.isClicked_ ? new Game() : null;
        }

        createSceneRenderer(canvas: sys.IGraphics): ISceneRenderer {
            return new SceneRenderer(canvas, this);
        }

        onClick(event: MouseEvent) {
            if (!this.isClicked_) {
                var player = AudioManager.getPlayer();
                player.play(1);
            }
            this.isClicked_ = true;
        }
    }

    /** タイトルの描画 */
    class SceneRenderer implements ISceneRenderer {
        private canvas_: sys.IGraphics;

        constructor(canvas: sys.IGraphics, title: Title) {
            this.canvas_ = canvas;
        }

        draw(): void {
            var g = this.canvas_;

            var style = g.getTextStyle();
            style.size = 48;
            style.horizontalAlign = sys.HorizontalAlign.kCenter;
            style.verticalAlign = sys.VerticalAlign.kTop;
            g.setTextStyle(style);
            g.drawText('タイトル', g.getWidth() * .5, 10, new sys.Color(0, 0, 0) );

            var alpha: number = Math.abs(Easing.ease((Frame.instance().current & 0x3f) / (0x40 >> 1) - 1));
            style.size = 36;
            style.horizontalAlign = sys.HorizontalAlign.kCenter;
            style.verticalAlign = sys.VerticalAlign.kCetner;
            g.setTextStyle(style);
            g.drawText('狼狸の森CLICK', g.getWidth() * .5, g.getHeight() * .5, new sys.Color(0, 0, 0, alpha));
        }
    }
} 
