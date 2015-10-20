<?php

header( 'Content-Type: text/json' );
header( 'Cache-Control: no-cache' );
header( 'Pragma: no-cache' );

require_once ( 'base64.php' );
require_once ( 'error.php' );
require_once ( 'json.php' );
require_once ( 'repository.php' );

session_start();

$response = null;

set_error_handler( 'handleErrorJson' );

$json =& Singleton::getInstance( 'Services_JSON', 'JSON' );

$errorHandler =& Singleton::getInstance( 'Observer', 'ErrorHandler' );

$repository = new Repository();	

$errorHandler->attach( $repository );

$action = null;

if ( isset ( $_REQUEST['action'] ) ) $action = $_REQUEST['action'];

if ( 'login' == $action )
{
	$dn = null;
	
	if ( isset ( $_REQUEST['dn'] ) && strlen ( $_REQUEST['dn'] ) > 0 )  $dn = $_REQUEST['dn'];
	
	$pass = null;
	
	if ( isset ( $_REQUEST['pass'] ) && strlen ( $_REQUEST['pass'] ) > 0 ) $pass = $_REQUEST['pass'];
	
	$user = $repository->findUser( $dn, $pass );
		
	if ( $user != null )
	{
		$_SESSION['PHP_AUTH_USER'] = $user->id;
		
		$response = $user;
	}
	else
	{
	    header( 'HTTP/1.1 401 Unauthorized' );
	}
}
else if ( isset ( $_SESSION['PHP_AUTH_USER'] ) )
{
	$target = null;
	if ( isset( $_REQUEST['target'] ) ) $target = $_REQUEST['target'];

	$id = null;	
	if ( isset( $_REQUEST['id'] ) ) $id = $_REQUEST['id'];
	
	$user = $_SESSION["PHP_AUTH_USER"];
		
	if ( 'logout' == $action )
	{
		session_destroy();
		
		$response = array( 'result', 'OK' );
	}
	else if ( 'list' == $action )
	{
		if ( 'Folders' == $target )	
		{
			$response = $repository->listFolders( $id );		
		}
		else if ( 'Links' == $target )
		{
			$response = $repository->listLinks();
		}
		else
		{
			$response = new Error( E_USER_ERROR, "Target $target is not supported", __FILE__, __LINE__ );
		}
	}
	else if ( 'find' == $action )
	{
		$response = $repository->findResource( $id );
	}
	else if ( 'insert' == $action )
	{
		$resource = $repository->createResource( $target, $_REQUEST );
		
		$resource->modified = date( 'Y-m-d h:i:s');
		
		$response = $resource;		
	}
	else if ( 'update' == $action )
	{
		$resource = null;
	
		if ( $id != -1 )
		{
			$resource = $repository->findResource( $id );
		}
		else
		{
			$resource = $repository->createResource( $target, null );
		}
		
		$resource->setValues( $_REQUEST );

		if ( $resource instanceof Story  )
		{
			$resource->pages = array();

			$index = 1;
		
			while ( isset ( $_REQUEST['Page' . $index] ) )
			{
				// fix the occasional space appearing with POST data, see
				// http://nl3.php.net/manual/en/function.base64-decode.php#69298
				
				$page = str_replace( " ", "+", $_REQUEST['Page' . $index] );
				
				// workaround for 'strict' parameters
				// http://nl3.php.net/manual/en/function.base64-decode.php#79098
				
				$page = base64_decode_fix( $page, true );
			
				$resource->pages[] = $page;
				
				$index++;
			}
			
			// Links
			
			$resource->links = array();
			
			$index = 1;
			
			while ( isset ( $_REQUEST['Link' . $index] ) )
			{
				$link = new Link();
				$link->id = $_REQUEST['Link' . $index];
				$resource->links[] = $link;
				$index++;
			}			
		}
		
		$repository->updateResource( $resource );
		
		$response = array( 'result' => 'OK' );		
	}
	else if ( 'delete' == $action )
	{
		if ( $id != -1 )
		{
			$repository->deleteResource( $id );			
		}
		
		$response = array( 'result' => 'OK' );
	}
	else
	{
		$response = new Error( E_USER_ERROR, "Action $action is not supported", __FILE__, __LINE__ );
	}	
}
else
{
    header( 'HTTP/1.1 401 Unauthorized' );
}

$repository->cleanup();	

if ( $response != null )
{
	$output = $json->encode( $response );
	
	// debug( "output: $output" );
	
	header( "X-JSON: ( $output )" );
}

?>