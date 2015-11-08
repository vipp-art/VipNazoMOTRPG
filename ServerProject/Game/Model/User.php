<?php

namespace game\model;

require_once dirname(__FILE__) . '/../../MySql/DB.php';

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
        $state->bind_param('i', $id);
        $state->execute();

        $userId = $id;

        $state->bind_result($userId, $this->name_, $this->group_, $this->room_);
        if ($state->fetch()) {
            $this->id_ = $userId;
        }
        $state->close();
    }

    /** 名前を指定してユーザーを生成 */
    public static function create($name) {
        if (!$name || $name === '') {
            return null;
        }
        $sql = \mysql\connect();
        $state = $sql->prepare('INSERT INTO `users` VALUES(0, ?)');
        $state->bind_param('s', $name);
        $state->execute();
        $state->close();
        return $sql->insert_id;
    }

    /**
     * ユーザーを検索
     * @param array $ids
     */
    public static function find($ids) {
        $sql = \mysql\connect();
        $query = '-1';
        foreach ($ids as $i) {
            if (is_numeric($i)) {
                $query .= ',';
                $query .= $i;
            }
        }

        $users = [];
        $result = $sql->query('SELECT `user_id`, `user_name` FROM `users` WHERE `user_id` IN (' . $query . ');');
        if ($result) {
            while ($row = $result->fetch_array()) {
                $users[] = array(
                    'id' => $row[0],
                    'name' => $row[1]
                );
            }
            $result->close();
        }
        return $users;
    }

    /** ID取得 */
    public function getId() {
        return $this->id_;
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

    /** グループ設定 */
    public function setGroup($groupId) {
        $this->group_ = $groupId;
    }

    /** ルーム設定 */
    public function setRoom($roomId) {
        $this->room_ = $roomId;
    }

}
