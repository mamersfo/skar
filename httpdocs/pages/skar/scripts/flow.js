
var currentForm = null;

var checkInfo = {
	name: {
		name: 'naam',
		pattern: /^\S[\S|\s]*$/,
		description: 'Veld mag niet leeg zijn.'
	},
	discipline: {
		name: 'discipline',
		pattern: /^\S[\S|\s]*$/,
		description: 'Veld mag niet leeg zijn.'
	},
	address: {
		name: 'adres',
		pattern: /^\S[\S|\s]*$/,
		description: 'Veld mag niet leeg zijn.'
	},
	postalCode: {
		name: 'postcode',
		pattern: /^[1-9]{1}[0-9]{3}\s?[A-Z]{2}$/,
		description: 'Vul vier cijfers en twee letters in, bijvoorbeeld: \'3000 BZ\'.'
	},
	city: {
		name: 'plaats',
		pattern: /^\S[\S|\s]*$/,
		description: 'Veld mag niet leeg zijn.'
	},
	phone: {
		name: 'telefoon',
		pattern: /^0[0-9]{9}$/,
		description: 'Vul een 10-cijferig telefoonnummer in zonder leestekens, bijvoorbeeld: \'0104127828\'.'
	},
	email: {
		name: 'email',
		pattern: /^\w*@\w*\.\w{2,4}$/,
		description: 'Vul een geldig email adres in, bijvoorbeeld: \'info@skar-ateliers.nl\'.'
	}
};

function checkForm( f )
{
   	for ( var i=0; i < f.length; i++ )
   	{
		var name = f[i].name;
		var type = f[i].type;
		var value = f[i].value;
		
		if ( name != null && type == 'text' )
		{
			var info = checkInfo[name];
			
			if ( ( value.match( info.pattern ) ) == null )
			{
				alert( 'Waarde voor \'' + info.name + '\' is onjuist. ' + info.description );

				return false;
			} 
		}
   	}		

	return true;
}

function checkForm( f )
{
	return true;
}

function closeFlow()
{
	$('flow').style.visibility = 'hidden';

	$('content').style.visibility = 'visible';	
}

function findForm( action )
{
	var check = $('flow-conditions-check' );
	
	if ( check != null && check.checked == false )
	{
		alert( 'Voor aanmelding dient u kennis te nemen van de voorwaarden.' );
		
		return;
	}
	
	if ( currentForm != null && currentForm.id == 'submit' )
	{
		if ( checkForm( $('flow-form') ) == false )
		{
			return;
		}
	}
	
	if ( action == null ) action = 'next';
	
	var postBody = 'action=' + action;

	var str = Form.serialize( 'flow-form' );

	if ( str != null && str.length > 0 ) postBody += ( '&' + str );
	
	// alert( 'postBody: ' + postBody );
	
	new Ajax.Request( '../php/register.php?' + postBody, {
		method: 'get',
		onSuccess: renderFlow,
		onFailure: renderFailure
	});
}

function openFlow()
{
	$('content').style.visibility = 'hidden';
	$('flow').style.visibility = 'visible';	
	initFlow();
}

function initFlow()
{	
	$('flow-bar').innerHTML = ( '&nbsp;Aanmelden' );
	
	$('flow-previous').disabled = true;
	$('flow-next').disabled = false;
	
	findForm( 'first' );

	// renderFlow();
}

function renderFailure( resp )
{
	// hideAddressBar();
	
	var html = '<div id="flow-content-left"><div id="flow-content-title"></div>' +
		'<div id="flow-content-text"></div></div><div id="flow-content-right"></div>'

	$('flow-content').innerHTML = html;

	if ( resp.responseText != null && resp.responseText.length > 0 )
	{
		$('flow-content-title').innerHTML = 'Error';	

		$('flow-content-text').innerHTML = resp.responseText;
		
		$('flow-content-right').innerHTML = '';		
	}	
}

function renderFlow( resp )
{
	// hideAddressBar();
	
	var html = '<div id="flow-content-left"><div id="flow-content-title"></div>' +
		'<span id="flow-content-text"></span></div><div id="flow-content-right"></div>'

	$('flow-content').innerHTML = html;

	if ( resp.responseText != null && resp.responseText.length > 0 )
	{
		$('flow-content-title').innerHTML = 'Error';	

		$('flow-content-text').innerHTML = resp.responseText;
		
		$('flow-content-right').innerHTML = '';		
	}
	else
	{		
		var result = eval( resp.getResponseHeader( 'X-JSON' ) );
	
		currentForm = result.form;
		
		// alert( 'currentForm: ' + currentForm.id );
		
		var choice = null;
		
		if ( result.registration != null )
		{
			choice = result.registration[currentForm.id];
		}
			
		$('flow-form-id').value = currentForm.id;
		
		if ( currentForm.options != null )
		{
			if ( currentForm.options.length == 0 )
			{
				$('flow-content-title').innerHTML = currentForm.title;	

				$('flow-content-text').innerHTML = currentForm.text;			
			}
			else if ( currentForm.options.length == 1 )
			{
				var html = '';
				
				html += '<div id="flow-conditions">';
				
				html += currentForm.text;
				
				html += '</div>';

				html += '<input id="flow-conditions-check" type="checkbox" name="option">';

				html += currentForm.options[0].text;
				
				html += '</input>';
				
				// alert( 'flow-content: ' + html );

				$('flow-content').innerHTML = html;							
			}
			else
			{
				$('flow-content-title').innerHTML = currentForm.title;	

				$('flow-content-text').innerHTML = currentForm.text;			

				var html = '<ul>';
		
				for ( var i=0; i < currentForm.options.length; i++ )
				{
					html += '<li><input type="radio" name="option" ';
				
					html += 'value="' + currentForm.options[i].id + '"';
				
					if ( choice != null )
					{
						if ( choice == currentForm.options[i].id ) html += ' checked';
					}
					else
					{
						if ( i == 0 ) html += ' checked';
					}
				
					html += '>&nbsp;';
					html += currentForm.options[i].text;
				
					if ( currentForm.options[i].info != null )
					{
						html += '&nbsp;&nbsp;<a href="#" title="' + currentForm.options[i].info + '">';
						html += '<img src="../images/skar_flow_info.gif" border="0"/>';
						html += '</a>';
					}
				
					html += '</input>';
					html += '</li>';
				}
			
				html += '</ul>';
				
				// alert( 'flow-content-right: ' + html );
				
				$( 'flow-content-right' ).innerHTML = html;
			}
		}
		
		if ( 'category' == currentForm.id )
		{
			$('flow-previous').disabled = true;
		}
		else
		{
			if ( 'submit' == currentForm.id )
			{
				$('flow-content-title').innerHTML = currentForm.title;	

				$('flow-content-text').innerHTML = currentForm.text;			

				var html = '<table>';

				html += '<tr><td>Naam:</td><td><input class="naw" type="text" name="name"/></td></tr>';
				html += '<tr><td>Kunstdiscipline:</td><td><input class="naw" type="text" name="discipline"/></td></tr>';
				html += '<tr><td>Adres:</td><td><input class="naw" type="text" name="address"/></td></tr>';
				html += '<tr><td>Postcode:</td><td><input class="naw" type="text" name="postalCode"/></td></tr>';
				html += '<tr><td>Plaats:</td><td><input class="naw" type="text" name="city"/></td></tr>';
				html += '<tr><td>Telefoon:</td><td><input class="naw" type="text" name="phone"/></td></tr>';
				html += '<tr><td>Email:</td><td><input class="naw" type="text" name="email"/></td></tr>';

				html += '</table>';

				$( 'flow-content-right' ).innerHTML = html;				
			}
			
			$('flow-previous').disabled = false;

			if ( 'exit' == currentForm.id )
			{
				$('flow-next').disabled = true;
				
				$( 'flow-content-right' ).innerHTML = '';		
			}
			else
			{
				$('flow-next').disabled = false;
			}
		}
	}
}
