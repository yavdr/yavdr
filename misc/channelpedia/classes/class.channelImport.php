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

    private
        $metaDate,
        $username;

    public function __construct($username, $nonSatProviders ){
        parent::__construct();
        $this->metaData = new channelImportMetaData( $nonSatProviders );
        $this->username = $username;
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
                }
                else{
                    $currentchannel = new channel( $this->getCurrentLine(), $this->metaData);
                    if ($currentchannel->isValid()){
                        if (false === $currentchannel->insertIntoDB()){
                            //$this->config->addToDebugLog( $msg_prefix . "already exists.\n");
                        }
                        else{
                            //$this->config->addToDebugLog( $msg_prefix . "added successfully.\n");
                        }
                    }
                    else{
                        $this->config->addToDebugLog( $msg_prefix . "illegal channel: ".$this->getCurrentLine().".\n");
                        $this->metaData->increaseIgnoredChannelCount();
                    }
                }
            }
            $query = $this->db->exec("COMMIT TRANSACTION");
            //rename read channels.conf file
            if (file_exists($filename . ".old"))
                unlink($filename . ".old");
            rename($filename, $filename . ".old");
            $this->addToUpdateLog( "-", "Summary: ".
                "Checked: " . $this->metaData->getCheckedChannelCount() .
                " / Added: " . $this->metaData->getAddedChannelCount() .
                " / Modified: " . $this->metaData->getChangedChannelCount() .
                " / Ignored: "  . $this->metaData->getIgnoredChannelCount()
            );
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
        if ( $this->metaData->getAddedChannelCount() + $this->metaData->getChangedChannelCount() > 0){
            $labeller = channelGroupingManager::getInstance();
            $rawOutput = new rawOutputRenderer();
            foreach ($this->metaData->getPresentSatProviders() as $sat => $dummy){
                $languages = $this->config->getLanguageGroupsOfSource( "DVB-S", $sat);
                $labeller->updateAllLabelsOfSource($sat);
                $rawOutput->writeRawOutputForSingleSource( $sat, $sat, $languages);
                $htmlOutput->renderPagesOfSingleSource($sat, $languages);
            }
            if ($this->metaData->getPresentNonSatProvider("C") != ""){
                $languages = $this->config->getLanguageGroupsOfSource( "DVB-C", $this->metaData->getPresentNonSatProvider("C"));
                $provider = "C[".$this->metaData->getPresentNonSatProvider("C")."]";
                $labeller->updateAllLabelsOfSource( $provider );
                $rawOutput->writeRawOutputForSingleSource( "C", $provider, $languages);
                $htmlOutput->renderPagesOfSingleSource($provider, $languages);
            }
            if ($this->metaData->getPresentNonSatProvider("T") != ""){
                $languages = $this->config->getLanguageGroupsOfSource( "DVB-T", $this->metaData->getPresentNonSatProvider("T"));
                $provider = "T[".$this->metaData->getPresentNonSatProvider("T")."]";
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