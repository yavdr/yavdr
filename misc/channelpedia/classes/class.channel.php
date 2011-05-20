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
        $params,

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

    public function __construct( $channelparams){
        $this->db = dbConnection::getInstance();
        $this->config = config::getInstance();
        $this->params = array();

        if (is_array( $channelparams )){
            //turn some integer params back into integer values
            //if they came from db they are all of type string
            $int_params = array(
                "frequency",
                "symbolrate",
                "sid",
                "nid",
                "tid",
                "x_last_changed",
                "x_timestamp_added",
                "x_last_confirmed",
                "x_utf8"
            );
            foreach ( $channelparams as $param => $value){
                if (in_array($param, $int_params)){
                    if (!array_key_exists($param, $channelparams)){
                        throw new Exception( "channel: param $param ist not in channel array!");
                    }
                    $channelparams[$param] = intval($value);
                }
            }
            $this->params = $channelparams;
            $this->source = $this->params["source"];
            $this->channelstring = $this->convertArray2String();
        }
        elseif (is_string( $channelparams )){
            //$this->channelstring = $channelparams;
            $this->params = $this->convertString2Array( $channelparams );
            $this->source = $this->params["source"];
            $this->channelstring = $this->convertArray2String();
        }
        else
            throw new Exception("Channelparams are neither of type array nor of type string!");

        $this->sourceLessId = $this->params["nid"]."-". $this->params["tid"]."-". $this->params["sid"];
        $this->uniqueID = $this->getShortenedSource()."-". $this->sourceLessId;
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