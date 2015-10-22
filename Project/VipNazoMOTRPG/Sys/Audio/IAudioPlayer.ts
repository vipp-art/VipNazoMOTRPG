/// <reference path="./IAudioSource.ts" />
module sys.audio {
    /** 音声の再生 */
    export interface IAudioPlayer {

        /** ボリュームの変更 */
        setVolume(port: number, volume: number): void;

        /** 音源の設定 */
        setSource(port: number, source: IAudioSource): void;
        
        /** 音声の再生 */
        play(port: number, count?:number): void;

        /** 停止 */
        stop(port: number): void;
    }
}