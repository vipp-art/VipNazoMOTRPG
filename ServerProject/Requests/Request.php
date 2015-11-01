<?php

require_once dirname(__FILE__) . '/../MySql/DB.php';

abstract class Request {

    /** 返り値 */
    private $responses;

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

        return strtolower($method);
    }

    /**
     * リクエストの処理
     */
    function request() {
        $this->responses = array();

        $method = Request::getMethod();
        $controller = $this->createController();

        // 基本ヘッダ
        header('Access-Control-Allow-Origin: http://localhost:52181');
        header('X-Content-Type-Options: nosniff');

        $isRollback = true;

        if (method_exists($controller, $method)) {
            header('Conent-Type: application/json');

            try {
                // 処理
                $controller->$method($this);
                $result = json_encode($this->responses);
                echo $result;
                $isRollback = false;
            } catch (Exception $e) {
                http_response_code(500);
            }
        } else {
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
        $this->responses += array($name => $value);
    }

}
