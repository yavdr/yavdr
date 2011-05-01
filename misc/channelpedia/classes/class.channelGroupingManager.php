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

//TODO: autoload these rule files
require_once PATH_TO_CLASSES . '../grouping_rules/base/class.ruleBase.php';
require_once PATH_TO_CLASSES . '../grouping_rules/class.GermanyEssentials.php';
require_once PATH_TO_CLASSES . '../grouping_rules/class.GermanySatNonEssentials.php';
require_once PATH_TO_CLASSES . '../grouping_rules/class.GermanyKabelDeutschland.php';
require_once PATH_TO_CLASSES . '../grouping_rules/class.GermanyWilhelmTel.php';
require_once PATH_TO_CLASSES . '../grouping_rules/class.GermanyUnityMedia.php';
require_once PATH_TO_CLASSES . '../grouping_rules/class.GermanyTeleColumbus.php';
require_once PATH_TO_CLASSES . '../grouping_rules/class.UKIrelandEssentials.php';
require_once PATH_TO_CLASSES . '../grouping_rules/class.AustriaSatEssentials.php';
require_once PATH_TO_CLASSES . '../grouping_rules/class.SwitzerlandSatEssentials.php';
require_once PATH_TO_CLASSES . '../grouping_rules/class.SpainSatEssentials.php';
require_once PATH_TO_CLASSES . '../grouping_rules/class.PolandSatEssentials.php';
require_once PATH_TO_CLASSES . '../grouping_rules/class.FranceSatEssentials.php';
require_once PATH_TO_CLASSES . '../grouping_rules/class.NetherlandsSatEssentials.php';

define("HD_CHANNEL"," UPPER(name) LIKE '% HD%' ");

define("DE_PRIVATE_PRO7_RTL"," (provider = 'ProSiebenSat.1' OR provider='Pro7 & Sat.1' OR provider = 'RTL World' OR provider = 'RTL' OR provider='MTV Networks') ");
define("DE_PUBLIC_PROVIDER", " (provider LIKE 'ARD%' OR provider = 'ZDFvision' OR provider = 'ZDF vision') ");

define("AUSTRIA", " (LOWER(name) LIKE '%sterreich' OR LOWER(name) LIKE '%austria%' OR UPPER(name) LIKE '% A'  OR UPPER(name) LIKE '%TIROL%' OR UPPER(provider)='ORF') ");
define("SWITZERLAND", " (UPPER(name) LIKE '% CH' OR LOWER(name) LIKE '% Schweiz' OR UPPER(name) LIKE 'SF%') ");
define("FRANCE_CSAT", " (upper(provider)='CSAT') ");
define("SPAIN_DIGITALPLUS", " (UPPER(provider) = 'DIGITAL +' OR UPPER(provider) = 'DIGITAL+') ");


define("FILTER_ASTRA1_FTA", " ((tid != '1092' AND tid != '1113' AND provider != '-') OR (name = 'DMAX')) AND provider != 'SKY' ");

class channelGroupingManager{

    private
        $db,
        $config,
        $rulesets;

    private static $instance = null;

    private function __clone(){}

    public static function getInstance(){
        if ( self::$instance == null){
            self::$instance = new channelGroupingManager();
        }
        return self::$instance;
    }

    protected function __construct(){
        $this->config = config::getInstance();
        $this->db = dbConnection::getInstance();
        $this->rulesets = array(
            "GermanyEssentials"        => new GermanyEssentials(),
            "GermanySatNonEssential"   => new GermanySatNonEssentials(),
            "AustriaSatEssentials"     => new AustriaSatEssentials(),
            "SwitzerlandSatEssentials" => new SwitzerlandSatEssentials(),
            "GermanyKabelDeutschland"  => new GermanyKabelDeutschland(),
            "GermanyWilhelmTel"        => new GermanyWilhelmTel(),
            "GermanyUnityMedia"        => new GermanyUnityMedia(),
            "GermanyTeleColumbus"      => new GermanyTeleColumbus(),
            "UKIrelandEssentials"      => new UKIrelandEssentials(),
            "SpainSatEssentials"       => new SpainSatEssentials(),
            "PolandSatEssentials"      => new PolandSatEssentials(),
            "FranceSatEssentials"      => new FranceSatEssentials(),
            "NetherlandsSatEssentials" => new NetherlandsSatEssentials(),
        );
    }

    public function updateAllLabels(){
        foreach ($this->config->getValue("sat_positions") as $sat => $languages){
            $this->updateAllLabelsOfSource($sat);
        }
        foreach ($this->config->getValue("cable_providers") as $cablep => $languages){
            $this->updateAllLabelsOfSource("C[$cablep]");
        }
        foreach ($this->config->getValue("terr_providers") as $terrp => $languages){
            $this->updateAllLabelsOfSource("T[$terrp]");
        }
    }

    public function updateAllLabelsOfSource( $source ){
        print "Updating labels for channels belonging to $source.\n";
        //reset all labels in DB to empty strings before updating them
        $temp = $this->db->query("UPDATE channels SET x_label='' WHERE source = ".$this->db->quote($source));
        $query = $this->db->exec("BEGIN TRANSACTION");
        $sourcetype = substr($source, 0, 1);
        foreach ( $this->rulesets as $title => $object){
            $config = $object->getConfig();
            if ( $sourcetype == "S"){
                if ( $config["validForSatellites"] === "all" || ( is_array( $config["validForSatellites"] ) && in_array( $source, $config["validForSatellites"], true)) ){
                    foreach ($object->getGroups() as $groupsettings){
                        $this->updateLabelsOfChannelSelection(
                            $label = $config["country"] . "." . str_pad($groupsettings["outputSortPriority"], 2, "0", STR_PAD_LEFT) . "." . $groupsettings["title"],
                            $source,
                            $outputSortPriority = $groupsettings["outputSortPriority"],
                            $caidMode           = $groupsettings["caidMode"],
                            $mediaType          = $groupsettings["mediaType"],
                            $language           = array_key_exists ("languageOverrule",$groupsettings) ? $groupsettings["languageOverrule"] : $config["lang"],
                            $customwhere        = $groupsettings["customwhere"],
                            $title
                        );
                    }
                }
            }
            elseif ( $sourcetype == "C"){
                if ( $config["validForCableProviders"] === "all" || ( is_array( $config["validForCableProviders"] ) && in_array( $source, $config["validForCableProviders"], true)) ){
                    foreach ($object->getGroups() as $groupsettings){
                        $this->updateLabelsOfChannelSelection(
                            $label = $config["country"] . ".". str_pad($groupsettings["outputSortPriority"], 2, "0", STR_PAD_LEFT) . "." . $groupsettings["title"],
                            $source,
                            $outputSortPriority = $groupsettings["outputSortPriority"],
                            $caidMode           = $groupsettings["caidMode"],
                            $mediaType          = $groupsettings["mediaType"],
                            $language           = array_key_exists ("languageOverrule",$groupsettings) ? $groupsettings["languageOverrule"] : $config["lang"],
                            $customwhere        = $groupsettings["customwhere"],
                            $title
                        );
                    }
                }
            }
            elseif ( $sourcetype == "T"){
                if ( $config["validForTerrProviders"] === "all" || ( is_array( $config["validForTerrProviders"] ) && in_array( $source, $config["validForTerrProviders"], true)) ){
                    foreach ($object->getGroups() as $groupsettings){
                        $this->updateLabelsOfChannelSelection(
                            $label = $config["country"] . "." . str_pad($groupsettings["outputSortPriority"], 2, "0", STR_PAD_LEFT) . "." . $groupsettings["title"],
                            $source,
                            $outputSortPriority = $groupsettings["outputSortPriority"],
                            $caidMode           = $groupsettings["caidMode"],
                            $mediaType          = $groupsettings["mediaType"],
                            $language           = array_key_exists ("languageOverrule",$groupsettings) ? $groupsettings["languageOverrule"] : $config["lang"],
                            $customwhere        = $groupsettings["customwhere"],
                            $title
                        );
                    }
                }
            }
        }
        $query = $this->db->exec("COMMIT TRANSACTION");
    }

    /*
     * tags specific channels in the db
     *
     * label (string, used in file name of newly generated channels file, use it to distinguish between different channels files)
     * source (string, satellite position, cable, terrestial, empty string means: show all. Example: "S28.2E", "S19.2E", "C", no lists allowed)
     *
     * caidMode
     *     0 = show all CAIDs including FTA,
     *     1 = show only channels FTA channels,
     *     2 = show only encrypted channels)
     *
     * mediaType
     *     0 = show all media types (radio + tv + other stuff),
     *     1 = show only TV channels (both SDTV + HDTV),
     *     2 = show only radio channels,
     *     3 = show only SDTV channels,
     *     4 = show only HDTV channel
     *
     * language (string with comma separated list of languages that should be displayed, empty string means all languages)
     */

    private function updateLabelsOfChannelSelection(
        $label,
        $source = "",
        $outputSortPriority = 0,
        $caidMode = 0,
        $mediaType = 0,
        $language = "",
        $customwhere = "",
        $title = ""
    ){
        $label_suffixes = array();
        $where = array();

        if ($source != "")
            $where[] = "source = ". $this->db->quote( $source );

        switch ($mediaType) {
            case 0:
                $label_suffixes[] = "TV+Radio";
                break;
            case 1:
                $where[] = "vpid != '0'";
                $label_suffixes[] ="TV";
                break;
            case 2:
                $where[] = "vpid = '0'";
                $label_suffixes[] ="Radio";
                break;
            case 3:
                $where[] = "vpid != '0'";
                $where[] = "NOT " . channelImport::hd_channel;
                $label_suffixes[] ="SDTV";
                break;
            case 4:
                $where[] = "vpid != '0'";
                $where[] = channelImport::hd_channel;
                $label_suffixes[] ="HDTV";
                break;
        }

        if ($caidMode != 0){
            $where[] = "caid ". ($caidMode === 2 ? "!= '0'" : "= '0'");
            $label_suffixes[] = ($caidMode === 2 ? "scrambled" : "FTA");
        }
        else{
            $label_suffixes[] = "scrambled+FTA";
        }

        if (count($label_suffixes) > 0){
            //$label = $label . " <div class=\"box\">".implode("</div><div class=\"box\">",$label_suffixes)."</div>";
            $label = $label . " ".implode(" ",$label_suffixes)."";
        }

        if ($language != "")
            $where[] = "apid LIKE '%=$language%'";

        //update label tag in the selected channels
        if (count($where) > 0){
            $where = "WHERE " . implode( $where, " AND " ) . $customwhere;
            $where2 = $where . " AND ";
            $where .= " AND x_label = ''";
        }
        else {
            $where2 = "WHERE ";
            $where .= "WHERE x_label = ''";
        }

        $sqlquery = "SELECT * FROM channels $where2 x_label != '' AND x_label != ". $this->db->quote($label);
        $result = $this->db->query($sqlquery);
        foreach ($result as $row){
            print "*** Notice: Channel '".$row["name"]."' is already tagged with '".$row["x_label"]."'. We just tried to tag it with '$label'\n";
        }

        //now only update channels with EMPTY x_label field!
        $sqlquery = "UPDATE channels SET x_label=". $this->db->quote($label) ." $where";
        $result = $this->db->query($sqlquery);
        //print "Updating labels for channels belonging to $title / $source / $label.\n";
    }

}
?>
