<?php

// load Tonic library
require_once '../lib/tonic.php';
require_once '../class.config.php';
require_once '../class.dbConnection.php';
require_once '../class.channelGroupIterator.php';
require_once '../class.channelIterator.php';

// load resources
require_once '../resources/channelgroups.php';

// handle request
$request = new Request(array(
    'baseUri' => '/fileadmin/yavdr/restful'
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
