<?php

// load Tonic library
require_once '../classes/lib/tonic.php';
require_once '../classes/class.config.php';
require_once '../classes/class.dbConnection.php';
require_once '../classes/class.channelGroupIterator.php';
require_once '../classes/class.channelIterator.php';

// load resources
require_once '../classes/restful_resources/channelgroups.php';
require_once '../classes/restful_resources/sources.php';

// handle request
$request = new Request(array(
    'baseUri' => '/restful'
));

$resource = $request->loadResource();
try {
    $response = $resource->exec($request);
} catch (AuthException $e) {
    $response = new Response($request);
    $response->code = Response::UNAUTHORIZED;
    $response->body = 'You must enter the username and password';
    $response->addHeader('WWW-Authenticate', 'Basic realm="Tonic"');
}
$response->output();

?>
