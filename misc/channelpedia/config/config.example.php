<?php

/*
 *  CUSTOM_PATH (path to parent folder of gen and userdata)
 *  Default: "" (in this case gen and userdata are
 *               located in web root)
 *
 * This is the path to the folder
 * where the following subfolders are located:
 *
 *     a) gen (generated HTML and raw channel files)
 *     b) userdata (sqlite database file + upload folders
 *        for users uploading their channel.conf's
 *
 * What's special about these sub-folders is that they
 * contain dynamic content that is regularly changed
 * by user uploads and the channelpedia rendering engine.
 * Therefore those folders need to be writeable for the
 * web server user (usually www-data).
 *
 * Normally, if used on shared webspace, there is no
 * better choice as to have these folders in the web root
 * of channelpedia together with all the other folders
 * like classes, config, etc.).
 *
 * Security remark:
 * The folders which don't need be publicly accessible
 * are protected with a .htaccess files denying access via HTTP.
 * This only works with Apache. Please check that these
 * precautions work on your installation!
 *
 * If you use channelpedia on a dedicated web server where
 * you have the freedom to set everything up in the way you want,
 * you can take several folders out of the public htdocs folder
 * for enhanced security. Folders that don't necessarily need to
 * be exposed worldwide by putting them into htdocs are:
 * classes, cli, config, epg_mappings, grouping_rules and
 * userdata. A number of require_once statements need to be
 * tweaked then to make channelpedia work again...
 *
 * If you use channelpedia locally and without a HTTP server
 * from the command line (PHP CLI), you may want to have
 * a different path for convenience reasons.
 */

define("CUSTOM_PATH", "");

define("UPLOAD_PASSWORD", "password")

$global_user_config = array(

/*
    "username" => array(
        "ignoreSources" => array(),
        "announcedProviders" => array(
            "C" => "none",
            "T" => "none",
            "A" => "none",
            //"S" => array() //not mandatory
        ),
        "visibleName" => "",

        "password" => "",
        "email" => "none"
    ),
*/
);

?>