<?php


class AustriaSatEssentials {

    function __construct(){

    }

    function getRules(){
        return array(
            "country" => "at",
            "lang" => "deu", //this is the language code used in the channels audio description
            "validForSatellites" => array( "S19.2E"),
            "validForCableProviders" => array(),//none
            "validForTerrProviders" => array(),//none
            "groups" => array(

                "01.scrambled.HDTV.ORF" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => " AND " . HD_CHANNEL. "AND UPPER(provider) = 'ORF'"
                ),

                "02.scrambled.SDTV.ORF" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => " AND NOT " . HD_CHANNEL . "AND UPPER(provider) = 'ORF'"
                ),

                "03.FTA.SDTV.Private" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "languageOverrule" => "", // needed for RTL2
                    "customwhere" => "AND NOT ". HD_CHANNEL. "AND ". AUSTRIA. "AND (". DE_PRIVATE_PRO7_RTL . " OR UPPER(provider) LIKE '%AUSTRIA%')"
                ),

                "04.FTA.SDTV.ServusTV" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => " AND UPPER(provider) = 'SERVUSTV' AND NOT ". HD_CHANNEL
                ),

                "05.FTA.HDTV.ServusTV" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => " AND UPPER(provider) = 'SERVUSTV' AND ". HD_CHANNEL
                ),

                "06.FTA.Radio.ORF" => array(
                    "caidMode" => 1,
                    "mediaType" => 2,
                    "customwhere" => " AND UPPER(provider) = 'ORF'"
                ),
/* FIXME: radio channels with language deu are already grabbed by the de list...
                "05.FTA.radio" => array(

                    "caidMode" => 1,
                    "mediaType" => 2,
                ),

                "06.scrambled.radio" => array(

                    "caidMode" => 2,
                    "mediaType" => 2,
                ),
*/
            )
        );
    }

}
?>
