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

require_once( dirname(__FILE__) . '/class.packageTrackerBase.php' );

class packageTrackerIndexer extends packageTrackerBase{

    private
        $T,
    	$package_megalist_was_updated,
	    $current_version_number,
        $starttime;

    function __construct( $debrepos, $mode ){

        $this->starttime = time();
        $this->T = new trace('html');
    	$this->package_megalist_was_updated = false;
    	parent::__construct( $debrepos);
    }

    function __destruct(){
        $this->saveIndexToDisk();
        $needed = time() - $this->starttime;
        print "Time needed: $needed seconds";
    }

    /* 
     * start to index all repos of a specified distribution/release
     */

	public function indexDistributionRelease($xdistribution, $xrelease){
	    //default values
	    $distribution = "Ubuntu";
	    $release = "lucid";
	
	    //read and sanitize user input
	    if (array_key_exists( $xdistribution, $this->debrepos)){
	        $distribution = $xdistribution;
	        if ($distribution == 'Debian') $release = 'sid'; //default
	    }
	    if (array_key_exists( $xrelease, $this->debrepos[$distribution])){
	        $release = $xrelease;
	    }

        $this->T->addToTrace(3, "--- vdrDevTracker started by IP address ".$_SERVER['REMOTE_ADDR']." with $distribution/$release  ---.");
        $this->setCurrentRepo($distribution, $release);
        //$this->updateRepoMetaInfoCache();
        $this->getRepoMetaInfo($distribution, $release);
        $this->debrepos[$distribution][$release] = $this->repos; //writing back changes
	}
   
    protected function saveIndexToDisk(){
	    if (!file_exists(parent::packagelistfile) || $this->package_megalist_was_updated ){
	        file_put_contents( dirname(__FILE__) . self::packagelistfile, serialize($this->package_megalist));

	    }
    //	if (!file_exists(parent::repolistfile)	 || $this->package_megalist_was_updated ){  
	        file_put_contents(dirname(__FILE__) . parent::repolistfile, serialize($this->debrepos));
    //	}
    }

    private function updateRepoMetaInfoCache(){
        foreach ($this->repos as $reponame => $repo){
            $info = $this->autoFetchList( 'http://'. $repo['url'] . '/Release' );
            file_put_contents( 'cache/'. strtr($repo['url'] . '/Release', '/\\', '__'), $info);
        }
    }

    private function getRepoMetaInfo($distribution, $release){
        foreach ($this->repos as $reponame => $repo){
            $relfile = $repo['url'] . 'Release';
	        $infofile = 'cache/'. strtr( $relfile, '/\\', '__');
	        if (file_exists($infofile)){
          		$info = file_get_contents($infofile);
                $age = intval((time() - filectime($infofile))/60);
	            if ( $age >= parent::timeout){
                    $this->T->addToTrace(3, "$relfile : Cached version is too old, checking for updates.");
            		$info2 = $this->getHTTPGetResponse( 'http://'. $relfile );
            		if ($info !== $info2){
            			$info = $info2;
        		        //@unlink($infofile);
            			file_put_contents( $infofile, $info);
            			//make room for new stuff
                        $this->T->addToTrace(3, "Release information has changed and was written to cache.");
                        $new_packagelists = $this->getFilledPackageListsFromRepoMetaInfo( $info, $repo);
                        $old_packagelists = $this->repos[$reponame]['packagelists'];
                        $added_lists = array();
                        for ($x=0; $x < count($new_packagelists); $x++){
                            $new_list = $new_packagelists[$x];
                            $hash_unchanged = implode('.', $new_list);
                            $found = false;
                            for ($z=0; $z < count($old_packagelists); $z++){
                                if ($old_packagelists[$z]['section'].'.'.$old_packagelists[$z]['architecture'].'.'. $old_packagelists[$z]['md5']  == $hash_unchanged){
                                    $this->T->addToTrace(3, "List $hash_unchanged remains unchanged");
                                    $old_packagelists[$z]['status'] = 'unchanged';
                                    $found = true;
                                    break;
                                }
                                //md5 hash has changed
                                elseif ($new_list['section'].'.'.$new_list['architecture'] === $old_packagelists[$z]['section'].'.'.$old_packagelists[$z]['architecture'] && 
                                           $new_list['md5'] !== $old_packagelists[$z]['md5']){
                                    $this->T->addToTrace(3, "List $hash_unchanged has changed (md5). Updating packages");
                                    //TODO: update packages of this list INTELLIGENTLY so that we can keep track of the changes
//$this->addToPackageChangeLog( $msg );
                                    $this->deletePackagesFromPackageList($reponame, $old_packagelists[$z]['architecture'], $old_packagelists[$z]['section']);
                                    $this->readPackagesOfSinglePackageList($repo, $new_list, $reponame);

                                    $old_packagelists[$z]['status'] = 'changed';
                                    $found = true;
                                    break;
                                }
                            }
                            if (!$found){
                                $this->T->addToTrace(3, "$new_list has newly been added to the list. Packages on this list will now be added.");
                                $this->readPackagesOfSinglePackageList($repo, $new_list, $reponame);
                            }
                        }
                        for ($z=0; $z < count($old_packagelists); $z++){
                        	if (!isset($old_packagelists[$z]['status'])){
                        	    $hash = implode('.', $old_packagelists[$z]);
                                $this->T->addToTrace(3, "$hash does not exist any more. Packages belonging to it will be deleted now.");
                                $this->deletePackagesFromPackageList($reponame, $old_packagelists[$z]['architecture'], $old_packagelists[$z]['section']);
                            }
                        }
                        $this->repos[$reponame]['packagelists'] = $new_packagelists;
                    }
            		else{
            			$this->T->addToTrace(3, "Cached version of $relfile was touched.");
            			//touch($infofile);
        		        @unlink($infofile);
            			file_put_contents( $infofile, $info);
            		}
	            }
                else{
           			$this->T->addToTrace(3, "Cached version of $relfile is still valid, timeout didn't happen yet.");
                }
/*
		        if ((!isset($this->repos[$reponame]['last_changed_date']) || strlen($this->repos[$reponame]['last_changed_date']) === 0)){
		            $this->repos[$reponame]['last_changed_date'] = $this->getDateFromRepoMetaInfo( $info );    
		            $this->repos[$reponame]['packagelists'] = $this->getFilledPackageListsFromRepoMetaInfo( $info, $repo );
                    foreach ($this->repos[$reponame]['packagelists'] as $packagelist){
                        $this->readPackagesOfSinglePackageList($repo, $packagelist, $reponame);
                    }
		            $this->package_megalist_was_updated = true;
		        }
*/
	        }
            else{
                //file does not exist
        		$info = $this->getHTTPGetResponse( 'http://'. $repo['url'] . 'Release' );
        		file_put_contents( $infofile, $info);
                $this->repos[$reponame]['last_changed_date'] = $this->getDateFromRepoMetaInfo( $info );    
                $this->repos[$reponame]['packagelists'] = $this->getFilledPackageListsFromRepoMetaInfo( $info, $repo);
                foreach ($this->repos[$reponame]['packagelists'] as $packagelist){
                    $this->readPackagesOfSinglePackageList($repo, $packagelist, $reponame);
                }
                $this->package_megalist_was_updated = true;
	        }
	        $this->repos[$reponame]['cache_age'] = filectime($infofile);
        }
        ksort( $this->package_megalist );
    }

    private function deletePackagesFromPackageList($reponame, $architecture, $section){
        foreach ($this->package_megalist as $package_name => $list){
            if (isset($list[$reponame][$architecture][$section])){
                unset($this->package_megalist[$package_name][$reponame][$architecture][$section]);
               $this->T->addToTrace(3, "Package $reponame - $section - $architecture - $package_name was deleted from packagelist.");
            }
        }
    }

    private function getDateFromRepoMetaInfo( $info ){
        preg_match('/\nDate:.(.*?)\n/', $info, $results);
        return $results[1];
    }

    private function getFilledPackageListsFromRepoMetaInfo( $info, $repo){
        $this->T->addToTrace(3, "Starting collecting packagelists of ".$repo['url']);
        preg_match('/.*?MD5Sum:(\n.*\n)SHA1/s', $info, $trimmed);
        //print '<pre>' . print_r( $trimmed[1], true ) . '</pre>';
        preg_match_all('/\n\s(\S*?)\s\D*?(\d+?)\s(.*?)\/(Packages|Sources)(|\.gz)\n/', $trimmed[1], $results);
        //print '<pre>' . print_r( $results, true ) . '</pre>';
        $packagelist = array();
        for ($z=0; $z < count( $results[2] ); $z++){
            $relpath = $results[3][$z];
    		$split_position = strrpos($relpath,'/');
    		$section = substr($relpath, 0, $split_position);
    		$architecture = substr($relpath, $split_position + 1, strlen($relpath) - $split_position + 1);
            $this->T->addToTrace(3, "Now checking fate of packagelist $section/$architecture...");
            if (intval($results[2][$z]) !== 0 && ($architecture == 'binary-i386' || $architecture == 'binary-amd64' || $architecture == 'source' )){
                if (!isset($repo['limit_sections']) || strstr($section, $repo['limit_sections']) !== false){
                    $this->T->addToTrace(3, "Valid packagelist added to packagelists: $section/$architecture.");
                   //print '<pre>' . print_r( $package_results, true ) . '</pre>';
                    $packagelist[] = array(
                        'section'    => $section,
                        'architecture' => $architecture,
                        'md5'     => $results[1][$z]
                    );
                }
                else{
                   $this->T->addToTrace(3, "Packagelist $section/$architecture was ignored (limit_sections).");
                }
            }
        }
        $this->T->addToTrace(3, "Finished collecting packagelists.");
        return $packagelist;
    }

    private function readPackagesOfSinglePackageList($repo, $packagelist, $reponame){
        $url = $repo['url'];
        $this->T->addToTrace(3, "readPackagesOfSinglePackageList $url, ".$packagelist['architecture'].", $reponame");
    	if ($packagelist['architecture'] == 'source' )
            $file = 'Sources';
    	else
            $file = 'Packages';

        $relname = $url . $packagelist['section'] . '/' . $packagelist['architecture'] . '/' . $file;
        $handle = $this->autoFetchList( 'http://'. $relname);

        while(1== 1){
            $packagelist_content = $this->fetchNextPackageFromList($handle);
            if (strlen( $packagelist_content) < 2){
                $this->T->addToTrace(3, "Leaving package loop.");
                break;
            }
            unset($package_results);
            preg_match('/(Package:\s(\S*?)\n.*?Version:\s(\S*?)\n.*?)\n/s', $packagelist_content, $package_results);
            $package_name = $package_results[2];
            if ( !isset($repo['limit_packages']) || preg_match( $repo['limit_packages'], $package_name, $results) > 0){

                if (!array_key_exists( $package_name, $this->package_megalist))
                    $this->package_megalist[ $package_name ] = array();

                if (!array_key_exists( $reponame, $this->package_megalist[ $package_name ]))
                    $this->package_megalist[ $package_name ][$reponame] = array();

                if (!array_key_exists( $packagelist['architecture'], $this->package_megalist[ $package_name ][$reponame]))
                    $this->package_megalist[ $package_name ][$reponame][$packagelist['architecture']] = array();

                $this->package_megalist[ $package_name ][$reponame][$packagelist['architecture']][$packagelist['section']] = array(
                    'version'      => $package_results[3],
                    'info'         => $package_results[1],
                );
                $this->T->addToTrace(3, "Package $relname - $package_name has been added to packagelist.");
            }
            else
                $this->T->addToTrace(3, "Package $package_name was ignored (limit_packages).");
        }
        gzclose($handle);
    }

    //debug
    public function printRepoMetaInfo(){
        print '<pre>' . htmlspecialchars( print_r( $this->repos,true )) . '</pre>';
    }

    //debug
    public function printMegaListArray(){
        print '<pre>' . htmlspecialchars( print_r( $this->package_megalist,true )) . '</pre>';
    }




    private function autoFetchList($url){
        $list = $this->getHTTPGetResponse($url.'.gz');
        file_put_contents('cache/temp_gzipfile.gz', $list);
        $handle = gzopen('cache/temp_gzipfile.gz', 'r');
        return $handle;
    }

    private function fetchNextPackageFromList($handle){
        $line = "";
        $result = "";
        while ($line !== "\n" && !gzeof($handle)){
            $line = gzgets( $handle, 255); //255 should be sufficient to hit a newline
            $result.=$line;
        }
        $this->T->addToTrace(5, "fetchNextPackageFromList: $result");
        return $result;
    }

    private function getHTTPGetResponse($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        //curl_setopt($ch, CURLOPT_PROXY, "http://proxy:8080");

        if (substr($url, -3, 3) === '.gz')
            curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1); 

        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1 );
        //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $my_response = curl_exec($ch);
        $curlerrno = curl_errno($ch);
        $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($http_status == 404){
            $my_response = false;
        }
        //print "<pre>" . htmlspecialchars("$http_status $curlerrno\n $my_response") . "</pre>";
        if ($curlerrno != 0){
            print " curl reports: $curlerrno : " . curl_error ( $ch );
            $my_response = false;
        }
        //print "<h1>Reading via HTTP: $url ($http_status).</h1>";

        curl_close($ch);
        return $my_response;
    }

    private function addToPackageChangeLog( $msg ){
			file_put_contents( 'cache/changelog.txt',  date('Y-m-d H:m:s: ', time()) . ": " . $msg . "\n", 
                FILE_APPEND | LOCK_EX
            );
    }
}

?>
