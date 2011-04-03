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

class FranceSatEssentials  extends ruleBase{

    function __construct(){

    }

    function getRules(){
        return array(
            "country" => "fr",
            "lang" => "fra", //this is the language code used in the channels audio description
            "validForSatellites" => array( "S19.2E"),
            "validForCableProviders" => array(),//none
            "validForTerrProviders" => array(),//none
            "groups" => array(

                "Diverse" => array(
                    "outputSortPriority" => 1,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" =>  ""
                ),

                "Diverse2" => array(
                    "outputSortPriority" => 2,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeHDTV,
                    "customwhere" =>  ""
                ),

                "Diverse3" => array(
                    "outputSortPriority" => 3,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" =>  ""
                ),

                "Diverse4" => array(
                    "outputSortPriority" => 4,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeHDTV,
                    "customwhere" =>  ""
                ),

                "More_CSAT" => array(
                    "outputSortPriority" => 5,
                    "caidMode" => 0,
                    "mediaType" => self::mediaTypeHDTV,
                    "languageOverrule" => "", //for CSAT
                    "customwhere" => " AND ". FRANCE_CSAT
                ),

                "More_CSAT2" => array(
                    "outputSortPriority" => 6,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeSDTV,
                    "languageOverrule" => "", //for CSAT
                	"customwhere" =>  " AND ". FRANCE_CSAT
                ),

                "Diverse5" => array(
                    "outputSortPriority" => 20,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeRadio,
                    "customwhere" => ""
                ),

                "Diverse6" => array(
                    "outputSortPriority" => 21,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeRadio,
                    "customwhere" => ""
                ),

                "CSAT" => array(
                    "outputSortPriority" => 22,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeRadio,
                    "languageOverrule" => "", //for CSAT
                    "customwhere" => "AND ". FRANCE_CSAT
                ),
            )
        );
    }

}

?>