<?php


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
                "21.Radio.SDTV.UnityDigital" => array(

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