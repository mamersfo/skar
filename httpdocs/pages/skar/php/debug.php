<?php

define ( 'DEBUG_ENABLED', false );

function debug( $str )
{
	if ( DEBUG_ENABLED == false ) return;

	$fp = fopen ( 'debug.log', 'a' );
	fwrite( $fp, date( 'H:i:s - ' ) );
	fwrite( $fp, $str );
	fwrite( $fp, "\r\n" );	
	fclose( $fp );	
}

?>