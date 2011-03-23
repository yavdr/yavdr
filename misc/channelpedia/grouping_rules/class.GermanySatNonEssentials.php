<?php


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

                "06.FTA.SDTV.Private3" => array(
                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" =>
                        " AND NOT ". FILTER_ASTRA1_FTA . " AND NOT (". HD_CHANNEL . " OR ".DE_PUBLIC_PROVIDER. " OR ".DE_PRIVATE_PRO7_RTL." OR ".AUSTRIA." OR ".SWITZERLAND.") "
                ),

                "15.scrambled.SDTV.Private" => array(
                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => "AND ".DE_PRIVATE_PRO7_RTL . "AND NOT (" . HD_CHANNEL . " OR ".AUSTRIA." OR ".SWITZERLAND.")"
                ),

            )
        );
    }

}

?>