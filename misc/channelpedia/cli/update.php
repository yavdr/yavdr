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

//input: reads channel.conf from path and put channels into db
require_once '../classes/class.config.php';

//set this to true to reparse all old channels.conf.old files of all users
$forceReparsing = false;


//if ( array_key_exists('SERVER_SOFTWARE',$_SERVER)) print "<pre>";

importFromAllChannelSources( $forceReparsing );

//if ( array_key_exists('SERVER_SOFTWARE',$_SERVER)) print "</pre>";

function importFromAllChannelSources($forceReparsing = false){
    $config = config::getInstance();
    $dir = new DirectoryIterator( $config->getValue("userdata")."sources/" );
    foreach ($dir as $fileinfo) {
        if ( $fileinfo->isDir() && !$fileinfo->isDot()){
            $metaData = new channelImportMetaData( $fileinfo->getFilename() );
            if ( $metaData->userNameExists()){
                $importer = new channelImport( $metaData, $forceReparsing );
                $importer->addToUpdateLog( "-", "Manually forced update: Checking for presence of unprocessed channels.conf to analyze.");
                $importer->insertChannelsConfIntoDB();
                //print "user account for folder " . $fileinfo->getFilename() . " does exist in global_user_data!\n";
            }
            else
                print "user account for folder " . $fileinfo->getFilename() . " does not exist in global_user_data!\n";
        }
    }
    $labeller = channelGroupingManager::getInstance();
    $labeller->updateAllLabels();

    $x = new rawOutputRenderer();
    $x->writeRawOutputForAllSources();

    $x = new HTMLOutputRenderer();
    $x->renderAllHTMLPages();
}
?>