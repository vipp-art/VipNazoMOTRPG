<?php

namespace game\controller\chat;

require_once dirname(__FILE__) . '/../../Model/Group.php';

class Read {

    /**
     * 
     * @param \Request $request
     */
    function get($request) {
        $id = $request->parameter('group');
        $group = new \game\model\Group($id);
        $request->response('log', $group->readChatAll());
    }

}
