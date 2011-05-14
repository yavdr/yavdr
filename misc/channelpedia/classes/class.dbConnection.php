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
        $config,
        $dbh = null,
        $dbfile;

    private static $instance = null;

    protected function __construct(){
        $this->config = config::getInstance();
        $this->dbfile = $this->config->getValue("userdata") . "channeldb.sqlite";
        //print "DB-File: ".$this->dbfile;
        if (!file_exists($this->dbfile)){
            $this->createDB();
        }
        if ($this->dbh == null){
            $this->connect();
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
        $dblayoutfile = "../templates/dblayout.sql";
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

    private function getWhereString( $where_array, $quote = true ){
        $where = array();
        $where_string = "";
        foreach ($where_array as $key => $value ){
            if ($quote) $value = $this->quote( $value );
            $where[] = "$key = ". $value;
        }
        if ( count($where > 0)){
            $where_string  = " WHERE " . implode( " AND ", $where);
        }
        return $where_string;
    }

    public function query( $statement ){
        //$this->config->addToDebugLog( "Query: $statement\n");
        $result = $this->dbh->query( $statement );
        if ($result === false)
            die( "\nDB-Error: " . $this->dbh->errorCode() . " / " . $statement );
        return $result;
    }

    public function query2( $statement, $where_array, $quote = true, $orderby = ""){
        if ($orderby != "")
            $orderby = " ORDER BY $orderby";
        $result = $this->query( trim($statement) . $this->getWhereString( $where_array, $quote). $orderby);
        return $result;
    }

    public function exec( $statement ){
        //print "Exec: $statement\n\n";
        $errorcode = 0;
        $result = $this->dbh->exec( $statement );
        if ($result === false){
            $errorinfo = $this->dbh->errorInfo();
            $errorcode =  $errorinfo[1];
            if ($errorcode != 19)
                die( "\nDB-Error: " . $this->dbh->errorCode() . " / " . $statement );
        }
        return $errorcode;
    }

    public function exec2( $statement, $where_array, $quote = true  ){
        $result = $this->exec( trim($statement). $this->getWhereString( $where_array, $quote) );
        return $result;
    }

    public function insert( $table, $params, $quote = true  ){
        if ($quote)
            foreach ($params as $key => $value)
                $params[$key] = $this->dbh->quote( $value );
        $columns = implode( ", ", array_keys($params) );
        $values = implode( ", ", array_values($params) );

        $result = $this->exec( "INSERT INTO $table ($columns) VALUES ($values)" );
        return $result;
    }


    public function quote( $string ){
        return $this->dbh->quote( $string );
    }


}
?>