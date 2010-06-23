<?php
/***************************************************************
*  Copyright notice
*
*  (c) 2010 Henning Pingel
*  All rights reserved
*
*  This script is part of the Yaphobia project. Yaphobia is
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

class packageTrackerBase{

    protected
	    $repos,
    	$package_megalist,
        $debrepos;

    const
        timeout = 28, //minutes	    
        packagelistfile = '/cache/a_package_list.txt',
	    repolistfile    = '/cache/a_repo_list.txt';

    function __construct($debrepos){

	    if (file_exists(self::packagelistfile)){
	        $this->package_megalist = unserialize(file_get_contents(self::packagelistfile));
	    }
	    else
            $this->package_megalist = array();

	    if (file_exists(self::repolistfile)){
	        $this->debrepos = unserialize(file_get_contents(self::repolistfile));
	    }
        else
            $this->debrepos = $debrepos;
    }

    /* 
     * sets the repo var to have access to the desired repos
     */

	public function setCurrentRepo($distribution, $release){
        $this->repos = $this->debrepos[$distribution][$release];
    }

}


?>
