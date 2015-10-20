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
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="nl" lang="nl">
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

<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="nl" lang="nl">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
    <title>SKAR</title>
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!---<meta name="viewport" content="width=device-width" />-->
    <link rel="stylesheet" href="../css/smart.css" type="text/css" />
    <link rel="shortcut icon" type="image/x-icon" href="../images/favicon.ico">
    <script src="../scripts/prototype.js" type="text/javascript"></script>
    <script src="../scripts/util.js" type="text/javascript"></script>
    <!--<script src="../scripts/site.js" type="text/javascript"></script>-->
    <script src="../scripts/smartphone.js" type="text/javascript"></script>
    <script src="../scripts/flow.js" type="text/javascript"></script>
    <link href="../css/shadowbox.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="../scripts/shadowbox.js"></script>
        <script type="text/javascript">

Shadowbox.init({
    // a darker overlay looks better on this particular site
    overlayOpacity: 0.8
    // setupDemos is defined in assets/demo.js
});

        function abrirSB(type, title, url)
             {
                 Shadowbox.init({skipSetup: true});
                 Shadowbox.open({type: type, title: title, content: url, width: 480, height: 240});
        };


    </script>
        <script>
      function hideAddressBar()
      {
          if(!window.location.hash)
          {
              if(document.height <= window.outerHeight + 10)
              {
                  document.body.style.height = (window.outerHeight + 50) +'px';
                  setTimeout( function(){ window.scrollTo(0, 1); }, 50 );
              }
              else
              {
                  setTimeout( function(){ window.scrollTo(0, 1); }, 0 );
              }
          }
      }

      window.addEventListener("load", hideAddressBar );
      window.addEventListener("orientationchange", hideAddressBar );
    </script>
</head>

<body onload="init()">

<!--<table id="canvas"><tr><td>-->

    <div id="top">

        <div id="tools">
            <ul>
                <li><a href="https://www.facebook.com/SKAR.ateliers" target="_blank"><span class="facebook"></span></a></li>
                <li><div><a href="#" onclick="openFlow()">Aanmelden</a></div></li>
                <li><div><a href="#" onclick="findResource( renderMenu, 6 );">Contact</a></div></li>
            </ul>
        </div> <!-- end tools -->

        <a href="#" onclick="home()"><div id="logocontent"></div></a>
        <div id="menu">
            <ul>
<?
foreach( $menus as $next )
{
    if ( $next->type == 'menu' )
    {
    ?>
            <li><a href="#" id="menu-<?= $next->id ?>" title="<?= $next->cn ?>" onclick="findResource( renderMenu, <?= $next->id ?> );"><div class="menutitle"><?= $next->cn ?></div><div id="subtitle"><?= $next->description ?></div></a></li>
    <?
    }
}
?>
            </ul>
        </div> <!-- end menu -->

        <div id="page2">

            <div id="page" >
                <div id="content-menu" >
                </div>
            </div>
            <div id="content-intro">
                   <div id="content-fieldintro">
                   </div>
                  <!--<div id="content-navintro"></div>-->
            </div>
            <div id="content">
                <div id="content-title"></div>
                <div id="content-canvas">
                    <div id="content-image"></div>
                    <div id="content-field">
                    </div>
                    <div id="content-nav"></div>
                </div>  <!-- end content canvas -->
            </div>
                <div id="twitter"><!--<span id="twitterdate">6/6</span><span id="twittertext">Foto's tijdelijk pand Raum. <a href="">ow.ly/80erD</a></span><span id="twitterfollow"><a href="#">Volg SKAR op Twitter</a></span>--></div>


            <ul id="alertlist">
        <li><div><span id="alert-title"><a href="../files/<?= $journal->uri ?>" target="_blank">
                            <?= $journal->cn ?></span>
                            <span id="alert-text"></span>
                        </a>

                        <span id="alert-archive">
                        <a href="#" onclick="findResource( renderMenu, 4 );">
                            Archief SKAR Journaal
                        </a></span>
                    </div></li>
<?
foreach ( $stories as $story )
{
?>
                    <li><div>
                        <span id="alert-title"><a href="#" onclick="showStory( <?= $story->id ?> )"><?= $story->cn ?></a></span>
                    </div></li>
<?
}
?>
                    </ul> <!-- end alert -->
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
                                <span id="flow-content-text"></span>
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




        </div> <!-- end page -->

    </div> <!-- end top -->

<!---</td></tr></table>-->

</body>
</html>
