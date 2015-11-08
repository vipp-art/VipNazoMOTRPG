module player {
    /** ユーザー情報 */
    export class UserInformation {
        /** UID */
        private id_: number;
        /** 名前 */
        private name_: string = '';

        constructor(id: number) {
            this.id_ = id;
        }

        get id(): number {
            return this.id_;
        }

        get name(): string {
            return this.name_;
        }

        set name(v: string) {
            this.name_ = v;
        }
    }
} 