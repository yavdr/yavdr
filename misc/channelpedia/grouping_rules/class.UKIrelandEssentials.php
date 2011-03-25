<?php

define("UK_ITV","(upper(name) LIKE '%ITV%' OR upper(name) LIKE 'STV%' OR upper(name) LIKE 'UTV%' )");
define("UK_C4","(upper(name) LIKE 'CHANNEL 4%' OR upper(name) LIKE 'CHANNEL 5%' OR  upper(name) LIKE 'MORE4%' OR upper(name) LIKE 'FILM4%' OR upper(name) LIKE 'E4%' OR upper(name) LIKE 'S4C%') AND provider = 'BSkyB' ");

class UKIrelandEssentials {

    function __construct(){

    }

    function getRules(){
        return array (
            "country" => "en",
            "lang" => "eng", //this is the language code used in the channels audio description
            "validForSatellites" => array( "S28.2E"),
            "validForCableProviders" => array(),
            "validForTerrProviders" => array(),
            "groups" => array(

                "01.BBC.HDTV.FTA" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => " AND upper(name) LIKE '%BBC%' AND ". HD_CHANNEL
                ),

                "02.BBC.SDTV.FTA" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => " AND (upper(name) LIKE '%BBC%' OR upper(name) = 'CBEEBIES') AND NOT ". HD_CHANNEL
                ),

                "03.ITV.HDTV.FTA" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => " AND ".UK_ITV." AND ". HD_CHANNEL
                ),

                "04.ITV.HDTV.scrambled" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => " AND ".UK_ITV." AND ". HD_CHANNEL
                ),

                "05.ITV.SDTV.FTA" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => " AND ".UK_ITV." AND NOT ". HD_CHANNEL
                ),

                "06.ITV.SDTV.scrambled" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => " AND ".UK_ITV." AND NOT ". HD_CHANNEL
                ),

                "10.Channel4Family.HDTV.FTA" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "languageOverrule" => "", //only because of brand new c4 hd fta (march 2011) with missing lang stuff
                    "customwhere" => " AND ".UK_C4." AND ". HD_CHANNEL
                ),

                "11.Channel4Family.HDTV.scrambled" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => " AND ".UK_C4." AND ". HD_CHANNEL
                ),

                "12.Channel4Family.SDTV.FTA" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => " AND ".UK_C4."  AND NOT ". HD_CHANNEL
                ),

                "13.Channel4Family.SDTV.scrambled" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => " AND  ".UK_C4." AND NOT ". HD_CHANNEL
                ),

                "20.Irish.SDTV.scrambled" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => " AND (UPPER(name) LIKE 'RTE%' OR UPPER(name) LIKE 'TV3' OR UPPER(name) LIKE 'TG4' OR UPPER(name) LIKE 'SETANTA%') AND NOT ". HD_CHANNEL
                ),

                "30.Rest.HDTV.FTA" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => " AND ". HD_CHANNEL
                ),

                "31.freesat.SDTV.FTA" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => " AND (
                        UPPER(name) LIKE 'CBS %' OR
                    	UPPER(name) LIKE 'ZONE %' OR
                        UPPER(name) LIKE 'TRUE %' OR
                        UPPER(name) LIKE 'MOVIES4MEN%' OR
                        UPPER(name) LIKE 'MOV4MEN%' OR
                        UPPER(name) LIKE 'MEN&MOVIES%' OR
                        UPPER(name) LIKE 'FOOD NETWORK%' OR
                        UPPER(name) LIKE 'HORROR%' OR
                        UPPER(name) LIKE 'WEDDING TV%'
                    ) AND NOT ". HD_CHANNEL
                ),

                "32.Rest.SDTV.FTA" => array(

                    "caidMode" => 1,
                    "mediaType" => 1,
                    "customwhere" => " AND NOT ". HD_CHANNEL
                ),

                "33.scrambled.HDTV" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => " AND ". HD_CHANNEL
                ),

                "34.scrambled.SDTV" => array(

                    "caidMode" => 2,
                    "mediaType" => 1,
                    "customwhere" => " AND NOT ". HD_CHANNEL
                ),


                "40.FTA.Radio.BBC" => array(

                    "caidMode" => 1,
                    "mediaType" => 2,
                    "customwhere" => " AND upper(name) LIKE '%BBC%' "
                ),

                "41.FTA.Radio.Irish_RTE" => array(

                    "caidMode" => 1,
                    "mediaType" => 2,
                    "customwhere" => " AND upper(name) LIKE 'RTE %' "
                ),

                "42.FTA.Radio.Rest" => array(

                    "caidMode" => 1,
                    "mediaType" => 2,
                    "customwhere" => ""
                ),

                "43.scrambled.Radio" => array(

                    "caidMode" => 2,
                    "mediaType" => 2,
                    "customwhere" => ""
                ),
            )
        );

    }

}

?>