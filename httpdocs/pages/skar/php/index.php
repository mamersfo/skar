<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<?php

require_once ( 'repository.php' );
require_once ( 'debug.php' );

set_error_handler( 'handleError' );

function handleError( $errno, $errstr, $errfile, $errline )
{
    debug( "Error $errno: $errstr, file: $errfile, line: $errline" );

    ?>
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="nl" lang="nl" xmlns:fb="http://ogp.me/ns/fb#">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <title>SKAR</title>
        <link rel="stylesheet" href="../css/skar.css" type="text/css" />
    </head>
    <body>
        <table id="canvas"><tr><td>
            <div id="error">De SKAR web site is tijdelijk onbereikbaar,<br/>probeer het later nog een keer.</div>
        </td></table>
    </body>
    </html>
    <?
    die();
}

$repo = new Repository();

$menus = $repo->listFolders( null );

$journal = $repo->findJournal();

$stories = $repo->listNews( 2 );

$repo->cleanup();

?>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="nl" lang="nl" xmlns:fb="http://ogp.me/ns/fb#">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />

    <meta property="og:image" content="http://www.skar-ateliers.nl/pages/skar/images/skartopnav3.gif" />

    <meta property="og:title" content="Non Profit Organisatie" />
    <meta property="og:site_name" content="SKAR" />
    <meta property="og:url" content="http://www.skar-ateliers.nl/pages/skar/php/index.php" />
    <meta property="og:type" content="website" />

    <meta property="fb:app_id" content="http://graph.facebook.com/SKAR.ateliers"  />
    <meta property="article:author" content="https://www.facebook.com/fareedzakaria" />
    <meta property="article:publisher" content="https://www.facebook.com/cnn" />

    <title>SKAR</title>
    <link rel="stylesheet" href="../css/skar.css" type="text/css" />
    <link rel="shortcut icon" type="image/x-icon" href="../images/favicon.ico">
    <script src="../scripts/prototype.js" type="text/javascript"></script>
    <script src="../scripts/util.js" type="text/javascript"></script>
    <script src="../scripts/site.js" type="text/javascript"></script>
    <script src="../scripts/flow.js" type="text/javascript"></script>
    <link href="../css/shadowbox.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="../scripts/shadowbox.js"></script>

    <script type="text/javascript">

    Shadowbox.init({
        // a darker overlay looks better on this particular site
        overlayOpacity: 0.85
        // setupDemos is defined in assets/demo.js
    });
    // window.onload = function() {
        // open a welcome message as soon as the window loads
       // Shadowbox.open({
       // content: '',
        // player: 'img',
        //height: 580,
      //  width: 580
      //  });
    //}
    </script>
</head>

<body onload="init();">



<table id="canvas"><tr><td>

    <div id="top">

        <div id="tools">
            <ul>
                <li><a href="https://www.facebook.com/SKAR.ateliers" target="_blank"><div class="facebook">&nbsp;</div></a></li>
                <li><div><a href="#" onclick="openFlow()">Aanmelden</a></div></li>
                <li><div><a href="#" onclick="findResource( renderMenu, 6 );">Contact</a></div></li>
            </ul>
        </div> <!-- end tools -->

        <div id="menu">
            <ul>
                <li><img id="menu-logo" src="../images/skartopnav3.gif"
                    border="0" alt="" onclick="home();"/></li>
<?
foreach( $menus as $next )
{
    if ( $next->type == 'menu' )
    {
    ?>
            <li><a href="#" id="menu-<?= $next->id ?>" title="<?= $next->cn ?>" onclick="findResource( renderMenu, <?= $next->id ?> );"><div class="menutitle"><?= $next->cn ?></div><div class="subtitle"><?= $next->description ?></div></a></li>
    <?
    }
}
?>
            </ul>
        </div> <!-- end menu -->

        <div id="page"
            style="background-image:url(../backgrounds/background1.jpg);background-repeat: no-repeat;">

            <div id="content">
                <table id="content-table" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>&nbsp;</td>
                        <td>
                            <div id="content-title"></div>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top" id="content-menu">
                        </td>
                        <td id="content-canvas">
                            <div id="content-image"></div>
                            <div id="content-field">
                            </div>
                            <div id="content-nav"></div>
                        </td>
                    </tr>
                </table>
            </div>

            <table id="alert" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <a href="../files/<?= $journal->uri ?>" target="_blank">
                            <span id="alert-title"><?= $journal->cn ?></span>
                            <br/>
                            <span id="alert-text"></span>
                        </a>
                        <br/>
                        <a href="#" onclick="findResource( renderMenu, 4 );">
                            <span id="alert-archive">Archief SKAR Journaal</span>
                        </a>
                    </td>
<?
foreach ( $stories as $story )
{
?>
                    <td>
                        <a href="#" onclick="showStory( <?= $story->id ?> )"><?= $story->cn ?></a>
                    </td>
<?
}
?>
                </tr>
            </table> <!-- end alert -->
            <!-- fotocomment -->
           <table id="fotocomment" cellpadding="0" cellspacing="0">
            <tr>
             <td>
              <div id="property-name"></div><div id="property-description"></div>
             </td>
            </tr>
           </table> <!-- end fotocomment -->

            <div id="flow">
                <form id="flow-form" action="">
                    <input id="flow-form-id" type="hidden" name="form" value="none" />
                    <div id="flow-bar"></div>
                    <div id="flow-body">
                        <div id="flow-content">
                            <div id="flow-content-left">
                                <div id="flow-content-title"></div>
                                <div id="flow-content-text"></div>
                            </div>
                            <div id="flow-content-right">
                            </div>
                        </div>
                        <div id="flow-footer">
                            <ul>
                                <li><input type="button" name="action" id="flow-close"
                                    onclick="closeFlow()" value="Sluiten"/></li>
                                <li><input type="button" name="action" id="flow-next"
                                    onclick="findForm( 'next' )" value="Volgende" /></li>
                                <li><input type="button" name="action" id="flow-previous"
                                    onclick="findForm( 'previous' )" value="Vorige"/></li>
                            </ul>
                        </div>
                    </div>
                </form>
            </div> <!-- end flow -->

            <table id="content-intro" cellpadding="0" cellspacing="0">
                 <tr>
                  <td>&nbsp;</td>
                 </tr>
                 <tr>
                  <td id="content-canvasintro">
                   <div id="content-fieldintro">
                   </div>
                    <div id="content-navintro">
                    </div>
                  </td>
                 </tr>
                 <tr>
                  <td>&nbsp;</td>
                 </tr>
            </table>


        </div> <!-- end page -->

    </div> <!-- end top -->

</td></tr></table>

</body>
</html>
