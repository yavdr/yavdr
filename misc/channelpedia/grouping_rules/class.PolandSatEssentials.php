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

class PolandSatEssentials  extends ruleBase {

    function __construct(){

    }

    function getRules(){
        return array(
            "country" => "pl",
            "lang" => "pol", //this is the language code used in the channels audio description
            "validForSatellites" => array( "S19.2E"),
            "validForCableProviders" => array(),//none
            "validForTerrProviders" => array(),//none
            "groups" => array(

                "DiverseHD" => array(
                    "outputSortPriority" => 1,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeHDTV,
                    "customwhere" =>  ""
                ),

                "Diverse" => array(
                    "outputSortPriority" => 2,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" =>  ""
                ),

                "DiverseHD2" => array(
                    "outputSortPriority" => 3,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeHDTV,
                    "customwhere" =>  ""
                ),

                "Diverse2" => array(
                    "outputSortPriority" => 4,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" =>  ""
                ),


                "Diverse3" => array(
                    "outputSortPriority" => 5,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeRadio,
                    "customwhere" => ""
                ),

                "Diverse4" => array(
                    "outputSortPriority" => 6,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeRadio,
                    "customwhere" => ""
                ),
            )
        );
    }

}

?>