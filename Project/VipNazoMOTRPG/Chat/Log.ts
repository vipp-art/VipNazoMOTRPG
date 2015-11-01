module chat {
    export class Log {
        private user_: number;
        private text_: string;
        private timestamp_: number;

        constructor(user: number, text: string, timestamp: number) {
            this.user_ = user;
            this.text_ = text;
            this.timestamp_ = timestamp;
        }

        get user(): number {
            return this.user_;
        }

        get text(): string {
            return this.text_;
        }

        get timestamp(): number {
            return this.timestamp_;
        }
    }
} 