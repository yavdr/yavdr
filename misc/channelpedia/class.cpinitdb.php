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

class cpDBInit extends cpBasics {

    function __construct($path){
        parent::__construct($path);
        @unlink($this->dbfile); //delete existing database file
        $this->connect();
        $this->createDBTables();
    }

    private function createDBTables(){
        $sqltext= "
        CREATE TABLE channels(
            name TEXT,
            provider TEXT,
            frequency INTEGER,
            modulation TEXT,
            source TEXT,
            symbolrate INTEGER,
            vpid INTEGER,
            apid INTEGER,
            tpid TEXT,
            caid TEXT,
            sid INTEGER,
            nid INTEGER,
            tid TEXT,
            rid INTEGER,
            cgroup TEXT,
            last_changed TIMESTAMP,
            PRIMARY KEY ( source, nid, tid, sid)
            ) ;

		CREATE TABLE channel_update_log(
            timestamp TIMESTAMP,
			name TEXT,
			combined_id TEXT,
			update_description TEXT
		);



        ";

        $query = $this->dbh->exec($sqltext);
        if ($query === false) {
            echo "\nPDO::errorInfo():\n";
            print_r($this->dbh->errorInfo());
            die("DB problem on create db + tables");
        }
    }
}

?>