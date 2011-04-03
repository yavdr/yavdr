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

class channelGroupIterator{

    private
        $db,
        $result = false,
        $channelgroup = false,
        $count = 0;

    function __construct(){
        $this->db = dbConnection::getInstance();
    }

    public function init( $source, $language){
        $this->result = $this->db->query(
            "SELECT x_label, count(*) AS channelcount FROM channels ".
            "WHERE source = ".$this->db->quote($source)." AND x_label LIKE ".$this->db->quote($language."%")." ".
            "GROUP BY x_label ORDER BY x_label"
        );
    }

    public function moveToNextChannelGroup(){
        $this->channelgroup = false;
        if (!$this->result === false){
            //FIXME: encapsulate access to result fetch
            $this->channelgroup = $this->result->fetch(PDO::FETCH_ASSOC);
        }
        if ($this->channelgroup === false){
            $exists = false;
        }
        else{
            $exists = true;
            $this->count++;
        }
        return $exists;
    }

    public function getCurrentChannelGroupArray(){
        return $this->channelgroup;
    }

    public function getCurrentChannelGroupArrayKeys(){
        return array_keys($this->channelgroup);
    }

    public function getCurrentChannelGroupCount(){
        return $this->count;
    }
}