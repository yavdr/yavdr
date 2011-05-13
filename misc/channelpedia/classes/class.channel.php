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

class channel{

    protected
        $db,
        $config,
        $params;

    private
        $timestamp,
        $source,
        $sourceDB;

    public function __construct( $channelparams, $timestamp ){
        $this->config = config::getInstance();
        $this->db = dbConnection::getInstance();
        $this->timestamp = $timestamp;
        $this->params = array();
        if (is_array( $channelparams )){
            $this->params = $channelparams;
        }
        elseif (is_string( $channelparams )){
            $this->params = $this->config->convertChannelString2Array( $channelparams );
        }

        $this->source = $this->params["source"];
        $this->setSourceForDB();
    }

    public function isValid(){
        return ($this->params !== false);
    }

    private function setSourceForDB(){
        if (!$this->isSatelliteSource()){
            switch ($this->source){
            case "C":
            case "T":
            case "A":
                $nonSatProviders = config::getNonSatProviders();
                $this->sourceDB = $this->source . '[' . $nonSatProviders[ $this->source ] . ']';
                config::addPresentNonSatProvider( $this->source, $nonSatProviders[ $this->source ] );
                break;
            default:
                throw new Exception( "Unknown source type!" . $this->source );
            }
        }
        else{
            $this->sourceDB = $this->source;
            config::addPresentSatProvider( $this->source );
        }
    }

    public function getSource(){
        return $this->source;
    }

    //FIXME temp
    public function getAsArray(){
        return $this->params;
    }


    public function isSatelliteSource(){
        return substr( $this->source, 0, 1) == "S";
    }

    /*
     * inserts a channel into db
     * takes an associative array with keys and values
     * that are used for insert
     */

    public function insertIntoDB(){
        //this only has to be added if native channel data is to be inserted to db
        $this->params = $this->params + array(
            "x_label"         => "",
            "x_last_changed"  => $this->timestamp,
            "x_timestamp_added" => $this->timestamp,
            "x_last_confirmed" => 0
        );
        //FIXME: source should stay original
        $this->params["source"] = $this->sourceDB;

        $success = true;
        $query = $this->db->insert( "channels", $this->params);
        //19 = channel already exists, could'nt be inserted
        if ($query != 19) {
            $query = $this->db->insert( "channel_update_log", array(
                "combined_id" => $this->params["source"]."-".$this->params["nid"]."-".$this->params["tid"]."-".$this->params["sid"],
                "name" => $this->params["name"],
                "update_description" => "New channel added: " . config::channelArray2ChannelString($this->params),
                "timestamp" => $this->timestamp,
                "importance" => "1"
            ));
        }
        else{
            $success = false;
        }
        return $success;
    }

}
?>