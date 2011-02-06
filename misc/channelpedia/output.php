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

require_once 'class.config.php';
require_once 'class.dbConnection.php';
require_once 'class.channelIterator.php';
require_once 'class.channelListWriter.php';
require_once 'include.groups.php';

//output

define("CABLE_PROVIDER","Germany_KabelBW");

/*
$y = new channelIterator("", "S19.2E");
while ($y->moveToNextChannel() !== false){
    if ($y->transponderChanged())
        print ": ### ".$y->getCurrentTransponderInfo()." ###\n";
    $channel = $y->getCurrentChannelString();
    print $channel."\n";
}
print "Number of channels processed: " . $y->getCurrentChannelCount() . "\n";
unset($y);
die();
*/



//for all existing sources, write unfiltered channels.conf lists to disc
$y = new channelListWriter("_complete", "S19.2E");
$y->writeFile();
$y = new channelListWriter("_complete", "S28.2E");
$y->writeFile();
$y = new channelListWriter("_complete", "C[".CABLE_PROVIDER."]");
$y->writeFile();
unset($y);

writeAllChannelSelections2Disk("S19.2E", channelGroupingRulesStore::getRules());
writeAllChannelSelections2Disk("C[".CABLE_PROVIDER."]", channelGroupingRulesStore::getRules());

function writeAllChannelSelections2Disk( $source, $groups ){

    foreach ($groups as $label => $details){
        $y = new channelListWriter( $label, $source, $details["orderby"] );
        $y->writeFile();
        unset($y);
    }
}


/*

function createEssentialListsFRA( $source, $x ){

    $x->updateLabelsOfChannelSelection(
        $label = "fra.FTA.TV",
        $source = "S19.2E",
        $caidMode = 1,
        $mediaType = 1,
        $language = "fra",
        $orderby = "UPPER(name) ASC"
    );
    $x->updateLabelsOfChannelSelection(
        $label = "_long.fra.scrambled.TV",
        $source = "S19.2E",
        $caidMode = 2,
        $mediaType = 1,
        $language = "fra",
        $orderby="UPPER(name) ASC",
        $customwhere = ""
    );
}
*/

?>