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

class SwitzerlandSatEssentials {

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

                "01.FTA.SDTV.Private" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" =>  " AND ". FILTER_ASTRA1_FTA . "AND NOT ". HD_CHANNEL . "AND ". SWITZERLAND. "AND ". DE_PRIVATE_PRO7_RTL
                ),
                "02.FTA.SDTV.diverse" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" =>  "AND NOT ". HD_CHANNEL
                ),

                "03.FTA.HDTV.diverse" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" =>  "AND ". HD_CHANNEL
                ),

/*only causes problems...
                "04.scrambled.SDTV.diverse" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" =>  "AND NOT ". HD_CHANNEL . " AND NOT ". FRANCE_CSAT
                ),
*/
                "05.scrambled.HDTV.diverse" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" =>  "AND ". HD_CHANNEL . " AND NOT ". FRANCE_CSAT
                ),
/* FIXME: radio channels with language deu are already grabbed by the de list...

                "06.FTA.radio" => array(

                    "caidMode" => 1,
                    "mediaType" => 2,
                ),

                "07.scrambled.radio" => array(

                    "caidMode" => 2,
                    "mediaType" => 2,
                ),
*/
            )
        );
    }

}

?>