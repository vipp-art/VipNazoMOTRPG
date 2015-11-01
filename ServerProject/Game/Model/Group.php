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

}
