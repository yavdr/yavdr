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

class HTMLOutputRenderer{

    const
        stylesheet = "templates/styles.css",
        htmlHeaderTemplate = "templates/html_header.html",
        htmlFooterTemplate = "templates/html_footer.html",
        htmlCustomFooterTemplate = "templates/html_custom_footer.html";

    private
        $db,
        $exportpath,
        $config,
        $linklist = array(),
        $html_header_template = "",
        $html_footer_template = "";

    function __construct(){
        $this->db = dbConnection::getInstance();
        $this->config = config::getInstance();
        $this->exportpath = $this->config->getValue("path").$this->config->getValue("exportfolder")."/html/";

        $this->addDividerTitle("Essential channels (pre-sorted lists)");

        $this->addDividerTitle("Satellite positions");
        foreach ($this->config->getValue("sat_positions") as $sat => $languages){
            $this->addDividerTitle($sat);
            foreach ($languages as $language)
                $this->writeNiceHTMLPage( $sat, $language );
            $this->addUncategorizedListLink( $sat );
            $this->renderGroupingHints( $sat );
            $this->addCompleteListLink( $sat );
            if (in_array("de", $languages)){
                $this->addEPGChannelmapLink( $sat );
            }
            $this->closeHierarchy();
        }
        $this->closeHierarchy();
        $this->addDividerTitle("Cable providers");
        foreach ($this->config->getValue("cable_providers") as $cablep => $languages){
            $this->addDividerTitle($cablep);
            foreach ($languages as $language)
                $this->writeNiceHTMLPage( "C[$cablep]", $language );
            $this->addUncategorizedListLink( "C[$cablep]" );
            $this->renderGroupingHints( "C[$cablep]" );
            $this->addCompleteListLink( "C[$cablep]" );
            if (in_array("de", $languages)){
                $this->addEPGChannelmapLink( "C[$cablep]" );
            }
            $this->closeHierarchy();
            }
        $this->closeHierarchy();
        $this->addDividerTitle("Terrestrial providers");
        foreach ($this->config->getValue("terr_providers") as $terrp => $languages){
            $this->addDividerTitle($terrp);
            foreach ($languages as $language)
                $this->writeNiceHTMLPage("T[$terrp]", $language);
            $this->addUncategorizedListLink("T[$terrp]");
            $this->renderGroupingHints( "T[$cablep]" );
            $this->addCompleteListLink("T[$terrp]");
            if (in_array("de", $languages)){
                $this->addEPGChannelmapLink( "T[$terrp]" );
            }
            $this->closeHierarchy();
        }
        $this->closeHierarchy();
        $this->closeHierarchy();
        $this->addDividerTitle("Changelog");

        $this->writeChangelog("", 1 ); //general changelog for all sources
        foreach ($this->config->getValue("sat_positions") as $sat => $languages){
            $this->writeChangelog( $sat );
        }
        foreach ($this->config->getValue("cable_providers") as $cablep => $languages){
            $this->writeChangelog( "C[$cablep]" );
        }
        foreach ($this->config->getValue("terr_providers") as $terrp => $languages){
            $this->writeChangelog("T[$terrp]");
        }
        $this->closeHierarchy();

        $this->addDividerTitle("Reports");
        $this->renderDEComparison();
        $this->renderUnconfirmedChannels("S19.2E");
        $this->renderUnconfirmedChannels("S28.2E");
        $this->closeHierarchy();

        $this->renderIndexPage();
    }

    private function getHTMLHeader($pagetitle){
        if ( $this->html_header_template == ""){
            //prepare html header template + stylesheet include
            $stylefile = "styles_". md5( file_get_contents( HTMLOutputRenderer::stylesheet ) ). ".css";
            $this->html_header_template =
                preg_replace( "/\[STYLESHEET\]/", $stylefile, file_get_contents( HTMLOutputRenderer::htmlHeaderTemplate));
            //TODO: delete old stylesheet files before copying new one
            if (!file_exists($this->exportpath . $stylefile))
                copy( HTMLOutputRenderer::stylesheet, $this->exportpath . $stylefile );
        }
        return preg_replace( "/\[PAGE_TITLE\]/", htmlspecialchars($pagetitle), $this->html_header_template );
    }

    private function getHTMLFooter(){
        if ( $this->html_footer_template == ""){
            $customfooter = "";
            if (file_exists("templates/html_custom_footer.html")){
                $customfooter = file_get_contents( HTMLOutputRenderer::htmlCustomFooterTemplate);
            }
            $this->html_footer_template =
                preg_replace( "/\[CUSTOM_FOOTER\]/", $customfooter, file_get_contents( HTMLOutputRenderer::htmlFooterTemplate) );
        }
        return $this->html_footer_template;
    }

    private function addCompleteListLink( $source ){
        $filename = "../raw/channels_".$source."__complete.conf";
        $this->addToOverview("Complete", $filename);
    }

    private function addUncategorizedListLink( $source ){
        $filename = "../raw/channels_".$source."_uncategorized.conf";
        $this->addToOverview("uncategorized rest", $filename);
    }

    private function addEPGChannelmapLink( $source ){
        $filename = "../raw/channelmaps/".$source.".epgdata2vdr_channelmap.conf";
        $this->addToOverview("epgdata2vdr Channelmap", $filename);
        $filename = "../raw/channelmaps/".$source.".tvm2vdr_channelmap.conf";
        $this->addToOverview("tvm2vdr Channelmap", $filename);
    }

    private function addDividerTitle( $title ){
        $this->addToOverview( $title, "");
    }

    private function addToOverview( $param, $value){
        $this->linklist[] = array( $param, $value);
    }

    private function closeHierarchy(){
        $this->linklist[] = array( "", "close");
    }

    public function writeChangelog($source, $importance = 0){

        $where = array();
        $wherestring = "";
        if ($source != "")
            $where[] = " combined_id LIKE ".$this->db->quote( $source."%" ) . " ";
        else
            $source = "all_sources";
        if ($importance === 1 ){
        	$where[] = " importance = $importance ";
        }
        if (count($where) > 0){
            $wherestring = "WHERE ". implode(" AND ", $where);
        }

        $sqlquery=
            "SELECT DATETIME( timestamp, 'unixepoch', 'localtime' ) AS datestamp, name, combined_id, importance, update_description ".
            "FROM channel_update_log $wherestring ORDER BY timestamp DESC LIMIT 100";
        $result = $this->db->query($sqlquery);
        $pagetitle = 'Changelog for '.$source.'';
        $buffer =
            $this->getHTMLHeader($pagetitle)."\n".
            '<h1>'.htmlspecialchars($pagetitle).'</h1><p>Last updated on: '. date("D M j G:i:s T Y")."</p>\n<table>\n";

        foreach ($result as $row) {
            $desclist = explode("\n", $row["update_description"]);
            $desc = "";
            foreach ($desclist as $descitem){
                $delimiter = strpos( $descitem, ":");
                $desc .= "<b>" .
                    htmlspecialchars( substr( $descitem,0, $delimiter)) . "</b>" .
                    htmlspecialchars( substr( $descitem, $delimiter)) . "<br/>";
            }
            $class = "changelog_row_style_".$row["importance"];
            $buffer.='<tr class="'.$class.'"><td>'.
            htmlspecialchars( $row["datestamp"] ). "</td><td>".
            htmlspecialchars( $row["name"] ). "</td><td>".
            htmlspecialchars( $row["combined_id"] ). "</td><td>".
            $desc.
            "</td></tr>\n";
        }
        $buffer .= "<table>\n".$this->getHTMLFooter();
        $filename = "changelog_".$source.".html";
        $this->addToOverview($pagetitle, $filename);
        file_put_contents($this->exportpath . $filename, $buffer );
    }

    //assembles all pre-written channel lists from hdd into one html page
    public function writeNiceHTMLPage($source, $language){
        $pagetitle = ''.$source.' (Language/Region: '.$language.')';
        $nice_html_output =
            $this->getHTMLHeader($pagetitle).
            '<h1>'.htmlspecialchars( $pagetitle)."</h1>\n
            <p>Last updated on: ". date("D M j G:i:s T Y")."</p>\n";
        $nice_html_body = "";
        $nice_html_linklist = "";

        $groupIterator = new channelGroupIterator();
        $groupIterator->init($source, $language);
        while ($groupIterator->moveToNextChannelGroup() !== false){
            $cols = $groupIterator->getCurrentChannelGroupArray();
            //print "Processing channelgroup ".$cols["x_label"]."\n";
            $html_table = "";
            $shortlabel =
            preg_match ( "/.*?\.\d*?\.(.*)/" , $cols["x_label"], $shortlabelparts );
            if (count($shortlabelparts) == 2)
                $shortlabel =$shortlabelparts[1];
            else
                $shortlabel = $cols["x_label"];
            $prestyle = (strstr($shortlabel, "FTA") === false  || strstr($shortlabel, "scrambled") !== false) ? ' class = "scrambled" ' : '';
            $escaped_shortlabel = htmlspecialchars($shortlabel);
            $nice_html_body .=
                '<h2'.$prestyle.'>'.
                '<a name ="'.$escaped_shortlabel.'">'.$escaped_shortlabel . " (" . $cols["channelcount"] . ' channels)</a>'.
                "</h2>\n".
                "<h3>VDR channel format</h3>\n<pre".$prestyle.">";
            $x = new channelIterator();
            $x->init1($cols["x_label"], $source, $orderby = "UPPER(name) ASC");
            while ($x->moveToNextChannel() !== false){
                if ($html_table == ""){
                    $html_table = "<h3>Table view</h3>\n<div class=\"tablecontainer\"><table>\n<tr>";
                    foreach ($x->getCurrentChannelArrayKeys() as $header){
                        $html_table .= '<th class="'.htmlspecialchars($header).'">'.htmlspecialchars(ucfirst($header))."</th>\n";
                    }
                    $html_table .= "</tr>\n";
                }
                $nice_html_body .= htmlspecialchars( $x->getCurrentChannelString())."\n";
                $html_table .= "<tr".$prestyle.">\n";
                foreach ($x->getCurrentChannelArray() as $param => $value){
                    if ($param == "apid" || $param == "caid"){
                        $value = str_replace ( array(",",";"), ",<br/>", htmlspecialchars($value ));
                    }
                    elseif ($param == "x_last_changed"){
                        $value = date("D, d M Y H:i:s", $value);
                    }
                    else
                        $value = htmlspecialchars($value);
                    $html_table .= '<td class="'.htmlspecialchars($param).'">'.$value."</td>\n";
                }
                $html_table .= "</tr>\n";
            }
            $html_table .= "</table></div>";
            $nice_html_body .= "</pre>\n";
            //$nice_html_body .= "</pre>\n".$html_table;
            $nice_html_linklist .= '<li><a href="#'.$escaped_shortlabel.'">'.$escaped_shortlabel. " (" . $cols["channelcount"] . " channels)</a></li>\n";
        }

        $nice_html_output .=
            "<h2>Overview</h2><ul class=\"overview\">" .
            $nice_html_linklist . "</ul>\n".
            $nice_html_body.
            $this->getHTMLFooter();

        $filename = "channels_".$language."_".$source.".html";
        $this->addToOverview( $language, $filename );
        file_put_contents($this->exportpath . $filename, $nice_html_output );
    }

    private function renderDEComparison(){
        $pagetitle = "Comparison: Parameters of German public TV channels at different providers";
        $nice_html_output =
            $this->getHTMLHeader($pagetitle).
            '<h1>'.htmlspecialchars( $pagetitle ).'</h1>
            <p>Last updated on: '. date("D M j G:i:s T Y").'</p>';
        $html_table = "";
        $x = new channelIterator();
        $x->init2( "SELECT * FROM channels WHERE x_label LIKE 'de.%' AND lower(x_label) LIKE '%public%' ORDER by x_label ASC, lower(name) ASC, source ASC");
        $lastname = "";
        while ($x->moveToNextChannel() !== false){
            $carray = $x->getCurrentChannelArray();
            if (strtolower($carray["name"]) != strtolower($lastname)){
                if ($lastname != ""){
                    $html_table .= "</table>\n</div>\n";
                }
                $html_table .= "<h2>".htmlspecialchars($carray["name"])."</h2>\n<h3>Table view</h3>\n<div class=\"tablecontainer\"><table>\n<tr>";
                foreach ($x->getCurrentChannelArrayKeys() as $header){
                    $html_table .= '<th class="'.htmlspecialchars($header).'">'.htmlspecialchars(ucfirst($header))."</th>\n";
                }
                $html_table .= "</tr>\n";
            }
            $html_table .= "<tr>\n";
            foreach ($carray as $param => $value){
                if ($param == "apid" || $param == "caid"){
                    $value = str_replace ( array(",",";"), ",<br/>", htmlspecialchars($value ));
                }
                elseif ($param == "x_last_changed"){
                    $value = date("D, d M Y H:i:s", $value);
                }
                else
                    $value = htmlspecialchars($value);
                $html_table .= '<td class="'.htmlspecialchars($param).'">'.$value."</td>\n";
            }
            $html_table .= "</tr>\n";
            $lastname = $carray["name"];
        }
        $html_table .= "</table></div>\n";
        $nice_html_output .=
            $html_table .
            $this->getHTMLFooter();
        $filename = "parameter_comparison_de.html";
        $this->addToOverview( "Comparison: Parameters of German public TV channels at different providers", $filename );
        file_put_contents($this->exportpath . $filename, $nice_html_output );
    }

    private function renderUnconfirmedChannels($source){
        $pagetitle = "Unconfirmed channels on $source / likely to be outdated";
        $nice_html_output =
            $this->getHTMLHeader($pagetitle).
            '<h1>'.htmlspecialchars( $pagetitle ).'</h1>
            <p>Last updated on: '. date("D M j G:i:s T Y").'</p>';
        $html_table = "";

        $sqlquery = "SELECT x_last_confirmed FROM channels WHERE source = ".$this->db->quote($source)." ORDER BY x_last_confirmed DESC LIMIT 1";
        $result = $this->db->query($sqlquery);
        $timestamp = $result->fetchAll();
        $timestamp = $timestamp[0][0];
        $nice_html_output .= "<p>Looking for channels that were last confirmed before ". date("D, d M Y H:i:s", $timestamp). " ($timestamp)</p>\n";

        $x = new channelIterator();
        $x->init2( "SELECT * FROM channels WHERE source = ".$this->db->quote($source)." AND x_last_confirmed < ".$timestamp);
        $lastname = "";
        while ($x->moveToNextChannel() !== false){
            $carray = $x->getCurrentChannelArray();
            if ($lastname == ""){
                $html_table .= "<h3>Table view</h3>\n<div class=\"tablecontainer\"><table>\n<tr>";
                foreach ($x->getCurrentChannelArrayKeys() as $header){
                    $html_table .= '<th class="'.htmlspecialchars($header).'">'.htmlspecialchars(ucfirst($header))."</th>\n";
                }
                $html_table .= "</tr>\n";
            }
            $html_table .= "<tr>\n";
            foreach ($carray as $param => $value){
                if ($param == "apid" || $param == "caid"){
                    $value = str_replace ( array(",",";"), ",<br/>", htmlspecialchars($value ));
                }
                elseif ($param == "x_last_changed"){
                    $value = date("D, d M Y H:i:s", $value);
                }
                else
                    $value = htmlspecialchars($value);
                $html_table .= '<td class="'.htmlspecialchars($param).'">'.$value."</td>\n";
            }
            $html_table .= "</tr>\n";
            $lastname = $carray["name"];
        }
        $html_table .= "</table></div>\n";
        $nice_html_output .=
            $html_table .
            $this->getHTMLFooter();
        $filename = "unconfirmed_channels_".$source.".html";
        $this->addToOverview( $pagetitle, $filename );
        file_put_contents($this->exportpath . $filename, $nice_html_output );
    }


    private function renderGroupingHints($source){
        $pagetitle = "Grouping hints for unsorted channels of ".$source;
        $nice_html_output =
            $this->getHTMLHeader($pagetitle).
            '<h1>'.htmlspecialchars( $pagetitle ).'</h1>
            <p>Last updated on: '. date("D M j G:i:s T Y").'</p>';
        $html_table = "<table><tr><th>Provider</th><th>Number of related channels</th></tr>\n";
        $nice_html_body = "";
        $result = $this->db->query(
            "SELECT provider, COUNT(*) AS providercount FROM channels ".
            "WHERE source = ".$this->db->quote($source).
            " AND x_label = '' GROUP BY provider ORDER by providercount DESC"
        );
        foreach ($result as $row) {
            $html_table .= "<tr><td>".htmlspecialchars($row["provider"])."</td><td>".htmlspecialchars($row["providercount"])."</td></tr>\n";
            $nice_html_body .= "<h2>".htmlspecialchars($row["provider"]). " (" . htmlspecialchars($row["providercount"]) ." channels)</h2>\n<pre>\n";
            $x = new channelIterator();
            $x->init2( "SELECT * FROM channels ".
                "WHERE source = ".$this->db->quote($source)." AND ".
                "x_label = '' AND provider = ".$this->db->quote($row["provider"]).
                " ORDER by x_label ASC, lower(name) ASC, source ASC");
            while ($x->moveToNextChannel() !== false){
                $nice_html_body .= htmlspecialchars( $x->getCurrentChannelString())."\n";
            }
            $nice_html_body .= "</pre>";
        }

        $html_table .= "</table>\n";
        $nice_html_output .=
            $html_table .
            $nice_html_body.
            $this->getHTMLFooter();
        $filename = "grouping_hints_".$source.".html";
//        $this->addDividerTitle("Reports");
        $this->addToOverview( "Grouping hints", $filename );
        file_put_contents($this->exportpath . $filename, $nice_html_output );
    }

    private function renderIndexPage(){
        $pagetitle = "Channelpedia - Overview";
        $nice_html_output =
            $this->getHTMLHeader($pagetitle).
            '<h1>'.htmlspecialchars( $pagetitle ).'</h1>
            <p>Last updated on: '. date("D M j G:i:s T Y").'</p>
            <ul>
        ';
        foreach ($this->linklist as $line){
           $title = $line[0];
           $url = $line[1];
           if($url == "")
               $nice_html_output .= '<li><b>'.htmlspecialchars( $title )."</b></li>\n<ul>";
           elseif($url == "close")
               $nice_html_output .= "<br clear=\"all\" /></ul>\n";
           else
              $nice_html_output .= '<li><a href="'. htmlspecialchars( $url ) .'">'.htmlspecialchars( $title )."</a></li>\n";
        }

        $nice_html_output .= "<br clear=\"all\" /></ul>\n".$this->getHTMLFooter();
        file_put_contents($this->exportpath . "index.html", $nice_html_output );

    }

}
?>