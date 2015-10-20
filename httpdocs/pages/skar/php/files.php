<html>
<body>
<?php

require_once( 'repository.php' );

$repo = new Repository();

$folder = $repo->listImages( '../images/backgrounds', $_REQUEST['uri'] );

?>
<table border="1" cellpadding="4" cellspacing="4">
<?
foreach ( $folder->items as $image )
{
    $url = "$folder->uri/$image->filename";

    ?>
    <tr>
        <td><a href="<?= $url ?>" target="_blank"><?= $image->filename ?></a></td>
        <td><?= $image->index ?></td>
        <td><?= $image->description ?></td>
        <td><?= $image->filesize ?></td>
    </tr>
    <?
}
?>
</table>
</body>
</html>