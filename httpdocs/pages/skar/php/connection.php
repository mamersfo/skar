<?php

define ( 'DB_SERVER', 'localhost' );
define ( 'DB_PORT', 3306 );
define ( 'DB_DATABASE', 'www_skar-ateliers_nl' );
define ( 'DB_USER', 'skar' );
define ( 'DB_PASSWORD', 'SlkqwWsx' );

require_once ( 'debug.php' );

class Connection
{
	function values( $query, $column, $connection )
	{
		$result = array();
		
		$sqlResult = mysql_query( $query, $connection )
			or die ( 'Connection->values() - error: ' . mysql_error() );
		
		if ( $sqlResult != null )
		{
			while ( ( $row = mysql_fetch_assoc( $sqlResult ) ) !== false ) 
			{
				$result[] = $row[$column];
			}
	
			mysql_free_result( $sqlResult );
		}		
		
		return $result;
	}

	function fetch( $query, $connection )
	{
		debug( "Connection->fetch() - $query" );
		
		$result = null;
	
		$sqlResult = mysql_query( $query, $connection )
			or die ( 'Connection->fetch() - error: ' . mysql_error() );
		
		if ( $sqlResult != null )
		{
			while ( ( $row = mysql_fetch_assoc( $sqlResult ) ) !== false ) 
			{
				$result = $row['result'];
				break;
			}

			mysql_free_result( $sqlResult );
		}
		
		return $result;		
	}	
		
	function execute( $query, $connection )
	{
		debug( "Connection->execute() - $query" );
		
		$value = $sqlResult = mysql_query( $query, $connection )
			or die ( 'Connection->execute() - error: ' . mysql_error() );
			
		if ( $value )
		{
			$result = mysql_affected_rows();
		}
		
		return $result;		
	}	
	
	function &connect()
	{
		debug( "Connection->connect()" );
		
		$server = DB_SERVER;

		if ( DB_PORT != 3306 ) $server .= ':' . DB_PORT;

		$connection = @mysql_connect( $server, DB_USER, DB_PASSWORD );
		
		if ( $connection )
		{
			mysql_select_db( DB_DATABASE, $connection );
		}
		else
		{
			die ( 'Could not connect: ' . mysql_error() );		
		}

		return $connection;
	}
	
	function close( &$connection )
	{
		debug( "Connection->close" );
		
		mysql_close( $connection );	
			
		$connection = null;
	}	
}

?>
