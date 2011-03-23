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

class HTMLOutputRenderer{

    private
        $db,
        $exportpath,
        $config,
        $linklist = array();

    function __construct(){
        $this->db = dbConnection::getInstance();
        $this->config = config::getInstance();
        $this->exportpath = $this->config->getValue("path").$this->config->getValue("exportfolder")."/html/";

        //FIXME: Don't store this like this
        $source_languages = array(
            "S19.2E" => array( "de", "at", "ch", "es", "fr", "pl","nl"),
            "S28.2E" => array( "en")
        );

        $this->addDividerTitle("Essential channels (pre-sorted lists)");

        $this->addDividerTitle("Satellite positions");
        foreach ($this->config->getValue("sat_positions") as $sat){
            $this->addDividerTitle($sat);
            foreach ($source_languages[$sat] as $language)
                $this->writeNiceHTMLPage( $sat, $language );
            $this->addUncategorizedListLink( $sat );
            $this->closeHierarchy();
        }
        $this->closeHierarchy();
        $this->addDividerTitle("Cable providers");
        foreach ($this->config->getValue("cable_providers") as $cablep){
            $this->addDividerTitle($cablep);
            $this->writeNiceHTMLPage( "C[$cablep]", "de" );
            $this->addUncategorizedListLink( "C[$cablep]" );
            $this->closeHierarchy();
            }
        $this->closeHierarchy();
        $this->addDividerTitle("Terrestrial providers");
        foreach ($this->config->getValue("terr_providers") as $terrp){
            $this->addDividerTitle($terrp);
            $this->writeNiceHTMLPage("T[$terrp]", "de");
            $this->addUncategorizedListLink("T[$terrp]");
            $this->closeHierarchy();
        }
        $this->closeHierarchy();
        $this->closeHierarchy();
        $this->addDividerTitle("Complete lists (grouped by transponder)");

        foreach ($this->config->getValue("sat_positions") as $sat){
            $this->addCompleteListLink( $sat );
        }
        foreach ($this->config->getValue("cable_providers") as $cablep){
            $this->addCompleteListLink( "C[$cablep]" );
        }
        foreach ($this->config->getValue("terr_providers") as $terrp){
            $this->addCompleteListLink("T[$terrp]");
        }
        $this->closeHierarchy();
        $this->addDividerTitle("Changelog");

        $this->writeChangelog("", 1 ); //general changelog for all sources
        foreach ($this->config->getValue("sat_positions") as $sat){
            $this->writeChangelog( $sat );
        }
        foreach ($this->config->getValue("cable_providers") as $cablep){
            $this->writeChangelog( "C[$cablep]" );
        }
        foreach ($this->config->getValue("terr_providers") as $terrp){
            $this->writeChangelog("T[$terrp]");
        }
        $this->closeHierarchy();
/*
        $this->addDividerTitle("(Yet) Uncategorized channels (grouped by transponder)");
        foreach ($this->config->getValue("sat_positions") as $sat){
            $this->addUncategorizedListLink( $sat );
        }
        foreach ($this->config->getValue("cable_providers") as $cablep){
            $this->addUncategorizedListLink( "C[$cablep]" );
        }
        foreach ($this->config->getValue("terr_providers") as $terrp){
            $this->addUncategorizedListLink("T[$terrp]");
        }
        $this->closeHierarchy();
*/
        $this->renderIndexPage();
    }

    private function addCompleteListLink( $source ){
        $filename = "../raw/channels_".$source."__complete.conf";
        $this->addToOverview("$source - complete", $filename);
    }

    private function addUncategorizedListLink( $source ){
        $filename = "../raw/channels_".$source."_uncategorized.conf";
        $this->addToOverview("uncategorized rest", $filename);
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

    /*
     *
     * example for usage of channel iterator
    $y = new channelIterator("", "S19.2E");
    while ($y->moveToNextChannel() !== false){
        if ($y->transponderChanged())
            print ": ### ".$y->getCurrentTransponderInfo()." ###\n";
        $channel = $y->getCurrentChannelString();
        print $channel."\n";
    }
    print "Number of channels processed: " . $y->getCurrentChannelCount() . "\n";
    unset($y);
    die();
    */

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
        $header = preg_replace("/\[PAGE_TITLE\]/",$pagetitle,file_get_contents("templates/html_header.html"));

        $buffer = $header.'
	    <h1>'.$pagetitle.'</h1><p>Last updated on: '. date("D M j G:i:s T Y")."</p>\n<table>\n";
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
        $buffer .= "<table>\n".file_get_contents("templates/html_footer.html");
        $filename = "changelog_".$source.".html";
        $this->addToOverview($pagetitle, $filename);
        file_put_contents($this->exportpath . $filename, $buffer );
    }

    //assembles all pre-written channel lists from hdd into one html page
    public function writeNiceHTMLPage($source, $language){
        $pagetitle = ''.$source.' (Language/Region: '.$language.')';
        $header = preg_replace("/\[PAGE_TITLE\]/",$pagetitle,file_get_contents("templates/html_header.html"));
        $nice_html_output =
            $header.
            '<h1>'.htmlspecialchars( $pagetitle).'</h1>
            <p>Last updated on: '. date("D M j G:i:s T Y").'</p>
        ';
        $dirname = $this->config->getValue("path").$this->config->getValue("exportfolder")."/raw";
        $dir = new DirectoryIterator( $dirname );
        $dirs = array();
        foreach ($dir as $fileinfo) {
            $prefix= "channels_".$source."_".$language;
            if ( $fileinfo->isFile() && substr($fileinfo->getFilename(),0, strlen($prefix)) == $prefix){// && !$fileinfo->isDot()){
                //echo $fileinfo->getFilename() . "\n";
                $infofile = $dirname."/". $fileinfo->getFilename();
                if (file_exists( $infofile )){
                    $dirs[ $fileinfo->getFilename() ] = $infofile;
                }
            }
        }
        ksort($dirs);
        $nice_html_body = "";
        $nice_html_linklist = "";
        foreach ($dirs as $filename => $filepath) {
            $prestyle = (strstr($filename, "FTA") === false  || strstr($filename, "scrambled") !== false) ? ' class = "scrambled" ' : '';
            $nice_html_body .=
                '<h2'.$prestyle.'><a name ="'.htmlspecialchars($filename).'">'.htmlspecialchars($filename)."</a></h2>\n".
                "<pre".$prestyle.">". htmlspecialchars(file_get_contents( $filepath )) ."</pre>\n";
            $nice_html_linklist .= '<li><a href="#'.htmlspecialchars($filename).'">'.htmlspecialchars($filename).'</a></li>';
        }
        $nice_html_output .=
        	"<h2>Overview</h2><ul>" .
            $nice_html_linklist . "</ul>\n".
            $nice_html_body.
            file_get_contents("templates/html_footer.html");

        $filename = "channels_".$language."_".$source.".html";
        $this->addToOverview( $language, $filename );
        file_put_contents($this->exportpath . $filename, $nice_html_output );
    }

    private function renderIndexPage(){
        $pagetitle = "Channelpedia - Overview";
        $header = preg_replace("/\[PAGE_TITLE\]/",$pagetitle,file_get_contents("templates/html_header.html"));
        $nice_html_output =
            $header.
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
              $nice_html_output .= "</ul>\n";
           else
              $nice_html_output .= '<li><a href="'. htmlspecialchars( $url ) .'">'.htmlspecialchars( $title )."</a></li>\n";
        }

        $nice_html_output .= "</ul>\n".file_get_contents("templates/html_footer.html");
        file_put_contents($this->exportpath . "index.html", $nice_html_output );

    }

}
?>