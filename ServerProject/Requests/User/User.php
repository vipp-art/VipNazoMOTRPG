<?php
namespace user;

require_once dirname(__FILE__) . '/../Request.php';

class User extends \Request {
    
    public function __construct() {
        parent::__construct();
    }
}

(new User())->request();