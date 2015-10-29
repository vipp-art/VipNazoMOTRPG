<?php

namespace game;

require_once dirname(__FILE__) . '../MySql/DB.php';

class User {

    /** */
    private $id_ = -1;

    /** */
    private $name_ = '';

    /** */
    private $group_ = -1;

    /** */
    private $room_ = -1;

    /** IDを指定してユーザー生成 */
    public function __construct($id) {
        $sql = \mysql\connect();

        $state = $sql->prepare('SELECT user_id, user_name, group_id, room_id FROM `user_view` WHERE `user_id`=? LIMIT 1;');
        $state->bind_param('d', $id);
        $state->execute();

        $userId = $id;

        $state->bind_result($userId, $this->name_, $this->group_, $this->room_);
        if ($state->fetch()) {
            $this->id = $userId;
        }
        $state->close();
    }

    /** 名前を指定してユーザーを生成 */
    public static function create($name) {
        $sql = connect();
        $state = $sql->prepare('INSERT INTO `users` VALUES(0, ?)');
        $state->bind_param('s', $name);
        $state->execute();
        $state->close();
        return $sql->insert_id;
    }

    /** 所属グループ取得 */
    public function getGroup() {
        return $this->group_;
    }

    /** 所属部屋取得 */
    public function getRoom() {
        return $this->room_;
    }

    /** 名前取得 */
    public function getName() {
        return $this->name_;
    }

}
