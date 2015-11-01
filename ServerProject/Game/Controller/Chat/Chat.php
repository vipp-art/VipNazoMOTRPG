<?php

namespace game\controller\chat;

require_once dirname(__FILE__) . '/../../Model/Group.php';

class Chat {

    /**
     * 
     * @param \Request $request
     */
    function doGet($request) {
        $id = $request->parameter('group');
        $group = new \game\model\Group($id);
        $request->response('log', $group->readChatAll());
    }

    /**
     *
     * @param \Request $request
     */
    function doPut($request) {
        $id = $request->parameter('group');
        $user = $request->parameter('user');
        $text = $request->parameter('text');
        
        $group = new \game\model\Group($id);
        $group->writeChat($user, $text);
    }

}
