<?php
    header('Access-Control-Allow-Origin: *');
    header('Conent-Type: text/plain');
    
    $test = filter_input(INPUT_GET, 'test', FILTER_SANITIZE_FULL_SPECIAL_CHARS );
    
    echo $test;

