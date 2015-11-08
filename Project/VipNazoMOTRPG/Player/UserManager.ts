/// <reference path="./UserInformation.ts" />
module player {
    /** ユーザー管理 */
    export class UserManger {
        private static instance_: UserManger = new UserManger();

        public static instance(): UserManger {
            return UserManger.instance_;
        }

        /** 自分 */
        private self_: UserInformation = null;

        /** 全ユーザー */
        private users_: Array<UserInformation> = new Array();

        /** ユーザー追加 */
        add(user: UserInformation): void {
            if (this.users_.indexOf(user) < 0) {
                this.users_.push(user);
            }
        }

        /** ユーザー削除 */
        remove(user: UserInformation): void {
            var index = this.users_.indexOf(user);
            if (index >= 0) {
                this.users_.splice(index, 1);
            }
        }

        /** ユーザー全削除 */
        removeAll(): void {
            this.users_ = new Array();
            this.setSelf(this.self);
        }

        /** 自分を設定 */
        setSelf(self: UserInformation): void {
            this.remove(this.self_);
            this.add(self);
            this.self_ = self;
        }

        /** 自分を取得 */
        get self(): UserInformation {
            return this.self_;
        }

        /** ユーザー数を取得 */
        get count(): number {
            return this.users_.length;
        }

        /** ユーザー取得 */
        at(no: number): UserInformation {
            return this.users_[no];
        }
    }
}