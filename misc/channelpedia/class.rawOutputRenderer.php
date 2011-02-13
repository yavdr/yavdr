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

        //for all existing sources, write unfiltered channels.conf lists to disc
        foreach ($this->config->getValue("sat_positions") as $sat){
            $y = new channelListWriter("_complete", $sat);
            $y->writeFile();
        }
        foreach ($this->config->getValue("cable_providers") as $cablep){
            $y = new channelListWriter("_complete", "C[$cablep]");
            $y->writeFile();
        }
        foreach ($this->config->getValue("terr_providers") as $terrp){
            $y = new channelListWriter("_complete", "T[$terrp]");
            $y->writeFile();
        }
        unset($y);

        //selections
        foreach ($this->config->getValue("sat_positions") as $sat){
            $this->writeAllChannelSelections2Disk( $sat );
        }
        foreach ($this->config->getValue("cable_providers") as $cablep){
            $this->writeAllChannelSelections2Disk( "C[$cablep]" );
        }
        foreach ($this->config->getValue("terr_providers") as $terrp){
            $this->writeAllChannelSelections2Disk( "T[$terrp]" );
        }
    }

    private function writeAllChannelSelections2Disk( $source){
        foreach ( channelGroupingRulesStore::getRules() as $label => $details){
            $y = new channelListWriter( $label, $source, $details["orderby"] );
            $y->writeFile();
        }
        $y = new channelListWriter( "", $source );
        $y->writeFile();
        unset($y);
    }
}

?>