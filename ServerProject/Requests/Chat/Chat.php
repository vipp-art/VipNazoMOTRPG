<?php
namespace chat;

require_once dirname(__FILE__) . '/../Request.php';

class Chat extends \Request {
    
    public function __construct() {
        parent::__construct();
    }
}

(new Chat())->request();