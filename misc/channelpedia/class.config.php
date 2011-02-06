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

require_once 'config.php';
require_once 'class.channelGroupingRulesStore.php';

class config {

    private static $instance = null;

    protected function __construct(){
    }

    private function __clone(){}

    public static function getInstance(){
        if ( self::$instance == null){
            self::$instance = new config();
        }
        return self::$instance;
    }

    public function getValue($key){
        $value = null;
        if ( $key == "path")
            $value = PATH;
        elseif ($key == "exportfolder")
            $value = EXPORTFOLDER;
        elseif ($key == "groups")
            $value = channelGroupingRulesStore::getRules();
        return $value;
    }
}
?>