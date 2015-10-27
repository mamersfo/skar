<?php

define ( 'DB_SERVER', 'localhost' );
define ( 'DB_PORT', 3306 );
define ( 'DB_DATABASE', 'www_skar-ateliers_nl' );
define ( 'DB_USER', 'skar' );
define ( 'DB_PASSWORD', 'SlkqwWsx' );

include_once ( 'pdo_mysql.php' );
require_once ( 'debug.php' );

class Connection
{
    var $pdo;

    function values( $query, $column )
    {
        $result = array();

        $sqlResult = pdo_query( $query )
            or die ( 'Connection->values() - error: ' . pdo_error() );

        if ( $sqlResult != null )
        {
            while ( ( $row = pdo_fetch_assoc( $sqlResult ) ) !== false )
            {
                $result[] = $row[$column];
            }

            unset( $sqlResult );
        }

        return $result;
    }

    function fetch( $query )
    {
        debug( "Connection->fetch() - $query" );

        $result = null;

        $sqlResult = pdo_query( $query )
            or die ( 'Connection->fetch() - error: ' . pdo_error() );

        if ( $sqlResult != null )
        {
            while ( ( $row = pdo_fetch_assoc( $sqlResult ) ) !== false )
            {
                $result = $row['result'];
                break;
            }

            unset( $sqlResult );
        }

        return $result;
    }

    function execute( $query )
    {
        debug( "Connection->execute() - $query" );

        $value = $sqlResult = pdo_query( $query )
            or die ( 'Connection->execute() - error: ' . pdo_error() );
    }

    function connect()
    {
        debug( "Connection->connect()" );

        $server = DB_SERVER;

        if ( DB_PORT != 3306 ) $server .= ':' . DB_PORT;

        $pdo = pdo_connect( $server, DB_USER, DB_PASSWORD );

        pdo_select_db( DB_DATABASE );
    }

    function close()
    {
        debug( "Connection->close" );
        unset($pdo);
    }
}

?>
