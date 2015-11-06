/// <reference path="./Scene/IScene.ts" />
/// <reference path="./Scene/Setup/CreateUser.ts" />
/// <reference path="./Event/EventHandler.ts" />
/// <reference path="./Util/Frame.ts" />
/// <reference path="./Util/With.ts" />
/// <reference path="./Sys/CanvasGraphics.ts" />
/// <reference path="./Sys/Audio/HTML5AudioPlayer.ts" />
/// <reference path="./Chat/ChatBoard.ts" />
/// <reference path="./Dialog/Dialog.ts" />
import IScene = scene.IScene;
import CreateUserWindow = scene.setup.CreateUser;
import EventHandler = eventhandler.EventHandler;
import Frame = util.Frame;
import AudioManager = sys.audio.AudioManager;
import Dialog = dialog.Dialog;

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
            // サウンド回り整備
            sys.audio.html5.AudioManger.setup();

            // 通信に使うポートの指定
            ajax.URL.setDefaultPort(8000);

            var chatBoard: chat.ChatBoard = new chat.ChatBoard(
                document.getElementById('chat-log'),
                document.getElementById('chat-sneder'), 1, 1);
        }

        /** ゲームの開始 */
        start() {
            Frame.instance().update();
            this.eventHandler_ = new EventHandler(this.element_);
            this.newScene(new CreateUserWindow());

            // 10FPSでタイマー起動
            setInterval(() => this.tick(), 1000 / 10);
        }

        /** 毎フレーム処理 */
        tick() {
            var isOpeningDialog: boolean = Dialog.isOpening;

            // 背面を白に
            this.graphics_.fillRect(0, 0, this.graphics_.getWidth(), this.graphics_.getHeight(), new sys.Color(1, 1, 1));

            // イベント更新
            this.eventHandler_.update(!isOpeningDialog);

            // シーン更新
            var next: IScene = isOpeningDialog ? null : this.scene_.update();
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