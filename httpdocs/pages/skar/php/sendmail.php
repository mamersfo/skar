<?php

function sendmail( $From, $FromName, $To, $ToName, $Subject, $Html )
{
	$OB="----=_OuterBoundary_000";
	$IB="----=_InnerBoundery_001";
	
	$Html or die( "No html part present." );
	$From or die( "Sender address missing" );
	$To or die( "Recipient address missing" );

	$headers ="MIME-Version: 1.0\r\n"; 
	$headers.="From: ".$FromName." <".$From.">\n"; 
	$headers.="To: ".$ToName." <".$To.">\n"; 
	$headers.="Reply-To: ".$FromName." <".$From.">\n"; 
	$headers.="X-Priority: 3\n"; 
	$headers.="X-MSMail-Priority: High\n"; 
	$headers.="X-Mailer: PHP Mailer\n"; 
	$headers.="Content-Type: multipart/mixed;\n\tboundary=\"".$OB."\"\n";

	$content = "<html><head>";
	$content = "<style type='text/css'>BODY { background-color: 669966; font-family: Arial; font-size: 9pt; } ";
	$content .= "TABLE { font-size: 9pt; color: 005D99; } ";
	$content .= "</style><body>De volgende inschrijving is aangemeld:<br/><br/>";
	$content .= "<table width='100%' border='0' cellpadding='0' cellspacing='5'>\n";
	$content .= $Html;
	$content .= "</table></body></html>";

	$Msg ="This is a multi-part message in MIME format.\n";
	$Msg.="\n--".$OB."\n";
	$Msg.="Content-Type: multipart/alternative;\n\tboundary=\"".$IB."\"\n\n";
	$Msg.="\n--".$IB."\n";
	$Msg.="Content-Type: text/html;\n\tcharset=\"iso-8859-1\"\n";
	$Msg.="Content-Transfer-Encoding: base64\n\n";
	$Msg.=chunk_split( base64_encode( $content ) )."\n\n";
	$Msg.="\n--".$IB."--\n";
	$Msg.="\n--".$OB."--\n";
		
 	return mail ( $To, $Subject, $Msg, $headers );
}

?>