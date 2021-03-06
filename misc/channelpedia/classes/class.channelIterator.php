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
        $db,
        $config,
        $result = false,
        $channel = false,
        $count = 0,
        $lastFrequency = "",
        $transponderChanged = true,
        $shortenSource;

    function __construct($shortenSource = true){
        $this->db = dbConnection::getInstance();
        $this->config = config::getInstance();
        $this->shortenSource = $shortenSource;
    }

    public function init1( $label, $source, $orderby = "frequency, modulation, provider, name ASC"){
        $where = array();
        $where["source"] = $source;
        if ($label != "_complete")
            $where["x_label"] = $label;
        $this->result = $this->db->query2("SELECT * FROM channels", $where, true, $orderby);
    }

    public function init2( $statement ){
        $db = dbConnection::getInstance();
        $this->result = $this->db->query($statement);
    }

    public function moveToNextChannel(){
        $this->channel = false;
        $exists = false;
        if (!$this->result === false){
            //FIXME: encapsulate access to result fetch
            $temp = $this->result->fetch(PDO::FETCH_ASSOC);
            if (!$temp === false){
                $channelobj = new channel( $temp );
                //print "channelobject instanciated.\n";
                if ($channelobj->isValid()) {
                    //print "channelobject is valid.\n";
                    $exists = true;
                    $this->channel = $channelobj;
                    if ($this->shortenSource){
                        $this->channel->setSourceToShortForm();
                    }
                    $this->count++;

                    if ( $this->lastFrequency != $this->channel->getSource() ."-" . $this->channel->getFrequency() ){
                        $this->transponderChanged = true;
                    }
                    else
                        $this->transponderChanged = false;
                    $this->lastFrequency = $this->channel->getSource() ."-" . $this->channel->getFrequency();
                }
                else{
                    print "channel invalid.\n";
                }
            }
        }
        return $exists;
    }

    public function getCurrentChannelObject(){
        return $this->channel;
    }

    public function getCurrentChannelArrayKeys(){
        return array_keys($this->channel->getAsArray());
    }

    public function transponderChanged(){
        return $this->transponderChanged;
    }

    //FIXME: This info should be provided by channel object!
    public function getCurrentTransponderInfo(){
        $frequency = $this->channel->getFrequency();
        $hilow = "";
        if (substr($this->channel->getSource(),0,1) == "S" && $frequency >= 11700 && $frequency <= 12750)
            $hilow = "High-Band";
        else if (substr($this->channel->getSource(),0,1) == "S" && $frequency >= 10700 && $frequency < 11700)
            $hilow = "Low-Band";
        return "Transponder " . $this->channel->getSource() . " " . $hilow . " " .$this->channel->getModulation(). " " . $frequency;
    }

    public function getCurrentChannelCount(){
        return $this->count;
    }
}