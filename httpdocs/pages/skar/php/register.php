<?php

header( 'Content-Type: text/json' );
header( 'Cache-Control: no-cache' );
header( 'Pragma: no-cache' );

require_once ( 'sendmail.php' );
require_once ( 'flow.php' );
require_once ( 'json.php' );
require_once ( 'error.php' );

set_error_handler( 'handleErrorJson' );

session_start();

$action = $_REQUEST['action'];

$json =& Singleton::getInstance( 'Services_JSON', 'JSON' );

$flow = getFlow();

$response = array();

if ( 'first' == $_REQUEST['action'] )
{
    $keys = array_keys( $_SESSION );

    foreach ( $keys as $key )
    {
        unset( $_SESSION[$key] );
    }

    reset( $flow->forms );

    $response['form'] = current( $flow->forms );
}
else if ( 'next' == $_REQUEST['action'] )
{
    if ( 'submit' == $_REQUEST['form'] )
    {
        $response['form'] = $flow->find( 'exit' );

        $html = '<html><head></head><body><table>';

        $lookup = array(
            "name" => "Naam",
            "discipline" => "Kunstdiscipline",
            "address" => "Adres",
            "postalCode" => "Postcode",
            "city" => "Plaats",
            "phone" => "Telefoon",
            "category" => "Doelgroep",
            "contract" => "Contract",
            "contractmedia" => "Contract",
            "size" => "Oppervlakte",
            "space" => "Werkruimte",
            "criteria-individual" => "Voorwaarden",
            "criteria-group" => "Voorwaarden"
        );

        foreach ( $lookup as $key => $property )
        {
            $value = null;

            if ( isset( $_SESSION[$key] ) ) $value = $_SESSION[$key];

            if ( $value == null && isset( $_REQUEST[$key] ) ) $value = $_REQUEST[$key];

            if ( $value != null ) $html .= "<tr><td>$property:</td><td>$value</td></tr>";
        }

        $html .= '</table></body></html>';

        debug( "html: $html" );

        sendmail(
            'webmaster@skar-ateliers.nl',   // from
            'SKAR Web Site',                // from name
            'info@skar-ateliers.nl',            // to
            'SKAR',                         // to name
            'SKAR Inschrijving',            // subject
            $html                           // message
        );

        session_destroy();
    }
    else
    {
        $form = $flow->find( $_REQUEST['form'] );

        $target = null;

        if ( isset ( $_REQUEST['option'] ) )
        {
            $option = $_REQUEST['option'];

            $_SESSION[$_REQUEST['form']] = $option;

            $option = $form->find( $option );

            $target = $option->target;
        }
        else
        {
            $target = $form->target;
        }

        $form = $flow->find( $target );

        $response['form'] = $form;
    }
}
else if ( 'previous' == $_REQUEST['action'] )
{
    $keys = array_keys( $_SESSION );

    $target = null;

    $count = count( $keys );

    while ( $count > 0 )
    {
        if ( $keys[$count-1] == $_REQUEST['form'] )
        {
            $target = $keys[$count-2];
            break;
        }

        $count--;
    }

    if ( $target == null )
    {
        $target = $keys[count( $keys )-1];
    }

    $form = $flow->find( $target );

    $response['form'] = $form;
}

if ( count( $_SESSION ) > 0 )
{
    $response['registration'] = $_SESSION;
}

$output = $json->encode( $response );

debug( "output: $output" );

header( "X-JSON: ( $output )" );

?>