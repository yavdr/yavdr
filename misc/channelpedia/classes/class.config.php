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

define( 'PATH_TO_CLASSES', dirname(__FILE__) ."/");

print "abspath: " . PATH_TO_CLASSES. "\n";

require_once PATH_TO_CLASSES.'../config/config.php';
require_once PATH_TO_CLASSES.'class.dbConnection.php';
require_once PATH_TO_CLASSES.'class.channelGroupingManager.php';
require_once PATH_TO_CLASSES.'class.channelGroupIterator.php';
require_once PATH_TO_CLASSES.'class.channelIterator.php';
require_once PATH_TO_CLASSES.'class.channelFileIterator.php';
require_once PATH_TO_CLASSES.'class.channelImport.php';
require_once PATH_TO_CLASSES.'class.channelListWriter.php';
require_once PATH_TO_CLASSES.'class.rawOutputRenderer.php';
require_once PATH_TO_CLASSES.'class.HTMLOutputRenderer.php';
require_once PATH_TO_CLASSES.'class.epg2vdrMapper.php';

class config {

    private static $instance = null;
    private $pathdynamic = "";

    protected function __construct(){
        /* CUSTOM_PATH can be set in config/config.php
         * to overrule the default path
         */
        if (CUSTOM_PATH == ""){
            $this->pathdynamic = PATH_TO_CLASSES."../";
        }
        else
            $this->pathdynamic = CUSTOM_PATH;
    }

    private function __clone(){}

    public static function getInstance(){
        if ( self::$instance == null){
            self::$instance = new config();
        }
        return self::$instance;
    }

    public function getValue($key){
        $default_lang_de_cable_provider = array("de");

        $value = null;
        if ( $key == "userdata")
            $value = $this->pathdynamic."userdata/";
        elseif ($key == "exportfolder")
            $value = $this->pathdynamic."gen"; // no ending slash!
        elseif ($key == "sat_positions")
            $value = array(
                "S13E" => array(),
                "S19.2E" => array( "de", "at", "ch", "es", "fr", "pl","nl" ),
                "S28.2E" => array( "en" )
            );
        elseif ($key == "cable_providers")
            $value = array(
                "de_KabelBW" => $default_lang_de_cable_provider,
                "de_KabelDeutschland_Speyer" => $default_lang_de_cable_provider,
                "de_KabelDeutschland_Nuernberg" => $default_lang_de_cable_provider,
                "de_Primacom_Halberstadt" => $default_lang_de_cable_provider,
                "de_TeleColumbus_Magdeburg" => $default_lang_de_cable_provider,
                "de_UnityMediaNRW" => $default_lang_de_cable_provider,
                "de_WilhelmTel" => $default_lang_de_cable_provider,
                "at_salzburg-ag" => $default_lang_de_cable_provider
            );
        elseif ($key == "terr_providers"){
            $value = array();
        }
        return $value;
    }

    public function channelArray2ChannelString($channel){
        $provider = "";
        if ($channel["provider"] != "")
            $provider = ";". $channel["provider"];

        //remove meta provider info from cable ot terrestrial source string
        $source = $channel["source"];
        $sourcetest = strtoupper( substr($channel["source"],0,1));
        if ($sourcetest == "C" || $sourcetest == "T")
            $source = $sourcetest;

        return
            $channel["name"] .
            $provider . ":".
            $channel["frequency"] . ":".
            $channel["modulation"] . ":".
            $source . ":".
            $channel["symbolrate"] . ":".
            $channel["vpid"] . ":".
            $channel["apid"] . ":".
            $channel["tpid"] . ":".
            $channel["caid"] . ":".
            $channel["sid"] . ":".
            $channel["nid"] . ":".
            $channel["tid"] . ":".
            $channel["rid"];
    }

    public function convertChannelString2Array( $string ){
        $result = false;
        $details = explode( ":", $string);
        if (count($details) == 13){
            $cname = $details[0];
            $cprovider = "";
            $cnamedetails = explode( ";", $cname);
            if (count($cnamedetails) == 2){
                $cname = $cnamedetails[0];
                $cprovider = $cnamedetails[1];
            }
            $result = array(
                "name"            => $cname,
                "provider"        => $cprovider,
                "frequency"       => $details[1],
                "modulation"      => strtoupper($details[2]), //w_scan has lower case, we don't want that
                "source"          => $details[3],
                "symbolrate"      => $details[4],
                "vpid"            => $details[5],
                "apid"            => $details[6],
                "tpid"            => $details[7],
                "caid"            => $details[8],
                "sid"             => $details[9],
                "nid"             => $details[10],
                "tid"             => $details[11],
                "rid"             => $details[12]
            );
        }
        return $result;
    }
}
?>