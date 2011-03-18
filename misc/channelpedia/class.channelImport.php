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
        $terrProviderPresent = false;

    function __construct(){
        $this->config = config::getInstance();
        $this->db = dbConnection::getInstance();
    }

    public function importChannelsConfFile($username, $cableSourceType, $terrSourceType){
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

        foreach ($this->existingChannelBuffer as $params){
            //print "checking channel ".$params["name"]." for changes: ";
            $result = $this->db->query2( "SELECT * FROM channels", $this->getWhereArray( "source, nid, tid, sid", $params ) );
            $query = $this->db->exec("BEGIN TRANSACTION");
            foreach ($result as $row){
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
                $update_data[] = "x_last_changed = ".time();
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
                            "timestamp"          => time(),
                            "importance"         => $importance
                        )
                    );
                    $this->numChanChanged++;
                }
                else{
                    //print "channel unchanged.\n";
                }
            }
            $query = $this->db->exec("COMMIT TRANSACTION");
        }
    }

    /*
     * reads channel conf file line by line and
     * adds channel lines that seem correct to the db
     */

    private function insertChannelsConfIntoDB($sourcepath){
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
        if ($sourcetype == "C"){
            $this->cableProviderPresent = true;
        }
        if ($sourcetype == "T"){
            $this->terrProviderPresent = true;
        }

        $query = $this->db->insert( "channels", $params);
        //19 = channel already exists, could'nt be inserted
        if ($query != 19) {
            $insert_params = array(
                "combined_id" => $params["source"]."-".$params["nid"]."-".$params["tid"]."-".$params["sid"],
                "name" => $params["name"],
                "update_description" => "New channel added: " . $rawstring,
                "timestamp" => time(),
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
        if ($details[3] == "C")
            $details[3] .= '['.$this->cableSourceType.']';
        else if ($details[3] == "T")
            $details[3] .= '['.$this->terrSourceType.']';

        return array(
            "name"            => $cname,
            "provider"        => $cprovider,
            "frequency"       => $details[1],
            "modulation"      => $details[2],
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
            "x_last_changed"  => time()
        );
    }

    public function updateNecessaryLabels(){
        if ($this->numChanAdded + $this->numChanChanged > 0){
            foreach ($this->foundSatellites as $sat => $dummy){
                $this->updateAllLabelsOfSource($sat);
            }
            if ($this->cableProviderPresent)
                $this->updateAllLabelsOfSource("C[".$this->cableSourceType."]");
            if ($this->terrProviderPresent)
                $this->updateAllLabelsOfSource("T[".$this->terrSourceType."]");
        }
        else{
            print "No need for label update.\n";
        }
    }

    public function updateAllLabels(){
            //reset all labels in DB to empty strings before updating them
            $sqlquery = "UPDATE channels SET x_label=''";
            $result = $this->db->query($sqlquery);

            foreach ($this->config->getValue("sat_positions") as $sat){
                $this->updateAllLabelsOfSource($sat);
            }
            foreach ($this->config->getValue("cable_providers") as $cablep){
                $this->updateAllLabelsOfSource("C[$cablep]");
            }
            foreach ($this->config->getValue("terr_providers") as $terrp){
                $this->updateAllLabelsOfSource("T[$terrp]");
            }
    }

    private function updateAllLabelsOfSource( $source ){
        $sourcetype = substr($source, 0, 1);
        foreach ( channelGroupingRulesStore::getRules() as $title => $config){
            if ( $sourcetype == "S"){
                if ( $config["validForSatellites"] === "all" || ( is_array( $config["validForSatellites"] ) && in_array( $source, $config["validForSatellites"], true)) ){
                    foreach ($config["groups"] as $grouptitle => $groupsettings){
                        $this->updateLabelsOfChannelSelection(
                            $label = $config["country"] . "." . $grouptitle,
                            $source,
                            $caidMode    = $groupsettings["caidMode"],
                            $mediaType   = $groupsettings["mediaType"],
                            $language    = $config["lang"],
                            $customwhere = $groupsettings["customwhere"],
                            $title
                        );
                    }
                }
            }
            elseif ( $sourcetype == "C"){
                if ( $config["validForCableProviders"] === "all" || ( is_array( $config["validForCableProviders"] ) && in_array( $source, $config["validForCableProviders"], true)) ){
                    foreach ($config["groups"] as $grouptitle => $groupsettings){
                        $this->updateLabelsOfChannelSelection(
                            $label = $config["country"] . "." . $grouptitle,
                            $source,
                            $caidMode    = $groupsettings["caidMode"],
                            $mediaType   = $groupsettings["mediaType"],
                            $language    = $config["lang"],
                            $customwhere = $groupsettings["customwhere"],
                            $title
                        );
                    }
                }
            }
            elseif ( $sourcetype == "T"){
                if ( $config["validForTerrProviders"] === "all" || ( is_array( $config["validForTerrProviders"] ) && in_array( $source, $config["validForTerrProviders"], true)) ){
                    foreach ($config["groups"] as $grouptitle => $groupsettings){
                        $this->updateLabelsOfChannelSelection(
                            $label = $config["country"] . "." . $grouptitle,
                            $source,
                            $caidMode    = $groupsettings["caidMode"],
                            $mediaType   = $groupsettings["mediaType"],
                            $language    = $config["lang"],
                            $customwhere = $groupsettings["customwhere"],
                            $title
                        );
                    }
                }
            }
        }
    }

    /*
     * tags specific channels in the db
     *
     * label (string, used in file name of newly generated channels file, use it to distinguish between different channels files)
     * source (string, satellite position, cable, terrestial, empty string means: show all. Example: "S28.2E", "S19.2E", "C", no lists allowed)
     * caidMode (0=show all CAIDs including FTA, 1= show only channels FTA channels, 2 = show only encrypted channels)
     * mediaType (0=show all media types, 1=show only TV channels, 2=show only radio channels, 3=show only other strange non-radio non-tv channels)
     * language (string with comma separated list of languages that should be displayed, empty string means all languages)
     */

    public function updateLabelsOfChannelSelection(
        $label,
        $source = "",
        $caidMode = 0,
        $mediaType = 0,
        $language = "",
        $customwhere = "",
        $title = ""
    ){
        $where = array();

        if ($source != "")
            $where[] = "source = ". $this->db->quote( $source );

        if ($caidMode != 0)
            $where[] = "caid ". ($caidMode === 2 ? "!= '0'": "= '0'");

        if ($mediaType != 0)
            $where[] = "vpid ". ($mediaType === 1 ? "!= '0'": "= '0'");

        if ($language != "")
            $where[] = "apid LIKE '%=$language%'";

        //update label tag in the selected channels
        if (count($where) > 0){
            $where = "WHERE " . implode( $where, " AND " ) . $customwhere;
            $where2 = $where . " AND ";
            $where .= " AND x_label = ''";
        }
        else {
            $where2 = "WHERE ";
            $where .= "WHERE x_label = ''";
        }

        $sqlquery = "SELECT * FROM channels $where2 x_label != '' AND x_label != ". $this->db->quote($label);
        $result = $this->db->query($sqlquery);
        foreach ($result as $row){
            print "*** Notice: Channel '".$row["name"]."' is already tagged with '".$row["x_label"]."'. We just tried to tag it with '$label'\n";
        }

        $sqlquery = "UPDATE channels SET x_label=". $this->db->quote($label) ." $where";
        $result = $this->db->query($sqlquery);
        print "Updating labels for channels belonging to $title / $source / $label.\n";
    }
}
?>