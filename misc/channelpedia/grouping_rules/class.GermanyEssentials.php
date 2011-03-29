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

class GermanyEssentials {

    function __construct(){

    }

    function getRules(){
        return array (
            "country" => "de",
            "lang" => "deu", //this is the language code used in the channels audio description
            "validForSatellites" => array( "S19.2E"),
            "validForCableProviders" => "all",
            "validForTerrProviders" => "all",
            "groups" => array(

                "01.FTA.HDTV.Public" => array(
                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => " AND " . HD_CHANNEL. " AND ".DE_PUBLIC_PROVIDER
                ),

                "02.FTA.SDTV.Public" => array(
                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" =>
                        " AND NOT ".HD_CHANNEL.
                        "AND ( ".
                        "(provider = 'ARD' AND ( UPPER(name) LIKE '%ERSTE%' OR UPPER(name) LIKE '%EINS%' OR UPPER(name) LIKE '%ARTE%' OR UPPER(name) LIKE '%PHOENIX%' )) ".
                        " OR provider = 'ZDFvision' OR provider = 'ZDF vision'".
                        ") "
                ),

                "03.FTA.SDTV.Public_Regional" => array(
                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" =>
                        " AND NOT ".HD_CHANNEL.
                        " AND provider = 'ARD' AND NOT ( UPPER(name) LIKE '%ERSTE%' OR UPPER(name) LIKE '%EINS%' OR UPPER(name) LIKE '%ARTE%' OR UPPER(name) LIKE '%PHOENIX%' OR UPPER(name) LIKE '%TEST%') "
                ),

                "10.FTA.HDTV.Private" => array(
                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => "AND ". HD_CHANNEL. " AND NOT (" . DE_PUBLIC_PROVIDER . " OR ".AUSTRIA." " . " OR ".SWITZERLAND.")"
                ),

                "11.scrambled.HD+.HDTV.Private" => array(
                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => " AND (UPPER(provider) = 'BETADIGITAL' OR UPPER(provider) = 'CBC' OR UPPER(provider) = 'PROSIEBENSAT.1' ) AND " . HD_CHANNEL
                ),

                "12.FTA.SDTV.Private" => array(
                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => "AND ".DE_PRIVATE_PRO7_RTL . "AND NOT (" . HD_CHANNEL . " OR ".AUSTRIA." OR ".SWITZERLAND.")"
                ),

                //provider undefined only wilhelm.tel --> sky
                "13.FTA.SDTV.Private2" => array(
                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" =>
                        " AND ". FILTER_ASTRA1_FTA . " AND NOT (". HD_CHANNEL . " OR ".DE_PUBLIC_PROVIDER. " OR ".DE_PRIVATE_PRO7_RTL." OR ".AUSTRIA." OR ".SWITZERLAND." OR UPPER(provider) = 'UNDEFINED') AND NOT name = '.'"
                ),

                "20.SKY.HDTV.scrambled" => array(
                    "caidMode" => 2,
                    "mediaType" => 1,
                    "languageOverrule" => "", //ESPN America HD is in English!
                    "customwhere" => " AND (UPPER(provider) = 'SKY') AND name != '.' AND " . HD_CHANNEL
                    //OR provider = '' OR UPPER(provider) = 'UNDEFINED'
                ),

                //provider undefined only wilhelm.tel --> sky
                "21.SKY.SDTV.scrambled" => array(
                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => " AND name NOT LIKE '% - %' AND name != 'Spieldaten' AND (UPPER(provider) = 'SKY' OR provider = '' OR provider = 'undefined') AND name != '.' AND NOT " . HD_CHANNEL
                ),

                //provider undefined only wilhelm.tel --> sky
                "22.SKY.SDTV2.scrambled" => array(
                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => " AND (name LIKE '% - %' OR name = 'Spieldaten' OR name = '.') AND (UPPER(provider) = 'SKY' OR provider = '' OR provider = 'undefined') AND NOT " . HD_CHANNEL
                ),

                "23.SKY.HDTV.FTA" => array(
                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => " AND (UPPER(provider) = 'SKY' OR provider = '' OR provider = 'undefined') AND " . HD_CHANNEL
                ),

                "24.SKY.SDTV.FTA" => array(
                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => " AND (UPPER(provider) = 'SKY' OR provider = '' OR provider = 'undefined') AND NOT " . HD_CHANNEL
                ),

                "25.MTVNetworksEurope.HDTV.FTA" => array(
                    "caidMode" => 1,
                    "mediaType" => 1,
                    "languageOverrule" => "",
                    "customwhere" => " AND UPPER(provider) = 'MTV NETWORKS EUROPE' AND " . HD_CHANNEL
                ),

                "26.MTVNetworksEurope.SDTV.FTA" => array(
                    "caidMode" => 1,
                    "mediaType" => 1,
                    "languageOverrule" => "",
                	"customwhere" => " AND UPPER(provider) = 'MTV NETWORKS EUROPE' AND NOT " . HD_CHANNEL
                ),

                "27.MTVNetworksEurope.HDTV.scrambled" => array(
                    "caidMode" => 2,
                    "mediaType" => 1,
                    "languageOverrule" => "",
                    "customwhere" => " AND UPPER(provider) = 'MTV NETWORKS EUROPE' AND " . HD_CHANNEL
                ),

                "28.MTVNetworksEurope.SDTV.scrambled" => array(
                    "caidMode" => 2,
                    "mediaType" => 1,
                    "languageOverrule" => "",
                    "customwhere" => " AND UPPER(provider) = 'MTV NETWORKS EUROPE' AND NOT " . HD_CHANNEL
                ),

                "30.FTA.Radio.ARD_ZDF" => array(
                    "caidMode" => 1,
                    "mediaType" => 2,
                    "customwhere" => " AND ".DE_PUBLIC_PROVIDER
                ),

                "31.FTA.Radio.Private" => array(
                    "caidMode" => 1,
                    "mediaType" => 2,
                    "customwhere" => " AND NOT provider = 'ORF' AND NOT  ".DE_PUBLIC_PROVIDER . "AND NOT " . AUSTRIA
                ),
                //provider undefined only wilhelm.tel --> sky
                "32.SKY.Radio" => array(
                    "caidMode" => 2,
                    "mediaType" => 2,
                    "customwhere" => " AND (UPPER(provider) LIKE 'SKY' OR provider = '' OR provider = 'undefined')"
                ),
            )
        );//end of Germany Essentials

    }

}

?>