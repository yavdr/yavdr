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


        //FIXME: don't limit this to hepi's own channel sources!!!
        define("CABLE_PROVIDER","Germany_KabelBW");

        //for all existing sources, write unfiltered channels.conf lists to disc
        $y = new channelListWriter("_complete", "S19.2E");
        $y->writeFile();
        $y = new channelListWriter("_complete", "S28.2E");
        $y->writeFile();
        $y = new channelListWriter("_complete", "C[".CABLE_PROVIDER."]");
        $y->writeFile();
        $y = new channelListWriter("_complete", "C[Germany_wilhelmTel]");
        $y->writeFile();
        $y = new channelListWriter("_complete", "C[Germany_kabelDeutschland]");
        $y->writeFile();

        unset($y);

        //selections
        $this->writeAllChannelSelections2Disk("S19.2E");
        $this->writeAllChannelSelections2Disk("S28.2E");
        $this->writeAllChannelSelections2Disk("C[".CABLE_PROVIDER."]");
        $this->writeAllChannelSelections2Disk("C[Germany_wilhelmTel]");
        $this->writeAllChannelSelections2Disk("C[Germany_kabelDeutschland]");
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