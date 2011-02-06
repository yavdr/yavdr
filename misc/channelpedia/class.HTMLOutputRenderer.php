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
        $config;

    function __construct(){
        $db = dbConnection::getInstance();
        $this->dbh = $db->getDBHandle();
        $this->config = config::getInstance();
        $this->exportpath = $this->config->getValue("path").$this->config->getValue("exportfolder")."/html/";

        $this->writeNiceHTMLPage();
        $this->writeChangelog();
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



    public function writeChangelog(){

        $sqlquery="SELECT DATETIME( timestamp, 'unixepoch', 'localtime' ) AS datestamp, name, combined_id, update_description FROM channel_update_log";
        $result = $this->dbh->query($sqlquery);
        if ($result === false)
            die("\nDB-Error: " . $this->dbh->errorCode() . " / " . $sqlquery);
        $buffer = '
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html
     PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Channel changelog</title>
		<style>
			body { font-family: Arial, sans-serif; font-size: 0.8em; background-color: #dddddd;}
			table { font-family: Arial, sans-serif; font-size: 0.8em; background-color: white; border-collapse:collapse;}
			td { border: 1px solid black; padding: 2px;}
		</style>
	</head>
	<body>
	    <h1>Changelog</h1>
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
        file_put_contents($this->exportpath . "changelog.html", $buffer );
    }

    //assembles all pre-written channel lists from hdd into one html page
    public function writeNiceHTMLPage(){

        $nice_html_output = '
        <?xml version="1.0" encoding="utf-8"?>
        <!DOCTYPE html
             PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
             "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
        	<head>
        		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        		<title>Nice channel lists</title>
        		<style>
        			body { font-family: Arial, sans-serif; font-size: 0.8em; background-color: #dddddd;}
        			pre { border: 1px solid black; padding: 5px; background-color: white; overflow: auto;}
        		</style>
        	</head>
        	<body>
        ';
        $dirname = $this->config->getValue("path").$this->config->getValue("exportfolder")."/raw";
        $dir = new DirectoryIterator( $dirname );
        foreach ($dir as $fileinfo) {
            if ( $fileinfo->isFile() && substr($fileinfo->getFilename(),0, 18) == "channels.S19.2E.de"){// && !$fileinfo->isDot()){
                //echo $fileinfo->getFilename() . "\n";
                $infofile = $dirname."/". $fileinfo->getFilename();
                if (file_exists( $infofile )){
                    $nice_html_output .= "<pre>". file_get_contents( $infofile ) ."</pre>\n";
                }
            }
        }
        $nice_html_output .= "
        	</body>
        <html>
        ";

        file_put_contents($this->exportpath . "nice_channels.html", $nice_html_output );
    }

}
?>