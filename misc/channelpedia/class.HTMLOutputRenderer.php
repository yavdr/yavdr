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

        $this->writeNiceHTMLPage("S19.2E", "de");
        $this->writeNiceHTMLPage("S19.2E", "at");
        $this->writeNiceHTMLPage("S19.2E", "ch");
        $this->writeNiceHTMLPage("C[Germany_KabelBW]", "de");
        $this->writeChangelog("S19.2E");
        $this->writeChangelog("S28.2E");
        $this->writeChangelog("C[Germany_KabelBW]");
        $this->renderIndexPage();
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

    public function writeChangelog($source){

        $sqlquery=
            "SELECT DATETIME( timestamp, 'unixepoch', 'localtime' ) AS datestamp, name, combined_id, update_description ".
            "FROM channel_update_log WHERE combined_id LIKE '".$source."%' ORDER BY timestamp DESC LIMIT 100";
        $result = $this->dbh->query($sqlquery);
        if ($result === false)
            die("\nDB-Error: " . $this->dbh->errorCode() . " / " . $sqlquery);
        $pagetitle = 'Changelog for '.$source.' (Last 100 changes)';
        $header = preg_replace("/\[PAGE_TITLE\]/",$pagetitle,file_get_contents("templates/html_header.html"));

        $buffer = $header.'
	    <h1>'.$pagetitle.'</h1><p>Last updated on: '. date("D M j G:i:s T Y").'</p>
        <table>';
        foreach ($result as $row) {
            $buffer.="<tr><td>".
            $row["datestamp"]. "</td><td>".
			$row["name"]. "</td><td>".
			$row["combined_id"]. "</td><td>".
			$row["update_description"] .
			"</td></tr>\n";
        }
        $buffer .= "<table></body></html>";
        $filename = "changelog_".$source.".html";
        $this->linklist[$pagetitle] = $filename;
        file_put_contents($this->exportpath . $filename, $buffer );
    }

    //assembles all pre-written channel lists from hdd into one html page
    public function writeNiceHTMLPage($source, $language){
        $pagetitle = 'Essential channels for '.$source.' (Language/Region: '.$language.')';
        $header = preg_replace("/\[PAGE_TITLE\]/",$pagetitle,file_get_contents("templates/html_header.html"));
        $nice_html_output =
            $header.
        	'<h1>'.$pagetitle.'</h1>
        	<p>Last updated on: '. date("D M j G:i:s T Y").'</p>
        ';
        $dirname = $this->config->getValue("path").$this->config->getValue("exportfolder")."/raw";
        $dir = new DirectoryIterator( $dirname );
        foreach ($dir as $fileinfo) {
            $prefix= "channels_".$source."_".$language;
            if ( $fileinfo->isFile() && substr($fileinfo->getFilename(),0, strlen($prefix)) == $prefix){// && !$fileinfo->isDot()){
                //echo $fileinfo->getFilename() . "\n";
                $infofile = $dirname."/". $fileinfo->getFilename();
                if (file_exists( $infofile )){
                    $nice_html_output .= "<h2>".$fileinfo->getFilename()."</h2>\n<pre>". file_get_contents( $infofile ) ."</pre>\n";
                }
            }
        }
        $nice_html_output .= "
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
        	'<h1>'.$pagetitle.'</h1>
        	<p>Last updated on: '. date("D M j G:i:s T Y").'</p><ul>
        ';
        foreach ($this->linklist as $title => $url){
            $nice_html_output .= '<li><a href="'.$url.'">'.$title.'</a></li>';
        }

        $nice_html_output .= "</ul>
        	</body>
        <html>
        ";
        file_put_contents($this->exportpath . "index.html", $nice_html_output );

    }

}
?>