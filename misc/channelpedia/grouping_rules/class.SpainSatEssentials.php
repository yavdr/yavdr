<?php


class SpainSatEssentials {

    function __construct(){

    }

    function getRules(){
        return array(
            "country" => "es",
            "lang" => "esl", //this is the language code used in the channels audio description
            "validForSatellites" => array( "S19.2E"),
            "validForCableProviders" => array(),//none
            "validForTerrProviders" => array(),//none
            "groups" => array(

                "01.FTA.SDTV.diverse" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" =>  "AND NOT ". HD_CHANNEL
                ),

                "02.FTA.HDTV.diverse" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" =>  "AND ". HD_CHANNEL
                ),

                "03.scrambled.SDTV.diverse" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" =>  "AND NOT ". HD_CHANNEL
                ),

                "04.scrambled.HDTV.diverse" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" =>  "AND ". HD_CHANNEL
                ),

                "05.FTA.radio" => array(

                    "caidMode" => 1,
                    "mediaType" => 2,
                ),

                "06.scrambled.radio" => array(

                    "caidMode" => 2,
                    "mediaType" => 2,
                ),

            )
        );
    }

}

?>