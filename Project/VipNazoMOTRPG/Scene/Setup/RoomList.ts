module scene.setup {
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

    /** 部屋一覧取得 */
    export class RoomList implements scene.IScene, eventhandler.IOnClick {
        private list_: Array<RoomInformation>;

        constructor() {
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
                    for (var i in result) {
                        this.list_.push(new RoomInformation(result[i]));
                    }
                },
                (o, m) => { alert('通信エラー:' + m); this.getRoomList(); });
            a.setParameter({ 'name': name });
            a.connect();
        }

        update(): IScene {
            return null;
        }

        createSceneRenderer(canvas: sys.IGraphics): ISceneRenderer {
            return new SceneRenderer(canvas, this);
        }

        get list(): Array<RoomInformation> {
            return this.list_;
        }

        onClick(event: MouseEvent) {
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
                var y: number = 0;
                var height: number = 80;
                for (var i in list) {
                    var item = list[i];
                    var cy: number = 5 + y * (height + 5);
                    g.drawRect(5, cy, 300, height, new sys.Color(0, 0, 0, 1));
                    g.drawText('部屋' + y + ' : ' + item.name, 7, cy + 2, new sys.Color(0, 0, 0, 1));
                    g.drawText('チームA : ' + item.group1.count + '人', 12, cy + 20, new sys.Color(0, 0, 0, 1));
                    g.drawText('チームB : ' + item.group2.count + '人', 12, cy + 34, new sys.Color(0, 0, 0, 1));
                    ++y;
                }

                var cy: number = 5 + y * (height + 5) + 10;
                g.fillRect(5, cy, 80, 80, new sys.Color(0, 1, 0, 1));
                g.drawText('部屋作成', 7, cy + 2, new sys.Color(0, 0, 0, 1));
            }
        }
    }
} 