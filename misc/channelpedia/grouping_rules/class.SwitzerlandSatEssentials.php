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
            )
        );
    }

}

?>