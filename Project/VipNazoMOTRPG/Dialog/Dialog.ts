module dialog {
    /** 汎用ダイアログ */
    export class Dialog {
        private static instance_: Dialog;

        /** ダイアログが開いたときの通知 */
        private static onOpenCallback_: () => void;

        /** ダイアログが閉じたときの通知 */
        private static onCloseCallback_: () => void;

        /** ダイアログを開く */
        static openDialog(): Dialog {
            if (!Dialog.instance_) {
                Dialog.instance_ = new Dialog();
            }
            Dialog.instance_.initialize();
            if (Dialog.onOpenCallback_) {
                Dialog.onOpenCallback_();
            }
            return Dialog.instance_;
        }

        /** ダイアログが開閉したときのコールバックを設定 */
        static setGlobalHook(onOpen: () => void, onClose: () => void): void {
            Dialog.onOpenCallback_ = onOpen;
            Dialog.onCloseCallback_ = onClose;
        }

        /** ダイアログが開いているか */
        static get isOpening(): boolean {
            return Dialog.instance_ ? Dialog.instance_.isOpening : false;
        }

        /** 全体 */
        private bg_: HTMLElement;
        /** 文字を出す場所 */
        private text_: HTMLElement;
        /** インプットフォーム */
        private input_: HTMLInputElement;
        /** テキストエリア */
        private textarea_: HTMLTextAreaElement;

        /** ボタン */
        private button1_: HTMLInputElement;
        /** ボタン */
        private button2_: HTMLInputElement;
        /** ボタン */
        private button3_: HTMLInputElement;

        /** 左押下 */
        private onSubmitLeft: (dialog: Dialog) => boolean;
        /** 右押下 */
        private onSubmitRight: (dialog: Dialog) => boolean;
        /** 中央押下 */
        private onSubmitCenter: (dialog: Dialog) => boolean;

        /** 開いているか */
        private isOpen_: boolean;

        constructor() {
            this.bg_ = document.getElementById('dialog-bg');
            this.text_ = document.getElementById('dialog-text');
            this.input_ = <HTMLInputElement> document.getElementById('dialog-input');
            this.textarea_ = <HTMLTextAreaElement> document.getElementById('dialog-textarea');

            this.button1_ = <HTMLInputElement> document.getElementById('dialog-button1');
            this.button2_ = <HTMLInputElement> document.getElementById('dialog-button2');
            this.button3_ = <HTMLInputElement> document.getElementById('dialog-button3');

            this.button1_.onclick = () => { this.onButton(0); }
            this.button2_.onclick = () => { this.onButton(1); }
            this.button3_.onclick = () => { this.onButton(2); }

            this.isOpen_ = false;
        }

        /** 初期設定 */
        private initialize(): void {
            this.bg_.style.display = 'block';

            this.input_.style.display = 'none';
            this.textarea_.style.display = 'none';
            this.button1_.style.display = 'none';
            this.button2_.style.display = 'none';
            this.button3_.style.display = 'none';

            this.text_.style.height = '290px';

            this.isOpen_ = true;
        }

        /** ボタン押下時 */
        private onButton(no: number): void {
            var callback: (dialog: Dialog) => boolean = [this.onSubmitLeft, this.onSubmitCenter, this.onSubmitRight][no];
            var isClose: boolean = true;
            if (callback) {
                isClose = callback(this);
            }
            if (isClose) {
                this.close();
            }
        }

        /** ダイアログが開いているか */
        get isOpening(): boolean {
            return this.isOpen_;
        }

        /** ウインドウを閉じる */
        close(): void {
            this.bg_.style.display = 'none';
            if (Dialog.onCloseCallback_) {
                Dialog.onCloseCallback_();
            }
            this.isOpen_ = false;
        }

        /** ボタン有効化 */
        setPositiveButton(text: string, callback: (dialog: Dialog) => boolean): void {
            this.setupButton(text, callback, 0);
        }

        /** ボタン有効化 */
        setNegativeButton(text: string, callback: (dialog: Dialog) => boolean): void {
            this.setupButton(text, callback, 2);
        }

        /** ボタン有効化 */
        setCenterButton(text: string, callback: (dialog: Dialog) => boolean): void {
            this.setupButton(text, callback, 1);
        }

        /** ボタン有効化 */
        private setupButton(text: string, callback: (dialog: Dialog) => boolean, no: number): void {
            var button: HTMLInputElement = [this.button1_, this.button2_, this.button3_][no];
            button.value = text;
            button.style.display = 'inline';
            this['onSubmit' + ['Left', 'Center', 'Right'][no]] = callback;
        }

        /** インプットフォーム有効化 */
        enableInputForm(placeholder?: string): void {
            this.input_.style.display = 'inline';
            this.input_.placeholder = placeholder || '';
        }

        /** テキストエリアの有効化 */
        enableTextForm(placeholder?: string): void {
            this.textarea_.style.display = 'block';
            this.textarea_.placeholder = placeholder || '';
            this.text_.style.height = '90px';
        }

        /** インプットフォームの内容を取得 */
        get inputText(): string {
            return this.input_.value;
        }

        /** テキストエリアの内容を取得 */
        get textareaText(): string {
            return this.textarea_.value;
        }

        /** メッセージの設定 */
        setMessage(text: string, width?: number): void {
            this.text_.innerText = text;
            if (width) {
                this.text_.style.width = width + 'px';
            }
        }

        /** メッセージをHTMLで指定 */
        setRichMessage(html: string): void {
            this.text_.innerHTML = html;
        }
    }
} 