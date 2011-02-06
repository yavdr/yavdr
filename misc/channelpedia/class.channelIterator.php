<?php
/***************************************************************
*  Copyright notice
*
*  (c) 2011 Henning Pingel
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

class channelIterator{

    private
        $result = false,
        $channel = false,
        $count = 0,
        $lastFrequency = "",
        $transponderChanged = true;

    function __construct( $label, $source, $orderby = "frequency, modulation, provider, name ASC"){
        $db = dbConnection::getInstance();
        $this->dbh = $db->getDBHandle();

        $where = "";
        if ($label != "_complete")
            $where = "label = ". $this->dbh->quote($label). " AND ";

        $sqlquery="SELECT * FROM channels WHERE $where source = ". $this->dbh->quote($source) . " ORDER BY " . $orderby;
        //echo "$label: $sqlquery\n";
        $this->result = $this->dbh->query($sqlquery);
        if ($this->result === false)
            die("\nDB-Error: " . $this->dbh->errorCode() . " / " . $sqlquery);
    }

    public function moveToNextChannel(){
        $this->channel = false;
        if (!$this->result === false){
            $this->channel = $this->result->fetch(PDO::FETCH_ASSOC);
        }
        if ($this->channel === false){
            $exists = false;
        }
        else{
            $exists = true;
            $this->count++;
            if ($this->lastFrequency != $this->channel["source"] ."-" . $this->channel["frequency"]){
                $this->transponderChanged = true;
            }
            else
                $this->transponderChanged = false;
            $this->lastFrequency = $this->channel["source"] ."-" . $this->channel["frequency"];
        }
        return $exists;
    }

    public function getCurrentChannelArray(){
        return $this->channel;
    }

    public function getCurrentChannelString(){
        $provider = "";
        if ($this->channel["provider"] != "")
            $provider = ";". $this->channel["provider"];

        //remove meta provider info from cable ot terrestrial source string
        $source = $this->channel["source"];
        $sourcetest = strtoupper( substr($this->channel["source"],0,1));
        if ($sourcetest == "C" || $sourcetest == "T")
            $source = $sourcetest;

        $rawstring =
            $this->channel["name"] .
            $provider . ":".
            $this->channel["frequency"] . ":".
            $this->channel["modulation"] . ":".
            $source . ":".
            $this->channel["symbolrate"] . ":".
            $this->channel["vpid"] . ":".
            $this->channel["apid"] . ":".
            $this->channel["tpid"] . ":".
            $this->channel["caid"] . ":".
            $this->channel["sid"] . ":".
            $this->channel["nid"] . ":".
            $this->channel["tid"] . ":".
            $this->channel["rid"];
        return $rawstring;
    }

    public function transponderChanged(){
        return $this->transponderChanged;
    }

    public function getCurrentTransponderInfo(){
        $frequency = $this->channel['frequency'];
        $hilow = "";
        if (substr($this->channel['source'],0,1) == "S" && $frequency >= 11700 && $frequency <= 12750)
            $hilow = "High-Band";
        else if (substr($this->channel['source'],0,1) == "S" && $frequency >= 10700 && $frequency < 11700)
            $hilow = "Low-Band";
        return "Transponder " . $this->channel['source'] . " " . $hilow . " " .$this->channel['modulation']. " " . $frequency;
    }

    public function getCurrentChannelCount(){
        return $this->count;
    }
}