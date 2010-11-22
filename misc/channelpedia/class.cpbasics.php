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

class cpBasics {

	private 
		$path,
		$dbh,
		$dbfile,
		$cableSourceType;

	function __construct($path){
		$this->path = $path;
		$this->dbfile = $this->path . "channeldb.sqlite";	
		$this->dbh = new PDO('sqlite:'.$this->dbfile); 
		$this->cableSourceType = "Germany_KabelBW";
	}

	public function createAllSortedChannelsConfFromDB(){
	
		$filter = " AND ((tid != '1092' AND tid != '1113' AND provider != '-') OR (name = 'DMAX')) AND provider != 'SKY' ";
		
		$this->createSortedChannelsConfFromDB( $label = "S19.2E_Astra1.complete", $source = "S19.2E", $caidMode = 0, $mediaType = 0, $language = "" );
		
		$this->createSortedChannelsConfFromDB( $label = "S19.2E_Astra1.FTA", $source = "S19.2E", $caidMode = 1, $mediaType = 0, $language = "");
		
		$this->createSortedChannelsConfFromDB( 
			$label = "S19.2E_Astra1.FTA.SDTV.de", 
			$source = "S19.2E", 
			$caidMode = 1,
		 	$mediaType = 1, 
		 	$language = "deu", 
		 	$orderby="UPPER(name) ASC", 
		 	$customwhere = $filter . "AND UPPER(name) NOT LIKE '% HD' "
		 	);
		
		$this->createSortedChannelsConfFromDB( 
			$label = "S19.2E_Astra1.FTA.HDTV.de", 
			$source = "S19.2E", 
			$caidMode = 1,
		 	$mediaType = 1, 
		 	$language = "deu", 
		 	$orderby="UPPER(name) ASC", 
		 	$customwhere = $filter . "AND UPPER(name) LIKE '% HD' "
		 	);
		
		$this->createSortedChannelsConfFromDB( 
			$label = "S19.2E_Astra1.FTA.filth.de", 
			$source = "S19.2E", 
			$caidMode = 1,
		 	$mediaType = 1, 
		 	$language = "deu", 
		 	$orderby="UPPER(name) ASC", 
		 	$customwhere =" AND (tid = '1092' OR tid = '1113' OR provider = '-' OR provider = 'SKY') "
		 	);
		 	
		$this->createSortedChannelsConfFromDB( 
			$label = "S19.2E_Astra1.FTA.radio.de", 
			$source = "S19.2E", 
			$caidMode = 1, 
			$mediaType = 2, 
			$language = "deu", 
			$orderby="UPPER(name) ASC" 
			);
		
		$this->createSortedChannelsConfFromDB( 
			$label = "S19.2E_Astra1.SKY.SDTV.de", 
			$source = "S19.2E", 
			$caidMode = 2,
		 	$mediaType = 1, 
		 	$language = "deu", 
		 	$orderby="UPPER(name) ASC", 
		 	$customwhere = " AND (UPPER(provider) = 'SKY' OR provider = '') AND name != '.' AND UPPER(name) NOT LIKE '% HD%' "
		 	);
		
		$this->createSortedChannelsConfFromDB( 
			$label = "S19.2E_Astra1.FTA.TV.fra", 
			$source = "S19.2E", 
			$caidMode = 1,
		 	$mediaType = 1, 
		 	$language = "fra", 
		 	$orderby="UPPER(name) ASC", 
		 	$customwhere = "" //$filter . "AND UPPER(name) NOT LIKE '% HD' "
		 	);
		 	
		$this->createSortedChannelsConfFromDB( 
			$label = "S19.2E_Astra1.scrambled.TV.fra", 
			$source = "S19.2E", 
			$caidMode = 2,
		 	$mediaType = 1, 
		 	$language = "fra", 
		 	$orderby="UPPER(name) ASC", 
		 	$customwhere = "" //$filter . "AND UPPER(name) NOT LIKE '% HD' "
		 	);		 	
		 	
		$this->createSortedChannelsConfFromDB( $label = "S28.2E_Astra2.FTA.tv", $source = "S28.2E", $caidMode = 1, $mediaType=1, $language = "", $orderby="UPPER(name) ASC");
		$this->createSortedChannelsConfFromDB( $label = "S28.2E_Astra2.FTA.radio", $source = "S28.2E", $caidMode = 1, $mediaType=2, $language = "", $orderby="UPPER(name) ASC");
		$this->createSortedChannelsConfFromDB( $label = "S28.2E_Astra2.scrambled", $source = "S28.2E", $caidMode = 2);
		$this->createSortedChannelsConfFromDB( $label = "S28.2E_Astra2.all", $source = "S28.2E", $caidMode = 0);
		$this->createSortedChannelsConfFromDB( $label = "C_Germany_KabelBW", $source = "C");

	}
	
	public function createFreshChannelDB(){
		//@unlink($this->dbfile); //delete existing database file
		$this->createDBTables();
		$this->insertChannelsConfIntoDB();
	}
	
	/*
	 * label (string, used in file name of newly generated channels file, use it to distinguish between different channels files)
	 * source (string, satellite position, cable, terrestial, empty string means: show all. Example: "S28.2E", "S19.2E", "C", no lists allowed)
	 * caidMode (0=show all CAIDs including FTA, 1= show only channels FTA channels, 2 = show only encrypted channels)
	 * mediaType (0=show all media types, 1=show only TV channels, 2=show only radio channels, 3=show only other strange non-radio non-tv channels)
	 * language (string with comma separated list of languages that should be displayed, empty string means all languages)
	 * path to files that should be saved
	 */
	
	function createSortedChannelsConfFromDB( $label, $source = "", $caidMode = 0, $mediaType = 0, $language = "", $orderby = "frequency, modulation, provider, name ASC", $customwhere =""){
		$gpath = $this->path."generated_channellists/";
		$filename = $gpath . 'channels.' . $label . '.conf';
		$where = array();
		
		if ($source != "")
			$where[] = "source = ". $this->dbh->quote( $source );
	
		if ($caidMode != 0)
			$where[] = "caid ". ($caidMode === 2 ? "!= '0'": "= '0'");
	
		if ($mediaType != 0)
			$where[] = "vpid ". ($mediaType === 1 ? "!= '0'": "= '0'");
	
		if ($language != "")
			$where[] = "apid LIKE '%=$language%'";
			
			
		if (count($where) > 0)
			$where = "WHERE " . implode( $where, " AND " ) . $customwhere;	
		
		$sqlquery="SELECT * FROM channels $where ORDER BY $orderby";
		print $sqlquery."\n";
	    $frequency = 0;
	    @unlink($filename);
		$handle = fopen ($filename, "w");
	    foreach ($this->dbh->query($sqlquery) as $row) {
			if ($row['frequency'] !== $frequency){
	    		$frequency = $row['frequency'];
	    		$hilow = "";
				if (substr($source,0,1) == "S" && $frequency >= 11700 && $frequency <= 12750)
	                $hilow = "High-Band";
	            else if (substr($source,0,1) == "S" && $frequency >= 10700 && $frequency < 11700)
	                $hilow = "Low-Band";
	    		//fputs($handle, ":transponder " . $source . " " . $hilow . " " .$row['modulation']. " " . $row['frequency'] . "\n");
	    		$frequency = $row['frequency'];
			}
			$provider = "";
			if ($row["provider"] != "")
				$provider = ";". $row["provider"];			
			
			$rawstring =
				$row["name"] .
				$provider . ":".
				$row["frequency"] . ":".
				$row["modulation"] . ":".
				$row["source"] . ":".
				$row["symbolrate"] . ":".
				$row["vpid"] . ":".
				$row["apid"] . ":".
				$row["tpid"] . ":".
				$row["caid"] . ":".
				$row["sid"] . ":".
				$row["nid"] . ":".
				$row["tid"] . ":".
				$row["rid"];			
			fputs($handle, "$rawstring\n");
	    }
	    fclose($handle);
	//    delete($this->dbh); 
	}
		
	private function insertChannelsConfIntoDB(){	
		$filename = $this->path . 'channels.conf';
		if (file_exists($filename)) {
			$handle = fopen ($filename, "r");
			$counter = 1;
			$cgroup = "";
			$query = $this->dbh->exec("BEGIN TRANSACTION");
			while (!feof($handle)) {
				print "add channel $counter :\n";
				$buffer = fgets($handle, 4096);
			    $buffer = rtrim( $buffer, "\n");
			    if (substr($buffer,0,1) == ":")
			       $cgroup = ltrim($buffer,":");
			    elseif($buffer == ""){}
			    else{
			    	$counter++;
			    	$params = $this->getParamArray($buffer,$cgroup);
			    	if ($params !== false)
				    	$this->insertChannelIntoDB ($params);
				    else{
				    	die("illegal channel.\n");
				    }
			    }
			}
			fclose ($handle);
			$query = $this->dbh->exec("COMMIT TRANSACTION");
		}
	}
	
	private function createDBTables(){
		$sqltext= "CREATE TABLE channels(
		    cablesourcetype TEXT,
			name TEXT,
			provider TEXT,
			frequency INTEGER,
			modulation TEXT,
			source TEXT,
			symbolrate INTEGER,
			vpid INTEGER,
			apid INTEGER,
			tpid TEXT,
			caid TEXT,
			sid INTEGER,
			nid INTEGER,
			tid TEXT,
			rid INTEGER,
			cgroup TEXT,
			PRIMARY KEY ( source, nid, tid, sid)
			) ;";
	
		$query = $this->dbh->exec($sqltext);
		if ($query === false) {
		    echo "\nPDO::errorInfo():\n";
		    print_r($this->dbh->errorInfo());
		    die("DB problem on create db + tables");
		}
	}	
	
	private function insertChannelIntoDB ($params){
    	$columns = implode( ", ", array_keys($params) );
    	$values = implode( ", ", array_values($params) );
    	$sqltext = "INSERT INTO channels ( " . $columns . " ) VALUES ( " . $values . " );";
    	//print "$sqltext\n";
		$query = $this->dbh->exec($sqltext);
		if (!$query) {
		    echo "\nPDO::errorInfo():\n";
		    print_r($this->dbh->errorInfo());
		    die("db error on insert");
		}
	}
	
	private function getParamArray( $buffer, $cgroup){
    	$details = explode( ":", $buffer);
		if (count($details) != 13) return false;    	
    	$cname = $details[0];
    	$cprovider = "";
	    $cnamedetails = explode( ";", $cname);
	    if (count($cnamedetails) == 2){
	    	$cname = $cnamedetails[0];
		    $cprovider = $cnamedetails[1];	    	
	    }

    	return array(
		    "cablesourcetype" 	=> $this->dbh->quote( $this->cableSourceType ),
			"name" 			=> $this->dbh->quote( $cname ),
			"provider" 		=> $this->dbh->quote( $cprovider ),
			"frequency" 	=> $this->dbh->quote( $details[1] ),
			"modulation" 	=> $this->dbh->quote( $details[2] ),
			"source" 		=> $this->dbh->quote( $details[3] ),
			"symbolrate" 	=> $this->dbh->quote( $details[4] ),
			"vpid" 			=> $this->dbh->quote( $details[5] ),
			"apid" 			=> $this->dbh->quote( $details[6] ),
			"tpid"			=> $this->dbh->quote( $details[7] ),
			"caid" 			=> $this->dbh->quote( $details[8] ),
			"sid" 			=> $this->dbh->quote( $details[9] ),
			"nid" 			=> $this->dbh->quote( $details[10] ),
			"tid" 			=> $this->dbh->quote( $details[11] ),
			"rid" 			=> $this->dbh->quote( $details[12] ),
			"cgroup" 		=> $this->dbh->quote( $cgroup )
    	);
	}
}
?>