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
        $numChanIgnored = 0,
        $timestamp,
        $username,
        $debuglog;

    public function __construct($username, $nonSatProviders ){
        parent::__construct();
        config::resetPresentProviders();
        config::setNonSatProviders( $nonSatProviders );
        $this->username = $username;
        $this->timestamp = time();
        $this->numChanChecked = 0;
        $this->numChanAdded = 0;
        $this->numChanChanged = 0;
        $this->numChanIgnored = 0;
        $this->existingChannelBuffer = array();
        //$this->addToUpdateLog( "-", "Processing users channels.conf.");
    }

    public function addToUpdateLog( $source, $description ){
        $query = $this->db->insert( "upload_log", array(
            "timestamp" => time(), //$this->timestamp,
            "user" => $this->username,
            "source" => $source,
            "description" => $description
        ));
        $this->config->addToDebugLog( $this->username . ": " . $description."\n");

    }

    /*
     * tries to update all channel data of the channels
     * listed in array existingChannelBuffer
     */

    private function updateExistingChannels(){
        $query = $this->db->exec("BEGIN TRANSACTION");
        foreach ($this->existingChannelBuffer as $params){
            //$this->config->addToDebugLog( "checking channel ".$params["name"]." for changes: \n");
            $result = $this->getChannelsWithMatchingUniqueParams( $params );
            foreach ($result as $row){
                if ($row["x_timestamp_added"] == $this->timestamp || $row["x_last_confirmed"] == $this->timestamp){
                    $this->config->addToDebugLog(
                        "ERROR: Trying to update channel ".$params["name"]." that was added or updated earlier! Double channel entry!\n".
                        "To update: " . $this->config->channelArray2ChannelString($params) ."\n".
                        "Existing : " . $this->config->channelArray2ChannelString($row) ."\n".
                        "---\n"
                    );
                    $this->numChanIgnored++;
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
                        $this->config->addToDebugLog( "Changed: ".$params["source"]."-".$params["nid"]."-".$params["tid"]."-".$params["sid"]."-".$params["name"].": ".implode(", ",$changes)."\n");
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
                        //$this->config->addToDebugLog( "channel unchanged, but update x_last_confirmed\n");
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

    public function insertChannelsConfIntoDB(){
        $sourcepath = $this->config->getValue("userdata")."sources/".$this->username."/";

        $msg_prefix = "";
        $filename = $sourcepath . 'channels.conf';
        if (!file_exists($filename)) {
            $this->addToUpdateLog( "-", "No unprocessed channels.conf exists. Nothing to do.");
        }
        elseif (file_exists($sourcepath . 'lockfile.txt')) {
            $this->addToUpdateLog( "-", "Lockfile present. Processing of channels.conf rejected.");
        }
        else{
            //lock this user
            file_put_contents($sourcepath . 'lockfile.txt', "locked");
            //read channels.conf line by line
            $this->openChannelFile($filename);
            $cgroup = "";
            $query = $this->db->exec("BEGIN TRANSACTION");
            while ($this->moveToNextLine() !== false) {
                //$msg_prefix = "try to add channel: ";
                if ($this->isCurrentLineAGroupDelimiter()){
                   $cgroup = $this->getGroupDelimiterFromCurrentLine();
                   //$this->config->addToDebugLog( $msg_prefix."Skipping a group delimiter.\n");
                }
                elseif($this->isCurrentLineEmpty()){
                    //$this->config->addToDebugLog( $msg_prefix . "illegal channel: ignoring empty line.\n");
                    //$this->numChanIgnored++;
                }
                else{
                    $this->numChanChecked++;
                    $currentchannel = new channel( $this->getCurrentLine(), $this->timestamp );
                    if ($currentchannel->isValid()){
                        //if (false === $this->insertChannelIntoDB ($params, $this->getCurrentLine())){
                        if (false === $currentchannel->insertIntoDB()){
                            $this->existingChannelBuffer[] = $currentchannel->getAsArray();

                            //$this->config->addToDebugLog( $msg_prefix . "already exists.\n");
                        }
                        else{
                            $this->numChanAdded++;
                            //$this->config->addToDebugLog( $msg_prefix . "added successfully.\n");
                        }
                    }
                    else{
                        $this->config->addToDebugLog( $msg_prefix . "illegal channel: ".$this->getCurrentLine().".\n");
                        $this->numChanIgnored++;
                    }
                }
            }
            $query = $this->db->exec("COMMIT TRANSACTION");
            //rename read channels.conf file
            if (file_exists($filename . ".old"))
                unlink($filename . ".old");
            rename($filename, $filename . ".old");
            $this->updateExistingChannels();
            $this->addToUpdateLog( "-", "Summary:  Checked: $this->numChanChecked / Added: $this->numChanAdded / Modified: $this->numChanChanged / Ignored: $this->numChanIgnored");
            unlink($sourcepath . 'lockfile.txt');
        }
    }

    /*
     * only those stuff is being updated that really needs to be updated
     * keep the amount of unnecessary updates as small as possible
     */

    public function updateAffectedDataAndFiles(){
        $htmlOutput = new HTMLOutputRenderer();
        $htmlOutput->writeUploadLog();
        if ($this->numChanAdded + $this->numChanChanged > 0){
            $labeller = channelGroupingManager::getInstance();
            $rawOutput = new rawOutputRenderer();
            foreach (config::getPresentSatProviders as $sat => $dummy){
                $languages = $this->config->getLanguageGroupsOfSource( "DVB-S", $sat);
                $labeller->updateAllLabelsOfSource($sat);
                $rawOutput->writeRawOutputForSingleSource( $sat, $sat, $languages);
                $htmlOutput->renderPagesOfSingleSource($sat, $languages);
            }
            if (config::getPresentNonSatProvider("C") != ""){
                $languages = $this->config->getLanguageGroupsOfSource( "DVB-C", config::getPresentNonSatProvider("C"));
                $provider = "C[".config::getPresentNonSatProvider("C")."]";
                $labeller->updateAllLabelsOfSource( $provider );
                $rawOutput->writeRawOutputForSingleSource( "C", $provider, $languages);
                $htmlOutput->renderPagesOfSingleSource($provider, $languages);
            }
            if (config::getPresentNonSatProvider("T") != ""){
                $languages = $this->config->getLanguageGroupsOfSource( "DVB-T", config::getPresentNonSatProvider("T"));
                $provider = "T[".config::getPresentNonSatProvider("T")."]";
                $labeller->updateAllLabelsOfSource( $provider );
                $rawOutput->writeRawOutputForSingleSource( "T", $provider, $languages);
                $htmlOutput->renderPagesOfSingleSource($provider, $languages);
            }
            $htmlOutput->writeGeneralChangelog();
        }
        else{
            $this->config->addToDebugLog( "No need for label update.\n");
        }
    }
}
?>