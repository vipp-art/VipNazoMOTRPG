<?php

namespace game\controller\user;

require_once dirname(__FILE__) . '/../../Model/User.php';

class User {

    /**
     * 
     * @param \Request $request
     */
    function doGet($request) {
    }

    /**
     *
     * @param \Request $request
     */
    function doPut($request) {
        $name = $request->parameter('name');
        
        $user = \game\model\User::create($name);
        $request->response('id', $user);
    }

}
