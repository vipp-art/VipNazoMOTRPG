<?php

namespace mysql;

require_once dirname(__FILE__) . '../mysql-config.php';

/**
 * mysqliの接続
 * @param boolean $noconnect 接続DB名
 * @return \mysqli 
 * @throws Exception 接続の失敗時
 */
function connect($noconnect=false) {
    static $sql = null;

    if ($sql) {
        return $sql;
    }
    if ($noconnect) {
        return null;
    }

    $sql = new \mysqli(
            \MySqlConfig::kHost,
            \MySqlConfig::kUser,
            \MySqlConfig::kPassword,
            \MySqlConfig::kDatabaseName,
            \MySqlConfig::kPort);

    if (mysqli_connect_errno() !== 0) {
        throw new Exception('DBへの接続に失敗.' . mysqli_connect_error());
    }

    $sql->set_charset('utf8');

    return $sql;
}
