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

class channelImport{

    const
        hd_channel = " UPPER(name) LIKE '% HD%' ";

    private
        $cableSourceType,
        $terrSourceType,
        $existingChannelBuffer,
        $db,
        $config,
        $numChanChecked = 0,
        $numChanAdded = 0,
        $numChanChanged = 0,
        $foundSatellites = array(),
        $cableProviderPresent = false,
        $terrProviderPresent = false,
        $timestamp;

    function __construct(){
        $this->config = config::getInstance();
        $this->db = dbConnection::getInstance();
    }

    public function importChannelsConfFile($username, $cableSourceType, $terrSourceType){
        $this->timestamp = time();
        $this->numChanChecked = 0;
        $this->numChanAdded = 0;
        $this->numChanChanged = 0;
        $this->foundSatellites = array();
        $this->cableProviderPresent = false;
        $this->terrProviderPresent = false;
        print "Processing channels.conf of user $username\n";
        $this->cableSourceType = $cableSourceType;
        $this->terrSourceType = $terrSourceType;
        $this->existingChannelBuffer = array();
        $this->insertChannelsConfIntoDB( $this->config->getValue("path")."sources/$username/" );
        $this->updateExistingChannels();
        print "Summary: Channels checked: $this->numChanChecked / Channels added: $this->numChanAdded / Channels modified: $this->numChanChanged\n";
    }

    private function getWhereArray( $wherelist, $params ){
        $where_array = array();
        foreach ( explode(",", $wherelist) as $key ){
            $key = trim($key);
            $where_array[$key] = $params[$key];
        }
        return $where_array;
    }

    /*
     * tries to update all channel data of the channels
     * listed in array existingChannelBuffer
     */

    private function updateExistingChannels(){
        $query = $this->db->exec("BEGIN TRANSACTION");
        foreach ($this->existingChannelBuffer as $params){
            //print "checking channel ".$params["name"]." for changes: ";
            $result = $this->db->query2( "SELECT * FROM channels", $this->getWhereArray( "source, nid, tid, sid", $params ) );
            foreach ($result as $row){
                if ($row["x_timestamp_added"] == $this->timestamp){
                    print "ERROR: Trying to update channel ".$params["name"]." that was added earlier! Double channel entry!\n";
                    print "To update: " . $this->config->channelArray2ChannelString($params) ."\n";
                    print "Existing : " . $this->config->channelArray2ChannelString($row) ."\n";
                    print "---\n";
                }
                else{
                    $changes = array();
                    $update_data = array();
                    $importance = 0;
                    foreach ($params as $key => $value){
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
                        //print "Changed: ".$params["source"].$params["nid"].$params["tid"].$params["sid"].$params["name"].": ".implode(", ",$changes)."\n";
                        $query = $this->db->exec2(
                            "UPDATE channels SET ".implode(", " , $update_data),
                            $this->getWhereArray( "source, nid, tid, sid", $params )
                        );
                        $query = $this->db->insert( "channel_update_log",
                            array(
                                "combined_id"        => $params["source"]."-".$params["nid"]."-".$params["tid"]."-".$params["sid"],
                                "name"               => $params["name"],
                                "update_description" => implode("\n",$changes),
                                "timestamp"          => $this->timestamp,
                                "importance"         => $importance
                            )
                        );
                        $this->numChanChanged++;
                    }
                    else{
                        //print "channel unchanged, but update x_last_confirmed\n";
                        //channel unchanged, but update x_last_confirmed
                        $query = $this->db->exec2(
                            "UPDATE channels SET x_last_confirmed = " . $this->timestamp,
                            $this->getWhereArray( "source, nid, tid, sid", $params )
                        );
                    }
                }
            }
        }
        $query = $this->db->exec("COMMIT TRANSACTION");
    }

    /*
     * reads channel conf file line by line and
     * adds channel lines that seem correct to the db
     */

    private function insertChannelsConfIntoDB($sourcepath){
        $msg_prefix = "";
        $filename = $sourcepath . 'channels.conf';
        if (file_exists($filename)) {
            $handle = fopen ($filename, "r");
            $counter = 1;
            $cgroup = "";
            $query = $this->db->exec("BEGIN TRANSACTION");
            while (!feof($handle)) {
                //$msg_prefix = "try to add channel $counter : ";
                $buffer = fgets($handle, 4096);
                $buffer = rtrim( $buffer, "\n");
                if (substr($buffer,0,1) == ":"){
                   $cgroup = ltrim($buffer,":");
                   //print $msg_prefix."Skipping a group delimiter.\n";
                }
                elseif($buffer == ""){
                    //print $msg_prefix . "illegal channel: ignoring empty line.\n";
                }
                else{
                    $this->numChanChecked++;
                    $counter++;
                    $params = $this->getParamArray($buffer);
                    if ($params !== false)
                        if (false === $this->insertChannelIntoDB ($params, $buffer)){
                            $this->existingChannelBuffer[] = $params;
                            //print $msg_prefix . "already exists.\n";
                        }
                        else{
                            $this->numChanAdded++;
                            //print $msg_prefix . "added successfully.\n";
                        }
                    else{
                        print $msg_prefix . "illegal channel: $buffer.\n";
                    }
                }
            }
            fclose ($handle);
            $query = $this->db->exec("COMMIT TRANSACTION");
        }
    }

    /*
     * inserts a channel into db
     * takes an associative array with keys and values
     * that are used for insert
     */

    private function insertChannelIntoDB ($params, $rawstring){
        $success = true;

        $sourcetype = substr($params["source"], 0, 1);
        if ($sourcetype == "S"){
            $this->foundSatellites[$params["source"]] = true;
        }
        elseif ($sourcetype == "C"){
            $this->cableProviderPresent = true;
        }
        elseif ($sourcetype == "T"){
            $this->terrProviderPresent = true;
        }
        else
            return false;

        $query = $this->db->insert( "channels", $params);
        //19 = channel already exists, could'nt be inserted
        if ($query != 19) {
            $insert_params = array(
                "combined_id" => $params["source"]."-".$params["nid"]."-".$params["tid"]."-".$params["sid"],
                "name" => $params["name"],
                "update_description" => "New channel added: " . $rawstring,
                "timestamp" => $this->timestamp,
                "importance" => "1"
            );
            $query = $this->db->insert( "channel_update_log", $insert_params);
        }
        else{
            $success = false;
        }
        return $success;
    }

    /*
     * converts channel data string into an array
     * ready to use for db insert
     */

    private function getParamArray( $buffer ){
        $details = explode( ":", $buffer);
        if (count($details) != 13) return false;
        $cname = $details[0];
        $cprovider = "";
        $cnamedetails = explode( ";", $cname);
        if (count($cnamedetails) == 2){
            $cname = $cnamedetails[0];
            $cprovider = $cnamedetails[1];
        }
        $sourcetype = substr($details[3], 0, 1);
        if ($sourcetype == "C")
            $details[3] .= '['.$this->cableSourceType.']';
        elseif ($sourcetype == "T")
            $details[3] .= '['.$this->terrSourceType.']';
        elseif ($sourcetype != "S")
            return false;

        return array(
            "name"            => $cname,
            "provider"        => $cprovider,
            "frequency"       => $details[1],
            "modulation"      => strtoupper($details[2]), //w_scan has lower case, we don't want that
            "source"          => $details[3],
            "symbolrate"      => $details[4],
            "vpid"            => $details[5],
            "apid"            => $details[6],
            "tpid"            => $details[7],
            "caid"            => $details[8],
            "sid"             => $details[9],
            "nid"             => $details[10],
            "tid"             => $details[11],
            "rid"             => $details[12],
            "x_label"         => "",
            "x_last_changed"  => $this->timestamp,
            "x_timestamp_added" => $this->timestamp,
            "x_last_confirmed" => 0
        );
    }

    public function updateNecessaryLabels(){
        $labeller = channelGroupingManager::getInstance();
        if ($this->numChanAdded + $this->numChanChanged > 0){
            foreach ($this->foundSatellites as $sat => $dummy){
                $labeller->updateAllLabelsOfSource($sat);
            }
            if ($this->cableProviderPresent)
                $labeller->updateAllLabelsOfSource("C[".$this->cableSourceType."]");
            if ($this->terrProviderPresent)
                $labeller->updateAllLabelsOfSource("T[".$this->terrSourceType."]");
        }
        else{
            print "No need for label update.\n";
        }
    }

}
?>