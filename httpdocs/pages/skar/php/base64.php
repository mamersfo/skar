<?php

function base64_decode_fix( $data, $strict = false )
{
    if ( $strict )
        if ( preg_match( '![^a-zA-Z0-9/+=]!', $data ) )
            return( false );

    return ( base64_decode( $data ) );
}

?>