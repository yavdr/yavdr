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

class FranceSatEssentials {

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

                "01.FTA.SDTV.diverse" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" =>  "AND NOT ". HD_CHANNEL
                ),

                "02.FTA.HDTV.diverse" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" =>  "AND ". HD_CHANNEL
                ),

                "03.scrambled.SDTV.diverse" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" =>  "AND NOT ". HD_CHANNEL
                ),

                "04.scrambled.HDTV.diverse" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" =>  "AND ". HD_CHANNEL
                ),

                "05.FTA.SDTV.more_CSAT" => array(

                    "caidMode" => 0,
                    "mediaType" => 1,
                    "languageOverrule" => "", //for CSAT
                    "customwhere" =>  "AND NOT ". HD_CHANNEL . " AND ". FRANCE_CSAT
                ),

                "06.scrambled.SDTV.more_CSAT" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "languageOverrule" => "", //for CSAT
                	"customwhere" =>  "AND NOT ". HD_CHANNEL . " AND ". FRANCE_CSAT
                ),


                "20.FTA.radio" => array(

                    "caidMode" => 1,
                    "mediaType" => 2,
                    "customwhere" => ""
                ),

                "21.scrambled.radio" => array(

                    "caidMode" => 2,
                    "mediaType" => 2,
                    "customwhere" => ""
                ),

                "22.CSAT.radio" => array(

                    "caidMode" => 1,
                    "mediaType" => 2,
                    "languageOverrule" => "", //for CSAT
                    "customwhere" => " AND ". FRANCE_CSAT
                ),

            )
        );
    }

}

?>