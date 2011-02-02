<?php
/***************************************************************
*  Copyright notice
*
*  (c) 2010 Henning Pingel
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

class cpOutput extends cpBasics{

    function __construct($path){
        parent::__construct($path);
        $this->connect();
    }

    /*
     * extracts specific channels from the db and stores them in a file
     *
     * label (string, used in file name of newly generated channels file, use it to distinguish between different channels files)
     * source (string, satellite position, cable, terrestial, empty string means: show all. Example: "S28.2E", "S19.2E", "C", no lists allowed)
     * caidMode (0=show all CAIDs including FTA, 1= show only channels FTA channels, 2 = show only encrypted channels)
     * mediaType (0=show all media types, 1=show only TV channels, 2=show only radio channels, 3=show only other strange non-radio non-tv channels)
     * language (string with comma separated list of languages that should be displayed, empty string means all languages)
     * path to files that should be saved
     */

    public function updateLabelsOfChannelSelection(
        $label,
        $source = "",
        $caidMode = 0,
        $mediaType = 0,
        $language = "",
        $orderby = "frequency, modulation, provider, name ASC",
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

        $sqlquery="UPDATE channels SET label=". $this->dbh->quote($label) ." $where";
        $result = $this->dbh->query($sqlquery);
        print "Updating labels for channels belonging to $source / $label.\n";
    }

    public function writeChannelSectionByLabel($label, $source){

        $where = "";
        if ($label !== "")
            $where = "label = ". $this->dbh->quote($label). " AND ";
        $sqlquery="SELECT * FROM channels WHERE $where source= ". $this->dbh->quote($source) . " " . $orderby;
        echo "$label: $sqlquery\n";

        $gpath = $this->path."generated_channellists/";
        $groupname = $source. '.' . $label;
        $filename = $gpath . 'channels.' . $groupname . '.conf';
        @unlink($filename);
        $handle = fopen ($filename, "w");
        fputs($handle, ":### $groupname ###\n");

        $frequency = 0;

        $result = $this->dbh->query($sqlquery);
        if ($result === false)
            die("\nDB-Error: " . $this->dbh->errorCode() . " / " . $sqlquery);

        foreach ($result as $row) {
            if ($row['frequency'] !== $frequency){
                $frequency = $row['frequency'];
                $hilow = "";
                if (substr($source,0,1) == "S" && $frequency >= 11700 && $frequency <= 12750)
                    $hilow = "High-Band";
                else if (substr($source,0,1) == "S" && $frequency >= 10700 && $frequency < 11700)
                    $hilow = "Low-Band";
                if ($label = "") fputs($handle, ":transponder " . $source . " " . $hilow . " " .$row['modulation']. " " . $row['frequency'] . "\n");
                $frequency = $row['frequency'];
            }
            $provider = "";
            if ($row["provider"] != "")
                $provider = ";". $row["provider"];

            $rawstring =
                $row["name"] .
                $provider . ":".
                $row["frequency"] . ":".
                $row["modulation"] . ":".
                $row["source"] . ":".
                $row["symbolrate"] . ":".
                $row["vpid"] . ":".
                $row["apid"] . ":".
                $row["tpid"] . ":".
                $row["caid"] . ":".
                $row["sid"] . ":".
                $row["nid"] . ":".
                $row["tid"] . ":".
                $row["rid"];
            fputs($handle, "$rawstring\n");
        }
        if (fclose($handle) === false)
            die("Error on file close.");
    }
}