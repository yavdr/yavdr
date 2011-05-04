<?php

/**
 * Channel groups resource
 *
 * @namespace channelpedia/channelgroups
 * @uri /channelgroups/:sourcetype/:source/:language/:group/:outputtype
 *
 */

class channelgroupsResource extends Resource {

    /**
     * Handle a GET request for this resource
     * @param Request request
     * @return Response
     */
    function get($request, $sourcetype, $source, $language, $group, $outputtype) {

        $response = new Response($request);

        //check validity of supplied parameters
        if ($group !== "all" && $group != intval($group))
            throw InvalidParamException();
        if ($group !== "all")
            $group = intval($group);
        $outputtype = strtolower($outputtype);
        if ($outputtype !== "json" && $outputtype !== "")
            throw InvalidParamException();
        if (!in_array( $sourcetype, array("DVB-S", "DVB-C", "DVB-T")))
            throw InvalidParamException();

        $response->code = Response::OK;

        $groupIterator = new channelGroupIterator();
        if (in_array( $sourcetype, array( "DVB-C", "DVB-T" ))){
            $source = substr($sourcetype,4,1)."[".$source."]";
        }
        $groupIterator->init($source, $language);

        if ($group === 0){
            if ($outputtype === "json"){
                $response->addHeader('Content-type', 'application/json; charset=utf-8');
                $jsonarray = array();
                $jsonarray["result"] = array();
                while ($groupIterator->moveToNextChannelGroup() !== false){
                    $jsonarray["result"][] = $groupIterator->getCurrentChannelGroupArray();
                }
                $response->body .= json_encode($jsonarray)."\n";
            }
            else{
                $response->addHeader('Content-type', 'text/plain');
                while ($groupIterator->moveToNextChannelGroup() !== false){
                    $cols = $groupIterator->getCurrentChannelGroupArray();
                    $response->body .= $cols['x_label'] . " / " . $cols['channelcount']."\n";
                }
            }
        }
        else{
            if ($outputtype === "json"){
                $response->addHeader('Content-type', 'application/json; charset=utf-8');
                $jsonarray = array();
                $jsonarray["result"] = array();
                while ($groupIterator->moveToNextChannelGroup() !== false ){
                    if ($group === "all" || intval($groupIterator->getCurrentChannelGroupCount()) === $group){
                        $temp = $groupIterator->getCurrentChannelGroupArray();
                        $temp["channels"] = array();
                        $channelIterator = new channelIterator();
                        $channelIterator->init1($temp['x_label'], $source, $orderby = "UPPER(name) ASC");
                        while ($channelIterator->moveToNextChannel() !== false){
                            $temp["channels"][] = array (
                                "parameters" => $channelIterator->getCurrentChannelArray(),
                                "string" => $channelIterator->getCurrentChannelString()
                            );
                        }
                        if ($group === "all")
                            $jsonarray["result"][] = $temp;
                        else
                            $jsonarray["result"] = $temp;
                    }
                }
                $response->body .= json_encode($jsonarray)."\n";
            }
            else{
                $response->addHeader('Content-type', 'text/plain; charset=utf-8');
                $response->body .= "not implemented yet\n";
            }
        }
        return $response;
    }
}
?>