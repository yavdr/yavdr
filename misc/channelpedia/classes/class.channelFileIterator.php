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

class channelFileIterator{

    private
        $file = "",
        $filehandle,
        $currentline;

    protected
        $db,
        $config;


    function __construct(){
        $this->db = dbConnection::getInstance();
        $this->config = config::getInstance();
    }

    public function openChannelFile($file){
        $this->file = $file;
        $this->filehandle = fopen ($this->file, "r");
        $this->currentline = "";
    }

    public function moveToNextLine(){
        $result = false;
        if (!feof($this->filehandle)) {
            $buffer = fgets($this->filehandle, 4096);
            $buffer = rtrim( $buffer, "\n");
            $this->currentline = trim( $buffer);
            $result = true;
        }
        else
            fclose ($this->filehandle);

        return $result;
    }

    public function getCurrentLine(){
        return $this->currentline;
    }

    public function getCurrentLineAsChannelObject(){
        return new channel($this->currentline);
    }

    public function isCurrentLineAGroupDelimiter(){
        return (substr($this->currentline,0,1) == ":");
    }

    public function isCurrentLineEmpty(){
        return $this->currentline == "";
    }

    public function getGroupDelimiterFromCurrentLine(){
        return ltrim($this->currentline,":");
    }
}

?>