<?php


class GermanyWilhelmTel {

    function __construct(){

    }

    function getRules(){
        return  array (

            "country" => "de",
            "lang" => "deu", //this is the language code used in the channels audio description
            "validForSatellites" => array(),
            "validForCableProviders" => array("C[de_WilhelmTel]"),
            "validForTerrProviders" => array(),//none
            "groups" => array(

                "25.wt_Pay-TV.SDTV.Private" => array(
                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => "AND provider = 'wt Pay-TV' AND NOT " . HD_CHANNEL
                ),
                "26.wt Pay-TV.HDTV.Private" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => "AND provider = 'wt Pay-TV' AND " . HD_CHANNEL
                )
            )
        );
    }


}

?>