/// <reference path="../Ajax/Ajax.ts" />

module chat {
    export class Chat {
        /** ログ */
        private logs_: Array<Log>;

        /** ユーザーID */
        private user_: number;

        /** グループID */
        private group_: number;

        constructor(group: number, user: number) {
            this.group_ = group;
            this.user_ = user;
            this.logs_ = new Array();
        }

        /** ログ取得 */
        getLogs(): Array<Log> {
            return this.logs_;
        }

        /** チャットのメッセージ受信 */
        postReadLog(callback: (chat: Chat) => void): void {
            // TODO: 一部だけ取得対応
            var a: ajax.Ajax = new ajax.Ajax(
                new ajax.URL('localhost', 'Requests/Chat/Chat.php'),
                (o) => {
                    var logs = o.responseObject['log'];
                    this.logs_ = new Array();
                    for (var i in logs) {
                        this.logs_.push(new Log(logs[i].user, logs[i].text, logs[i].senttime));
                    }
                    if (callback) {
                        callback(this);
                    }
                },
                (o, m) => { console.log('通信エラー:' + m); });
            a.setParameter({ 'group': this.group_ });
            a.connect();
        }

        /**
         * チャットのメッセージ送信
         */
        sendMessage(message: string, callback: (chat: Chat) => void): void {
            var a: ajax.Ajax = new ajax.Ajax(
                new ajax.URL('localhost', 'Requests/Chat/Chat.php'),
                (o) => { if (callback) { callback(this); } },
                (o, m) => { alert('通信エラー:' + m); });
            a.setParameter({ 'group': this.group_, 'text': message, 'user': this.user_ });
            a.put();
        }
    }
}