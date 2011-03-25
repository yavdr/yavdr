<?php


class GermanyTeleColumbus {

    function __construct(){

    }

    function getRules(){
        return array (

            "country" => "de",
            "lang" => "deu", //this is the language code used in the channels audio description
            "validForSatellites" => array(),
            "validForCableProviders" => array("C[de_TeleColumbus_Magdeburg]"),
            "validForTerrProviders" => array(),//none
            "groups" => array(

                "04.TeleColumbus_Basis1.HDTV.scrambled" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => "AND UPPER(provider) = 'BASIS 1' AND " . HD_CHANNEL
                ),

                "05.TeleColumbus_Basis1.SDTV.scrambled" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => "AND UPPER(provider) = 'BASIS 1' AND NOT " . HD_CHANNEL
                ),
                "06.TeleColumbus_KabelKiosk.HDTV.scrambled" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => "AND UPPER(provider) = 'KABELKIOSK' AND " . HD_CHANNEL
                ),

                "07.TeleColumbus_KabelKiosk.SDTV.scrambled" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => "AND UPPER(provider) = 'KABELKIOSK' AND NOT " . HD_CHANNEL
                ),
            )
        );
    }

}

?>