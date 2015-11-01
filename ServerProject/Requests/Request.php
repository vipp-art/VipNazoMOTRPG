<?php

require_once dirname(__FILE__) . '/../MySql/DB.php';

abstract class Request {

    /** @var array 返り値 */
    private $responses_;

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
    private static function getMethod() {
        $method = filter_input(INPUT_SERVER, 'REQUEST_METHOD');

        if ($method === '' || !isset($method) || !is_string($method)) {
            $method = 'get';
        }

        $method = strtolower($method);
        $method[0] = strtoupper($method[0]);
        return 'do' . $method;
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
     * リクエストの処理
     */
    function request() {
        $this->responses_ = array();

        $method = Request::getMethod();
        $controller = $this->createController();

        // 基本ヘッダ
        header('Access-Control-Allow-Origin: http://localhost:52181');
        header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS, DELETE');
        header('Access-Control-Allow-Headers: *');
        header('X-Content-Type-Options: nosniff');

        $isRollback = true;

        // PUTなら送信データをパース
        if ($method === 'doPut') {
            $this->readPut();
        }

        if (method_exists($controller, $method)) {
            try {
                // 処理
                $controller->$method($this);
                $result = json_encode($this->responses_);
                header('Conent-Type: application/json');
                echo $result;
                $isRollback = false;
            } catch (\Exception $e) {
                echo e;
                http_response_code(500);
            }
        } else {
            echo get_class($controller);
            echo $method;
            exit();
            http_response_code(500);
        }

        $this->closeDB($isRollback);
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
