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

class GermanySatNonEssentials {

    function __construct(){

    }

    function getRules(){
        return array (
            "country" => "de",
            "lang" => "deu", //this is the language code used in the channels audio description
            "validForSatellites" => array( "S19.2E"),
            "validForCableProviders" => array(),//none
            "validForTerrProviders" => array(),//none
            "groups" => array(

                "14.FTA.SDTV.Private3" => array(
                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" =>
                        " AND NOT ". FILTER_ASTRA1_FTA . " AND NOT (". HD_CHANNEL . " OR ".DE_PUBLIC_PROVIDER. " OR ".DE_PRIVATE_PRO7_RTL." OR ".AUSTRIA." OR ".SWITZERLAND.") "
                ),

                "11.scrambled.SDTV.Private" => array(
                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => "AND ".DE_PRIVATE_PRO7_RTL . "AND NOT (" . HD_CHANNEL . " OR ".AUSTRIA." OR ".SWITZERLAND.")"
                ),

            )
        );
    }

}

?>