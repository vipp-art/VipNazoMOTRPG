/// <reference path="./AudioManager.ts" />

module sys.audio.html5 {
    export class AudioManger {
        static setup(): void {
            sys.audio.AudioManager.setup(new AudioPlayer(), new AudioLoader());
        }
    }

    export class AudioPlayer implements IAudioPlayer {
        private sources_: Array<AudioSource>;

        constructor() {
            this.sources_ = new Array();
        }

        /** ボリュームの変更 */
        setVolume(port: number, volume: number): void {
            var source: AudioSource = this.sources_[port];
            if (source) {
                var e = source.element;
                if (e) {
                    e.volume = volume;
                }
            }
        }

        /** 音源の設定 */
        setSource(port: number, source: IAudioSource): void {
            this.stop(port);

            if (source) {
                // 新しいのを設定
                try {
                    this.sources_[port] = <AudioSource> source;
                    this.sources_[port].element.pause();
                    this.sources_[port].element.currentTime = 0;
                } catch (exception) {
                }
            }
        }

        /** 音声の再生 */
        play(port: number, count?: number): void {
            var old: AudioSource = this.sources_[port];
            if (old) {
                // 既存を停止
                var e = old.element;
                if (e) {
                    e.pause();
                    e.currentTime = 0;
                    if (count > 1) {
                        // 指定回
                        e.loop = true;
                        e.onended = AudioPlayer.createOnEnd(count);
                    } else if (count <= 0) {
                        // 無限
                        e.loop = true;
                    } else {
                        // 1回
                        e.loop = false;
                    }
                    e.play();
                }
            }
        }

        /** 停止 */
        stop(port: number): void {
            var source: AudioSource = this.sources_[port];
            if (source) {
                var e = source.element;
                if (e) {
                    e.pause();
                }
            }
        }

        private static createOnEnd(count: number) {
            return function (e) {
                if (--count <= 0) {
                    e.pause();
                }
            };
        }
    }

    export class AudioSource implements IAudioSource {
        private source_: HTMLAudioElement;

        constructor(source: HTMLAudioElement) {
            this.source_ = source;
        }

        get element(): HTMLAudioElement {
            return this.source_;
        }
    }

    export class AudioLoader implements IAudioLoader {
        /** ファイルフォーマットが対応しているかのチェック */
        static canPlayType(audio: HTMLAudioElement): string {
            var result: string = null;
            if (audio.canPlayType('audio/ogg')) {
                return '.ogg';
            }
            if (audio.canPlayType('audio/mp3') || audio.canPlayType('audio/mpeg')) {
                return '.mp3';
            }
            throw '音声再生未対応？';
        }

        load(path: string): IAudioSource {
            var audio: HTMLAudioElement = new Audio();

            var ext:string = AudioLoader.canPlayType(audio);

            audio.autoplay = false;
            audio.src = path + ext;
            audio.load();
            return new AudioSource(audio);
        }
    }
}