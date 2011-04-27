<?php

/**
 * Sources resource
 *
 * @namespace channelpedia/sources
 * @uri /sources
 *
 */

class sourcesResource extends Resource {

    /**
     * Handle a GET request for this resource
     * @param Request request
     * @return Response
     */
    function get() {
        $config = config::getInstance();

        $response = new Response($request);
        $response->code = Response::OK;
        $response->addHeader('Content-type', 'application/json');

        $jsonarray = array();
        $jsonarray["result"] = array();

        $stype = "DVB-S";
        $jsonarray["result"][$stype] = array();
        foreach ($config->getValue("sat_positions") as $sat => $languages){
            $jsonarray["result"][$stype][$sat] = array();
            foreach ($languages as $language){
                $jsonarray["result"][$stype][$sat][] = $language;
            }
        }

        $stype = "DVB-C";
        $jsonarray["result"][$stype] = array();
        foreach ($config->getValue("cable_providers") as $cablep => $languages){
            $jsonarray["result"][$stype][$cablep] = array();
            foreach ($languages as $language){
                $jsonarray["result"][$stype][$cablep][] = $language;
            }
        }

        $stype = "DVB-T";
        $jsonarray["result"][$stype] = array();
        foreach ($config->getValue("terr_providers") as $terrp => $languages){
            $jsonarray["result"][$stype][$terrp] = array();
            foreach ($languages as $language){
                $jsonarray["result"][$stype][$terrp][] = $language;
            }
        }

        $response->body = json_encode($jsonarray)."\n";
        return $response;
    }
}
?>