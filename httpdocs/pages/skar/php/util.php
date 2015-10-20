<?php 

function file_32( $filename )
{
	$pos = strrpos( $filename, "." );
				
	return sprintf( "%s_32.%s", substr( $filename, 0, $pos ), substr( $filename, $pos + 1 ) );
}

function map_file_32( $filename )
{
	if ( substr( $filename, 0, 12 ) == "/pages/skar/" )
	{
		$filename = substr( $filename, 12 );
	}
	
	return file_32( $filename );
}

function file_bg( $filename )
{
	$pos = strrpos( $filename, "_vw" );
		
	return sprintf( "%s_bg.jpg", substr( $filename, 0, $pos ) );
}

?>
