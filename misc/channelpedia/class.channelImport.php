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
        $dbh,
        $config,
        $numChanChecked = 0,
        $numChanAdded = 0,
        $numChanChanged = 0;

    function __construct(){
        $this->config = config::getInstance();
        $db = dbConnection::getInstance();
        $this->dbh = $db->getDBHandle();
    }

    public function importChannelsConfFile($username, $cableSourceType, $terrSourceType){
        $this->numChanChecked = 0;
        $this->numChanAdded = 0;
        $this->numChanChanged = 0;
        print "Processing channels.conf of user $username\n";
        $this->cableSourceType = $cableSourceType;
        $this->terrSourceType = $terrSourceType;
        $this->existingChannelBuffer = array();
        $this->insertChannelsConfIntoDB( $this->config->getValue("path")."sources/$username/" );
        $this->updateExistingChannels();
        print "Summary: Channels checked: $this->numChanChecked / Channels added: $this->numChanAdded / Channels modified: $this->numChanChanged\n";
    }
    /*
     * tries to update all channel data of the channels
     * listed in array existingChannelBuffer
     */

    private function updateExistingChannels(){

        foreach ($this->existingChannelBuffer as $params){
            //print "checking channel ".$params["name"]." for changes: ";
            $sqlquery = "SELECT * FROM channels WHERE source = ".
                $this->dbh->quote( $params["source"])." AND nid = ".
                $this->dbh->quote( $params["nid"])." AND tid = ".
                $this->dbh->quote( $params["tid"])." AND sid = ".
                $this->dbh->quote( $params["sid"]);
            $result = $this->dbh->query($sqlquery);
            if ($result === false) die("\nDB-Error: " . $this->dbh->errorCode() . " / " . $sqlquery);
            $query = $this->dbh->exec("BEGIN TRANSACTION");
            foreach ($result as $row){
                $changes = array();
                $update_data = array();
                $importance = 0;
                foreach ($params as $key => $value){
                    if ($value != $row[$key]  && substr($key,0,2) !== "x_" ){
                        if ($key != "apid" && $key != "vpid")
                            $importance = 1;
                        $changes[] = "<b>$key</b>: '".$row[$key]. "' to '". $value."'</br>";
                        $update_data[] = "$key = ".$this->dbh->quote( $value);
                    }
                }
                $update_data[] = "x_last_changed = ".time();
                if (count ($changes) != 0){
                    //print "Changed: ".$params["source"].$params["nid"].$params["tid"].$params["sid"].$params["name"].": ".implode(", ",$changes)."\n";
                    $statement = "UPDATE channels SET ".implode(", " , $update_data)." WHERE source = ".
                        $this->dbh->quote( $params["source"] )." AND nid = ".
                        $this->dbh->quote( $params["nid"] )." AND tid = ".
                        $this->dbh->quote( $params["tid"])." AND sid = ".
                        $this->dbh->quote( $params["sid"])."; ";
                    $statement .= "INSERT INTO channel_update_log (combined_id, name, update_description, timestamp, importance) VALUES
                        ( ".$this->dbh->quote( $params["source"]."-".$params["nid"]."-".$params["tid"]."-".$params["sid"]).",
                         ".$this->dbh->quote( $params["name"]).", ".
                           $this->dbh->quote( implode(", ",$changes)).", ".
                           time(). ", ".
                           $importance.
                         " );";
                    //print "$statement\n";
                    $query = $this->dbh->exec($statement);
                    if (!$query) {
                        $errorinfo = $this->dbh->errorInfo();
                        print "$statement\n";
                        echo "\nPDO::errorInfo():\n";
                        print_r($this->dbh->errorInfo());
                        die("db error on insert\n");
                    }
                    $this->numChanChanged++;
                }
                else{
                    //print "channel unchanged.\n";
                }
            }
            $query = $this->dbh->exec("COMMIT TRANSACTION");
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
            $query = $this->dbh->exec("BEGIN TRANSACTION");
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
            $query = $this->dbh->exec("COMMIT TRANSACTION");
        }
    }

    /*
     * inserts a channel into db
     * takes an associative array with keys and values
     * that are used for insert
     */

    private function insertChannelIntoDB ($params, $rawstring){
        $success = true;
        $unique_channel_id = $params["source"]."-".$params["nid"]."-".$params["tid"]."-".$params["sid"];
        foreach ($params as $key => $value)
            $params[$key]=$this->dbh->quote( $value );
        $columns = implode( ", ", array_keys($params) );
        $values = implode( ", ", array_values($params) );
        $sqltext = "INSERT INTO channels ( " . $columns . " ) VALUES ( " . $values . " );";
        $sqltext .= "INSERT INTO channel_update_log (combined_id, name, update_description, timestamp, importance) VALUES ( ".
            $this->dbh->quote( $unique_channel_id ).", ".
            $params["name"].", ".
            $this->dbh->quote( "<b>New channel added:</b> " . $rawstring ).", ".
            time().", 1".
            " );";
        $query = $this->dbh->exec($sqltext);
        if (!$query) {
            //19 = channel already exists
            $errorinfo = $this->dbh->errorInfo();
            if ($errorinfo[1] == 19)
                $success = false;
            else{
                print "$sqltext\n";
                echo "\nPDO::errorInfo():\n";
                print_r($this->dbh->errorInfo());
                die("db error on insert\n");
            }
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

    public function updateAllLabels( $forceUpdate = false){
        if ($this->numChanAdded + $this->numChanChanged > 0 || $forceUpdate){
            //FIXME: avoid static sat sources !!!! avoid updating just one C and one T!!!
            $this->updateAllLabelsOfSource("S19.2E");
            if ($this->cableSourceType != "none")
                $this->updateAllLabelsOfSource("C[".$this->cableSourceType."]");
            if ($this->terrSourceType != "none")
                $this->updateAllLabelsOfSource("T[".$this->terrSourceType."]");
        }
        else{
            print "No need for label update.\n";
        }
    }

    private function updateAllLabelsOfSource( $source ){

        foreach ($this->config->getValue("groups") as $label => $details){
            $this->updateLabelsOfChannelSelection(
                $label,
                $source,
                $caidMode    = $details["caidMode"],
                $mediaType   = $details["mediaType"],
                $language    = $details["language"],
                $customwhere = $details["customwhere"]
            );
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
        $customwhere =""
    ){
        $where = array();

        if ($source != "")
            $where[] = "source = ". $this->dbh->quote( $source );

        if ($caidMode != 0)
            $where[] = "caid ". ($caidMode === 2 ? "!= '0'": "= '0'");

        if ($mediaType != 0)
            $where[] = "vpid ". ($mediaType === 1 ? "!= '0'": "= '0'");

        if ($language != "")
            $where[] = "apid LIKE '%=$language%'";

        //update label tag in the selected channels
        if (count($where) > 0)
            $where = "WHERE " . implode( $where, " AND " ) . $customwhere;

        $sqlquery="UPDATE channels SET x_label=". $this->dbh->quote($label) ." $where";
        $result = $this->dbh->query($sqlquery);
        print "Updating labels for channels belonging to $source / $label.\n";
    }
}
?>