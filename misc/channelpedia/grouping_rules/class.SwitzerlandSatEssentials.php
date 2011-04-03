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

class SwitzerlandSatEssentials extends ruleBase {

    function __construct(){

    }

    function getRules(){
        return array(
            "country" => "ch",
            "lang" => "deu", //this is the language code used in the channels audio description
            "validForSatellites" => array( "S19.2E"),
            "validForCableProviders" => array(),//none
            "validForTerrProviders" => array(),//none
            "groups" => array(

                array(
                    "title" => "Private",
                    "outputSortPriority" => 1,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" =>  " AND ". FILTER_ASTRA1_FTA . "AND ". SWITZERLAND. "AND ". DE_PRIVATE_PRO7_RTL
                ),

                array(
                    "title" => "Diverse",
                    "outputSortPriority" => 2,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeHDTV,
                    "customwhere" =>  ""
                ),

                array(
                    "title" => "Diverse",
                    "outputSortPriority" => 3,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeSDTV,
                    "customwhere" =>  ""
                ),


/*only causes problems...
                "scrambled.SDTV.diverse" => array(
                    "title" => ,
                    "outputSortPriority" => 4,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeTV,
                    "customwhere" =>  "AND NOT ". HD_CHANNEL . " AND NOT ". FRANCE_CSAT
                ),
*/
                array(
                    "title" => "Diverse",
                    "outputSortPriority" => 5,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeHDTV,
                    "customwhere" =>  "AND NOT ". FRANCE_CSAT
                ),
/* FIXME: radio channels with language deu are already grabbed by the de list...

                "FTA.radio" => array(
                    "title" => ,
                    "outputSortPriority" => 6,
                    "caidMode" => self::caidModeFTA,
                    "mediaType" => self::mediaTypeRadio,
                ),

                "scrambled.radio" => array(
                    "title" => ,
                    "outputSortPriority" => 7,
                    "caidMode" => self::caidModeScrambled,
                    "mediaType" => self::mediaTypeRadio,
                ),
*/
            )
        );
    }

}

?>