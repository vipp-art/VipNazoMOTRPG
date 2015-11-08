/// <reference path="../IScene.ts" />
/// <reference path="../../Event/EventHandler.ts" />
/// <reference path="../../Player/UserManager.ts" />
/// <reference path="../../Chat/ChatBoard.ts" />

module scene.game {
    /** グループの情報 */
    export class GroupInformation {
        private id_: number;
        private users_: Array<player.UserInformation> = new Array();

        constructor(id: number) {
            this.id_ = id;
        }

        get id(): number {
            return this.id_;
        }

        add(user: player.UserInformation): void {
            if (!this.users_.some((u) => {return u.id == user.id })) {
                this.users_.push(user);
            }
        }

        get members(): Array<player.UserInformation> {
            return this.users_;
        }
    }

    export class RoomInformation implements scene.IScene, eventhandler.IOnClick {
        /** 部屋ID */
        private roomId_: number;
        /** 部屋名 */
        private roomName_: string;

        /** チーム1 */
        private group1_: GroupInformation;
        /** チーム2 */
        private group2_: GroupInformation;

        /** 次のシーン */
        private nextScene_: Game = null;

        /** ボタン */
        private buttons_: util.button.ButtonManager;

        /** チャット */
        private chat_: chat.ChatBoard = null;

        constructor(roomId: number, roomName: string, group1: number, group2: number) {
            this.roomId_ = roomId;
            this.roomName_ = roomName;

            this.group1_ = new GroupInformation(group1);
            this.group2_ = new GroupInformation(group2);
        }

        /** 5秒ごとにユーザー情報の更新 */
        private connectGetUser(): void{
            if (this.nextScene_) {
                return;
            }
            // 各グループのユーザーの情報を取得
            this.getUsers(this.group1, () => {
                this.getUsers(this.group2, () => {
                    var timer = util.Timer.createTimer('getuser', this.connectGetUser, this);
                    timer.setInterval(util.TimeUnit.fromSeconds(5));
                    timer.start();
                });
            });
        }

        /** グループの所属ユーザー取得 */
        private getUsers(group: GroupInformation, onComplete: () => void): void {
            var a: ajax.Ajax = new ajax.Ajax(
                new ajax.URL('localhost', 'Requests/Room/Group.php'),
                (o) => {
                    var result: Array<number> = o.responseObject['users'];
                    this.getUserInformations(group, result.join(','), onComplete);
                },
                (o, m) => { alert('通信エラー:' + m); this.getUsers(group, onComplete); });
            a.setParameter({ 'id': group.id });
            a.connect();
        }

        /** ユーザーの詳細を取得 */
        private getUserInformations(group: GroupInformation, joinedId: string, onComplete: () => void): void {
            var a: ajax.Ajax = new ajax.Ajax(
                new ajax.URL('localhost', 'Requests/User/User.php'),
                (o) => {
                    var result: Array<Object> = o.responseObject['users'];
                    for (var i in result) {
                        var u = new player.UserInformation(result[i]['id']);
                        u.name = result[i]['name'];
                        u.group = group.id;
                        group.add(u);
                        player.UserManager.instance().add(u);
                    }
                    if (onComplete) {
                        onComplete();
                    }
                },
                (o, m) => { alert('通信エラー:' + m); this.getUserInformations(group, joinedId, onComplete); });
            a.setParameter({ 'users': joinedId });
            a.connect();
        }

        /** シーンの初期化 */
        initialize(): void {
            this.connectGetUser();
            this.buttons_ = new util.button.ButtonManager();
            var button: util.button.Button;

            // 参加ボタン
            this.buttons_.add(button = new util.button.RectButton(new util.Rect(5 + 3, 20 + 23, 80, 20)));
            button.setOnClickHandler((button) => { this.join(this.group1); });

            this.buttons_.add(button = new util.button.RectButton(new util.Rect(210 + 3, 20 + 23, 80, 20)));
            button.setOnClickHandler((button) => { this.join(this.group2); });
        }

        /** グループに参加 */
        join(group: GroupInformation): void {
            if (player.UserManager.instance().self.group < 0) {
                // 未参加なので参加通信
                var a: ajax.Ajax = new ajax.Ajax(
                    new ajax.URL('localhost', 'Requests/Room/Group.php'),
                    (o) => {
                        player.UserManager.instance().self.group = group.id;
                    },
                    (o, m) => { alert('通信エラー:' + m); this.join(group); });
                a.setParameter({ 'id': group.id, 'user': player.UserManager.instance().self.id });
                a.post();
            }
        }

        /** 更新 */
        update(): scene.IScene {
            if (this.chat_ == null) {
                var self = player.UserManager.instance().self;
                if (self.group > 0) {
                    this.chat_ = new chat.ChatBoard(
                        document.getElementById('chat-log'),
                        document.getElementById('chat-sneder'), self.group, self.id);
                }
            }
            return this.nextScene_;
        }

        /** 描画用のレンダラの生成 */
        createSceneRenderer(canvas: sys.IGraphics): scene.ISceneRenderer {
            return new SceneRenderer(canvas, this);
        }

        /** クリックされた */
        onClick(event: MouseEvent): void {
            this.buttons_.onClick(event);
        }

        get roomId(): number {
            return this.roomId_;
        }

        get roomName(): string {
            return this.roomName_;
        }

        get group1(): GroupInformation {
            return this.group1_;
        }

        get group2(): GroupInformation {
            return this.group2_;
        }
    }

    class SceneRenderer implements scene.ISceneRenderer {
        private canvas_: sys.IGraphics;
        private parent_: RoomInformation;

        constructor(canvas: sys.IGraphics, parent: RoomInformation) {
            this.canvas_ = canvas;
            this.parent_ = parent;
        }

        draw(): void {
            var parent = this.parent_;
            var g = this.canvas_;

            var style = g.getTextStyle();
            style.horizontalAlign = sys.HorizontalAlign.kCenter;
            style.verticalAlign = sys.VerticalAlign.kTop;
            g.setTextStyle(style);

            g.drawText(parent.roomName, g.getWidth() * .5, 5, new sys.Color(0, 0, 0, 1));

            this.drawGroup(parent.group1, 'チーム1', 5, 20);
            this.drawGroup(parent.group2, 'チーム2', 210, 20);
        }

        /** グループの情報を表示 */
        private drawGroup(group: GroupInformation, caption:string, x:number, y:number): void {
            var parent = this.parent_;
            var g = this.canvas_;

            var style = g.getTextStyle();
            style.horizontalAlign = sys.HorizontalAlign.kCenter;
            style.verticalAlign = sys.VerticalAlign.kTop;
            g.setTextStyle(style);

            g.drawText(caption, x + 100, y, new sys.Color(0, 0, 0, 1));

            // 参加ボタン
            g.fillRect(x + 3, y + 23, 80, 20, sys.Color.red); 
            g.drawText('参加', x + 5 + 40, y + 25, sys.Color.black);

            style.horizontalAlign = sys.HorizontalAlign.kLeft;
            g.setTextStyle(style);

            // メンバー
            var members = group.members;
            for (var i in members) {
                var member = members[i];
                g.drawText(member.name, x + 5, y + 50 + i * 20, sys.Color.black);
            }
        }
    }
}