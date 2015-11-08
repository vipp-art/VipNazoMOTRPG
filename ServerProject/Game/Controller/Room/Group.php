<?php

namespace game\controller\room;

require_once dirname(__FILE__) . '/../../Model/Group.php';
require_once dirname(__FILE__) . '/../../Model/Room.php';
require_once dirname(__FILE__) . '/../../Model/User.php';

class Group {

    /**
     * グループの情報取得
     * @param \Request $request
     */
    function doGet($request) {
        $groupId = $request->parameter('id');
        $group = new \game\model\Group($groupId);

        $request->response('users', $group->getUsers());
    }

    /**
     * グループに参加
     * @param \Request $request
     * @Transactional
     */
    function doPost($request) {
        $groupId = $request->parameter('id');
        $user = $request->parameter('user');

        $group = new \game\model\Group($groupId);
        $group->join(new \game\model\User($user));
    }

}
