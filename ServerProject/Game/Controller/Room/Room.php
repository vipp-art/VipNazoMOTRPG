<?php

namespace game\controller\room;

require_once dirname(__FILE__) . '/../../Model/Group.php';
require_once dirname(__FILE__) . '/../../Model/Room.php';
require_once dirname(__FILE__) . '/../../Model/User.php';

class Room {

    /**
     * ルームの情報取得
     * @param \Request $request
     */
    function doGet($request) {
        $sql = \mysql\connect();

        // state2検索用部屋ID
        $state2RoomId = 1;

        // state1結果用部屋ID
        $roomId = 0;
        // state1結果用部屋名
        $roomName = '';
        // state1結果用部屋説明
        $roomNotice = '';

        // state2結果用グループID
        $groupId = 0;
        // state2結果用グループ所属人数
        $groupMemberCount = 0;

        $state = $sql->prepare('SELECT room.`room_id`, room.`room_name`, room.`notice` FROM `game_rooms` room ORDER BY `room_id`;');
        $state->bind_result($roomId, $roomName, $roomNotice);

        $state2 = $sql->prepare(
                'SELECT g.`group_id`, (
                SELECT COUNT(*)
                FROM `user_belongsto_group` belongs
                WHERE belongs.`group_id`=g.`group_id` )
              FROM `user_groups` AS g
              WHERE g.`room_id`=? ORDER BY g.`group_id`;');

        $state2->bind_param('i', $state2RoomId);
        $state2->bind_result($groupId, $groupMemberCount);

        $state->execute();
        $state->store_result();

        $result = array();
        while ($state->fetch()) {
            $state2RoomId = $roomId;
            $state2->execute();
            $state2->store_result();

            if ($state2->num_rows() !== 2) {
                continue;
            }

            $groups = array();

            while ($state2->fetch()) {
                $groups[] = array(
                    'id' => $groupId,
                    'count' => $groupMemberCount);
            }

            $result[] = array(
                'room-id' => $roomId,
                'name' => $roomName,
                'notice' => $roomNotice,
                'group1' => $groups[0],
                'group2' => $groups[1]);
        }

        $state2->close();
        $state->close();

        $request->response('rooms', $result);
    }

    /**
     * ルームの生成
     * @param \Request $request
     * @Transactional
     */
    function doPut($request) {
        $name = $request->parameter('name');
        $text = $request->parameter('text');
        $user = new \game\model\User($request->parameter('user'));

        $roomId = \game\model\Room::create($name, $text);

        $room = new \game\model\Room($roomId);
        $room->createGroups();
        $room->join($user);
        $room->getGroup1()->join($user);

        $request->response('room-id', $roomId);
        $request->response('group-id1', $room->getGroup1()->getId());
        $request->response('group-id2', $room->getGroup2()->getId());
    }

    /**
     * ルームに参加
     * @param \Request $request
     */
    function doPost($request) {
        $id = $request->parameter('id');
        $user = $request->parameter('user');
        
        $room = new \game\model\Room($id);
        $room->join(new \game\model\User($user));
        $request->response('group-id1', $room->getGroup1()->getId());
        $request->response('group-id2', $room->getGroup2()->getId());
    }

}
