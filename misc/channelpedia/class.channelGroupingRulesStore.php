<?php
/***************************************************************
*  Copyright notice
*
*  (c) 2011 Henning Pingel
*  All rights reserved
*
*  This script is part of the yaVDR project. yaVDR is
*  free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*  A copy is found in the textfile GPL.txt.
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*/

define("HD_CHANNEL"," UPPER(name) LIKE '% HD%' ");
define("DE_PRIVATE_PRO7_RTL"," (provider = 'ProSiebenSat.1' OR provider='Pro7 & Sat.1' OR provider = 'RTL World' OR provider = 'RTL') ");
define("DE_PUBLIC_PROVIDER", " (provider LIKE 'ARD%' OR provider = 'ZDFvision' OR provider = 'ZDF vision') ");

define("AUSTRIA", " (LOWER(name) LIKE '%sterreich' OR LOWER(name) LIKE '% austria' OR UPPER(name) LIKE '% A') ");
define("SWITZERLAND", " (UPPER(name) LIKE '% CH' OR LOWER(name) LIKE '% Schweiz' OR UPPER(name) LIKE 'SF%') ");

define("FILTER_ASTRA1_FTA", " ((tid != '1092' AND tid != '1113' AND provider != '-') OR (name = 'DMAX')) AND provider != 'SKY' ");

class channelGroupingRulesStore{

static public function getRules(){
    return array(

    "de.01.FTA.HDTV.Public" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" => "UPPER(name) ASC",
        "customwhere" => " AND " . HD_CHANNEL. " AND ".DE_PUBLIC_PROVIDER
    ),

    "de.02.FTA.SDTV.Public" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>
            " AND NOT ".HD_CHANNEL. " AND UPPER(name) NOT LIKE '%TEST-%' ".
            "AND ( ".
            "(provider = 'ARD' AND ( UPPER(name) LIKE '%ERSTE%' OR UPPER(name) LIKE '%EINS%' OR UPPER(name) LIKE '%ARTE%' OR UPPER(name) LIKE '%PHOENIX%' )) ".
            " OR provider = 'ZDFvision' OR provider = 'ZDF vision'".
            ") "
    ),

    "de.03.FTA.SDTV.Public_Regional" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>
            " AND NOT ".HD_CHANNEL.
            " AND UPPER(name) NOT LIKE '%TEST-%'".
            " AND provider = 'ARD' AND NOT ( UPPER(name) LIKE '%ERSTE%' OR UPPER(name) LIKE '%EINS%' OR UPPER(name) LIKE '%ARTE%' OR UPPER(name) LIKE '%PHOENIX%' ) "
    ),

    "de.04.FTA.HDTV.Private" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" => "UPPER(name) ASC",
        "customwhere" => "AND ". HD_CHANNEL. " AND NOT (" . DE_PUBLIC_PROVIDER . " OR ".AUSTRIA." " . " OR ".SWITZERLAND.")"
    ),

    "de.05.FTA.SDTV.Private" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" => "UPPER(name) ASC",
        "customwhere" => "AND ".DE_PRIVATE_PRO7_RTL . "AND NOT (" . HD_CHANNEL . " OR ".AUSTRIA." OR ".SWITZERLAND.")"
    ),

    //kabelDeutschland only
    "de.05.DigitalFree.SDTV.Private" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" => "UPPER(name) ASC",
        "customwhere" => "AND provider = 'Digital Free' AND NOT " . HD_CHANNEL
    ),


    //kabelDeutschland only
    "de.06.KDHome.SDTV.Private" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" => "UPPER(name) ASC",
        "customwhere" => "AND provider = 'KD Home' AND NOT " . HD_CHANNEL
    ),


    "de.06.FTA.SDTV.Private2" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" =>"UPPER(name) ASC",
        "customwhere" =>
            " AND ". FILTER_ASTRA1_FTA . " AND NOT (". HD_CHANNEL . " OR ".DE_PUBLIC_PROVIDER. " OR ".DE_PRIVATE_PRO7_RTL." OR ".AUSTRIA." OR ".SWITZERLAND.") "
    ),

    "de.06.FTA.SDTV.Private3" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" =>"UPPER(name) ASC",
        "customwhere" =>
            " AND NOT ". FILTER_ASTRA1_FTA . " AND NOT (". HD_CHANNEL . " OR ".DE_PUBLIC_PROVIDER. " OR ".DE_PRIVATE_PRO7_RTL." OR ".AUSTRIA." OR ".SWITZERLAND.") "
    ),

    "de.07.SKY.SDTV" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" =>"UPPER(name) ASC",
        "customwhere" => " AND name NOT LIKE '% - %'  AND (UPPER(provider) = 'SKY' OR provider = '' OR provider = 'undefined') AND name != '.' AND NOT " . HD_CHANNEL
    ),

    "de.07.SKY.SDTV2" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" =>"UPPER(name) ASC",
        "customwhere" => " AND (name LIKE '% - %' OR name = 'Spieldaten' OR name = '.') AND (UPPER(provider) = 'SKY' OR provider = '' OR provider = 'undefined') AND NOT " . HD_CHANNEL
    ),

    "de.08.SKY.HDTV" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" =>"UPPER(name) ASC",
        "customwhere" => " AND (UPPER(provider) = 'SKY' OR provider = '') AND name != '.' AND " . HD_CHANNEL
    ),

    "de.09.HD+.HDTV.Private" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" =>"UPPER(name) ASC",
        "customwhere" => " AND (UPPER(provider) = 'BETADIGITAL' OR UPPER(provider) = 'CBC' OR UPPER(provider) = 'PROSIEBENSAT.1' ) AND " . HD_CHANNEL
    ),

    "de.20.FTA.Radio.ARD_ZDF" => array(

        "caidMode" => 1,
        "mediaType" => 2,
        "language" => "deu",
        "orderby" =>"UPPER(name) ASC",
        "customwhere" => " AND ".DE_PUBLIC_PROVIDER
    ),

    "de.21.FTA.Radio.Private" => array(

        "caidMode" => 1,
        "mediaType" => 2,
        "language" => "deu",
        "orderby" =>"UPPER(name) ASC",
        "customwhere" => " AND NOT ".DE_PUBLIC_PROVIDER
    ),

    "at.01.scrambled.HDTV.ORF" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" => "UPPER(name) ASC",
        "customwhere" => " AND " . HD_CHANNEL. "AND UPPER(provider) = 'ORF'"
    ),

    "at.02.scrambled.SDTV.ORF" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" => "UPPER(name) ASC",
        "customwhere" => " AND NOT " . HD_CHANNEL . "AND UPPER(provider) = 'ORF'"
    ),

    "at.03.FTA.SDTV.Private" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" => "UPPER(name) ASC",
        "customwhere" => " AND ". FILTER_ASTRA1_FTA . "AND NOT ". HD_CHANNEL. "AND ". AUSTRIA. "AND ". DE_PRIVATE_PRO7_RTL
    ),

    "ch.FTA.SDTV.Private" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "deu",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>  " AND ". FILTER_ASTRA1_FTA . "AND NOT ". HD_CHANNEL . "AND ". SWITZERLAND. "AND ". DE_PRIVATE_PRO7_RTL
    ),

    "es.FTA.SDTV.diverse" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "esl",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>  "AND NOT ". HD_CHANNEL
    ),

    "es.FTA.HDTV.diverse" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "esl",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>  "AND ". HD_CHANNEL
    ),

    "es.scrambled.SDTV.diverse" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "esl",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>  "AND NOT ". HD_CHANNEL
    ),

    "es.scrambled.HDTV.diverse" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "esl",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>  "AND ". HD_CHANNEL
    ),

    "pl.FTA.SDTV.diverse" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "pol",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>  "AND NOT ". HD_CHANNEL
    ),

    "pl.FTA.HDTV.diverse" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "pol",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>  "AND ". HD_CHANNEL
    ),

    "pl.scrambled.SDTV.diverse" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "pol",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>  "AND NOT ". HD_CHANNEL
    ),

    "pl.scrambled.HDTV.diverse" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "pol",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>  "AND ". HD_CHANNEL
    ),

    "fr.FTA.SDTV.diverse" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "fra",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>  "AND NOT ". HD_CHANNEL
    ),

    "fr.FTA.HDTV.diverse" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "fra",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>  "AND ". HD_CHANNEL
    ),

    "fr.scrambled.SDTV.diverse" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "fra",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>  "AND NOT ". HD_CHANNEL
    ),

    "fr.scrambled.HDTV.diverse" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "fra",
        "orderby" => "UPPER(name) ASC",
        "customwhere" =>  "AND ". HD_CHANNEL
    ),

    "eng.01.FTA.HDTV.BBC" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "eng",
        "orderby" => "UPPER(name) ASC",
        "customwhere" => " AND upper(name) LIKE '%BBC%' AND ". HD_CHANNEL
    ),

    "eng.02.FTA.SDTV.BBC" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "eng",
        "orderby" => "UPPER(name) ASC",
        "customwhere" => " AND upper(name) LIKE '%BBC%' AND NOT ". HD_CHANNEL
    ),

    "eng.03.FTA.HDTV.ITV" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "eng",
        "orderby" => "UPPER(name) ASC",
        "customwhere" => " AND upper(name) LIKE '%ITV%' AND ". HD_CHANNEL
    ),

    "eng.04.FTA.SDTV.ITV" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "eng",
        "orderby" => "UPPER(name) ASC",
        "customwhere" => " AND upper(name) LIKE '%ITV%' AND NOT ". HD_CHANNEL
    ),

    "eng.10.FTA.Radio.BBC" => array(

        "caidMode" => 1,
        "mediaType" => 2,
        "language" => "eng",
        "orderby" => "UPPER(name) ASC",
        "customwhere" => " AND upper(name) LIKE '%BBC%' "
    ),


    );
}

/*
$x->updateLabelsOfChannelSelection(
    $label = "FTA.rubbish",
    $source = "S19.2E",
    $caidMode = 1,
    $mediaType = 1,
    $language = "deu",
    $orderby="UPPER(name) ASC",
    $customwhere =" AND (tid = '1092' OR tid = '1113' OR provider = '-' OR provider = 'SKY') "
    );


$x->updateLabelsOfChannelSelection(
    $label = "at.FTA.Radio.ORF",
    $source = "S19.2E",
    $caidMode = 1,
    $mediaType = 2,
    $language = "deu",
    $orderby="UPPER(name) ASC",
    $customwhere = " AND provider = 'ORF' "
    );



$x->updateLabelsOfChannelSelection(
    $label = "_long.FTA.radio",
    $source = "S28.2E",
    $caidMode = 1,
    $mediaType=2,
    $language = "",
    $orderby="UPPER(name) ASC"
    );

$x->updateLabelsOfChannelSelection( $label = "_long.FTA.tv", $source = "S28.2E", $caidMode = 1, $mediaType=1, $language = "", $orderby="UPPER(name) ASC");
$x->updateLabelsOfChannelSelection( $label = "_long.complete", $source = "S19.2E", $caidMode = 0, $mediaType = 0, $language = "" );
$x->updateLabelsOfChannelSelection( $label = "_long.FTA", $source = "S19.2E", $caidMode = 1, $mediaType = 0, $language = "");
$x->updateLabelsOfChannelSelection( $label = "_long.scrambled", $source = "S28.2E", $caidMode = 2);
$x->updateLabelsOfChannelSelection( $label = "_long.all", $source = "S28.2E", $caidMode = 0);
$x->updateLabelsOfChannelSelection( $label = "_long.C_Germany_KabelBW", $source = CABLE_PROVIDER);
*/

        /*

        function createEssentialListsFRA( $source, $x ){

            $x->updateLabelsOfChannelSelection(
                $label = "fra.FTA.TV",
                $source = "S19.2E",
                $caidMode = 1,
                $mediaType = 1,
                $language = "fra",
                $orderby = "UPPER(name) ASC"
            );
            $x->updateLabelsOfChannelSelection(
                $label = "_long.fra.scrambled.TV",
                $source = "S19.2E",
                $caidMode = 2,
                $mediaType = 1,
                $language = "fra",
                $orderby="UPPER(name) ASC",
                $customwhere = ""
            );
        }
        */
}
?>
