module util {
    /** 時間 */
    export class TimeUnit {
        /** 内部 */
        private millis_: number;

        /** ミリ秒から生成 */
        static fromMillis(milliSeconds: number): TimeUnit {
            var result = new TimeUnit();
            result.millis_ = Math.floor(milliSeconds);
            return result;
        }

        /** 秒から生成 */
        static fromSeconds(seconds: number): TimeUnit {
            return TimeUnit.fromMillis(seconds * 1000);
        }

        /** 分から生成 */
        static fromMinutes(minutes: number): TimeUnit {
            return TimeUnit.fromSeconds(minutes * 60);
        }

        /** 時から生成 */
        static fromHours(hours: number): TimeUnit {
            return TimeUnit.fromMinutes(hours * 60);
        }

        /** 日から生成 */
        static fromDay(days: number): TimeUnit {
            return TimeUnit.fromHours(days * 24);
        }

        /** ミリ秒として取得 */
        toMillis(): number {
            return this.millis_;
        }

        /** 秒として取得 */
        toSeconds(): number {
            return this.toMillis() / 1000;
        }
        
        /** 分として取得 */
        toMinutes(): number {
            return this.toMillis() / 1000 / 60;
        }

        /** 時として取得 */
        toHours(): number {
            return this.toMillis() / 1000 / 60 / 60;
        }

        /** 日として取得 */
        toDays(): number {
            return this.toMillis() / 1000 / 60 / 60 / 24;
        }

        /** 加算 */
        add(rhs:TimeUnit): TimeUnit {
            return TimeUnit.fromMillis(this.toMillis() + rhs.toMillis());
        }

        /** 減算 */
        minus(rhs: TimeUnit): TimeUnit {
            return TimeUnit.fromMillis(this.toMillis() - rhs.toMillis());
        }

        /** 差 */
        distanceOf(rhs: TimeUnit): TimeUnit {
            return TimeUnit.fromMillis(Math.abs(this.toMillis() - rhs.toMillis()));
        }
    }
} 