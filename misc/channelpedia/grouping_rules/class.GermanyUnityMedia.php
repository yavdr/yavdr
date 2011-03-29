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

class GermanyUnityMedia {

    function __construct(){

    }

    function getRules(){
        return array (

            "country" => "de",
            "lang" => "deu", //this is the language code used in the channels audio description
            "validForSatellites" => array(),
            "validForCableProviders" => array("C[de_UnityMediaNRW]"),
            "validForTerrProviders" => array(),//none
            "groups" => array(

                "04.UnityDigitalTV_Private.SDTV.scrambled" => array(
                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => "AND provider = 'UnityDigitalTV' AND NOT " . HD_CHANNEL
                ),
                "05.Kino_auf_Abruf.SDTV" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => "AND provider = 'Kino auf Abruf'"
                ),
                "31.Radio.SDTV.UnityDigital" => array(

                    "caidMode" => 2,
                    "mediaType" => 2,
                    "languageOverrule" => "",
                    "customwhere" => "AND provider = 'UnityDigital TV - Music Choice'"
                ),
            )
        );
    }

}

?>