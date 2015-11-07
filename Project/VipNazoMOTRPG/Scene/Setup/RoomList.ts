/// <reference path="../IScene.ts" />
/// <reference path="../../Ajax/Ajax.ts" />
/// <reference path="../../Event/EventHandler.ts" />
/// <reference path="../../Sys/Audio/AudioManager.ts" />
/// <reference path="../../Util/Button/ButtonManager.ts" />

module scene.setup {
    import AudioManager = sys.audio.AudioManager;
    import ButtonManager = util.button.ButtonManager;

    export class GroupInformation {
        private id_: number;
        private count_: number;

        constructor(id: number, count: number) {
            this.id_ = id;
            this.count_ = count;
        }

        get id(): number { return this.id_; }
        get count(): number { return this.count_; }
    }

    export class RoomInformation {
        private roomId_: number;
        private name_: string;
        private notice_: string;
        private group1_: GroupInformation;
        private group2_: GroupInformation;

        constructor(data: Object) {
            this.roomId_ = data['room-id'];
            this.name_ = data['name'];
            this.notice_ = data['notice'];
            this.group1_ = new GroupInformation(data['group1']['id'], data['group1']['count']);
            this.group2_ = new GroupInformation(data['group2']['id'], data['group2']['count']);
        }

        get roomId(): number { return this.roomId_; }
        get name(): string { return this.name_; }
        get natice(): string { return this.notice_; }

        get group1(): GroupInformation { return this.group1_; }
        get group2(): GroupInformation { return this.group2_; }
    }

    /** 部屋ボタン */
    export class RoomButton extends util.button.RectButton {
        private room_: RoomInformation;
        private index_: number;

        constructor(room: RoomInformation, index: number, callback: (button: RoomButton) => void) {
            super(new Rect(7, 5 + index * (80 + 5), 300, 80));
            super.setOnClickHandler(callback);
            this.room_ = room;
            this.index_ = index;
        }

        draw(g: sys.IGraphics): void {
            var height: number = 80;
            var item = this.room_;
            var rect = this.rect;
            g.drawRect(rect.x, rect.y, rect.width, rect.height, new sys.Color(0, 0, 0, 1));
            g.drawText('部屋' + (this.index_ + 1) + ' : ' + item.name, rect.x + 2, rect.y + 2, new sys.Color(0, 0, 0, 1));
            g.drawText('チームA : ' + item.group1.count + '人', rect.x + 8, rect.y + 20, new sys.Color(0, 0, 0, 1));
            g.drawText('チームB : ' + item.group2.count + '人', rect.x + 8, rect.y + 34, new sys.Color(0, 0, 0, 1));
        }

        get room(): RoomInformation {
            return this.room_;
        }
    }

    /** 部屋一覧取得 */
    export class RoomList implements scene.IScene, eventhandler.IOnClick {
        /** 部屋一覧 */
        private list_: Array<RoomButton>;

        /** ボタン */
        private buttons_: ButtonManager;

        /** 部屋作成ボタン */
        private createButton_: util.button.RectButton;

        constructor() {
            this.buttons_ = new ButtonManager;
        }

        initialize(): void {
            var player = AudioManager.getPlayer();
            player.setSource(1, AudioManager.getLoader().load('Res/piko'));
            this.getRoomList();
        }

        getRoomList(): void {
            this.list_ = new Array();
            var a: ajax.Ajax = new ajax.Ajax(
                new ajax.URL('localhost', 'Requests/Room/Room.php'),
                (o) => {
                    var result = o.responseObject['rooms'];
                    this.buttons_.removeAll();
                    for (var i in result) {
                        var item = new RoomInformation(result[i]);
                        var button = new RoomButton(item, i, (button) => { this.onButtonClicked(button); });
                        this.list_.push(button);
                        this.buttons_.add(button);
                    }
                    // 部屋作成ボタン追加
                    var createButton = new util.button.RectButton(new Rect(400, 8, 100, 20));
                    createButton.setOnClickHandler((button) => { this.onCreateButtonClicked(); });
                    this.buttons_.add(createButton);
                    this.createButton_ = createButton;
                },
                (o, m) => { alert('通信エラー:' + m); this.getRoomList(); });
            a.setParameter({ 'name': name });
            a.connect();
        }

        /** ボタン押下時 */
        private onButtonClicked(button: RoomButton): void {
        }

        /** 部屋作成ボタン押下時 */
        private onCreateButtonClicked(): void {
        }

        update(): IScene {
            return null;
        }

        createSceneRenderer(canvas: sys.IGraphics): ISceneRenderer {
            return new SceneRenderer(canvas, this);
        }

        /** 部屋一覧 */
        get list(): Array<RoomButton> {
            return this.list_;
        }

        /** 部屋作成ボタン */
        get createButton(): util.button.RectButton {
            return this.createButton_;
        }

        onClick(event: MouseEvent) {
            this.buttons_.onClick(event);
        }
    }

    class SceneRenderer implements scene.ISceneRenderer {
        private canvas_: sys.IGraphics;
        private parent_: RoomList;

        constructor(canvas: sys.IGraphics, list: RoomList) {
            this.canvas_ = canvas;
            this.parent_ = list;
        }

        draw(): void {
            var g = this.canvas_;
            var list = this.parent_.list;
            if (list) {
                var height: number = 80;
                var style = g.getTextStyle();
                style.size = 16;
                style.bold = false;
                style.horizontalAlign = sys.HorizontalAlign.kLeft;
                style.verticalAlign = sys.VerticalAlign.kTop;
                g.setTextStyle(style);
                for (var i in list) {
                    var item = list[i];
                    item.draw(g);
                }

                var button = this.parent_.createButton;
                if (button) {
                    var rect = button.rect;
                    var center = rect.center;
                    style.horizontalAlign = sys.HorizontalAlign.kCenter;
                    style.verticalAlign = sys.VerticalAlign.kCetner;
                    g.setTextStyle(style);
                    g.fillRect(rect.x, rect.y, rect.width, rect.height, new sys.Color(0, 1, 0, 1));
                    g.drawText('部屋作成', center.x, center.y, new sys.Color(0, 0, 0, 1));
                }
            }
        }
    }
} 