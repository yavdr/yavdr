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

class rawOutputRenderer {

    function __construct(){
        $this->config = config::getInstance();
    }

    public function writeRawOutput(){
        //for all existing sources, write unfiltered channels.conf lists to disc
        foreach ($this->config->getValue("sat_positions") as $sat => $languages){
            $y = new channelListWriter("_complete", $sat);
            $y->writeFile();
        }
        foreach ($this->config->getValue("cable_providers") as $cablep => $languages){
            $y = new channelListWriter("_complete", "C[$cablep]");
            $y->writeFile();
        }
        foreach ($this->config->getValue("terr_providers") as $terrp => $languages){
            $y = new channelListWriter("_complete", "T[$terrp]");
            $y->writeFile();
        }
        unset($y);

        //selections
        foreach ($this->config->getValue("sat_positions") as $sat => $languages){
            //$this->writeAllChannelSelections2Disk( $sat );
            $this->writeAllUncategorizedChannels2Disk( $sat );
            if (in_array("de", $languages)){
                $this->epgMappings( $sat, $sat, "tvm");
                $this->epgMappings( $sat, $sat, "epgdata");
            }

        }
        foreach ($this->config->getValue("cable_providers") as $cablep => $languages){
            //$this->writeAllChannelSelections2Disk( "C[$cablep]" );
            $this->writeAllUncategorizedChannels2Disk( "C[$cablep]" );
            if (in_array("de", $languages)){
                $this->epgMappings( "C", "C[$cablep]", "tvm");
                $this->epgMappings( "C", "C[$cablep]", "epgdata");
            }
        }
        foreach ($this->config->getValue("terr_providers") as $terrp => $languages){
            //$this->writeAllChannelSelections2Disk( "T[$terrp]" );
            $this->writeAllUncategorizedChannels2Disk( "T[$terrp]" );
            if (in_array("de", $languages)){
                $this->epgMappings( "T", "T[$terrp]", "tvm");
                $this->epgMappings( "T", "T[$terrp]", "epgdata");
            }
        }
    }

    private function writeAllChannelSelections2Disk( $source){
        $sourcetype = substr($source, 0, 1);
        foreach ( channelGroupingRulesStore::getRules() as $title => $config){
            if ( $sourcetype == "S"){
                if ( $config["validForSatellites"] === "all" || ( is_array( $config["validForSatellites"] ) && in_array( $source, $config["validForSatellites"], true)) ){
                    foreach ($config["groups"] as $grouptitle => $groupsettings){
                        $y = new channelListWriter( $config["country"] . "." . $grouptitle, $source);
                        $y->writeFile();
                    }
                }
            }
            elseif ( $sourcetype == "C"){
                if ( $config["validForCableProviders"] === "all" || ( is_array( $config["validForCableProviders"] ) && in_array( $source, $config["validForCableProviders"], true)) ){
                    foreach ($config["groups"] as $grouptitle => $groupsettings){
                        $y = new channelListWriter( $config["country"] . "." . $grouptitle, $source);
                        $y->writeFile();
                    }
                }
            }
            elseif ( $sourcetype == "T"){
                if ( $config["validForTerrProviders"] === "all" || ( is_array( $config["validForTerrProviders"] ) && in_array( $source, $config["validForTerrProviders"], true)) ){
                    foreach ($config["groups"] as $grouptitle => $groupsettings){
                        $y = new channelListWriter( $config["country"] . "." . $grouptitle, $source);
                        $y->writeFile();
                    }
                }
            }
        }
    }

    private function writeAllUncategorizedChannels2Disk( $source){
        //also write a complete channels.conf for this source grouped by transponders, containing all existing channels
        $y = new channelListWriter( "uncategorized", $source );
        $y->writeFile();
        unset($y);
    }

    /*
     * epgservice can be either epgdata or tvm
     */

    private function epgMappings( $shortsource, $source, $epgservice){
        $db = dbConnection::getInstance();
        if ( $epgservice != "epgdata" && $epgservice != "tvm")
            throw("Illegal epgservice value!");
        $mapping = unserialize(file_get_contents("epg_mappings/".$epgservice."2vdr.txt"));
        $map = "";
        $notfoundlist = array();
        foreach ($mapping as $channel => $epgid){
            $origchannel = $channel;
            $channel = $this->fixChannelName($channel);
            if (substr($channel, -1, 1) == "%")
                $querypart = "UPPER(name) LIKE" . $db->quote(strtoupper($channel)) . " ";
            else
                $querypart = "UPPER(name) =" . $db->quote(strtoupper($channel)) . " ";

            $sqlquery=
                "SELECT * FROM channels ".
                "WHERE source = ".$db->quote($source)." ".
                "AND vpid != '0' ". //only tv channels
                "AND (x_label LIKE 'de.%' OR x_label LIKE 'at.%' OR x_label LIKE 'ch.%') ".
                "AND ( ".
                $querypart.
                "OR UPPER(name) LIKE" . $db->quote(strtoupper($channel.' HD%')) . " ".
                "OR UPPER(name) LIKE " . $db->quote(strtoupper($channel.',%')). " ".
                "OR UPPER(name) LIKE " . $db->quote(strtoupper($channel.'.%')). " ".
            ")";
            $result = $db->query($sqlquery);
            $idlist = array();
            $comments = array();
            foreach ($result as $row){
                $idlist[] = $shortsource . "-" . $row["nid"] . "-" . $row["tid"] . "-" . $row["sid"];
                $comments[] = $this->config->channelArray2ChannelString($row);
            }
            if (count($idlist) > 0 ){
                $map .=
                    "//\n".
                    "//=======================================================\n".
                    "// '" . $origchannel . "' (" . $epgid . ")\n".
                    "//-------------------------------------------------------\n".
                    "//\n".
                    "//  ".
                    "found matches:\n//    " .implode( "\n//    ", $comments )."\n//\n".
                    $epgid . " = " . implode( ",", $idlist )."\n"
                    ;
            }
            else{
                $notfoundlist[] = $origchannel . " (" . $epgid . ")";
            }
        }
        if ($map != ""){
            $map =
                "//\n".
                "// ChannelMap for ".strtoupper($epgservice)."2VDR-Plugin\n".
                "// --------------------------\n".
                "// automatically generated by yaVDR Channelpedia\n".
                "// created on: ". date("D M j G:i:s T Y")."\n".
                "// only valid for provider/source ". $source . "\n".
                "//\n".
                "//=======================================================\n".
                "// WARNING: We couldn't match the following channels:\n".
                "// You have to care for them manually.\n".
                "// Do these channels exist with your provider?\n".
                "//  ".implode( "\n//  ", $notfoundlist).
                "\n//\n".
                $map.
                "//\n";

            $gpath = $this->config->getValue("path"). $this->config->getValue("exportfolder")."/raw/channelmaps/";
            $filename = $gpath . $source . '.' . $epgservice . '2vdr_channelmap.conf';
            print "Writing channelmap $filename\n";
            file_put_contents($filename, $map);
        }
    }

    //this is the most stupid way to fix the problem
    private function fixChannelName($channel){

        switch ($channel) {
        case "ARD":
            $channel = "Das Erste";
            break;
        case "ZDFneo":
            $channel = "ZDF_neo";
            break;
        case "ZDFinfo":
            $channel = "ZDFinfokanal";
            break;
        case "SAT1":
            $channel = "SAT.1";
            break;
        case "RTL":
            $channel = "RTL Television"; // doesn't work good
            break;
        case "S RTL":
            $channel = "Super RTL";
            break;
        case "RTL II":
            $channel = "RTL2";
            break;
        case "DSF":
            $channel = "Sport1";
            break;
        case "VIVA":
            $channel = "VIVA Germany";
            break;
        case "Ki.Ka":
        case "KI.KA":
            $channel = "KIKA";
            break;
        case "ORF 1":
            $channel = "ORF1";
            break;
        case "ORF 2":
            $channel = "ORF2";
            break;
        case "NDR":
        case "NDR":
        case "HR":
        case "MDR":
        case "WDR":
        case "SWR":
        case "RBB":
            $channel = $channel."%";
            break;
        case "BR":
            $channel = "Bayerisches FS %";
            break;
        case "BR alpha":
        case "BR Alpha":
            $channel = "BR-alpha";
            break;
        case "SKY Fußball Bundesliga"://do not use UTF-8 here!!!
            $channel = "SKY Bundesliga";
            break;
        case "SKY Sport HD":
            $channel = "SKY Sport HD 1";
            break;
        case "rheinmainTV":
            $channel = "rhein main TV";
            break;
        case "National Geographic HD":
            $channel = "NatGeo HD";
            break;
        }


        return $channel;
    }

/*
NTV, Kabel, DSF, ORF 1, ORF 2, B3, NDR, SF 1, H3, RBB, WDR, SWR, ATV+,
 MDR, TV Berlin, SF 2, TV München, HH1, BR Alpha, Ki.Ka, NL1, NL2, NL3, DK1, DK2, Tele5, MTV,
  VIVA, CNN, TV5, QVC, S RTL, Home Shopping Europe, EinsMuXx, Planet, SCI FI, Beate-Uhse-TV,
   XXP, ZDFInfo, Discovery Geschichte, FOCUS Gesundheit, RTL Shop, Silverline, Bibel-TV, BBC,
    ESPN Classic Sport, NASN, History Channel, Extreme Sports Channel, Wetter Fernsehen, tv.gusto premium,
     Sailing Channel, Gute Laune TV, Trace.TV, SPIEGEL TV XXP DIGITAL, E! Entertainment Television,
      Fashion TV, münchen 2, The Biography Channel, Turner Classic Movies, MTV Base,
      Kanal 7 Int, Zone Reality Europe, Baby TV, The Karaoke Channel, Tier TV,
       ATV Avrupa, Detski Mir / Teleclub, Euro D, Euro Star, iTVN, LIG TV, RTR-Planeta, Nashe Kino,
        Show Turk, RTVi, Türkmax, DELUXE MUSIC TV, MTV Entertainment, Nick Premium, FOX Channel, TIMM,
         SKY Fußball Bundesliga, SKY Sport HD, National Geographic Wild, TGRT EU, BloombergTV, fashiontv HD, sportdigital.tv, National Geographic HD, Sonnenklar.TV, LUST PUR, BBC Entertainment, OKTO TV, AutoMotorSportChannel, Austria9, yourfamilyentertainment, NRW.TV, PULS 4, Alpengluehen TVX, Nick jr., iMusic1, Astro TV
*/


}

?>