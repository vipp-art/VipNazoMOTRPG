<?php

namespace game\model;

require_once dirname(__FILE__) . '/../../MySql/DB.php';

class Room {
    
    /** */
    private $id_;

    /** グループ */
    private $group1_;
    
    /** グループ */
    private $group2_;
    
    /**
     * 
     * @param number $id
     */
    public function __construct($id) {
        $this->id_ = $id;
        $groups = Group::findAtRoomId($this->id_);
        if ($groups !== null && count($groups) == 2) {
            $this->group1_ = new Group($groups[0]);
            $this->group2_ = new Group($groups[1]);
        }
    }

    /**
     * グループ生成
     */
    public function createGroups() {
        $this->group1_ = new Group(Group::create($this->id_));
        $this->group2_ = new Group(Group::create($this->id_));
    }

    /**
     * グループ取得
     * @return Group
     */
    public function getGroup1() {
        return $this->group1_;
    }
    
    /**
     * グループ取得
     * @return Group
     */
    public function getGroup2() {
        return $this->group2_;
    }

    /**
     * ルームに参加
     * @param User $user
     */
    public function join($user) {
        $sql = \mysql\connect();

        $state = $sql->prepare('INSERT INTO `user_belongsto_room` VALUES(?, ?) ON DUPLICATE KEY UPDATE `room_id`=?;');
        $state->bind_param('iii', $this->id_, $user->getId(), $this->id_);
        if ($state->execute()) {
            $user->setRoom($this->id_);
        }
        $state->close();
    }
    
    /**
     * 部屋作成
     * @param string $name
     * @param string $text
     */
    public static function create($name, $text) {
        $sql = \mysql\connect();
        
        $state = $sql->prepare( 'INSERT INTO `game_rooms` VALUES(0, ?, ?);' );
        $state->bind_param('ss', $name, $text);
        $state->execute();
        $state->close();
        return $sql->insert_id;
    }
}
