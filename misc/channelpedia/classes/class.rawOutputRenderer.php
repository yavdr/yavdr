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

class rawOutputRenderer {

    function __construct(){
        $this->config = config::getInstance();
    }

    public function writeRawOutputForAllSources(){
        foreach ($this->config->getValue("sat_positions") as $sat => $languages){
            $this->writeRawOutputForSingleSource( $sat, $sat, $languages);
        }
        foreach ($this->config->getValue("cable_providers") as $cablep => $languages){
            $this->writeRawOutputForSingleSource( "C", "C[$cablep]", $languages);
        }
        foreach ($this->config->getValue("terr_providers") as $terrp => $languages){
            $this->writeRawOutputForSingleSource( "T", "T[$terrp]", $languages);
        }
    }

    public function writeRawOutputForSingleSource( $shortsource, $longsource, $languages){
        //write unfiltered channels.conf lists to disc
        $channelListWriter = new channelListWriter("_complete", $longsource);
        $channelListWriter->writeFile();
        //$this->writeAllChannelSelections2Disk( $longsource );
        $this->writeAllUncategorizedChannels2Disk( $longsource);
        //epgmappings only for German providers
        if (in_array("de", $languages)){
            $epgstuff = epg2vdrMapper::getInstance();
            $epgstuff->writeEPGChannelmap( $shortsource, $longsource, "tvm");
            $epgstuff->writeEPGChannelmap( $shortsource, $longsource, "epgdata");
        }
    }

    private function writeAllChannelSelections2Disk( $source){
        $sourcetype = substr($source, 0, 1);
        foreach ( channelGroupingRulesStore::getRules() as $title => $config){
            if ( $sourcetype == "S"){
                if ( $config["validForSatellites"] === "all" || ( is_array( $config["validForSatellites"] ) && in_array( $source, $config["validForSatellites"], true)) ){
                    foreach ($config["groups"] as $grouptitle => $groupsettings){
                        $y = new channelListWriter( $config["country"] . "." . $grouptitle, $source);
                        $y->writeFile();
                    }
                }
            }
            elseif ( $sourcetype == "C"){
                if ( $config["validForCableProviders"] === "all" || ( is_array( $config["validForCableProviders"] ) && in_array( $source, $config["validForCableProviders"], true)) ){
                    foreach ($config["groups"] as $grouptitle => $groupsettings){
                        $y = new channelListWriter( $config["country"] . "." . $grouptitle, $source);
                        $y->writeFile();
                    }
                }
            }
            elseif ( $sourcetype == "T"){
                if ( $config["validForTerrProviders"] === "all" || ( is_array( $config["validForTerrProviders"] ) && in_array( $source, $config["validForTerrProviders"], true)) ){
                    foreach ($config["groups"] as $grouptitle => $groupsettings){
                        $y = new channelListWriter( $config["country"] . "." . $grouptitle, $source);
                        $y->writeFile();
                    }
                }
            }
        }
    }

    private function writeAllUncategorizedChannels2Disk( $source){
        //also write a complete channels.conf for this source grouped by transponders, containing all existing channels
        $y = new channelListWriter( "uncategorized", $source );
        $y->writeFile();
        unset($y);
    }
}

?>