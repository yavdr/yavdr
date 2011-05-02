<?php

/**
 * Sources resource
 *
 * @namespace channelpedia/channelsupload
 * @uri /channelsupload
 *
 */

class channelsupload extends Resource {

    /**
     * Handle a GET request for this resource
     * @param Request request
     * @return Response
     */
    function get() {
        $response = new Response($request);
        $response->code = Response::OK;
        $response->body = "This resource is not usable with a GET request.\n";
    }

    /**
     * Handle a POST request for this resource
     * @param Request request
     * @return Response
     */
    function post() {
        $config = config::getInstance();

        $response = new Response($request);
        $response->code = Response::OK;

        //FIXME: Add security checks!!!!
        $response->body = "Welcome to channelpedia channels.conf upload, let's see what we can do....\n";

        $password = isset($_POST["password"]) ? $_POST["password"] : "";
        $user = isset($_POST["user"]) ? $_POST["user"] : "";
        //prevent directory traversal: user name is not allowed to contain dots or slashes
        if ( UPLOAD_PASSWORD == "" || $password != UPLOAD_PASSWORD || $user == "" || strstr($user,".") || strstr($user,"/") || strstr($user,"\\") )
            $response->body .= "Error. File upload canceled.\n";
        else{
            $checkpath = $config->getValue("userdata"). "sources/$user/";

            if (isset($_FILES["channels"]["name"]) && is_file( $checkpath."info.txt" ) && $_FILES["channels"]["name"] == "channels.conf"){
                if (move_uploaded_file($_FILES["channels"]["tmp_name"], $checkpath."channels.conf" )){
                    $response->body .= "Upload successful.\n";
                    //quick'n'dirty approach
                    //now trigger the import of the newly uploaded channels.conf file
                    $cableProvider = "";
                    $infofile = $checkpath."info.txt";
                    if (file_exists( $infofile )){
                        $info = file_get_contents( $infofile);
                        $cableProvider = trim($info); //FIXME
                    }
                    //print $info ."/". $infofile ."/".  $cableProvider."\n";
                    $importer = new channelImport($user, $cableProvider, "none");
                    $importer->addToUpdateLog( "-", "channels.conf was uploaded and is now being processed.");
                    $importer->insertChannelsConfIntoDB();
                    $importer->updateAffectedDataAndFiles();
                    $importer->addToUpdateLog( "-", "Processing finished.");
                    unset($importer);
                }
                else{
                    $response->body .= "Error. File upload canceled.\n";
                }
            }
            else
                $response->body .= "Error. File upload canceled.\n";
        }

        return $response;
    }
}
?>