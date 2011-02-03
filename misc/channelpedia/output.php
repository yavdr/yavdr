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

require_once 'class.cpbasics.php';
require_once 'class.cpoutput.php';
require_once 'include.groups.php';

//output
$x = new cpOutput("/home/hp/Desktop/channels/");

define("CABLE_PROVIDER","C[Germany_KabelBW]");

//this filters channels that don't fit into some standard categories

createEssentialListsDE("S19.2E", $x, $groups);
createEssentialListsDE(CABLE_PROVIDER, $x, $groups);

$x->writeChannelSectionByLabel( "", "S28.2E");


function createEssentialListsDE( $source, $x, $groups ){

    foreach ($groups as $label => $details){
        $x->updateLabelsOfChannelSelection(
            $label,
            $source,
            $caidMode    = $details["caidMode"],
            $mediaType   = $details["mediaType"],
            $language    = $details["language"],
            $customwhere = $details["customwhere"]
        );
        $x->writeChannelSectionByLabel( $label, $source, $details["orderby"]);
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