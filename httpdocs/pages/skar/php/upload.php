<?php

function handleError( $errno, $errstr )
{
    echo( 'parent.handleUpload( { result: "ERROR", error: "' .
        addslashes( $errstr ) . '" } );' );
}

set_error_handler( 'handleError' );

?>
<html>
<head>
    <META http-equiv="Content-Type" content="text/html; charset="8859-1">
    <link rel="stylesheet" type="text/css" href="cms/css/main.css"/>
    <link rel="stylesheet" type="text/css" href="cms/css/custom.css"/>
    </script>
</head>
<body>
<?

if ( isset( $_FILES['file'] ) )
{
    echo ( '<script>' );

    if ( $_FILES['file']['error'] > 0 )
    {
        trigger_error( $_FILES['file']['error'] );
    }
    else
    {
        if ( move_uploaded_file ( $_FILES['file']['tmp_name'], './files/' . $_FILES['file']['name'] ) )
        {
            $dn = $_FILES['file']['name'];

            $uri = 'files/' . $_FILES['file']['name'];

            echo( 'parent.handleUpload( { result: "OK", dn: "' . $dn . '", uri: "' . $uri . '" } );' );
        }
    }

    echo ( '</script>' );
}
else
{
?>
    <form method="post" enctype="multipart/form-data">
        <table style="background-color: white;">
            <tr>
                <td class="default-property">
                    Bestand
                </td>
                <td class="default-value">
                    <input class="default" type="file" name="file"/>
                </td>
            </tr>
            <tr>
                <td><br/></td>
                <td class="default-value">
                    <input type="image" src="cms/img/action/select.gif"/>
                </td>
            </tr>
        </table>
        </form>
<?
}
?>
</body>
</html>