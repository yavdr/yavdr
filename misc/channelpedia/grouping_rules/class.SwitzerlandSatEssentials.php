<?php


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