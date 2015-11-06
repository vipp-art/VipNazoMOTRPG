<?php
namespace room;

require_once dirname(__FILE__) . '/../Request.php';

class Room extends \Request {
    
    public function __construct() {
        parent::__construct();
    }
}

(new Room())->request();