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

ini_set("display_errors", E_ALL);

require_once 'class.config.php';
require_once 'class.dbConnection.php';
require_once 'class.channelImport.php';
require_once 'class.rawOutputRenderer.php';
require_once 'class.HTMLOutputRenderer.php';

$config = config::getInstance();

if ( !array_key_exists('SERVER_SOFTWARE',$_SERVER))
    die ("Script can't be called from cli environment.\n");

//FIXME: Add security checks!!!!

$user = $_POST["user"];
//prevent directory traversal
if ( $user == "" || strstr($user,".") || strstr($user,"/") )
    die("illegal user value");

$checkpatch = $config->getValue("path"). "sources/$user/";

if (is_file( $checkpatch."info.txt" ) && $_FILES["channels"]["name"] == "channels.conf"){
    print move_uploaded_file($_FILES["channels"]["tmp_name"], $checkpatch."channels.conf" );
    print "upload successful.\n";
    //quick'n'dirty approach
    //now trigger the import of the newly uploaded channels.conf file
    $cableProvider = "";
    $infofile = $checkpatch."info.txt";
    if (file_exists( $infofile )){
        $info = file_get_contents( $infofile);
        $cableProvider = $info; //FIXME
    }
    //print $info ."/". $infofile ."/".  $cableProvider."\n";
    $x = new channelImport();
    $x-> importChannelsConfFile($checkpatch, $cableProvider, "none");
    $x->updateAllLabels();
    $x =new rawOutputRenderer();
    $x =new HTMLOutputRenderer();
    unset($x);
}
else
    print "Error: Folder not found.\n";
?>
