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

/*
 * this is a simple helper script to change stuff in the database
 * meant for maintainance purposes. Put in a SQL query you want
 * to execute and execute it once, then disable this script again.
 *
//delete all log entries from table channel_update_log
require_once '../classes/class.config.php';
require_once '../classes/class.dbConnection.php';
$db = dbConnection::getInstance();
//phpinfo();
//$query = $db->exec("DELETE FROM channel_update_log");
//$query = $db->exec("UPDATE channels SET source='C[de_KabelDeutschland_Speyer]' where source='C[de_KabelDeutschland]'");
//$query = $db->exec("DELETE FROM channels WHERE x_last_confirmed < 1303053421");
*/

?>