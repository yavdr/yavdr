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

class updateFromScan extends channelFileIterator{

    private
        $newfile,
        $stats;

    public function __construct($cableSourceType, $terrSourceType){
        parent::__construct($cableSourceType, $terrSourceType);
        $checkpath = $this->config->getValue("userdata"). "scancompare/";
        $infofile = $checkpath."info.txt";
        $cableProvider = "";
        if (is_file( $infofile ) && is_file( $checkpath."channels.conf" )){
            $info = file_get_contents( $infofile);
            $cableProvider = trim($info); //FIXME

            $this->openChannelFile( $checkpath."channels.conf" );
            $this->newfile = fopen ($checkpath."channels.new.conf", "w");

            $this->stats = array();
            $this->stats["group_delimiters"] = 0;
            $this->stats["empty_lines"] = 0;
            $this->stats["unchanged_channels"] = 0;
            $this->stats["updated_channels"] = 0;
            $this->stats["unmatched_channels"] = 0;

            while( $this->moveToNextLine() !== false){
                if ($this->isCurrentLineAGroupDelimiter()){
                    fputs ($this->newfile, $this->getCurrentLine() . "\n");
                    $this->stats["group_delimiters"] ++;
                }
                elseif ($this->isCurrentLineEmpty()){
                    fputs ($this->newfile, "\n");
                    $this->stats["empty_lines"] ++;
                }
                else{
                    $channel = $this->getCurrentLineAsChannelObject();
                    if ($channel->isValid() === false)
                        fputs ($this->newfile, "#Illegal channel: " . $chanel->getChannelString() . "\n");
                    else{
                        $newchannel = $this->checkChannel( $channel );
                        if ($newchannel !== "")
                            fputs ($this->newfile, $newchannel . "\n");
                    }
                }
            }
            fclose( $this->newfile );
            print_r($this->stats);
        }
        else
            print "Files are missing at $checkpath.\n";
    }

    private function checkChannel( $channel ){
        $channelstring = "";
        $rowcount = 0;
        $matchstring = "";
        $result = $channel->getChannelsWithMatchingUniqueParams();
        foreach ($result as $row){
            $resultchannel = new channel($row);
            $matchstring .= " * " .$resultchannel->getChannelString() ."\n";
            $rowcount ++;
        }
        switch ($rowcount){
            case 0:
                print "Warning: Found no match for channel: ". $channel->getChannelString()."\n";
                $this->stats["unmatched_channels"] ++;
                $channelstring = "#Warning: Found no match for channel: ". $channel->getChannelString();
                $query = "SELECT * FROM channels WHERE".
                    " name = " . $this->db->quote($channel->getName()) .
                    " AND source = " . $this->db->quote($channel->getSource);
                $result = $this->db->query($query);
                foreach ($result as $row2){
                    $altchannel = new channel($row2);
                    $channelstring .= "\n#  Alternative: " . $altchannel->getChannelString();
                }
                $channelstring = ""; //hide alternative lines for now
                break;
            case 1:
                print "Info: Found one match for channel: ". $channel->getChannelString()."\n";
                if ( $channel->getChannelString() != $resultchannel->getChannelString())
                    $this->stats["updated_channels"] ++;
                else
                    $this->stats["unchanged_channels"] ++;

                $channelstring = $resultchannel->getChannelString();
                break;
            default:
                print "Error: Found more than one match for channel". $channel["name"] . ":\n" . $matchstring;
                $this->stats["unmatched_channels"] ++;
        }
        return $channelstring;
    }
}
?>