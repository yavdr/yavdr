<?php


class GermanyKabelDeutschland {

    function __construct(){

    }

    function getRules(){
        return array (

            "country" => "de",
            "lang" => "deu", //this is the language code used in the channels audio description
            "validForSatellites" => array(),
            "validForCableProviders" => array("C[de_KabelDeutschland]"),
            "validForTerrProviders" => array(),//none
            "groups" => array(

                "05.DigitalFree.SDTV.Private" => array(
                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => "AND provider = 'Digital Free' AND NOT " . HD_CHANNEL
                ),
                "06.KDHome.SDTV.Private" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => "AND provider = 'KD Home' AND NOT " . HD_CHANNEL
                )
            )
        );
    }

}

?>