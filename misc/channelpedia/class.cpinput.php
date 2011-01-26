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

class cpInput extends cpBasics {

    private
        $cableSourceType,
        $terrSourceType,
        $existingChannelBuffer;

    function __construct($path, $cableSourceType, $terrSourceType){
        parent::__construct($path);
        $this->connect();
        $this->cableSourceType = $cableSourceType;
        $this->terrSourceType = $terrSourceType;
        $this->existingChannelBuffer = array();
        $this->insertChannelsConfIntoDB();
        $this->updateExistingChannels();
    }

    /*
     * tries to update all channel data of the channels
     * listed in array existingChannelBuffer
     */
    
    private function updateExistingChannels(){
        
        foreach ($this->existingChannelBuffer as $params){
            //print "checking channel ".$params["name"]." for changes: ";
            //implement
            $sqlquery = "SELECT * FROM channels WHERE source = ".$params["source"]." AND nid = ".$params["nid"]." AND tid = ".$params["tid"]." AND sid = ".$params["sid"];
            $result = $this->dbh->query($sqlquery);
            if ($result === false) die("\nDB-Error: " . $this->dbh->errorCode() . " / " . $sqlquery);
            $changed = false;
            foreach ($result as $row){
                foreach ($params as $key => $value){
                    if ($value != $this->dbh->quote( $row[$key])){
                        print "Changed: ".$params["source"].$params["nid"].$params["tid"].$params["sid"].$params["name"].": Parameter $key: from ".$this->dbh->quote( $row[$key]). " to $value\n";
                        $changed = true;
                    }
                }
            }
            //if ($changed)
              //  die("test");
        }
    }

    /*
     * reads channel conf file line by line and 
     * adds channel lines that seem correct to the db
     */
    
    private function insertChannelsConfIntoDB(){
        $filename = $this->path . 'channels.conf';
        if (file_exists($filename)) {
            $handle = fopen ($filename, "r");
            $counter = 1;
            $cgroup = "";
            $query = $this->dbh->exec("BEGIN TRANSACTION");
            while (!feof($handle)) {
                print "try to add channel $counter : ";
                $buffer = fgets($handle, 4096);
                $buffer = rtrim( $buffer, "\n");
                if (substr($buffer,0,1) == ":")
                   $cgroup = ltrim($buffer,":");
                elseif($buffer == ""){}
                else{
                    $counter++;
                    $params = $this->getParamArray($buffer,$cgroup);
                    if ($params !== false)
                        if (false === $this->insertChannelIntoDB ($params)){
                            $this->existingChannelBuffer[] = $params;
                            print "already exists.\n";
                        }
                        else{
                            print "added successfully.\n";
                        }
                    else{
                        die("illegal channel.\n");
                    }
                }
            }
            fclose ($handle);
            $query = $this->dbh->exec("COMMIT TRANSACTION");
        }
    }
    
    /*
     * inserts a channel into db
     * takes an associative array with keys and values 
     * that are used for insert
     */
    
    private function insertChannelIntoDB ($params){
        $success = true;
        $columns = implode( ", ", array_keys($params) );
        $values = implode( ", ", array_values($params) );
        $sqltext = "INSERT INTO channels ( " . $columns . " ) VALUES ( " . $values . " );";
        //print "$sqltext\n";
        $query = $this->dbh->exec($sqltext);
        if (!$query) {
            //19 = channel already exists
            $errorinfo = $this->dbh->errorInfo();
            if ($errorinfo[1] == 19)
                $success = false;
            else{
                echo "\nPDO::errorInfo():\n";
                print_r($this->dbh->errorInfo());
                die("db error on insert\n");
            }
        }
        return $success;
    }

    /*
     * converts channel data string into an array 
     * ready to use for db insert
     */
    
    private function getParamArray( $buffer, $cgroup){
        $details = explode( ":", $buffer);
        if (count($details) != 13) return false;
        $cname = $details[0];
        $cprovider = "";
        $cnamedetails = explode( ";", $cname);
        if (count($cnamedetails) == 2){
            $cname = $cnamedetails[0];
            $cprovider = $cnamedetails[1];
        }

        return array(
            "cablesourcetype" => $this->dbh->quote( $this->cableSourceType ),
            "name"            => $this->dbh->quote( $cname ),
            "provider"        => $this->dbh->quote( $cprovider ),
            "frequency"       => $this->dbh->quote( $details[1] ),
            "modulation"      => $this->dbh->quote( $details[2] ),
            "source"          => $this->dbh->quote( $details[3] ),
            "symbolrate"      => $this->dbh->quote( $details[4] ),
            "vpid"            => $this->dbh->quote( $details[5] ),
            "apid"            => $this->dbh->quote( $details[6] ),
            "tpid"            => $this->dbh->quote( $details[7] ),
            "caid"            => $this->dbh->quote( $details[8] ),
            "sid"             => $this->dbh->quote( $details[9] ),
            "nid"             => $this->dbh->quote( $details[10] ),
            "tid"             => $this->dbh->quote( $details[11] ),
            "rid"             => $this->dbh->quote( $details[12] ),
            "cgroup"          => $this->dbh->quote( $cgroup )
        );
    }
}
?>