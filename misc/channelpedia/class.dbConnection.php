<?php
/***************************************************************
*  Copyright notice
*
*  (c) 2010 Henning Pingel
*  All rights reserved
*
*  This script is part of the yaVDR project. yaVDR is
*  free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*  A copy is found in the textfile GPL.txt.
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*/

class dbConnection {

    private
        $dbh = null,
        $dbfile;

    private static $instance = null;

    protected function __construct(){
        $config = config::getInstance();
        $this->dbfile = $config->getValue("path") . "channeldb.sqlite";
        //print "DB-File: ".$this->dbfile;
        if (!file_exists($this->dbfile)){
            $this->createDB();
        }
    }

    private function __clone(){}

    public static function getInstance(){
        if ( self::$instance == null){
            self::$instance = new dbConnection();
        }
        return self::$instance;
    }

    public function connect(){
        $this->dbh = new PDO('sqlite:'.$this->dbfile);
    }

    public function getDBHandle(){
        if ($this->dbh == null){
            $this->connect();
        }
        return $this->dbh;
    }

    /*
     * delete db file and create new one with empty db tables
     */
    public function reset(){
        if ($this->dbh == null){
            @unlink($this->dbfile); //delete existing database file
            $this->createDB();
        }
        else
            print "DB-Reset impossible because db is already in use.\n";
    }

    private function createDB(){
        $dblayoutfile = "templates/dblayout.sql";
        if (!file_exists($dblayoutfile))
            die ("dblayoutfile $dblayoutfile does not exist!");
        $this->connect();
        $query = $this->dbh->exec(file_get_contents( $dblayoutfile ));
        if ($query === false) {
            echo "\nPDO::errorInfo():\n";
            print_r($this->dbh->errorInfo());
            die("DB problem on create db + tables");
        }
    }
}
?>