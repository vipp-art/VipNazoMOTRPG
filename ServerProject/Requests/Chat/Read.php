<?php
namespace chat;

require_once dirname(__FILE__) . '/../Request.php';

class Read extends \Request {
    
    public function __construct() {
        parent::__construct();
    }
}

(new Read())->request();