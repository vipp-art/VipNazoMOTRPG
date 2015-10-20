module player {
    /** 各プレイヤーの集中管理用クラス */
    export class PlayerHolder {
        private players_: Array<Player>;

        constructor() {
            this.players_ = new Array();
        }

        add(player: Player) {
            this.players_.push(player);
        }

        traverse(traverser: IPlayerTraverser): void {
            for (var i in this.players_) {
                traverser.execPlayer(i, this.players_[i]);
            }
        }

        findSelf(): Player {
            for (var i in this.players_) {
                if (this.players_[i].isSelf) {
                    return this.players_[i];
                }
            }
            return null;
        }

        findAtId(id: number): Player {
            for (var i in this.players_) {
                if (this.players_[i].id == id) {
                    return this.players_[i];
                }
            }
            return null;
        }

        at(no: number): Player {
            return this.players_[no];
        }

        createRenderer(canvas:sys.IGraphics): IPlayerRenderer {
            return new CanvasPlayerRenderer(canvas, this);
        }
    }

    export interface IPlayerRenderer {
        draw(): void;
    }

    export interface IPlayerTraverser {
        execPlayer(no: number, player: Player): void;
    }
} 