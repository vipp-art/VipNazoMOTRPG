/// <reference path="../Sys/IGraphics.ts" />
/// <reference path="../Sys/Audio/AudioManager.ts" />
module scene {
    /** シーンの描画 */
    export interface ISceneRenderer {
        draw(): void;
    }

    /** シーンの基底 */
    export interface IScene {
        /** シーンの初期化 */
        initialize(): void;

        /** 更新 */
        update(): IScene;

        /** 描画用のレンダラの生成 */
        createSceneRenderer(canvas: sys.IGraphics): ISceneRenderer;
    }

    /** */
    export class BlankSceneRender {
        draw(): void {}
    }

}
