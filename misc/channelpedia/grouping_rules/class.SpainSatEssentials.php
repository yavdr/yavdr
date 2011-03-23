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

                "01.FTA.HDTV.DigitalPlus" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "languageOverrule" => "",
                    "customwhere" =>  "AND ". HD_CHANNEL . " AND " . SPAIN_DIGITALPLUS
                ),

                "02.FTA.SDTV.DigitalPlus" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "languageOverrule" => "",
                    "customwhere" =>  "AND NOT ". HD_CHANNEL  . " AND " . SPAIN_DIGITALPLUS
                ),

                "03.scrambled.HDTV.DigitalPlus" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "languageOverrule" => "",
                    "customwhere" =>  "AND ". HD_CHANNEL  . " AND " . SPAIN_DIGITALPLUS
                ),

                "04.scrambled.SDTV.DigitalPlus" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "languageOverrule" => "",
                    "customwhere" =>  "AND NOT ". HD_CHANNEL  . " AND " . SPAIN_DIGITALPLUS
                ),

                "05.FTA.HDTV.diverse" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" =>  "AND ". HD_CHANNEL . " AND NOT " . SPAIN_DIGITALPLUS
                ),

                "06.FTA.SDTV.diverse" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" =>  "AND NOT ". HD_CHANNEL . " AND NOT " . SPAIN_DIGITALPLUS
                ),

                "07.scrambled.HDTV.diverse" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" =>  "AND ". HD_CHANNEL . " AND NOT " . SPAIN_DIGITALPLUS
                ),

                "08.scrambled.SDTV.diverse" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" =>  "AND NOT ". HD_CHANNEL . " AND NOT " . SPAIN_DIGITALPLUS
                ),

                "10.FTA.radio" => array(

                    "caidMode" => 1,
                    "mediaType" => 2,
                    "customwhere" => ""
                ),

                "11.scrambled.radio" => array(

                    "caidMode" => 2,
                    "mediaType" => 2,
                    "customwhere" => ""
                ),

            )
        );
    }

}

?>