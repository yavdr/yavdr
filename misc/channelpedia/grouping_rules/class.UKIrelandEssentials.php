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

define("UK_ITV","(upper(name) LIKE '%ITV%' OR upper(name) LIKE 'STV%' OR upper(name) LIKE 'UTV%' )");
define("UK_C4","(upper(name) LIKE 'CHANNEL 4%' OR upper(name) LIKE 'CHANNEL 5%' OR  upper(name) LIKE 'MORE4%' OR upper(name) LIKE 'FILM4%' OR upper(name) LIKE 'E4%' OR upper(name) LIKE 'S4C%') AND provider = 'BSkyB' ");

class UKIrelandEssentials  extends ruleBase {

    function __construct(){

    }

    function getRules(){
        return array (
            "country" => "en",
            "lang" => "eng", //this is the language code used in the channels audio description
            "validForSatellites" => array( "S28.2E"),
            "validForCableProviders" => array(),
            "validForTerrProviders" => array(),
            "groups" => array(

                "BBC freesat" => array(
                    "outputSortPriority" => 1,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeHDTV,
                    "customwhere" => " AND upper(name) LIKE '%BBC%'"
                ),

                "BBC2 freesat" => array(
                    "outputSortPriority" => 2,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" => " AND (upper(name) LIKE '%BBC%' OR upper(name) = 'CBEEBIES')"
                ),

                "ITV freesat " => array(
                    "outputSortPriority" => 3,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeHDTV,
                    "customwhere" => " AND ".UK_ITV
                ),

                "ITV" => array(
                    "outputSortPriority" => 4,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeHDTV,
                    "customwhere" => " AND ".UK_ITV
                ),

                "ITV freesat 2" => array(
                    "outputSortPriority" => 5,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" => " AND ".UK_ITV
                ),

                "ITV_" => array(
                    "outputSortPriority" => 6,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" => " AND ".UK_ITV
                ),

                "Channel4Family freesat" => array(
                    "outputSortPriority" => 10,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeHDTV,
                    "languageOverrule" => "", //only because of brand new c4 hd fta (march 2011) with missing lang stuff
                    "customwhere" => " AND ".UK_C4
                ),

                "Channel4Family" => array(
                    "outputSortPriority" => 11,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeHDTV,
                    "customwhere" => " AND ".UK_C4
                ),

                "Channel4Family freesat 2" => array(
                    "outputSortPriority" => 12,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" => " AND ".UK_C4
                ),

                "Channel4Family 2" => array(
                    "outputSortPriority" => 13,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" => " AND  ".UK_C4
                ),

                "Irish" => array(
                    "outputSortPriority" => 20,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" => " AND (UPPER(name) LIKE 'RTE%' OR UPPER(name) LIKE 'TV3' OR UPPER(name) LIKE 'TG4' OR UPPER(name) LIKE 'SETANTA%')"
                ),

                "Rest" => array(
                    "outputSortPriority" => 30,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeHDTV,
                    "customwhere" => ""
                ),

                "freesat" => array(
                    "outputSortPriority" => 31,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" => " AND (
                        UPPER(name) LIKE 'CBS %' OR
                        UPPER(name) LIKE 'ZONE %' OR
                        UPPER(name) LIKE 'TRUE %' OR
                        UPPER(name) LIKE 'MOVIES4MEN%' OR
                        UPPER(name) LIKE 'MOV4MEN%' OR
                        UPPER(name) LIKE 'MEN&MOVIES%' OR
                        UPPER(name) LIKE 'FOOD NETWORK%' OR
                        UPPER(name) LIKE 'HORROR%' OR
                        UPPER(name) LIKE 'WEDDING TV%'
                    )"
                ),

                "Rest2" => array(
                    "outputSortPriority" => 32,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" => ""
                ),

                "sky_uk etc" => array(
                    "outputSortPriority" => 33,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeHDTV,
                    "customwhere" => ""
                ),

                "sky_uk etc 2" => array(
                    "outputSortPriority" => 34,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" => ""
                ),

                "BBC__" => array(
                    "outputSortPriority" => 40,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeRadio,
                    "customwhere" => " AND upper(name) LIKE '%BBC%' "
                ),

                "Irish_RTE" => array(
                    "outputSortPriority" => 41,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeRadio,
                    "customwhere" => " AND upper(name) LIKE 'RTE %' "
                ),

                "Rest____" => array(
                    "outputSortPriority" => 42,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeRadio,
                    "customwhere" => ""
                ),

                "Rest__________" => array(
                    "outputSortPriority" => 43,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeRadio,
                    "customwhere" => ""
                ),
            )
        );
    }

}

?>