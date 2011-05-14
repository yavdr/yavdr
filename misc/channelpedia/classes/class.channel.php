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
        $timestamp, //needed for db
        $sourceDB, //needed for db
        $metaData,

        $name,
        $provider,
        $frequency,
        $modulation, //w_scan has lower case, we don't want that
        $source,
        $symbolrate,
        $vpid,
        $apid,
        $tpid,
        $caid,
        $sid,
        $nid,
        $tid,
        $rid;

    public function __construct( $channelparams, & $metaDataObj ){
        $this->config = config::getInstance();
        $this->db = dbConnection::getInstance();
        $this->metaData = $metaDataObj;
        $this->metaData->increaseCheckedChannelCount();
        $this->timestamp = $metaDataObj->getTimestamp();
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
                $nonSatProviders = $this->metaData->getNonSatProviders();
                $this->sourceDB = $this->source . '[' . $nonSatProviders[ $this->source ] . ']';
                $this->metaData->addPresentNonSatProvider( $this->source, $nonSatProviders[ $this->source ] );
                break;
            default:
                throw new Exception( "Unknown source type!" . $this->source );
            }
        }
        else{
            $this->sourceDB = $this->source;
            $this->metaData->addPresentSatProvider( $this->source );
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
            $this->metaData->increaseAddedChannelCount();
            $query = $this->db->insert( "channel_update_log", array(
                "combined_id" => $this->params["source"]."-".$this->params["nid"]."-".$this->params["tid"]."-".$this->params["sid"],
                "name" => $this->params["name"],
                "update_description" => "New channel added: " . $this->config->channelArray2ChannelString($this->params),
                "timestamp" => $this->timestamp,
                "importance" => "1"
            ));
        }
        else{
            $this->updateInDB();
            $success = false;
        }
        return $success;
    }

    public function updateInDB(){
        //$this->config->addToDebugLog( "checking channel ".$this->params["name"]." for changes: \n");
        $result = $this->getChannelsWithMatchingUniqueParams( $this->params );
        foreach ($result as $row){
            if ($row["x_timestamp_added"] == $this->timestamp || $row["x_last_confirmed"] == $this->timestamp){
                $this->config->addToDebugLog(
                    "ERROR: Trying to update channel ".$this->params["name"]." that was added or updated earlier! Double channel entry!\n".
                    "To update: " . $this->config->channelArray2ChannelString($this->params) ."\n".
                    "Existing : " . $this->config->channelArray2ChannelString($row) ."\n".
                    "---\n"
                );
                $this->metaData->increaseIgnoredChannelCount();
            }
            else{
                $changes = array();
                $update_data = array();
                $importance = 0;
                foreach ($this->params as $key => $value){
                    if ($value != $row[$key]  && substr($key,0,2) !== "x_" ){
                        if ($key != "apid" && $key != "vpid" && $key != "caid")
                            $importance = 1;
                        $changes[] = "$key: '".$row[$key]. "' to '". $value."'";
                        $update_data[] = "$key = ".$this->db->quote( $value);
                    }
                }
                $update_data[] = "x_last_changed = ". $this->timestamp;
                $update_data[] = "x_last_confirmed = " . $this->timestamp;

                if (count ($changes) != 0){
                    $this->config->addToDebugLog( "Changed: ".$this->params["source"]."-".$this->params["nid"]."-".$this->params["tid"]."-".$this->params["sid"]."-".$this->params["name"].": ".implode(", ",$changes)."\n");
                    $query = $this->db->exec2(
                        "UPDATE channels SET ".implode(", " , $update_data),
                        $this->getWhereArray( "source, nid, tid, sid", $this->params )
                    );
                    $query = $this->db->insert( "channel_update_log",
                        array(
                            "combined_id"        => $this->params["source"]."-".$this->params["nid"]."-".$this->params["tid"]."-".$this->params["sid"],
                            "name"               => $this->params["name"],
                            "update_description" => implode("\n",$changes),
                            "timestamp"          => $this->timestamp,
                            "importance"         => $importance
                        )
                    );
                    $this->metaData->increaseChangedChannelCount();
                }
                else{
                    //$this->config->addToDebugLog( "channel unchanged, but update x_last_confirmed\n");
                    //channel unchanged, but update x_last_confirmed
                    $query = $this->db->exec2(
                        "UPDATE channels SET x_last_confirmed = " . $this->timestamp,
                        $this->getWhereArray( "source, nid, tid, sid", $this->params )
                    );
                }
            }
        }
    }

    protected function getChannelsWithMatchingUniqueParams(){
        return $this->db->query2( "SELECT * FROM channels", $this->getWhereArray( "source, nid, tid, sid") );
    }

    protected function getWhereArray( $wherelist){
        $where_array = array();
        foreach ( explode(",", $wherelist) as $key ){
            $key = trim($key);
            $where_array[$key] = $this->params[$key];
        }
        return $where_array;
    }
}
?>