<?php

require_once ( 'debug.php' );
require_once ( 'json.php' );
require_once ( 'singleton.php' );
require_once ( 'observer.php' );

class Error
{
	var $oc;
	var $id;
	var $type;
	var $description;
	var $file;
	var $line;
	
	function Error( $errno, $errstr, $errfile, $errline )
	{
		$error_types = array (
			E_ERROR              => 'Error',
			E_WARNING            => 'Warning',
			E_PARSE              => 'Parsing Error',
			E_NOTICE             => 'Notice',
			E_CORE_ERROR         => 'Core Error',
			E_CORE_WARNING       => 'Core Warning',
			E_COMPILE_ERROR      => 'Compile Error',
			E_COMPILE_WARNING    => 'Compile Warning',
			E_USER_ERROR         => 'User Error',
			E_USER_WARNING       => 'User Warning',
			E_USER_NOTICE        => 'User Notice',
			E_STRICT             => 'Runtime Notice',
			E_RECOVERABLE_ERROR  => 'Catchable Fatal Error'
		);

		$this->oc = 'Error';
		$this->id = $errno;
		$this->type = $error_types[$errno];
		$this->description = $errstr;
		$this->file = $errfile;
		$this->line = $errline;
	}
}

function handleErrorJson( $errno, $errstr, $errfile, $errline )
{
	debug( "error $errno: $errstr, file: $errfile at line $errline" );
	
	$components = explode( "/", $errfile );
	
	$error = new Error( $errno, $errstr, $components[count($components)-1], $errline );
	
	$handler =& Singleton::getInstance( 'Observer', 'ErrorHandler' );
	
	$handler->setState( $error );
	
	$json =& Singleton::getInstance( 'Services_JSON', 'JSON' );

	header( "X-JSON: ( $json->encode( $error ) )" );

	die();
}

?>