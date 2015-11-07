/// <refernece path="../../util/With.ts" />
/// <refernece path="./RoomList.ts" />

module scene.setup {
    export class CreateUser implements scene.IScene {

        /** ユーザー生成成功したか */
        private isSuccessCreateUser_: boolean;

        /** ダイアログ */
        private dialog_: Dialog;

        initialize(): void {
            this.isSuccessCreateUser_ = false;
            this.dialog_ = Dialog.openDialog();
            this.reinput();
        }

        reinput(): void {
            util.With(this.dialog_, (self: Dialog) => {
                self.setMessage('ユーザー名を入力してください。');
                self.enableInputForm();
                self.setPositiveButton('OK', () => { this.createUser(self.inputText); return false; });
            });
        }

        update(): scene.IScene {
            return this.isSuccessCreateUser_ ? new RoomList() : null;
        }

        createSceneRenderer(): scene.ISceneRenderer {
            return new scene.BlankSceneRender();
        }

        /** ユーザー生成通信 */
        private createUser(name: string): void {
            // ダイアログを通信中に変更
            this.dialog_.setMessage('通信中...');
            this.dialog_.setPositiveButton('通信中', () => { return false; });

            var a: ajax.Ajax = new ajax.Ajax(
                new ajax.URL('localhost', 'Requests/User/User.php'),
                (o) => {
                    var userId:number = o.responseObject['id'];
                    this.isSuccessCreateUser_ = true;
                    this.dialog_.close();
                },
                (o, m) => { alert('通信エラー:' + m); this.reinput(); });
            a.setParameter({ 'name': name });
            a.put();
        }
    }
} 