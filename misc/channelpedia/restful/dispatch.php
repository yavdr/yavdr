<?php

// load Tonic library
require_once '../classes/lib/tonic.php';
require_once '../classes/class.config.php';
require_once '../classes/class.dbConnection.php';
require_once '../classes/class.channelGroupIterator.php';
require_once '../classes/class.channelIterator.php';

// load resources
require_once '../classes/restful_resources/channelgroups.php';
require_once '../classes/restful_resources/channelsupload.php';
require_once '../classes/restful_resources/sources.php';

// handle request
$request = new Request(array(
    'baseUri' => '/restful'
));

try {
    $resource = $request->loadResource();
    $response = $resource->exec($request);
} catch (ResponseException $e) {
    switch ($e->getCode()) {
    case Response::UNAUTHORIZED:
        $response = $e->response($request);
        $response->addHeader('WWW-Authenticate', 'Basic realm="Tonic"');
        break;
    default:
        $response = $e->response($request);
    }
}
$response->output();
?>
