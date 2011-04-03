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

class GermanyTeleColumbus  extends ruleBase{

    function __construct(){

    }

    function getRules(){
        return array (

            "country" => "de",
            "lang" => "deu", //this is the language code used in the channels audio description
            "validForSatellites" => array(),
            "validForCableProviders" => array("C[de_TeleColumbus_Magdeburg]"),
            "validForTerrProviders" => array(),//none
            "groups" => array(

                array(
                    "title" => "Basis1",
                    "outputSortPriority" => 4,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeHDTV,
                    "customwhere" => "AND UPPER(provider) = 'BASIS 1'"
                ),

                array(
                    "title" => "Basis1",
                    "outputSortPriority" => 5,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" => "AND UPPER(provider) = 'BASIS 1'"
                ),

                array(
                    "title" => "KabelKiosk",
                    "outputSortPriority" => 6,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeHDTV,
                    "customwhere" => "AND UPPER(provider) = 'KABELKIOSK'"
                ),

                array(
                    "title" => "KabelKiosk",
                    "outputSortPriority" => 7,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" => "AND UPPER(provider) = 'KABELKIOSK'"
                ),
            )
        );
    }

}

?>