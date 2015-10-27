/// <reference path="./URL.ts" />
module ajax {
    /** ajax */
    export class Ajax {
        /** コネクション */
        private request_: XMLHttpRequest;

        /** 接続先 */
        private url_: string;

        /** BLOBか */
        private isBinary_: boolean = false;

        /** 通信完了 */
        private onComplete_: (ajax:Ajax) => void;

        /** 通信エラー */
        private onError_: (ajax: Ajax, message:string) => void;

        /** DL率 */
        private progress_: number = -1;

        /** 送信するデータ */
        private parameters_: Object = null;

        constructor(url: URL, onComplete: (ajax: Ajax) => void, onError?: (ajax: Ajax, message: string) => void) {
            // TODO:XDomainRequest
            this.request_ = new XMLHttpRequest();
            this.url_ = url.url;
            this.onComplete_ = onComplete;
            this.onError_ = onError;

            this.request_.onload = (e: Event) => {
                this.onComplete();
            };
            this.request_.onerror = (e: ErrorEvent) => {
                this.onError(e.error);
            };
            this.request_.onprogress = (e: ProgressEvent) => {
                this.onProgress(e);
            };
        }

        /** 通信完了 */
        private onComplete(): void {
            var statusType: number = Math.floor(this.request_.status / 100);
            if (statusType == 2 || statusType == 3) {
                // 2XXもしくは3XXは成功
                if (this.onComplete_) {
                    this.onComplete_(this);
                }
            } else {
                // 4XX、5XX、ついでに1XXは失敗
                if (this.onError_) {
                    this.onError_(this, this.request_.statusText);
                }
            }
        }

        /** 通信失敗 */
        private onError(message:string): void {
            if (this.onError_) {
                this.onError_(this, message);
            }
        }

        /** 通信中 */
        private onProgress(e: ProgressEvent): void {
            this.progress_ = -1;
            if (e.lengthComputable) {
                this.progress_ = e.loaded / e.total;
            }
        }

        /** DL進捗率の取得 */
        get progress(): number {
            return this.progress_;
        }

        /** レスポンスはバイナリ */
        setBinaryResponse(): void {
            this.isBinary_ = true;
        }

        /** 値 */
        setText(parameters: string): void {
            this.parameters_ = parameters;
        }

        /** 値 */
        setParameter(parameters: Object): void {
            this.parameters_ = parameters;
        }

        /** バイナリ値 */
        setBinary(binary: Blob): void {
            this.parameters_ = binary;
        }

        /** GET通信 */
        connect(): void {
            var request: string = '';
            if (this.parameters_ instanceof Blob) {
                // blobは無視 -> Base64?
            } else if (this.parameters_ instanceof String) {
                request = '?' + this.parameters_;
            } else if (this.parameters_ instanceof Object) {
                request = '?';
                for (var i in this.parameters_) {
                    request += encodeURIComponent(i) + '=' + encodeURIComponent(this.parameters_[i]);
                    request += '&';
                }
                request = request.substr(0, request.length - 1);
            }
            this.request_.open('GET', this.url_ + request);
            this.request_.send();
        }

        /** POST通信 */
        post(): void {
            this.request_.open('POST', this.url_);

            if (this.parameters_ instanceof Blob) {
                this.request_.send(this.parameters_);
            } else if (this.parameters_ instanceof String) {
                this.request_.send(this.parameters_);
            } else if (this.parameters_ instanceof Object) {
                var form: FormData = new FormData();
                for (var i in this.parameters_) {
                    form.append(i, this.parameters_[i]);
                }
                this.request_.send(form);
            } else {
                this.request_.send();
            }
        }

        /** レスポンスの文字列表現 */
        get responseText(): string {
            return this.request_.responseText;
        }
    }
} 