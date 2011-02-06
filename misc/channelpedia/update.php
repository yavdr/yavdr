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
require_once 'class.config.php';
require_once 'class.dbConnection.php';
require_once 'class.channelImport.php';
require_once 'class.HTMLOutputRenderer.php';

importFromAllChannelSources();
$x =new HTMLOutputRenderer();

function importFromAllChannelSources(){
    $config = config::getInstance();
    $dir = new DirectoryIterator( $config->getValue("path")."sources/" );
    $x = new channelImport();
    foreach ($dir as $fileinfo) {
        if ( $fileinfo->isDir() && !$fileinfo->isDot()){
            //echo $fileinfo->getFilename() . "\n";
            $cableProvider = "";
            $infofile = $config->getValue("path")."sources/". $fileinfo->getFilename() ."/info.txt";
            if (file_exists( $infofile )){
                $info = file_get_contents( $infofile);
                $cableProvider = $info; //FIXME
            }
            //print $info ."/". $infofile ."/".  $cableProvider."\n";
            $x->importChannelsConfFile( $fileinfo->getFilename(), $cableProvider, "none" );
        }
    }
    $x->updateAllLabels();
    unset($x);
}
?>