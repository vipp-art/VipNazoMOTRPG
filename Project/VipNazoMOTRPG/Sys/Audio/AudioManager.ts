/// <reference path="./IAudioPlayer.ts" />
/// <reference path="./IAudioLoader.ts" />
/// <reference path="./IAudioSource.ts" />

module sys.audio {
    /** 音声回り */
    export class AudioManager{
        private static player_: IAudioPlayer;
        private static loader_: IAudioLoader;

        static setup(player: IAudioPlayer, loader: IAudioLoader): void {
            this.player_ = player;
            this.loader_ = loader;
        }

        static getPlayer(): IAudioPlayer {
            return AudioManager.player_;
        }

        static getLoader(): IAudioLoader {
            return AudioManager.loader_;
        }
    }
} 