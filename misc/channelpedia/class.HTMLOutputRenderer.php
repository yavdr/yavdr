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
        $dbh,
        $exportpath,
        $config,
        $linklist = array();

    function __construct(){
        $db = dbConnection::getInstance();
        $this->dbh = $db->getDBHandle();
        $this->config = config::getInstance();
        $this->exportpath = $this->config->getValue("path").$this->config->getValue("exportfolder")."/html/";

        $this->addDividerTitle("Complete lists (grouped by transponder)");
        $this->addCompleteListLink( "S19.2E" );
        $this->addCompleteListLink( "S28.2E" );
        $this->addCompleteListLink("C[Germany_KabelBW]");
        $this->addCompleteListLink("C[Germany_wilhelmTel]");
        $this->addCompleteListLink("C[Germany_kabelDeutschland]");

        $this->addDividerTitle("Essential channels (pre-sorted lists)");
        $this->writeNiceHTMLPage("S19.2E", "de");
        $this->writeNiceHTMLPage("S19.2E", "at");
        $this->writeNiceHTMLPage("S19.2E", "ch");
        $this->writeNiceHTMLPage("S28.2E", "eng");
        $this->writeNiceHTMLPage("C[Germany_kabelDeutschland]", "de");
        $this->writeNiceHTMLPage("C[Germany_KabelBW]", "de");
        $this->writeNiceHTMLPage("C[Germany_wilhelmTel]", "de");

        $this->addDividerTitle("Changelog");
        $this->writeChangelog("", 1 ); //general changelog for all sources
        $this->writeChangelog("S19.2E");
        $this->writeChangelog("S28.2E");
        $this->writeChangelog("C[Germany_KabelBW]");
        $this->writeChangelog("C[Germany_wilhelmTel]");
        $this->writeChangelog("C[Germany_kabelDeutschland]");

        $this->addDividerTitle("(Yet) Uncategorized channels (grouped by transponder)");
        $this->addUncategorizedListLink( "S19.2E" );
        $this->addUncategorizedListLink( "S28.2E" );
        $this->addUncategorizedListLink("C[Germany_KabelBW]");
        $this->addUncategorizedListLink("C[Germany_wilhelmTel]");
        $this->addUncategorizedListLink("C[Germany_kabelDeutschland]");

        $this->renderIndexPage();
    }

    private function addCompleteListLink( $source ){
        $pagetitle = "Complete channel list of $source";
        $filename = "../raw/channels_".$source."__complete.conf";
        $this->linklist[$pagetitle] = $filename;
    }

    private function addUncategorizedListLink( $source ){
        $pagetitle = "List of uncategorized channels of $source";
        $filename = "../raw/channels_".$source."_uncategorized.conf";
        $this->linklist[$pagetitle] = $filename;
    }

    private function addDividerTitle( $title ){
        $this->linklist[$title] = "";
    }


    /*
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
            $where[] = " combined_id LIKE ".$this->dbh->quote( $source."%" ) . " ";
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
        $result = $this->dbh->query($sqlquery);
        if ($result === false)
            die("\nDB-Error: " . $this->dbh->errorCode() . " / " . $sqlquery);
        $pagetitle = 'Changelog for '.$source.'';
        $header = preg_replace("/\[PAGE_TITLE\]/",$pagetitle,file_get_contents("templates/html_header.html"));

        $buffer = $header.'
	    <h1>'.$pagetitle.'</h1><p>Last updated on: '. date("D M j G:i:s T Y").'</p>
        <table>';
        foreach ($result as $row) {
            $desclist = explode("\n", $row["update_description"]);
            $desc = "";
            foreach ($desclist as $descitem){
                $delimiter = strpos( $descitem, ":");
                $desc .= "<b>" .
                    htmlspecialchars( substr( $descitem,0, $delimiter)) . "</b>" .
                    htmlspecialchars( substr( $descitem, $delimiter)) . "</br>";
            }
            $class = "changelog_row_style_".$row["importance"];
            $buffer.='<tr class="'.$class.'"><td>'.
            htmlspecialchars( $row["datestamp"] ). "</td><td>".
            htmlspecialchars( $row["name"] ). "</td><td>".
            htmlspecialchars( $row["combined_id"] ). "</td><td>".
            $desc.
            "</td></tr>\n";
        }
        $buffer .= "<table></body></html>";
        $filename = "changelog_".$source.".html";
        $this->linklist[$pagetitle] = $filename;
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
            $nice_html_body .=
                '<h2><a name ="'.htmlspecialchars($filename).'">'.htmlspecialchars($filename)."</a></h2>\n".
                "<pre>". htmlspecialchars(file_get_contents( $filepath )) ."</pre>\n";
            $nice_html_linklist .= '<li><a href="#'.htmlspecialchars($filename).'">'.htmlspecialchars($filename).'</a></li>';
        }
        $nice_html_output .= "<h2>Overview</h2><ul>" . $nice_html_linklist . "</ul>\n". $nice_html_body. "
        	</body>
        <html>
        ";

        $filename = "channels_".$language."_".$source.".html";
        $this->linklist[$pagetitle] = $filename;
        file_put_contents($this->exportpath . $filename, $nice_html_output );
    }

    private function renderIndexPage(){
        $pagetitle = "Channelpedia - Overview";
        $header = preg_replace("/\[PAGE_TITLE\]/",$pagetitle,file_get_contents("templates/html_header.html"));
        $nice_html_output =
            $header.
        	'<h1>'.htmlspecialchars( $pagetitle ).'</h1>
        	<p>Last updated on: '. date("D M j G:i:s T Y").'</p><ul>
        ';
        foreach ($this->linklist as $title => $url){
           if ($url != "")
              $nice_html_output .= '<li><a href="'. htmlspecialchars( $url ) .'">'.htmlspecialchars( $title ).'</a></li>';
           else
              $nice_html_output .= '</ul><h2>'.htmlspecialchars( $title ).'</h2><ul>';
        }

        $nice_html_output .= "</ul>
        	</body>
        <html>
        ";
        file_put_contents($this->exportpath . "index.html", $nice_html_output );

    }

}
?>