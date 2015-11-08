/// <reference path="../IScene.ts" />

module scene.game {
    export class RoomInformation implements scene.IScene {
        constructor(roomId: number, roomName:string, group1: number, group2: number) {
        }

        /** シーンの初期化 */
        initialize(): void {
        }

        /** 更新 */
        update(): scene.IScene {
            return null;
        }

        /** 描画用のレンダラの生成 */
        createSceneRenderer(canvas: sys.IGraphics): scene.ISceneRenderer {
            return new SceneRenderer(this);
        }
    }

    class SceneRenderer implements scene.ISceneRenderer {
        constructor(parent: RoomInformation) {
        }

        draw(): void {
        }
    }
}