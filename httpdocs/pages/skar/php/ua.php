<?php

function is_gecko( $str )
{
    return (
        strpos( $str, "gecko" ) != FALSE &&
        ! is_safari( $str )
    );
}

function get_my_browser( $str )
{
    if ( is_ie( $str ) ) return "Internet Explorer";
    if ( is_ns( $str ) ) return "Netscape Navigator";
    if ( is_opera( $str ) ) return "Opera";
    if ( is_firefox( $str ) ) return "FireFox";
    if ( is_mozilla( $str ) ) return "Mozilla";
    if ( is_konqueror( $str ) ) return "Konqueror";
    if ( is_safari( $str ) ) return "Safari";
    if ( is_omniweb( $str ) ) return "OmniWeb";
    return "Unknown";
}

function get_my_version( $str )
{
    $result = "0";

    if ( is_ie( $str ) )
    {
        $begin = strpos( $str, "msie" );
        $end = strpos( $str, ";", $begin );
        $str = substr( $str, $begin, $end - $begin );
        $pieces = explode( " ", $str );
        $result = $pieces[1];
    }
    else if ( is_ns( $str ) )
    {
        if ( strpos( $str, "netscape" ) != FALSE )
        {
            $index = strpos( $str, "netscape" );
            $str = substr( $str, $index );
            $pieces = explode( "/", $str );
            $result = $pieces[1];
        }
    }
    else if ( is_opera( $str ) )
    {
        $index = strpos( $str, "opera" );
        $str = substr( $str, $index );
        $pieces = explode( " ", $str );
        $result = $pieces[1];
    }
    else if ( is_firefox( $str ) )
    {
        $index = strpos( $str, "firefox" );
        $str = substr( $str, $index );
        $pieces = explode( "/", $str );
        $result = $pieces[1];
    }
    else if ( is_mozilla( $str ) )
    {
    }

    return $result;
}

function is_konqueror( $str )
{
    return (
        strpos( $str, "konqueror" ) != FALSE
    );
}

function is_safari( $str )
{
    return (
        strpos( $str, "safari" ) != FALSE
    );
}

function is_omniweb( $str )
{
    return (
        strpos( $str, "omniweb" ) != FALSE
    );
}

function is_opera( $str )
{
    return (
        strpos( $str, "opera" ) != FALSE
    );
}

function is_icab( $str )
{
    return (
        strpos( $str, "icab" ) != FALSE
    );
}

function is_aol( $str )
{
    return (
        strpos( $str, "aol" ) != FALSE
    );
}

function is_webtv( $str )
{
    return (
        strpos( $str, "webtv" ) != FALSE
    );
}

function is_ie( $str )
{
    return (
        strpos( $str, "msie" ) != FALSE &&
        ! is_opera( $str ) &&
        ! is_webtv( $str )
    );
}

function is_mozilla( $str )
{
    return (
        is_gecko( $str ) &&
        ( strpos( $str, "gecko/" ) + 14 == strlen( $str ) )
    );
}

function is_firebird( $str )
{
    return (
        strpos( $str, "firebird/" ) != FALSE
    );
}

function is_firefox( $str )
{
    return (
        strpos( $str, "firefox" ) != FALSE
    );
}

function is_ns( $str )
{
    return (
        is_gecko( $str ) ?
            strpos( $str, "netscape" ) :
                ( ereg( "mozilla", $str ) &&
                    ! is_opera( $str ) &&
                    ! is_safari( $str ) &&
                    strpos( $str, "spoofer" ) == FALSE &&
                    strpos( $str, "compatible" ) == FALSE &&
                    strpos( $str, "webtv" ) == FALSE &&
                    strpos( $str, "hotjava" ) == FALSE )
    );
}

// Operating Systems

function get_my_os( $str )
{
    if ( is_win( $str ) ) return "Windows";
    if ( is_mac( $str ) ) return "Macintosh";
    if ( is_linux( $str ) ) return "Linux";
    if ( is_unix( $str ) ) return "UNIX";
    return "Unknown";
}

function is_win( $str )
{
    return (
        strpos( $str, "win" )
    );
}

function is_mac( $str )
{
    return (
        strpos( $str, "mac" )
    );
}

function is_unix( $str )
{
    return (
        strpos( $str, "unix" ) ||
        strpos( $str, "sunos" ) ||
        strpos( $str, "bsd" ) ||
        strpos( $str, "x11" )
    );
}

function is_linux( $str )
{
    return (
        strpos( $str, "linux" )
    );
}

?>
