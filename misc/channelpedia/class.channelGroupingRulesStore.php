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

require_once 'grouping_rules/class.GermanyEssentials.php';
require_once 'grouping_rules/class.GermanySatNonEssentials.php';
require_once 'grouping_rules/class.GermanyKabelDeutschland.php';
require_once 'grouping_rules/class.GermanyWilhelmTel.php';
require_once 'grouping_rules/class.UKIrelandEssentials.php';
require_once 'grouping_rules/class.AustriaSatEssentials.php';
require_once 'grouping_rules/class.SwitzerlandSatEssentials.php';
require_once 'grouping_rules/class.SpainSatEssentials.php';

define("HD_CHANNEL"," UPPER(name) LIKE '% HD%' ");

define("DE_PRIVATE_PRO7_RTL"," (provider = 'ProSiebenSat.1' OR provider='Pro7 & Sat.1' OR provider = 'RTL World' OR provider = 'RTL') ");
define("DE_PUBLIC_PROVIDER", " (provider LIKE 'ARD%' OR provider = 'ZDFvision' OR provider = 'ZDF vision') ");

define("AUSTRIA", " (LOWER(name) LIKE '%sterreich' OR LOWER(name) LIKE '% austria' OR UPPER(name) LIKE '% A') ");
define("SWITZERLAND", " (UPPER(name) LIKE '% CH' OR LOWER(name) LIKE '% Schweiz' OR UPPER(name) LIKE 'SF%') ");

define("FILTER_ASTRA1_FTA", " ((tid != '1092' AND tid != '1113' AND provider != '-') OR (name = 'DMAX')) AND provider != 'SKY' ");

class channelGroupingRulesStore{

static public function getRules(){
    return array(
        "GermanyEssentials" => GermanyEssentials::getRules(),
        "GermanySatNonEssential" => GermanySatNonEssentials::getRules(),
        "GermanyKabelDeutschland" => GermanyKabelDeutschland::getRules(),
        "GermanyWilhelmTel" => GermanyWilhelmTel::getRules(),
        "UKIrelandEssentials" => UKIrelandEssentials::getRules(),
        "AustriaSatEssentials" => AustriaSatEssentials::getRules(),
        "SwitzerlandSatEssentials" => SwitzerlandSatEssentials::getRules(),
        "SpainSatEssentials" => SpainSatEssentials::getRules(),
    );
/*
//...
    "pl.FTA.SDTV.diverse" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "pol",
        "customwhere" =>  "AND NOT ". HD_CHANNEL
    ),

    "pl.FTA.HDTV.diverse" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "pol",
        "customwhere" =>  "AND ". HD_CHANNEL
    ),

    "pl.scrambled.SDTV.diverse" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "pol",
        "customwhere" =>  "AND NOT ". HD_CHANNEL
    ),

    "pl.scrambled.HDTV.diverse" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "pol",
        "customwhere" =>  "AND ". HD_CHANNEL
    ),

    "fr.FTA.SDTV.diverse" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "fra",
        "customwhere" =>  "AND NOT ". HD_CHANNEL
    ),

    "fr.FTA.HDTV.diverse" => array(

        "caidMode" => 1,
        "mediaType" => 1,
        "language" => "fra",
        "customwhere" =>  "AND ". HD_CHANNEL
    ),

    "fr.scrambled.SDTV.diverse" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "fra",
        "customwhere" =>  "AND NOT ". HD_CHANNEL
    ),

    "fr.scrambled.HDTV.diverse" => array(

        "caidMode" => 2,
        "mediaType" => 1,
        "language" => "fra",
        "customwhere" =>  "AND ". HD_CHANNEL
    ),

    );
*/

}
/*
$x->updateLabelsOfChannelSelection(
    $label = "FTA.rubbish",
    $source = "S19.2E",
    $caidMode = 1,
    $mediaType = 1,
    $language = "deu",
    $customwhere =" AND (tid = '1092' OR tid = '1113' OR provider = '-' OR provider = 'SKY') "
    );


$x->updateLabelsOfChannelSelection(
    $label = "at.FTA.Radio.ORF",
    $source = "S19.2E",
    $caidMode = 1,
    $mediaType = 2,
    $language = "deu",
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
