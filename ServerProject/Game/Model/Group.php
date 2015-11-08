<?php

namespace game\model;

require_once dirname(__FILE__) . '/../../MySql/DB.php';

class Group {

    /** グループID */
    private $id_;

    /**
     * 
     * @param type $id
     */
    public function __construct($id) {
        if (is_numeric($id)) {
            $this->id_ = $id;
        } else {
            $this->id_ = -1;
        }
    }

    /**
     * グループ生成
     * @param number $roomId
     */
    public static function create($roomId) {
        $sql = \mysql\connect();

        $state = $sql->prepare('INSERT INTO `user_groups` VALUES(0, \'\', ?);');
        $state->bind_param('i', $roomId);
        $state->execute();
        $state->close();
        return $sql->insert_id;
    }

    /**
     * ルームIDからグループを検索
     * @param number $roomId
     * @return array
     */
    public static function findAtRoomId($roomId) {
        $sql = \mysql\connect();

        $state = $sql->prepare('SELECT `group_id` FROM `user_groups` WHERE `room_id`=? ;');
        $state->bind_param('i', $roomId);
        $state->execute();

        $id = 0;
        $state->bind_result($id);

        $result = array();

        while ($state->fetch()) {
            $result[] = $id;
        }
        return $result;
    }

    /**
     * このグループに参加
     * @param User $user
     */
    public function join($user) {
        $sql = \mysql\connect();

        $state = $sql->prepare('INSERT INTO `user_belongsto_group` VALUES(?, ?) ON DUPLICATE KEY UPDATE `group_id`=?;');
        $state->bind_param('iii', $this->id_, $user->getId(), $this->id_);
        if ($state->execute()) {
            $user->setGroup($this->id_);
        }
        $state->close();
    }

    /**
     * ID取得
     * @return number
     */
    public function getId() {
        return $this->id_;
    }

    /**
     * ログを全件取得
     * @return array
     */
    public function readChatAll() {
        $sql = \mysql\connect();
        $state = $sql->prepare('SELECT `chat_text`, UNIX_TIMESTAMP(`sent_time`), `user_id` FROM `chat_logs` WHERE `group_id`=?;');
        $state->bind_param('i', $this->id_);
        $state->execute();

        $text = '';
        $sentTime = 0;
        $userId = 0;

        $state->bind_result($text, $sentTime, $userId);

        $result = array();

        while ($state->fetch()) {
            $result[] = array(
                'text' => $text,
                'senttime' => $sentTime,
                'user' => $userId);
        }
        $state->close();
        return $result;
    }

    /**
     * テキストの書き込み
     * @param number $user
     * @param string $text
     */
    public function writeChat($user, $text) {
        if (!is_string($text) || $text === '') {
            throw new \Exception('テキストが不正');
        }

        $sql = \mysql\connect();
        $state = $sql->prepare('INSERT INTO `chat_logs` VALUES (?, ?, NOW(), ?);');
        $state->bind_param('isi', $this->id_, $text, $user);
        $state->execute();
        $state->close();
    }

    /**
     * ユーザー一覧取得
     * @return array
     */
    public function getUsers() {
        $users = [];

        $sql = \mysql\connect();
        $state = $sql->prepare('SELECT `user_id` FROM `user_belongsto_group` WHERE `group_id`=?');
        $state->bind_param('i', $this->id_);
        $state->execute();

        $userId = -1;
        $state->bind_result($userId);

        $state->store_result();

        while ($state->fetch()) {
            $users[] = $userId;
        }

        $state->close();
        return $users;
    }

}
