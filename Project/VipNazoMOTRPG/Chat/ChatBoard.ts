/// <reference path="./Log.ts" />
/// <reference path="./Chat.ts" />

module chat {
    export class ChatBoard {
        private board_: HTMLElement;
        private sender_: HTMLElement;
        private group_: number;
        private user_: number;
        private chat_: Chat;

        constructor(board: HTMLElement, sender: HTMLElement, group: number, user: number) {
            this.board_ = board;
            this.sender_ = sender;
            this.group_ = group;
            this.user_ = user;
            this.chat_ = new Chat(group, user);

            this.postReadLog();
            this.sender_.onsubmit = () => {
                var value: string = this.sender_['chat-text'].value || '';
                this.sender_['chat-text'].value = '';
                if (value.length > 0) {
                    this.chat_.sendMessage(value, (chat) => { });
                }
            };
       } 

        postReadLog(): void {
            var manager = player.UserManager.instance();
            this.chat_.postReadLog((chat) => {
                    var html: string = '';
                    chat.getLogs().forEach((v) => {
                        html += '<p><span>' + manager.find(v.user).name + '</span> : <span>' + v.text + '</span></p>'
                        });
                    this.board_.innerHTML = html;

                    // タイマーで定期的に取得
                    var timer = util.Timer.createTimer('chat', this.postReadLog, this);
                    timer.setInterval(util.TimeUnit.fromMillis(500));
                    timer.start();
                },
                (chat) => {
                    // タイマーで定期的に取得
                    var timer = util.Timer.createTimer('chat', this.postReadLog, this);
                    timer.setInterval(util.TimeUnit.fromMillis(500));
                    timer.start();
                });
        }
    }
} 