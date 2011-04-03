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

require_once 'grouping_rules/base/class.ruleBase.php';
require_once 'grouping_rules/class.GermanyEssentials.php';
require_once 'grouping_rules/class.GermanySatNonEssentials.php';
require_once 'grouping_rules/class.GermanyKabelDeutschland.php';
require_once 'grouping_rules/class.GermanyWilhelmTel.php';
require_once 'grouping_rules/class.GermanyUnityMedia.php';
require_once 'grouping_rules/class.GermanyTeleColumbus.php';
require_once 'grouping_rules/class.UKIrelandEssentials.php';
require_once 'grouping_rules/class.AustriaSatEssentials.php';
require_once 'grouping_rules/class.SwitzerlandSatEssentials.php';
require_once 'grouping_rules/class.SpainSatEssentials.php';
require_once 'grouping_rules/class.PolandSatEssentials.php';
require_once 'grouping_rules/class.FranceSatEssentials.php';
require_once 'grouping_rules/class.NetherlandsSatEssentials.php';

define("HD_CHANNEL"," UPPER(name) LIKE '% HD%' ");

define("DE_PRIVATE_PRO7_RTL"," (provider = 'ProSiebenSat.1' OR provider='Pro7 & Sat.1' OR provider = 'RTL World' OR provider = 'RTL' OR provider='MTV Networks') ");
define("DE_PUBLIC_PROVIDER", " (provider LIKE 'ARD%' OR provider = 'ZDFvision' OR provider = 'ZDF vision') ");

define("AUSTRIA", " (LOWER(name) LIKE '%sterreich' OR LOWER(name) LIKE '%austria%' OR UPPER(name) LIKE '% A'  OR UPPER(name) LIKE '%TIROL%' OR UPPER(provider)='ORF') ");
define("SWITZERLAND", " (UPPER(name) LIKE '% CH' OR LOWER(name) LIKE '% Schweiz' OR UPPER(name) LIKE 'SF%') ");
define("FRANCE_CSAT", " (upper(provider)='CSAT') ");
define("SPAIN_DIGITALPLUS", " (UPPER(provider) = 'DIGITAL +' OR UPPER(provider) = 'DIGITAL+') ");


define("FILTER_ASTRA1_FTA", " ((tid != '1092' AND tid != '1113' AND provider != '-') OR (name = 'DMAX')) AND provider != 'SKY' ");

class channelGroupingRulesStore{

    static public function getRules(){
        return array(
            "GermanyEssentials" => GermanyEssentials::getRules(),
            "GermanySatNonEssential" => GermanySatNonEssentials::getRules(),
            "AustriaSatEssentials" => AustriaSatEssentials::getRules(),
            "SwitzerlandSatEssentials" => SwitzerlandSatEssentials::getRules(),
            "GermanyKabelDeutschland" => GermanyKabelDeutschland::getRules(),
            "GermanyWilhelmTel" => GermanyWilhelmTel::getRules(),
            "GermanyUnityMedia" => GermanyUnityMedia::getRules(),
            "GermanyTeleColumbus" => GermanyTeleColumbus::getRules(),
            "UKIrelandEssentials" => UKIrelandEssentials::getRules(),
            "SpainSatEssentials" => SpainSatEssentials::getRules(),
            "PolandSatEssentials" => PolandSatEssentials::getRules(),
            "FranceSatEssentials" => FranceSatEssentials::getRules(),
            "NetherlandsSatEssentials" => NetherlandsSatEssentials::getRules(),
        );
    }
}
?>
