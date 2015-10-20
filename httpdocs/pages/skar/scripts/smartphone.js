// constants

var SERVICE_URI = '../php/site.php';
var ITEMS_PER_PAGE = 25;
var PROPS_PER_PAGE = 25;

// global variables

var currentMenu = null;
var currentResource = null;

var crossFadeDuration = 4;
var backgrounds = null;
var backgroundSpeed = 16000;
var currentBackground = 0;
var slides = null;

var browser = null;

var regions = {
	'centrum': 'Centrum',
	'delfshaven': 'Delfshaven',
	'feijenoord': 'Feijenoord',
	'hilligersb': 'Hillegersberg- Schiebroek',
	'kralingen': 'Kralingen-Crooswijk',
	'noord': 'Noord',
	'oudewesten': 'Oude Westen',
	'overschie': 'Overschie',
	'proveniers': 'Provenierswijk',
	'schpvftkwt': 'Scheepvaart- kwartier',
	'spangen': 'Spangen'
};

function init()
{	
	browser = new Browser();
	
	// alert( 'browser: ' + browser.name + '\nversion: ' + browser.version + '\nos: ' + browser.os );		

	home();
	runSlideshow( 'page' );			
}

function home()
{
	if ( currentMenu != null && 'menu' == currentMenu.type )
	{
		$('menu-' + currentMenu.id).style.backgroundColor = '#A59AC6';
	}
	
	$('content').style.display = 'none';
	$('content-menu').innerHTML = '';
	$( 'content-image' ).style.backgroundImage = 'none';
	$('content-title').innerHTML = '';
	$('content-field').innerHTML = '';
	$('content-nav').innerHTML = '';
	
	if ( $( 'content' ).style.display == 'block' )
	{	
		$('content').style.display = 'none';
	}

	if ( $( 'content-intro' ).style.display == 'none' )
	{
		$( 'content-intro' ).style.display = 'block';
	}
		
	$('content-fieldintro').innerHTML = 
		'SKAR is de Stichting KunstAccommodatie Rotterdam. SKAR beheert <em>betaalbare en passende ' +
		'werkruimte voor professionele kunstenaars</em> in Rotterdam uit alle disciplines. SKAR bemiddelt, ' +
		'adviseert en voert projecten uit.';
	
	slideshow( 'default', 4 );
}

function slideshow( uri, count )
{	
	backgrounds = new Array();

	for ( var i=0; i < count; i++ )
	{
		backgrounds[i] = { uri: ( '../images/backgrounds/' + uri + '_0' + ( i + 1 ) + '_bg.jpg' ) };

	    if ( i == 0 ) ( new Image() ).src = backgrounds[i].uri;
	}			
}

function runSlideshow( target )
{
	if ( document.all )
	{
	    $( target ).style.filter="blendTrans(duration=crossFadeDuration)";
	
	    $( target ).filters.blendTrans.Apply();
	
	    $( target ).filters.blendTrans.Play();
	}  

	if ( document.body )
	{
	    if ( currentBackground > ( backgrounds.length - 1 ) ) currentBackground = 0;

		var bg = backgrounds[currentBackground++];
		
	    if ( currentBackground > ( backgrounds.length - 1 ) ) currentBackground = 0;

	    $( target ).style.backgroundImage = "url(" + bg.uri + ")";  
	
		if ( bg.property != null )
		{
			$('property-name').innerHTML = bg.property;

			if ( bg.description != null ) $('property-description').innerHTML = bg.description;
			
			$('fotocomment').style.visibility = 'visible';
		}
		else
		{
			$('fotocomment').style.visibility = 'hidden';			
		}

	    setTimeout( 'runSlideshow( "' + target + '" )', backgroundSpeed );
	}    
}	

function showStory( id )
{
	$('content-menu').innerHTML = '';
	findResource( renderResource, id );
}

function findResource( fun, arg )
{
	// alert( 'findResource(' + arg + ')' );
	
	if ( arg == 0 ) return;
	
	new Ajax.Request( SERVICE_URI, {
		method: 'get',
		onSuccess: fun,
		parameters: 'action=find&target=Resource&id=' + arg
	});
}

function renderMenu( resp )
{
	if ( currentMenu != null && 'menu' == currentMenu.type )
	{
		$('menu-' + currentMenu.id).style.backgroundColor = '#A59AC6';
	}
	
	result = eval( resp.getResponseHeader( 'X-JSON' ) );
	
	if ( result != null )
	{
		if ( 'Error' == result.oc )
		{
			handleError( result );
		}
		else
		{
			currentMenu = result;
			
			if ( 'menu' == currentMenu.type )
			{
				$('menu-' + currentMenu.id).style.backgroundColor = '#9c599c';
			}
			
			var html = '';
			
			if ( currentMenu.folders.length > 0 )
			{
				$( 'content-image' ).style.backgroundImage = 'none';
				
				$( 'content-image' ).style.width = '0px';	
		
				$( 'content-image' ).style.height = '0px';	
		
				$( 'content-image' ).style.margins = '20px 20px 20px 8px';		
				
				$( 'content-image' ).style.display = 'none';

				setOpacity( $('content-menu'), 75 );

				html += '<table id="content-menutable">'; 
		
				for ( i=0; i < currentMenu.folders.length; i++ )
				{
					var folder = currentMenu.folders[i];
			
					// alert( 'folder: ' + folder.cn + ' home: ' + folder.home );
					
					html += '<tr><td';
			
					if ( i > 0 ) html += ' style="border-top: 1px solid #ccc;"';						
			
					html += '><a href="#" ';
					html += 'onclick="findResource( renderResource, ' + folder.home + ' );" ';
					html += '>';
					html += folder.cn;
					html += '</a></td></tr>';
				}
		
				html += '</table>';
			}
		
			$('content-menu').innerHTML = html;
			
			findResource( renderResource, currentMenu.home );
			
			// slideshow
		
			var target = currentMenu.uri;
		
			if ( target == 'contact' || target == 'nieuws' ) target = 'default';
			
			slideshow( target, 4 );
		}
	}
	else
	{
		handleErrorText( resp.responseText );
	}
}

function handleError( error )
{
	var html = '<table>';
	
	html += '<tr><td>Error:</td><td>' + error.id + '</td></tr>';
	html += '<tr><td>Type:</td><td>' + error.type + '</td></tr>';
	html += '<tr><td>Description:</td><td>' + error.description + '</td></tr>';
	html += '<tr><td>File:</td><td>' + error.file + '</td></tr>';
	html += '<tr><td>Line:</td><td>' + error.line + '</td></tr>';
	
	handleErrorText( html );
}

function handleErrorText( text )
{
	$('content-field').innerHTML = text;
}

function renderResource( resp )
{
	$( 'content-intro' ).style.display = 'none';
	
	if ( $( 'content' ).style.display == 'none' )
	{	
		$('content').style.display = 'block';
	}
	
	var result = eval( resp.getResponseHeader( 'X-JSON' ) );
	
	if ( result != null )
	{	
		if ( 'Error' == result.oc )
		{
			handleError( result );
		}
		else if ( 'Property' == result.oc )
		{
			$('content-title').innerHTML = result.cn;

			showProperty( result );
		}
		else
		{
			currentResource = result;
		
			$('content-title').innerHTML = currentResource.cn;
		
			showPage( 1 );		
		}
	}
	else
	{
		handleErrorText( resp.responseText );
	}
}

function setOpacity( element, opacity )
{
	if ( browser.name == 'Explorer' )
	{
		element.style.filter = 'alpha(opacity=' + opacity + ')';
	}
	else
	{
		element.style.opacity = new String( opacity / 100 );
	}
}

function showProperty( property )
{
	var image = new Image();
	
	if ( property.thumbnails != null && property.thumbnails.length > 0 )
	{

	}
	else
	{
		alert( 'Fout: geen thumbnails gevonden voor Property met id ' + property.id + ' en uri '+ property.uri );
	}
	
	if ( property.backgrounds != null )
	{

		slides = new Array();

		
		
		if ( property.backgrounds.length == 1){
		Shadowbox.open([ { player:'img', content: property.backgrounds[0].uri}]);
		}
		if ( property.backgrounds.length == 2){
		Shadowbox.open([ { player:'img', content: property.backgrounds[0].uri , title: property.backgrounds[0].property , gallery:'gallery name' },{ player:'img', content: property.backgrounds[1].uri , title: property.backgrounds[1].property }]);
		}
		if ( property.backgrounds.length == 3){
		Shadowbox.open([ { player:'img', content: property.backgrounds[0].uri , title: property.backgrounds[0].property , gallery:'gallery name' },{ player:'img', content: property.backgrounds[1].uri , title: property.backgrounds[1].property , gallery:'gallery name' },{ player:'img', content: property.backgrounds[2].uri , title: property.backgrounds[2].property }]);
		}
		if ( property.backgrounds.length == 4){
		Shadowbox.open([ { player:'img', content: property.backgrounds[0].uri , title: property.backgrounds[0].property , gallery:'gallery name' },{ player:'img', content: property.backgrounds[1].uri , title: property.backgrounds[1].property , gallery:'gallery name' },{ player:'img', content: property.backgrounds[2].uri , title: property.backgrounds[2].property , gallery:'gallery name' }, { player:'img', content: property.backgrounds[3].uri , title: property.backgrounds[3].property , gallery:'gallery name' }]);
		}
	}
}

function showPage( number )
{

	hideAddressBar();
	
	$( 'content-image' ).style.backgroundImage = 'none';
				
	$( 'content-image' ).style.width = '0px';	
		
	$( 'content-image' ).style.height = '0px';	
		
	$( 'content-image' ).style.margin = '0px';	
				
	$( 'content-image' ).style.display = 'none';
				
	var total = 0;
	
	// alert( 'showPage() - oc: ' + currentResource.oc + ', id: ' + currentResource.id + ', number: ' + number );

	var content = '';
	
	if ( 'Story' == currentResource.oc )
	{
		total = currentResource.pages.length;
		
		content = '';
		
		if ( currentResource.pages[number-1] != null )
		{
			// content = currentResource.pages[number-1];
		}
		for ( pg=0; pg < currentResource.pages.length; pg++ )
			{
			content += currentResource.pages[pg];
		}
		
		if ( number == total && currentResource.links.length > 0 )
		{
			content += '<p/>';
			
			for ( i=0; i < currentResource.links.length; i++ )
			{
				var type = currentResource.links[i].type;
				
				if ( 'journal' == type || 'pdf' == type )
				{
					content += '<a href="../files/';
					content += currentResource.links[i].uri;
					content += '" target="_blank"';
					content += '">';
					content += currentResource.links[i].cn;
					content += '</a>';
				}
				else
				{
					content += '<a href="#" ';
					content += 'onclick="findResource( renderResource, ';
					content += currentResource.links[i].id;
					content += ' );">';
					content += currentResource.links[i].cn;
					content += '</a>';							
				}
				
				content += '<br/>';
			}
		}
		
		if ( content == '' ) content = 'Tekst niet gevonden.';
		
		$('content-field').innerHTML = content;
	}
	else if ( 'Folder' )
	{
		if ( currentResource.items.length > 0 )
		{
			var oc = currentResource.items[0].oc;
		
			var max = 1;
		
			if ( 'Link' == oc || 'Story' == oc || 'Journal' == oc )
			{
				max = ITEMS_PER_PAGE;
			}
			else if ( 'Property' == oc ) 
			{
				max = PROPS_PER_PAGE;
			}
		
			total = Math.floor( currentResource.items.length / max );

			if ( currentResource.items.length % max > 0 ) total += 1;
		
			for ( i=0, index = ( number - 1 ) * max; 
				  i < max && index < currentResource.items.length; 
				  i++, index++ )
			{
				var item = currentResource.items[index];
				
				if ( 'Property' == item.oc )
					{
				}
							
				content += '<div>';
			
				content += '<a';
			
				if ( 'Link' == item.oc )
				{
					content += ' href="';
				
					if ( 'journal' == item.type )
					{
						content += '../files/';
					}
				
					content += item.uri;
					content += '" ';
					content += ' target="_blank"';
				}
				
				else if ( 'Property' == item.oc || 'Story' == item.oc )
				{
					
					content += ' href="#"';
					content += ' onclick="findResource( renderResource, ';
					content += item.id;
					content += ' );"';
				}
			
				content += '>';
			
				content += item.cn;
			
				content += ' </a>';
				
				
				
				if ( 'Property' == item.oc )
				{
					$( 'content-image' ).style.height = '189px';		
					$( 'content-image' ).style.width = '150px';	
					$( 'content-image' ).style.margin = '20px 20px 20px 8px';	
					$( 'content-image' ).style.visibility = 'visible';
				
					content += '<span style="color: #A59AC6; display: inline;white-space:pre;">';
					content += regions[item.type];
					content += ' </span><br/>';
				}
				content += '</div>';
				
			
				if ( item.description != null )
				{
					if ( 'Story' == item.oc )
					{
						var date = new LocalizedDate( item.pubdate );

						content += ( date.day + ' ' + date.localizedMonth( 'nl' ) + ' - ' );
					}

					content += item.description;
				}
			
				content += '<p/>';
			}					

			$('content-field').innerHTML = content;
		}
		else
		{
			handleErrorText( 'Nothing found in Folder' );			
		}
	}
	else
	{
		handleErrorText( 'Object class ' + currentResource.oc + ' is not supported.' );

		return;
	}
	
	content = '';
	
	if ( total > 0 )
	{
		if ( number > 1 )
		{
			content += '<a href="#" onclick="showPage( ' + ( number - 1 ) + ' )">&laquo; Back</a>';
		}
	
		for ( var i=1; i <= total; i++ )
		{
			if ( i == number )
			{
				content += '&nbsp;[' + i + ']'
			}
			else
			{
				content += '&nbsp;<a href="#" onclick="showPage( ' + i + ' )">' + i + '</a>';
			}
		}
	
		if ( number < total )
		{
			content += "&nbsp;";
			content += '<a href="#" onclick="showPage( ' + ( number + 1 ) + ' )">Next &raquo;</a>';
		}
	}
	
	//$('content-nav').innerHTML = content;
}
