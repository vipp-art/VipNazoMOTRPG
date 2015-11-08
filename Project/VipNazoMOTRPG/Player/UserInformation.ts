module player {
    /** ユーザー情報 */
    export class UserInformation {
        /** UID */
        private id_: number;
        /** 名前 */
        private name_: string = '';
        /** 所属チーム */
        private group_: number = -1;

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

        get group(): number {
            return this.group_;
        }

        set group(v: number) {
            this.group_ = v;
        }
    }
} 