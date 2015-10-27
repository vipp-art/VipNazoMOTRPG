module ajax {
    /** URL */
    export class URL {
        /** プロトコル */
        private protocol_: string;
        /** ホスト */
        private host_: string;
        /** ポート */
        private port_: number;
        /** リソース */
        private resource_: string;

        /** デフォルトのポート */
        private static kDefaultPort: number = 80;

        /** 基本で使用するポートの指定 */
        static setDefaultPort(port: number): void {
            URL.kDefaultPort = port;
        }

        /** */
        constructor(host: string, resource: string, port?: number, protocol?:Protocol) {
            this.host_ = host;
            this.resource_ = (resource.indexOf( '/' ) == 0) ? resource : ('/' + resource);
            this.port_ = port || URL.kDefaultPort;
            this.setProtocol(protocol);
        }

        /** プロトコルの指定 */
        private setProtocol(protocol?: Protocol): void {
            if (!protocol) {
                this.protocol_ = location.protocol;
                return;
            }
            switch (protocol) {
                case Protocol.kHttp: this.protocol_ = 'http:'; break;
                case Protocol.kHttps: this.protocol_ = 'https:'; break;
                case Protocol.kFtp: this.protocol_ = 'ftp:'; break;
                case Protocol.kSftp: this.protocol_ = 'sftp:'; break;
                case Protocol.kFtps: this.protocol_ = 'ftps:'; break;
                case Protocol.kFile: this.protocol_ = 'file:'; break;
                default: throw '不正なプロトコル';
            }
        }

        /** フルパスを取得 */
        get url(): string {
            return this.protocol_ + '//' + this.host_ + ':' + this.port_ + this.resource_;
        }
    }

    /** プロトコル */
    export enum Protocol {
        kHttp = 1,
        kHttps,
        kFtp,
        kSftp,
        kFtps,
        kFile,
    }
} 