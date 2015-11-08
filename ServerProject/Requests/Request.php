<?php

require_once dirname(__FILE__) . '/../MySql/DB.php';

abstract class Request {

    /** @var array 返り値 */
    private $responses_ = [];

    /** @var array PUTのリクエスト */
    private $requests_ = null;

    protected function __construct() {
        
    }

    /**
     * コントローラ生成
     */
    private function createController() {
        $name = get_class($this);
        require_once dirname(__FILE__) . '/../Game/Controller/' . str_replace('\\', '/', $name) . '.php';
        $clazz = '\\game\\controller\\' . $name;
        return new $clazz;
    }

    /**
     * HTTP METHODの解決
     * @return type
     */
    private function getMethod() {
        $method = filter_input(INPUT_SERVER, 'REQUEST_METHOD');

        if ($method === '' || !isset($method) || !is_string($method)) {
            $method = 'get';
        }

        $lowerMethod = strtolower($method);
        $lowerMethod[0] = strtoupper($lowerMethod[0]);

        // PUTなら送信データをパース
        if ($lowerMethod === 'Put') {
            $this->readPut();
        }

        return 'do' . $lowerMethod;
    }

    /**
     * PUTのデータの解決
     */
    private function readPut() {
        $this->requests_ = array();

        $putdata = @fopen("php://input", "r");

        if ($putdata) {
            while (!feof($putdata)) {
                $line = fgetss($putdata);
                $tokens = split('=', $line);

                if (count($tokens) != 2) {
                    continue;
                }

                $key = rawurldecode($tokens[0]);
                $value = rawurldecode($tokens[1]);

                $this->requests_ += array($key => trim($value));
            }
        }
    }

    /**
     * 基本のレスポンスヘッダを返す
     */
    private function putCommonHeader($controller, $method) {
        // 基本のヘッダー
        header('Access-Control-Allow-Origin: http://localhost:52181');
        header('Access-Control-Allow-Headers: *');
        header('X-Content-Type-Options: nosniff');
        header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS, DELETE');

        // OPTIONSはAllowを返すのみ
        if ($method === 'doOptions') {
            $methods = (new ReflectionClass(get_class($controller)))->getMethods();
            $allows = [];
            foreach ($methods as $m) {
                if (strpos($m, 'do') === 0) {
                    $allows[] = strtoupper(substr($m, 2));
                }
            }
            header('Allow:' . join(',', $allows));
            return false;
        }
        return true;
    }

    /**
     * リクエストの処理
     */
    function request() {
        $isRollback = true;
        $responseCode = 500;

        $method = $this->getMethod();
        $controller = $this->createController();

        // 基本ヘッダ
        if (!$this->putCommonHeader($controller, $method)) {
            // ヘッダを返すだけで終わりのとき
            return;
        }

        // 処理
        if (method_exists($controller, $method)) {
            try {
                $this->executeRequest($controller, $method);
                $isRollback = false;
                $responseCode = 200;
            } catch (\Exception $e) {
                echo $e->getMessage();
            }
        } else {
            echo 'unknown request:' . get_class($controller) . '#' . $method;
        }

        http_response_code($responseCode);
        $this->closeDB($isRollback);
    }

    /**
     * リクエストの内容をコントローラで処理
     * @param Controller $controller
     * @param string $method
     */
    private function executeRequest($controller, $method) {
        // アノテーション検索
        $reflectionMethod = (new ReflectionClass(get_class($controller)))->getMethod($method);
        $docComment = $reflectionMethod->getDocComment();
        $isTransactional = FALSE;

        if ($docComment !== FALSE) {
            // トランザクション処理
            $isTransactional = strpos($docComment, '@Transactional') !== FALSE;
        }

        if ($isTransactional) {
            // DBをロック
            $sql = \mysql\connect();
            $sql->begin_transaction();
        }

        // 処理
        $controller->$method($this);
        $result = json_encode($this->responses_);

        if ($isTransactional) {
            // コミット
            $sql = \mysql\connect();
            $sql->commit();
        }
        header('Conent-Type: application/json');
        echo $result;
    }

    /**
     * DBを閉じる
     * @param boolean $isRollback
     */
    private function closeDB($isRollback) {
        // DB切断
        $db = \mysql\connect(true);
        if ($db) {
            if ($isRollback) {
                $db->rollback();
            }
            $db->close();
        }
    }

    /**
     * リクエストパラメータの取得
     * @param string $tag パラメータ名
     * @return string パラメータ
     */
    function parameter($tag) {
        if (isset($this->requests_[$tag])) {
            return $this->requests_[$tag];
        }

        if (isset($_REQUEST[$tag])) {
            return $_REQUEST[$tag];
        }
        return '';
        //return filter_input(INPUT_REQUEST, $tag);
    }

    /**
     * 結果
     * @param string $name
     * @param mixed $value
     */
    function response($name, $value) {
        $this->responses_ += array($name => $value);
    }

}
