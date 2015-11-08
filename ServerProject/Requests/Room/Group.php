<?php
namespace room;

require_once dirname(__FILE__) . '/../Request.php';

class Group extends \Request {
    
    public function __construct() {
        parent::__construct();
    }
}

(new Group())->request();