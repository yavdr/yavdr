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

class channelImport extends channelFileIterator{

    const
        hd_channel = " UPPER(name) LIKE '% HD%' ";

    private
        $existingChannelBuffer,
        $numChanChecked = 0,
        $numChanAdded = 0,
        $numChanChanged = 0,
        $timestamp;

    public function __construct($username, $cableSourceType, $terrSourceType){
        parent::__construct($cableSourceType, $terrSourceType);
        $this->timestamp = time();
        $this->numChanChecked = 0;
        $this->numChanAdded = 0;
        $this->numChanChanged = 0;
        $this->existingChannelBuffer = array();

        print "Processing channels.conf of user $username\n";
        $this->insertChannelsConfIntoDB( $this->config->getValue("userdata")."sources/$username/" );
    }

    /*
     * tries to update all channel data of the channels
     * listed in array existingChannelBuffer
     */

    private function updateExistingChannels(){
        $query = $this->db->exec("BEGIN TRANSACTION");
        foreach ($this->existingChannelBuffer as $params){
            //print "checking channel ".$params["name"]." for changes: ";
            $result = $this->getChannelsWithMatchingUniqueParams( $params );
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

    private function checkAndFixChannelSource(){
        $channel = $this->getCurrentLineAsChannelArray();
        if ( $channel !== false){
            if (strlen($channel["source"]) == 1){
                switch ($channel["source"]){
                case "C":
                    $this->cableProviderPresent = true;
                    $channel["source"] .= '['.$this->cableSourceType.']';
                    break;
                case "T":
                    $this->terrProviderPresent = true;
                    $channel["source"] .= '['.$this->terrSourceType.']';
                    break;
                default:
                    print "ERROR: unknown source type!".$channel["source"]."\n";
                }
            }
            elseif (substr($channel["source"], 0, 1) == "S")
                $this->foundSatellites[$channel["source"]] = true;
            else
                $channel = false;
        }
        return $channel;
    }

    /*
     * reads channel conf file line by line and
     * adds channel lines that seem correct to the db
     */

    private function insertChannelsConfIntoDB($sourcepath){
        $msg_prefix = "";
        $filename = $sourcepath . 'channels.conf';
        if (!file_exists($filename)) {
            print "No new uploaded channels.conf exists. Skipping this path.\n";
        }
        else{
            //read channels.conf line by line
            $this->openChannelFile($filename);
            $cgroup = "";
            $query = $this->db->exec("BEGIN TRANSACTION");
            while ($this->moveToNextLine() !== false) {
                //$msg_prefix = "try to add channel: ";
                if ($this->isCurrentLineAGroupDelimiter()){
                   $cgroup = $this->getGroupDelimiterFromCurrentLine();
                   //print $msg_prefix."Skipping a group delimiter.\n";
                }
                elseif($this->isCurrentLineEmpty()){
                    //print $msg_prefix . "illegal channel: ignoring empty line.\n";
                }
                else{
                    $this->numChanChecked++;
                    $params = $this->checkAndFixChannelSource();
                    if ($params !== false){
                        $params = $params + array(
                            "x_label"         => "",
                            "x_last_changed"  => $this->timestamp,
                            "x_timestamp_added" => $this->timestamp,
                            "x_last_confirmed" => 0
                        );

                        if (false === $this->insertChannelIntoDB ($params, $this->getCurrentLine())){
                            $this->existingChannelBuffer[] = $params;
                            //print $msg_prefix . "already exists.\n";
                        }
                        else{
                            $this->numChanAdded++;
                            //print $msg_prefix . "added successfully.\n";
                        }
                    }
                    else{
                        print $msg_prefix . "illegal channel: ".$this->getCurrentLine().".\n";
                    }
                }
            }
            $query = $this->db->exec("COMMIT TRANSACTION");
            //rename read channels.conf file
            if (file_exists($filename . ".old"))
                unlink($filename . ".old");
            rename($filename, $filename . ".old");
            $this->updateExistingChannels();
            print "Summary: Channels checked: $this->numChanChecked / Channels added: $this->numChanAdded / Channels modified: $this->numChanChanged\n";
        }
    }

    /*
     * inserts a channel into db
     * takes an associative array with keys and values
     * that are used for insert
     */

    private function insertChannelIntoDB($params, $rawstring){
        $success = true;
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