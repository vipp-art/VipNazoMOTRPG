<?php

namespace game\controller\user;

require_once dirname(__FILE__) . '/../../Model/User.php';

class User {

    /**
     * ユーザー情報の取得
     * @param \Request $request
     */
    function doGet($request) {
        $users = $request->parameter('users');
        $found = \game\model\User::find(split(',', $users));
        
        $request->response('users', $found);
    }

    /**
     * ユーザー生成
     * @param \Request $request
     */
    function doPut($request) {
        $name = $request->parameter('name');
        
        $user = \game\model\User::create($name);
        $request->response('id', $user);
    }

}
