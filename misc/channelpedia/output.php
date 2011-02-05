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

require_once 'config.php';
require_once 'class.cpbasics.php';
require_once 'class.cpoutput.php';
require_once 'include.groups.php';

//output
$x = new cpOutput( PATH, EXPORTFOLDER );

define("CABLE_PROVIDER","Germany_KabelBW");

//this filters channels that don't fit into some standard categories

createEssentialListsDE("S19.2E", $x, $groups);
createEssentialListsDE("C[".CABLE_PROVIDER."]", $x, $groups);

//write complete channels conf
$x->writeChannelSectionByLabel( "", "S19.2E");
$x->writeChannelSectionByLabel( "", "S28.2E");
$x->writeChannelSectionByLabel( "", "C[".CABLE_PROVIDER."]");

foreach ($groups as $label){

}

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


$x->writeChangelog();


$nice_html_output = '
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html
     PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Nice channel lists</title>
		<style>
			body { font-family: Arial, sans-serif; font-size: 0.8em; background-color: #dddddd;}
			pre { border: 1px solid black; padding: 5px; background-color: white; overflow: auto;}
		</style>
	</head>
	<body>
';

$dir = new DirectoryIterator( PATH.EXPORTFOLDER );
foreach ($dir as $fileinfo) {
    if ( $fileinfo->isFile() && substr($fileinfo->getFilename(),0, 18) == "channels.S19.2E.de"){// && !$fileinfo->isDot()){
        //echo $fileinfo->getFilename() . "\n";
        $infofile = PATH.EXPORTFOLDER."/". $fileinfo->getFilename();
        if (file_exists( $infofile )){
            $nice_html_output .= "<pre>". file_get_contents( $infofile ) ."</pre>\n";
        }
    }
}
$nice_html_output .= "
	</body>
<html>
";


file_put_contents(PATH."nice_channels.html", $nice_html_output );


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