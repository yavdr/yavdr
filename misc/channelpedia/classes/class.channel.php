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
        $sourceDB, //needed for db
        $metaData,
        $channelstring = "",
        $uniqueID = "",
        $longUniqueID = "",

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

    public function __construct( $channelparams, & $metaDataObj = null){
        $this->config = config::getInstance();
        $this->db = dbConnection::getInstance();
        $this->metaData = $metaDataObj;
        if ( $this->metaData !== null)
            $this->metaData->increaseCheckedChannelCount();
        $this->params = array();
        if (is_array( $channelparams )){
            //turn some integer params back into integer values
            $int_params = array("frequency", "symbolrate", "sid", "nid", "tid", "rid", "x_last_changed", "x_timestamp_added", "x_last_confirmed");
            foreach ( $channelparams as $param => $value){
                if (in_array($param, $int_params)){
                    if (!array_key_exists($param, $channelparams)){
                        throw new Exception( "channel: param $param ist not in channel array!");
                    }
                    $channelparams[$param] = intval($value);
                }
            }
            $this->params = $channelparams;
            $this->channelstring = $this->convertArray2String();
        }
        elseif (is_string( $channelparams )){
            //$this->channelstring = $channelparams;
            $this->params = $this->convertString2Array( $channelparams );
            $this->channelstring = $this->convertArray2String();
        }
        else
            throw new Exception("Channelparams are neither of type array nor of type string!");

        //convert name and provider strings to utf-8 if they are not in utf-8
        //this only needs to be done if the channels were read from file
        //usually is necessary for sky_de channels that are encoded in ISO-8859-15
        if ( $this->metaData !== null){
            $this->params["x_utf8"] = 1;
            if (mb_check_encoding($this->params["name"], "UTF-8") === false){
                $this->params["name"] = mb_convert_encoding ( $this->params["name"] , "UTF-8", "ISO-8859-15");
                $this->params["x_utf8"] = 0;
            }
            if (mb_check_encoding($this->params["provider"], "UTF-8") === false){
                $this->params["provider"] = mb_convert_encoding ( $this->params["provider"] , "UTF-8", "ISO-8859-15");
                $this->params["x_utf8"] = 0;
            }
        }

        $this->source = $this->params["source"];

        //if a channel was read from a file the source of non-sat channels
        //need to be modified before they are being put into the db
        //this does not apply for channels read from the db
        //we assume that metaData is null when channel was read from db
        //ugly!
        if ( $this->metaData !== null)
            $this->setSourceForDB();
//        else
//            $this->setSourceToShortForm();
//when channels are read from db we want to output the long source in most cases, examples:
//update log, de report

        $this->sourceLessId = $this->params["nid"]."-". $this->params["tid"]."-". $this->params["sid"];
        $this->uniqueID = $this->getShortenedSource()."-". $this->sourceLessId;
        if ( $this->metaData !== null)
            $this->longUniqueID = $this->sourceDB."-". $this->sourceLessId;
        else
            $this->longUniqueID = $this->params["source"]."-". $this->sourceLessId;
    }

    public function isValid(){
        return ($this->params !== false);
    }

    public function getShortenedSource(){
        $retval = "";
        if (!$this->isSatelliteSource()){
            $retval = substr($this->source,0,1);
        }
        else
            $retval = $this->source;
        return $retval;
    }

    public function setSourceToShortForm(){
        $this->source = $this->getShortenedSource();
    }

    private function setSourceForDB(){
        if (!$this->isSatelliteSource()){
            switch ($this->source){
            case "C":
            case "T":
            case "A":
                $nonSatProvider = $this->metaData->getAnnouncedNonSatProvider($this->source);
                $this->sourceDB = $this->source . '[' . $nonSatProvider . ']';
                if ( $this->metaData !== null)
                    $this->metaData->addPresentNonSatProvider( $this->source, $nonSatProvider );
                break;
            case "I":
            case "P":
                $this->config->addToDebugLog( "ignoring channels sourcetype: ". $this->source  ."\n");
                $this->params = false;
                break;
            default:
                throw new Exception( "Unknown source type! " . $this->source );
            }
        }
        else{
            $this->sourceDB = $this->source;
            if ( $this->metaData !== null)
                $this->metaData->addPresentSatProvider( $this->source );
        }
    }

    public function getFrequency(){
        return $this->params["frequency"];
    }

    public function getModulation(){
        return $this->params["modulation"];
    }

    public function getSource(){
        return $this->source;
    }

    public function getUniqueID(){
        return $this->uniqueID;
    }

    public function getLongUniqueID(){
        return $this->longUniqueID;
    }


    //FIXME temp
    public function getAsArray(){
        $this->params["x_unique_id"] = $this->getUniqueID();
        $this->params["source"] = $this->source;
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
            "x_last_changed"  => $this->metaData->getTimestamp(),
            "x_timestamp_added" => $this->metaData->getTimestamp(),
            "x_last_confirmed" => 0
        );
        //FIXME: source should stay original
        $this->params["source"] = $this->sourceDB;

        $success = true;
        $query = $this->db->insert( "channels", $this->params);
        //19 = channel already exists, could'nt be inserted
        if ($query != 19) {
            if ( $this->metaData !== null)
                $this->metaData->increaseAddedChannelCount();
            $query = $this->db->insert( "channel_update_log", array(
                "combined_id" => $this->longUniqueID,
                "name" => $this->params["name"],
                "update_description" => "New channel added: " . $this->getChannelString(),
                "timestamp" => $this->metaData->getTimestamp(),
                "importance" => "1"
            ));
        }
        else{
            $this->updateInDB();
            $success = false;
        }
        return $success;
    }

    protected function updateInDB(){
        //$this->config->addToDebugLog( "checking channel ".$this->params["name"]." for changes: \n");
        $result = $this->getChannelsWithMatchingUniqueParams();
        foreach ($result as $row){
            $otherchannel = new channel($row);
            if ($row["x_timestamp_added"] == $this->metaData->getTimestamp() || $row["x_last_confirmed"] == $this->metaData->getTimestamp()){
                $this->config->addToDebugLog(
                    "ERROR: Trying to update channel ".$this->params["name"]." that was added or updated earlier! Double channel entry!\n".
                    "To update: " . $this->getChannelString() ."\n".
                    "Existing : " . $otherchannel->getChannelString() ."\n".
                    "---\n"
                );
                if ( $this->metaData !== null)
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
                $update_data[] = "x_last_changed = "   . $this->metaData->getTimestamp();
                $update_data[] = "x_last_confirmed = " . $this->metaData->getTimestamp();

                if (count ($changes) != 0){
                    $this->config->addToDebugLog( "Changed: ".$this->getUniqueID() . "-" . $this->params["name"] . ": " . implode(", ",$changes)."\n");
                    $query = $this->db->exec2(
                        "UPDATE channels SET ".implode(", " , $update_data),
                        $this->getWhereArray( "source, nid, tid, sid" )
                    );
                    $query = $this->db->insert( "channel_update_log",
                        array(
                            "combined_id"        => $this->getUniqueID(),
                            "name"               => $this->params["name"],
                            "update_description" => implode("\n",$changes),
                            "timestamp"          => $this->metaData->getTimestamp(),
                            "importance"         => $importance
                        )
                    );
                    if ( $this->metaData !== null)
                        $this->metaData->increaseChangedChannelCount();
                }
                else{
                    //$this->config->addToDebugLog( "channel unchanged, but update x_last_confirmed\n");
                    //channel unchanged, but update x_last_confirmed
                    $query = $this->db->exec2(
                        "UPDATE channels SET x_last_confirmed = " . $this->metaData->getTimestamp(),
                        $this->getWhereArray( "source, nid, tid, sid" )
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

    public function getChannelString(){
        return $this->channelstring;
    }

    public function convertArray2String(){
        $provider = "";
        if ($this->params["provider"] != "")
            $provider = ";". $this->params["provider"];

        return
            $this->params["name"] .
            $provider . ":".
            $this->params["frequency"] . ":".
            $this->params["modulation"] . ":".
            $this->getShortenedSource() . ":".
            $this->params["symbolrate"] . ":".
            $this->params["vpid"] . ":".
            $this->params["apid"] . ":".
            $this->params["tpid"] . ":".
            $this->params["caid"] . ":".
            $this->params["sid"] . ":".
            $this->params["nid"] . ":".
            $this->params["tid"] . ":".
            $this->params["rid"];
    }

    public function convertString2Array( $string ){
        $result = false;
        $details = explode( ":", $string);
        if (count($details) == 13){
            $cname = $details[0];
            $cprovider = "";
            $cnamedetails = explode( ";", $cname);
            if (count($cnamedetails) == 2){
                $cname = $cnamedetails[0];
                $cprovider = $cnamedetails[1];
            }

            $result = array(
                "name"            => $cname,
                "provider"        => $cprovider,
                "frequency"       => intval($details[1]),
                "modulation"      => strtoupper($details[2]), //w_scan has lower case, we don't want that
                "source"          => $details[3],
                "symbolrate"      => intval($details[4]),
                "vpid"            => $details[5],
                "apid"            => $details[6],
                "tpid"            => $details[7],
                "caid"            => $details[8],
                "sid"             => intval($details[9]),
                "nid"             => intval($details[10]),
                "tid"             => intval($details[11]),
                "rid"             => intval($details[12])
            );
        }
        else{
            throw new Exception( "Couldn't convert channel string to channel array");
        }
        return $result;
    }

}
?>