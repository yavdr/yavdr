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

require_once( dirname(__FILE__) . '/class.packageTrackerBase.php' );

class packageTrackerViewer extends packageTrackerBase{

    private
        $empty_row;

    public function printLinkMenu($distribution, $release, $mode){
	    //generate link menu
	    $menu = '';
	    foreach ($this->debrepos as $distr => $dist_details){
	      foreach ($dist_details as $dist_release => $rel_details){
	        if ($distribution == $distr && $release == $dist_release && $mode == '')
	          $menu .= '<b>' . $distr.' '. $dist_release .'</b> | ';
	        else
	          $menu .= '<a href="?distribution='.$distr.'&release='.$dist_release.'">'.$distr.' '. $dist_release .'</a> | ';
	      }
	    }
            $menu .= '<a href="?mode=yavdr">Vergleich yaVDR Karmic/Lucid</a>';
	    print "<p>".$menu."</p>";

            print "<h1>VDR Package Repositories for $distribution Linux ($release)</h1>";
    }

    public function printMegaListAsTable($arch, $reposelection){
        $tableheader = '<tr><th>Package</th>';
        $tableheader2 = '<tr><th>&nbsp;</th>';
        foreach ($reposelection as $reponame => $repo){
            $tableheader .= '<th'.($arch === 3 ? ' colspan="3"':'') . '><a href="'.htmlspecialchars($repo['info']).'" target="_blank">'. htmlspecialchars($reponame) . '</a></th>';
            if ($arch === 3 ) $tableheader2 .= '<th>source</th>';
            if ($arch === 1 || $arch === 3 ) $tableheader2 .= '<th>i386</th>';
            if ($arch === 2 || $arch === 3 ) $tableheader2 .= '<th>amd64</th>';
        }
        $tableheader .= '</tr>';
        $tableheader2 .= '</tr>';

        $tablecontent = $tableheader . $tableheader2;

        foreach ($this->package_megalist as $packagename => $homes){
            $packagelinks = "";
	    $this->empty_row = true;
	    if (false === false){
	      $this->current_version_number = '';
	      $rowcontent =
		  '<tr style="vertical-align: top;"><td class="packagename">' . htmlspecialchars($packagename) . '</td>';
	      foreach ($reposelection as $reponame => $repo){
		  if (array_key_exists( $reponame, $homes)){
			//source column
			 $rowcontent .= $this->renderTableCell('source', $homes, $reponame);
			//i386 column
		      if ($arch === 1 || $arch === 3 )
			 $rowcontent .= $this->renderTableCell('binary-i386', $homes, $reponame);
			//amd64 column
		      if ($arch === 2 || $arch === 3 )
			 $rowcontent .= $this->renderTableCell('binary-amd64', $homes, $reponame);
		  }
		  else
		      if ($arch === 3 )
			  $rowcontent .= '<td>-</td><td>-</td><td>-</td>';
		      else
			  $rowcontent .= '<td>-</td>';
	      }
	      if ($this->empty_row === false)
		$tablecontent .= $rowcontent . '</tr>';
	    }
        }
        return '<table border="1">'.$tablecontent.'</table></br>';
    }


	private function renderTableCell($architecture, $homes, $reponame){
	  if (array_key_exists( $architecture, $homes[$reponame])){
	      $cellcontent = '';
	      foreach( $homes[$reponame][$architecture] as $area => $package){
   		$multi_version_indicator = "";
		if (isset($_GET['mode']) && $_GET['mode'] == 'etobivshanno'){

		  if ( $this->current_version_number == '')
			$this->current_version_number = $package['version'];
		  elseif ($this->current_version_number != $package['version'])
 			$multi_version_indicator = "_but_other_version";
		}

		  $cellcontent .=
		      '<span title="'.htmlspecialchars( $package['info']).'">'.
		      '<b>' . htmlspecialchars( $area ). ':</b> ' . htmlspecialchars( $package['version']  ) . 
		      '</span></br>';

	      }
	      $cellcontent = '<td class="package_present'. $multi_version_indicator.'">'. $cellcontent . '</td>';
	      $this->empty_row = false;
	  }
	  else
	      $cellcontent = '<td>-</td>';
	  return $cellcontent;
	}


    public function printRepoMetaInfoAsTable($repos){
        $tablecontent = '';
        $tablecontent .=
            '<tr><th>Repository</th><th>Subscribed packagelists</th><th>Repository cache will be refreshed in...</th><th>Last update of Release list</th><th>URL</th></tr>';
        foreach ($repos as $reponame => $repo){
            $tablecontent .=
                '<tr style="vertical-align: top;">'.
		'<td>' . $reponame  . ' </td><td>' . count( $repo['packagelists']). 
                //'</br><pre>'. print_r($repo['packagelists'], true) . '</pre>'.
                '</td>'.
                '<td>' . (parent::timeout - intval((time() - $repo['cache_age'])/60)) . ' minutes</td>'.
                '<td>' . $repo['last_changed_date'] . '</td>'.
                '<td><a href="'.htmlspecialchars($repo['info']).'" target="_blank">'. htmlspecialchars($repo['info']) . '</a></td></tr>';
        }
        return '<table border="1">'.$tablecontent.'</table></br>';
    }

	public function printEtobiVsHanno(){
        $ind_repos = array(
			        'the-vdr-team' => $this->repos['Ubuntu']['karmic']['the-vdr-team'],
			        'yavdr-testing-vdr' => $this->repos['Ubuntu']['lucid']['yavdr-testing-vdr']
			);

		print '<h1>Vergleich yaVDR Karmic mit Lucid</h1>' . 
		     //$this->printRepoMetaInfoAsTable($ind_repos).
			 $this->printMegaListAsTable( 3, $ind_repos );
	}

	public function printOutput(){
		print $this->printRepoMetaInfoAsTable($this->repos);
		//$this->printMegaListArray();
		print $this->printMegaListAsTable(3, $this->repos);
		//$this->printRepoMetaInfo();

	}
}
