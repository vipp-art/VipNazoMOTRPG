/// <reference path="./Scene/IScene.ts" />
/// <reference path="./Scene/Title/Title.ts" />
/// <reference path="./Event/EventHandler.ts" />
/// <reference path="./Util/Frame.ts" />
/// <reference path="./Sys/CanvasGraphics.ts" />
import IScene = scene.IScene;
import Title = scene.title.Title;
import EventHandler = eventhandler.EventHandler;
import Frame = util.Frame;

/** メイン */
module main {

    /** メイン */
    class Greeter {
        /** 対象<canvas> */
        private element_: HTMLElement;
        /** 実行中シーン */
        private scene_: IScene;
        /** キーボード・マウスイベント用 */
        private eventHandler_: EventHandler;
        /** 描画 */
        private graphics_: sys.IGraphics;

        constructor(element: HTMLElement) {
            this.element_ = element;
            var canvasElement = <HTMLCanvasElement> document.querySelector("canvas");
            this.graphics_ = new sys.CanvasGraphics(canvasElement.getContext('2d'));
        }

        /** ゲームの開始 */
        start() {
            Frame.instance().update();
            this.eventHandler_ = new EventHandler(this.element_);
            this.newScene(new Title());

            // 10FPSでタイマー起動
            setInterval(() => this.tick(), 1000 / 10);
        }

        /** 毎フレーム処理 */
        tick() {
            // 背面を白に
            this.graphics_.fillRect(0, 0, this.graphics_.getWidth(), this.graphics_.getHeight(), new sys.Color(1, 1, 1));

            // イベント更新
            this.eventHandler_.update();

            // シーン更新
            var next: IScene = this.scene_.update();
            // シーン描画
            this.scene_.createSceneRenderer(this.graphics_).draw();

            // シーン遷移があれば遷移
            this.newScene(next);

            Frame.instance().update();
        }

        /** シーン遷移 */
        private newScene(next: IScene): void {
            if (next != null) {
                Frame.instance().reset();
                if (this.scene_ != null) {
                    this.eventHandler_.removeEventListener(this.scene_);
                }
                next.initialize();
                this.scene_ = next;
                this.eventHandler_.addEventListener(this.scene_);
            }
        }
    }

    // DOMの初期化完了時にゲームを読み込む
    window.onload = () => {
        var el = document.getElementById('game-canvas');
        var greeter = new Greeter(el);
        greeter.start();
    };
}