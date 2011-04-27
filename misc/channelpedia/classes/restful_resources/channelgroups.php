<?php

/**
 * Channel groups resource
 *
 * @namespace channelpedia/channelgroups
 * @uri /channelgroups/:source/:language/:group/:outputtype
 *
 */

class channelgroupsResource extends Resource {

    /**
     * Handle a GET request for this resource
     * @param Request request
     * @return Response
     */
    function get($request, $source, $language, $group, $outputtype) {

        $response = new Response($request);

        //check validity of supplied parameters
        if ($group != intval($group))
            throw InvalidParamException();
        $group = intval($group);
        $outputtype = strtolower($outputtype);
        if ($outputtype !== "json" && $outputtype !== "")
            throw InvalidParamException();

        $response->code = Response::OK;

        $groupIterator = new channelGroupIterator();
        $groupIterator->init($source, $language);

        if ($group == 0){
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
                    if ($groupIterator->getCurrentChannelGroupCount() == $group){
                        $values = $groupIterator->getCurrentChannelGroupArray();
                        $jsonarray["meta"][] = $values;
                        $channelIterator = new channelIterator();
                        $channelIterator->init1($values['x_label'], $source, $orderby = "UPPER(name) ASC");
                        while ($channelIterator->moveToNextChannel() !== false){
                            $jsonarray["result"]["channelparameters"][] = $channelIterator->getCurrentChannelArray();
                            $jsonarray["result"]["channelstrings"][] = $channelIterator->getCurrentChannelString();
                        }
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