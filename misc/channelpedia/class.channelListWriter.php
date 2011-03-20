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

class channelListWriter extends channelIterator{

    private
        $filehandle = null,
        $filename = "",
        $addTransponderDelimiters = false;

    function __construct($label = "_complete", $source, $orderby = "UPPER(name) ASC"){
        if ($label == "_complete"){
            $this->addTransponderDelimiters = true;
            $orderby = "frequency, modulation, provider, name ASC";
        }
        else if ($label == "")
        {
            $label = "uncategorized";
            $this->addTransponderDelimiters = true;
            $orderby = "frequency, modulation, provider, name ASC";
        }
        parent::__construct($label, $source, $orderby);
        $config = config::getInstance();
        $gpath = $config->getValue("path"). $config->getValue("exportfolder")."/raw/";
        $groupname = $source. '_' . $label;
        $this->filename = $gpath . 'channels_' . $groupname . '.conf';
    }

    public function writeFile(){
        while ($this->moveToNextChannel() !== false){
            if ($this->addTransponderDelimiters && $this->transponderChanged())
                $this->write2File( ": ### ".$this->getCurrentTransponderInfo()." ###\n" );
            $this->write2File( $this->getCurrentChannelString()."\n" );
        }
        $this->closeFile();
    }

    private function write2File( $buffer){
        if ($this->filehandle == null){
            $this->openFile();
        }
        fputs( $this->filehandle, $buffer);
    }

    private function openFile(){
        print "writing to file $this->filename\n";
        @unlink($this->filename);
        $this->filehandle = fopen ($this->filename, "w");
    }

    private function closeFile(){
        if ($this->filehandle != null)
            if (fclose($this->filehandle) === false)
                die("Error on file close.");
    }
}

?>