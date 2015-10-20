<html>
<head>
<?php
if ( isset( $_REQUEST['title'] ) )
{
?>
	<title><?= $_REQUEST['title'] ?></title>
<?
}
?>
<META content="no" http-equiv="ImageToolbar">
<link rel="stylesheet" href="/assets/skar/legacy.css" />
<style type="text/css">
<!--
BODY
{
	margin: 0px;
}
-->
</style>
</head>
<body onContextMenu="return false">
<?php

if ( isset( $_REQUEST['picture'] ) )
{
	echo "<image src='$_REQUEST[picture]'/>";
}

?>
</body>
</html>
