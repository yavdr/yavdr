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

    public function writeRawOutput(){
        //for all existing sources, write unfiltered channels.conf lists to disc
        foreach ($this->config->getValue("sat_positions") as $sat => $languages){
            $y = new channelListWriter("_complete", $sat);
            $y->writeFile();
        }
        foreach ($this->config->getValue("cable_providers") as $cablep => $languages){
            $y = new channelListWriter("_complete", "C[$cablep]");
            $y->writeFile();
        }
        foreach ($this->config->getValue("terr_providers") as $terrp => $languages){
            $y = new channelListWriter("_complete", "T[$terrp]");
            $y->writeFile();
        }
        unset($y);
        $epgstuff = epg2vdrMapper::getInstance();
        //selections
        foreach ($this->config->getValue("sat_positions") as $sat => $languages){
            //$this->writeAllChannelSelections2Disk( $sat );
            $this->writeAllUncategorizedChannels2Disk( $sat );
            if (in_array("de", $languages)){
                $epgstuff->writeEPGChannelmap( $sat, $sat, "tvm");
                $epgstuff->writeEPGChannelmap( $sat, $sat, "epgdata");
            }

        }
        foreach ($this->config->getValue("cable_providers") as $cablep => $languages){
            //$this->writeAllChannelSelections2Disk( "C[$cablep]" );
            $this->writeAllUncategorizedChannels2Disk( "C[$cablep]" );
            if (in_array("de", $languages)){
                $epgstuff->writeEPGChannelmap( "C", "C[$cablep]", "tvm");
                $epgstuff->writeEPGChannelmap( "C", "C[$cablep]", "epgdata");
            }
        }
        foreach ($this->config->getValue("terr_providers") as $terrp => $languages){
            //$this->writeAllChannelSelections2Disk( "T[$terrp]" );
            $this->writeAllUncategorizedChannels2Disk( "T[$terrp]" );
            if (in_array("de", $languages)){
                $epgstuff->writeEPGChannelmap( "T", "T[$terrp]", "tvm");
                $epgstuff->writeEPGChannelmap( "T", "T[$terrp]", "epgdata");
            }
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