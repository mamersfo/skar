<?php

require_once ( 'error.php' );
require_once ( 'repository.php' );

header( 'Content-Type: text/json' );
header( 'Cache-Control: no-cache' );
header( 'Pragma: no-cache' );

set_error_handler( 'handleErrorJson' );

$action = 'undefined';
if ( isset( $_REQUEST['action'] ) ) $action = $_REQUEST['action'];

$target = 'undefined';
if ( isset( $_REQUEST['target'] ) ) $target = $_REQUEST['target'];

$id = 'undefined';	
if ( isset( $_REQUEST['id'] ) ) $id = $_REQUEST['id'];

debug( "site.php: action=$action, target=$target, id=$id" );
	
$json =& Singleton::getInstance( 'Services_JSON', 'JSON' );

$errorHandler =& Singleton::getInstance( 'Observer', 'ErrorHandler' );

$repository = new Repository();	

$errorHandler->attach( $repository );

$response = null;

if ( 'list' == $action )
{
	if ( 'Folders' == $target )	
	{
		$response = $repository->listFolders( $id );		
	}
	else if ( 'Backgrounds' == $target )
	{
		$response = $repository->listImages( '../images/backgrounds', $id );
	}
	else
	{
		$response = new Error( -1, "Unexpected target: $target", __FILE__, __LINE__ );
	}
}
else if ( 'find' == $action )
{
	$response = $repository->findResource( $id );
}
else
{
	$response = new Error( -1, "Unexpected action: $action", __FILE__, __LINE__ );
}

$repository->cleanup();

if ( $response == null )
{
	$response = new Error( -1, 'Unable to create response', __FILE__, __LINE__ );
}

$output = $json->encode( $response );

header( "X-JSON: ( $output )" );

?>