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

class channelImportMetaData{

    private
        $timestamp,
        //$usersNonSatProviders = array(), //provider names that the user offers to indicate what's in his channels conf
        $usersPresentProviders , //provider names for channels actually present in the channels.conf including all satellite positions found
        $numChanChecked = 0,
        $numChanAdded = 0,
        $numChanChanged = 0,
        $numChanIgnored = 0,
        $username,
        $currentUserConfig;


    public function __construct( $username ){
        global $global_user_config;
        if ( array_key_exists($username, $global_user_config) ){
            $this->currentUserConfig = $global_user_config[ $username ];
            //print_r($this->currentUserConfig);die();
        }
        else
            $this->currentUserConfig = null;

        $this->timestamp = time();
        $this->numChanChecked = 0;
        $this->numChanAdded   = 0;
        $this->numChanChanged = 0;
        $this->numChanIgnored = 0;
        $this->resetPresentProviders();
        $this->username = $username;
    }

    public function userNameExists(){
        return ($this->currentUserConfig !== null);
    }

    public function isAuthenticated( $password ){
        return ($this->currentUserConfig["password"] === $password);
    }

    public function getUsername(){
        return $this->username;
    }

    public function getAnnouncedNonSatProvider( $type ){
        $feedback = false;
        if (in_array( $type, $this->currentUserConfig["announcedProviders"] ))
            $feedback = $this->currentUserConfig["announcedProviders"]["type"];
        return $feedback;
    }

    public function getAnnouncedNonSatProviders(){
        $feedback = false;
        if (in_array( "announcedProviders", $this->currentUserConfig ))
            $feedback = $this->currentUserConfig["announcedProviders"];
        return $feedback;
    }

    public function getTimestamp(){
        return $this->timestamp;
    }

/*    public function getNonSatProviders(){
        return $this->usersNonSatProviders;
    }*/

    public function resetPresentProviders(){
        $this->usersPresentProviders = array();
        $this->usersPresentProviders["S"] = array();
    }

    public function addPresentNonSatProvider( $type, $provider ){
        $this->usersPresentProviders[$type] = $provider;
    }

    public function getPresentNonSatProvider( $type ){
        $result = "";
        if (in_array($type, $this->usersPresentProviders))
            $result = $this->usersPresentProviders[$type];
        return $result;
    }

    public function addPresentSatProvider( $satposition ){
        $this->usersPresentProviders["S"][$satposition] = true;
    }

    public function getPresentSatProviders(){
        return $this->usersPresentProviders["S"];
    }

    public function increaseIgnoredChannelCount(){
        $this->numChanIgnored++;
    }

    public function increaseChangedChannelCount(){
        $this->numChanChanged++;
    }

    public function increaseAddedChannelCount(){
        $this->numChanAdded++;
    }

    public function increaseCheckedChannelCount(){
        $this->numChanChecked++;
    }

    public function getIgnoredChannelCount(){
        return $this->numChanIgnored;
    }

    public function getChangedChannelCount(){
        return $this->numChanChanged;
    }

    public function getAddedChannelCount(){
        return $this->numChanAdded;
    }

    public function getCheckedChannelCount(){
        return $this->numChanChecked;
    }
}