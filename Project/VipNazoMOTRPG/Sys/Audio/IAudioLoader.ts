/// <reference path="./IAudioSource.ts" />
module sys.audio {
    /** 音声読み込み */
    export interface IAudioLoader {
        /** 音声の読み込み */
        load(path: string): IAudioSource;
    }
} 