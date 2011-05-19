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

define( 'PATH_TO_CLASSES', dirname(__FILE__) ."/");

require_once PATH_TO_CLASSES.'../config/config.php';
require_once PATH_TO_CLASSES.'class.channel.php';
require_once PATH_TO_CLASSES.'class.storableChannel.php';
require_once PATH_TO_CLASSES.'class.channelImportMetaData.php';
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
    private
        $pathdynamic = "",
        $sourcelist;

    protected function __construct(){
        /* CUSTOM_PATH can be set in config/config.php
         * to overrule the default path
         */
        if (CUSTOM_PATH == ""){
            $this->pathdynamic = PATH_TO_CLASSES."../";
        }
        else
            $this->pathdynamic = CUSTOM_PATH;

        $debuglogfile = $this->getValue("exportfolder")."/raw/debuglog.txt";
        //@unlink($debuglogfile);
        $this->debuglog = fopen( $debuglogfile, "w");
        $this->addToDebugLog("---------------------------------- begin of session ".date("D M j G:i:s T Y")." -------------------------------------------\n");

        $default_lang_de_cable_provider = array("de");

        $this->sourcelist = array(
            "DVB-S" => array(
                "S13E" => array(),
                "S19.2E" => array( "de", "at", "ch", "es", "fr", "pl","nl" ),
                "S28.2E" => array( "en" )
            ),
            "DVB-C" => array(
                "de_KabelBW" => $default_lang_de_cable_provider,
                "de_KabelDeutschland_Speyer" => $default_lang_de_cable_provider,
                "de_KabelDeutschland_Nuernberg" => $default_lang_de_cable_provider,
                "de_Primacom_Halberstadt" => $default_lang_de_cable_provider,
                "de_TeleColumbus_Magdeburg" => $default_lang_de_cable_provider,
                "de_UnityMediaNRW" => $default_lang_de_cable_provider,
                "de_WilhelmTel" => $default_lang_de_cable_provider,
                "at_salzburg-ag" => $default_lang_de_cable_provider
            ),
            "DVB-T" => array(
                "de_Heidelberg" => array() //$default_lang_de_cable_provider
            )
        );
    }

    function __destruct(){
        $this->addMemoryPeakUsageToDebugLog();
        $this->addToDebugLog("---------------------------------- end of session ".date("D M j G:i:s T Y")." -------------------------------------------\n");
        fclose( $this->debuglog );
    }

    private function __clone(){}

    public static function getInstance(){
        if ( self::$instance == null){
            self::$instance = new config();
        }
        return self::$instance;
    }

    public function addToDebugLog( $line ){
        fputs( $this->debuglog, $line);
        //print "$line";
    }

    private function addMemoryPeakUsageToDebugLog(){
        $memorypeak1 = intval(memory_get_peak_usage ( true ) / 1024);
        $memorypeak2 = intval(memory_get_peak_usage ( false ) / 1024);
        $this->addToDebugLog( "Memory usage: real: $memorypeak1 KB, emalloc: $memorypeak2 KB\n" );
    }

    public function getLanguageGroupsOfSource( $type, $source){
        $groups = false;
        foreach ($this->sourcelist[$type] as $sourcename => $languages){
            if ( $sourcename == $source){
                $groups = $languages;
                break;
            }
        }
        return $groups;
    }

    public function getSourceList(){
        return $this->sourcelist;
    }

    public function getValue($key){

        $value = null;
        if ( $key == "userdata")
            $value = $this->pathdynamic."userdata/";
        elseif ($key == "exportfolder")
            $value = $this->pathdynamic."gen"; // no ending slash!
        elseif ($key == "sat_positions")
            $value = $this->sourcelist["DVB-S"];
        elseif ($key == "cable_providers")
            $value = $this->sourcelist["DVB-C"];
        elseif ($key == "terr_providers"){
            $value = $this->sourcelist["DVB-T"];
        }
        return $value;
    }
}
?>