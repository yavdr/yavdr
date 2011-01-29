<?php
/***************************************************************
*  Copyright notice
*
*  (c) 2010 Henning Pingel
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

require_once 'class.cpbasics.php';
require_once 'class.cpoutput.php';

//output
$x = new cpOutput("/home/hp/Desktop/channels/");

//this filters channels that don't fit into some standard categories
$filter_astra1_fta = " AND ((tid != '1092' AND tid != '1113' AND provider != '-') OR (name = 'DMAX')) AND provider != 'SKY' ";

createEssentialListsDE("S19.2E", $x);
createEssentialListsDE("C[Germany_KabelBW]", $x);

$x->createSortedChannelsConfFromDB(
    $label = "au.FTA.SDTV.Private",
    $source = "S19.2E",
    $caidMode = 1,
    $mediaType = 1,
    $language = "deu",
    $orderby="UPPER(name) ASC",
    $customwhere = $filter_astra1_fta . "AND UPPER(name) NOT LIKE '% HD' ".
        "AND (name LIKE '% Austria' OR name LIKE '% A') ".
        "AND (provider = 'ProSiebenSat.1' OR provider = 'RTL World' OR provider = 'RTL') "
     );

$x->createSortedChannelsConfFromDB(
    $label = "ch.FTA.SDTV.Private",
    $source = "S19.2E",
    $caidMode = 1,
    $mediaType = 1,
    $language = "deu",
    $orderby="UPPER(name) ASC",
    $customwhere = $filter_astra1_fta . "AND UPPER(name) NOT LIKE '% HD' ".
        "AND (name LIKE '% CH' OR name LIKE '% Schweiz') ".
        "AND (provider = 'ProSiebenSat.1' OR provider = 'RTL World' OR provider = 'RTL') "
     );

/*
$x->createSortedChannelsConfFromDB(
    $label = "FTA.rubbish",
    $source = "S19.2E",
    $caidMode = 1,
    $mediaType = 1,
    $language = "deu",
    $orderby="UPPER(name) ASC",
    $customwhere =" AND (tid = '1092' OR tid = '1113' OR provider = '-' OR provider = 'SKY') "
    );
*/

$x->createSortedChannelsConfFromDB(
    $label = "at.FTA.Radio.ORF",
    $source = "S19.2E",
    $caidMode = 1,
    $mediaType = 2,
    $language = "deu",
    $orderby="UPPER(name) ASC",
    $customwhere = " AND provider = 'ORF' "
    );

$x->createSortedChannelsConfFromDB(
    $label = "fra.FTA.TV",
    $source = "S19.2E",
    $caidMode = 1,
    $mediaType = 1,
    $language = "fra",
    $orderby = "UPPER(name) ASC"
    //$customwhere = " AND (UPPER(provider) = 'SKY' OR provider = '') AND name != '.' AND UPPER(name) NOT LIKE '% HD%' "
    );

$x->createSortedChannelsConfFromDB(
    $label = "_long.fra.scrambled.TV",
    $source = "S19.2E",
    $caidMode = 2,
    $mediaType = 1,
    $language = "fra",
    $orderby="UPPER(name) ASC",
    $customwhere = "" //$filter_astra1_fta . "AND UPPER(name) NOT LIKE '% HD' "
    );

$x->createSortedChannelsConfFromDB(
    $label = "_long.FTA.radio",
    $source = "S28.2E",
    $caidMode = 1,
    $mediaType=2,
    $language = "",
    $orderby="UPPER(name) ASC"
    );

$x->createSortedChannelsConfFromDB( $label = "_long.FTA.tv", $source = "S28.2E", $caidMode = 1, $mediaType=1, $language = "", $orderby="UPPER(name) ASC");
$x->createSortedChannelsConfFromDB( $label = "_long.complete", $source = "S19.2E", $caidMode = 0, $mediaType = 0, $language = "" );
$x->createSortedChannelsConfFromDB( $label = "_long.FTA", $source = "S19.2E", $caidMode = 1, $mediaType = 0, $language = "");
$x->createSortedChannelsConfFromDB( $label = "_long.scrambled", $source = "S28.2E", $caidMode = 2);
$x->createSortedChannelsConfFromDB( $label = "_long.all", $source = "S28.2E", $caidMode = 0);
$x->createSortedChannelsConfFromDB( $label = "_long.C_Germany_KabelBW", $source = "C");

function createEssentialListsDE( $source, $x ){

    $public_provider = "(provider LIKE '%ARD%' OR provider = 'ZDFvision' OR provider = 'ZDF vision')";

    $x->createSortedChannelsConfFromDB(
        $label = "de.FTA.SDTV.Public",
        $source,
        $caidMode = 1,
        $mediaType = 1,
        $language = "deu",
        $orderby="UPPER(name) ASC",
        $customwhere =
            " AND UPPER(name) NOT LIKE '% HD' ".
            "AND UPPER(name) NOT LIKE '%TEST-%' ".
            "AND ( ".
            "(provider = 'ARD' AND ( UPPER(name) LIKE '%ERSTE%' OR UPPER(name) LIKE '%EINS%' OR UPPER(name) LIKE '%ARTE%' OR UPPER(name) LIKE '%PHOENIX%' )) ".
            " OR provider = 'ZDFvision' OR provider = 'ZDF vision'".
        	") "
    );

    $x->createSortedChannelsConfFromDB(
        $label = "de.FTA.SDTV.Public_Regional",
        $source,
        $caidMode = 1,
        $mediaType = 1,
        $language = "deu",
        $orderby="UPPER(name) ASC",
        $customwhere =
             " AND UPPER(name) NOT LIKE '% HD'
             AND UPPER(name) NOT LIKE '%TEST-%'
             AND provider = 'ARD' AND NOT ( UPPER(name) LIKE '%ERSTE%' OR UPPER(name) LIKE '%EINS%' OR UPPER(name) LIKE '%ARTE%' OR UPPER(name) LIKE '%PHOENIX%' ) "
    );

    $x->createSortedChannelsConfFromDB(
        $label = "de.FTA.HDTV",
        $source,
        $caidMode = 1,
        $mediaType = 1,
        $language = "deu",
        $orderby="UPPER(name) ASC",
        $customwhere = "AND UPPER(name) LIKE '% HD%' "
    );

    $x->createSortedChannelsConfFromDB(
        $label = "de.FTA.SDTV.Private",
        $source,
        $caidMode = 1,
        $mediaType = 1,
        $language = "deu",
        $orderby="UPPER(name) ASC",
        $customwhere =
            "AND UPPER(name) NOT LIKE '% HD' ".
            "AND name NOT LIKE '% Austria' AND name NOT LIKE '% A' AND name NOT LIKE '% CH'  AND name NOT LIKE '% Schweiz' ".
            "AND (provider = 'ProSiebenSat.1' OR provider='Pro7 & Sat.1' OR provider = 'RTL World' OR provider = 'RTL') "
    );

    $filter_astra1_fta = " AND ((tid != '1092' AND tid != '1113' AND provider != '-') OR (name = 'DMAX')) AND provider != 'SKY' ";

    $x->createSortedChannelsConfFromDB(
        $label = "de.FTA.SDTV.Rest_Private",
        $source,
        $caidMode = 1,
        $mediaType = 1,
        $language = "deu",
        $orderby="UPPER(name) ASC",
        $customwhere = $filter_astra1_fta .
           "AND UPPER(name) NOT LIKE '% HD'
            AND provider != 'ProSiebenSat.1'
            AND provider !='Pro7 & Sat.1'
            AND provider != 'RTL World'
            AND provider != 'RTL'
            AND provider != 'ARD'
            AND provider != 'ZDFvision'  "
    );

    $x->createSortedChannelsConfFromDB(
        $label = "de.FTA.Radio.ARD_ZDF",
        $source,
        $caidMode = 1,
        $mediaType = 2,
        $language = "deu",
        $orderby="UPPER(name) ASC",
        $customwhere = " AND $public_provider"
    );

    $x->createSortedChannelsConfFromDB(
        $label = "de.FTA.Radio.Private",
        $source,
        $caidMode = 1,
        $mediaType = 2,
        $language = "deu",
        $orderby="UPPER(name) ASC",
        $customwhere = " AND NOT $public_provider "
    );

    $x->createSortedChannelsConfFromDB(
        $label = "de.SKY.SDTV",
        $source,
        $caidMode = 2,
        $mediaType = 1,
        $language = "deu",
        $orderby="UPPER(name) ASC",
        $customwhere = " AND (UPPER(provider) = 'SKY' OR provider = '') AND name != '.' AND UPPER(name) NOT LIKE '% HD%' "
    );
}

?>