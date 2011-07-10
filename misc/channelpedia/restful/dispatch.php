<?php

// load Tonic library
require_once '../classes/lib/tonic.php';
require_once '../classes/lib/PiwikTracker.php';
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

if (PIWIK_TRACKING_ENABLED)
    PiwikTracker::$URL = PIWIK_TRACKING_REMOTE_URL;

try {
    $resource = $request->loadResource();
    $response = $resource->exec($request);
    if (PIWIK_TRACKING_ENABLED){
        $piwikTracker = new PiwikTracker( PIWIK_TRACKING_IDSITE, PIWIK_TRACKING_REMOTE_URL );
        $piwikTracker->setTokenAuth( PIWIK_TRACKING_AUTH_TOKEN );
        $piwikTracker->setUrl( "http://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] );
        $piwikTracker->doTrackPageView( $_SERVER['REQUEST_URI'] );
    }
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
