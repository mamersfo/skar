
function listLocations()
{
	return [
		{ id: 'centrum', cn: 'Centrum' },
		{ id: 'delfshaven', cn: 'Delfshaven' },
		{ id: 'feijenoord', cn: 'Feijenoord' },
		{ id: 'hillegersb', cn: 'Hillegersberg-Schiebroek' },
		{ id: 'kralingen', cn: 'Kralingen-Crooswijk' },
		{ id: 'noord', cn: 'Noord' },
		{ id: 'oudewesten', cn: 'Oude Westen' },
		{ id: 'overschie', cn: 'Overschie' },
		{ id: 'proveniers', cn: 'Provenierswijk' },
		{ id: 'schpvftkwt', cn: 'Scheepvaartkwartier' },
		{ id: 'spangen', cn: 'Spangen' }
	];
}

function listLinkTypes()
{
	return [
		{ id: 'default', cn: 'Link' },
		{ id: 'journal', cn: 'Journaal' },
		{ id: 'pdf', cn: 'PDF' }
	];
}

function listFolderTypes()
{
	return [
		{ id: 'alert', cn: 'Alert' },
		{ id: 'default', cn: 'Default' },
		{ id: 'function', cn: 'Function' },
		{ id: 'journal', cn: 'Journaals' },
		{ id: 'link', cn: 'Links' },
		{ id: 'menu', cn: 'Menu' },
		{ id: 'news', cn: 'Nieuws' },
		{ id: 'property', cn: 'Gebouwen' },
		{ id: 'story', cn: 'Artikelen' }
	];
}

function listStoryTypes()
{
	return [
		{ id: 'news', cn: 'Nieuws' },
		{ id: 'default', cn: 'Default' }
	];
}

function init()
{
	// Hidden Properties

	var propId = { name: 'id', element: 'input', type: 'hidden' };
	var propParent = { name: 'parent', element: 'input', type: 'hidden' };
	var propPath = { name: 'path', title: 'Pad', element: 'input', type: 'hidden' };

	// Text Properties
	
	var propDn = { name: 'dn', title: 'Naam', element: 'input', type: 'text', pattern: '[a-z_A-Z_0-9]{1,50}' };
	var propCn = { name: 'cn', title: 'Titel', element: 'input', type: 'text' };
	var propOc = { name: 'oc', title: 'Type', element: 'input', type: 'text', edit: 'disabled' };
	var propPubdate = { name: 'pubdate', title: 'Publicatie', element: 'input', type: 'text', pattern: '^(.{0})|([0-9]{4}-[0-9]{2}-[0-9]{2})$' };
	var propModified = { name: 'modified', title: 'Gewijzigd', element: 'input', type: 'text', edit: 'disabled' };
	var propUri = { name: 'uri', title: 'URI', element: 'input', type: 'text' };
	var propIndex = { name: 'cindex', title: 'Index', element: 'input', type: 'text', pattern: '[0-9]+' };
	var propIndex = { name: 'index', title: 'Index', element: 'input', type: 'text' };
	var propCIndex = { name: 'cindex', title: 'Index', element: 'input', type: 'text' };

	// Other Properties 
	
	var propDesc = { name: 'description', title: 'Omschrijving', element: 'textarea' };
	var propPages = { name: 'pages', title: 'Tekst', element: 'pages' };
	var propPass = { name: 'pass', title: 'Wachtwoord', element: 'input', type: 'password' };
	var propFile = { name: 'file', title: 'Bestand', element: 'file' };

	// List Properties
	
	var propLinkType = { 
		name: 'type', 
		title: 'Type', 
		element: 'list', 
		items: 'listLinkTypes()', 
		size: 1 
	};
	
	var propFolderType = {
		name: 'type',
		title: 'Type',
		element: 'list',
		items: 'listFolderTypes()',
		size: 1
	};
	
	var propStoryType = {
		name: 'type',
		title: 'Type',
		element: 'list',
		items: 'listStoryTypes()',
		size: 1
	};

	var propHome = { 
		name: 'home', 
		title: 'Home', 
		element: 'list', 
		items: 'this.userObject.items', 
		size: 1 
	};

	var propLocation = { 
		name: 'type', 
		title: 'Locatie', 
		element: 'list', 
		items: 'listLocations()', 
		size: 1 
	};

	var propLinks = { 
		name: 'links', 
		target: 'Link', 
		title: 'Links', 
		element: 'list', 
		size: 3, 
		onInsert: 'insertLink', 
		actions: [
			new Action( this.id, 'insertItem', 'Nieuw' ),
			new Action( this.id, 'deleteItem', 'Verwijder' )
		] 		
	};

	var propBackgrounds = { 
		name: 'backgrounds', 
		target: 'Backgrounds', 
		title: 'Achtergronden', 
		element: 'list', 
		size: 5, 
		actions: [
			/* new Action( null, 'loadItem', 'Nieuw' ), */
			new Action( null, 'openItem', 'Open' )
		] 
	};
	
	// Login Editor
	var loginEditor = new ResourceEditor( 'login' );
	loginEditor.addProperty( propDn );
	loginEditor.addProperty( propPass );
	loginEditor.addAction( { img: 'login', action: 'login' } );
	controller.addWidget( loginEditor );
	
	// Story Editor
	var storyEditor = new ResourceEditor( 'Story' );
	storyEditor.css = 'item';
	storyEditor.addProperty( propId );
	storyEditor.addProperty( propParent );
	// storyEditor.addProperty( propModified );
	storyEditor.addProperty( propStoryType );
	storyEditor.addProperty( propCn );
	storyEditor.addProperty( propPubdate );
	storyEditor.addProperty( propDesc );
	storyEditor.addProperty( propPages );
	storyEditor.addProperty( propLinks );
	storyEditor.addAction( { img: 'update', action: 'updateItem' } );
	storyEditor.addAction( { img: 'delete', action: 'deleteItem' } );
	storyEditor.addAction( { img: 'cancel', action: 'cancelItem' } );
	controller.addWidget( storyEditor );

	// Link Editor
	var linkEditor = new ResourceEditor( 'Link' );
	linkEditor.css = 'item';
	linkEditor.addProperty( propId );
	linkEditor.addProperty( propParent );
	linkEditor.addProperty( propModified );
	linkEditor.addProperty( propPubdate );
	linkEditor.addProperty( propLinkType );
	linkEditor.addProperty( propUri );
	linkEditor.addProperty( propCn );
	linkEditor.addProperty( propDesc );
	linkEditor.addAction( { img: 'update', action: 'updateLink' } );
	linkEditor.addAction( { img: 'delete', action: 'deleteItem' } );
	linkEditor.addAction( { img: 'cancel', action: 'cancelItem' } );
	controller.addWidget( linkEditor );
	
	// Property Editor
	var propEditor = new ResourceEditor( 'Property' );
	propEditor.css = 'item';
	propEditor.addProperty( propId );
	propEditor.addProperty( propParent );
	propEditor.addProperty( propModified );
	propEditor.addProperty( propCn );
	propEditor.addProperty( propUri );
	propEditor.addProperty( propLocation );
	propEditor.addProperty( propDesc );
	propEditor.addProperty( propBackgrounds );
	propEditor.addAction( { img: 'update', action: 'updateProperty' } );
	propEditor.addAction( { img: 'delete', action: 'deleteItem' } );
	propEditor.addAction( { img: 'cancel', action: 'cancelItem' } );
	controller.addWidget( propEditor );
	
	// Links Editor
	var editor = new ResourceEditor( 'Links' );
	editor.addProperty( { name: 'items', title: '', element: 'list', size: 5 } );
	editor.addAction( { img: 'select', action: 'selectLink' } );
	editor.addAction( { img: 'cancel', action: 'clearDialog' } );
	controller.addWidget( editor );
	
	// Image Editor
	var imageEditor = new ResourceEditor( 'Background' );
	imageEditor.addProperty( propCn );
	imageEditor.addProperty( propIndex );
	imageEditor.addAction( { img: 'cancel', action: 'clearDialog' } );
	controller.addWidget( imageEditor );
		 
	// Channel
	var channel = new Channel( 'channel' );
	channel.addAction( { img: 'property', action: 'addProperty' } );
	channel.addAction( { img: 'story', action: 'addStory' } );
	channel.addAction( { img: 'link', action: 'addLink' } );
	controller.addWidget( channel );

	// Inspector
	var inspector = new ResourceEditor( 'inspector' );
	inspector.addProperty( propId );
	inspector.addProperty( propParent );
	inspector.addProperty( propModified );
	inspector.addProperty( propFolderType );
	inspector.addProperty( propCn );
	inspector.addProperty( propUri );
	inspector.addProperty( propCIndex );
	inspector.addProperty( propHome );
	inspector.addProperty( propDesc );
	inspector.addAction( { img: 'update', action: 'updateInspector', title: 'Bewaren' } );
	controller.addWidget( inspector );	
	
	// Tree Container 
	
	var container = new Container( 'treeContainer' );
	container.setDecorator( new Decorator( 'Site Map' ) );
	controller.addWidget( container );
	
	// Tree
	var userObject = { id: 'tree', nt: 'branch', oc: 'root', cn: 'SKAR' };
	var tree = new Tree( new Node( userObject ) );
	tree.controller = container;
	controller.addWidget( tree );

	// Inspector Container
	container = new Container( 'inspectorContainer' );
	container.setDecorator( new Decorator( 'Eigenschappen' ) );
	controller.addWidget( container );	

	// Content Container
	container = new Container( 'contentContainer' );
	container.setDecorator( new Decorator( 'Inhoud' ) );
	controller.addWidget( container );	
	
	// Start
	
	controller.handleDialog( 'login' );
	
	// doAutoLogin();
}

function insertLink( id )
{
	var options = 
	{
		onSuccess: function ( resp ) 
		{
			var result = eval ( resp.getResponseHeader( 'X-JSON' ) );
			
			if ( result != null )
			{
				if ( 'Error' == result.oc )
				{
					controller.handleError( 'Main.insertLink()', result );
				}
				else
				{
					var list = controller.getWidget( 'Links' );
					list.userObject = { items: result };
					list.runModal();					
				}
			}
			else if ( resp.responseText != null )
			{
				controller.handleErrorText( 'Main.insertLink()', resp.responseText );
			}
		},
		parameters: ( 'action=list&target=Links' )
	};
	
	new Ajax.Request( SERVICE_URI, options );	
}

function insertImage( id )
{
	var options = 
	{
		onSuccess: function ( resp )
		{
			var result = eval ( resp.getResponseHeader( 'X-JSON' ) );
			
			if ( result != null )
			{
				if ( 'Error' == result.oc )
				{
					controller.handleError( 'Main.insertImage', result );
				}
				else
				{
					var list = controller.getWidget( 'Image' );
				
					list.userObject = { items: result };
				
					list.runModal();				
				}
			}
			else if ( resp.responseText != null )
			{
				controller.handleErrorText( 'Main.insertImage()', resp.responseText );
			}
		},
		parameters: ( 'action=list&target=Images' )
	};
	
	new Ajax.Request( SERVICE_URI, options );
}

function selectLink( id )
{
	var editor = controller.getWidget( 'LinksList1' );
	
	if ( editor != null )
	{
		var value = editor.getSelectedItem();
	
		if ( value != null )
		{
			editor = controller.getWidget( 'StoryList2' );
		
			editor.items.push( value );
		
			editor.render();
		}
	}
	else
	{
		alert( 'Could not find widget: LinksList1' );
	}
	
	clearDialog();	
}

function clearDialog()
{
	$('dialog').style.visibility = 'hidden';	
}

function loginAs( user )
{
	$('dialog').style.visibility = 'hidden';

	controller.user = user;
	controller.handleInfo( 'Ingelogd als ' + user.cn );
	
	controller.getWidget( 'treeContainer' ).render();
	controller.getWidget( 'inspectorContainer' ).render();
	controller.getWidget( 'contentContainer' ).render();
	
	$('top').style.visibility = 'visible';
	
	var tree = controller.getWidget( 'tree' );
	tree.container = controller.getWidget( 'treeContainer' );
	tree.current = tree.root;
	tree.load();		
}

function doAutoLogin()
{
	try
	{
		var postBody = 'action=login&dn=martin&pass=bbl117c';
		
		var options = 
		{
			onSuccess: function ( resp ) 
			{
				var result = eval( resp.getResponseHeader( 'X-JSON' ) );
				
				if ( result != null )
				{	
					if ( 'Error' == result.oc )
					{
						controller.handleError( 'Main.doAutoLogin()', result );
					}
					else
					{
						loginAs( result );
					}
				}
				else if ( resp.responseText != null )
				{
					controller.handleErrorText( 'Main.doAutoLogin()', resp.responseText );
				}
			},
			postBody: postBody
		};
		
		new Ajax.Request( SERVICE_URI, options );	
	}
	catch ( error )
	{
		controller.handleErrorText( 'Main.doAutoLogin()', error.message );						
	}			
}

function login( id )
{
	try
	{
		var postBody = 'action=login&' + Form.serialize( id );
		
		Form.reset( id );
		
		var options = 
		{
			onSuccess: function ( resp ) 
			{
				var result = eval( resp.getResponseHeader( 'X-JSON' ) );
				
				if ( result != null )
				{	
					if ( 'Error' == result.oc )
					{
						controller.handleError( 'Main.login()', result );
					}
					else
					{
						loginAs( result );
					}
				}
				else if ( resp.responseText != null )
				{
					controller.handleErrorText( 'Main.login()', resp.responseText );
				}
			},
			postBody: postBody
		};
		
		new Ajax.Request( SERVICE_URI, options );	
	}
	catch ( error )
	{
		controller.handleErrorText( 'Main.login()', error.message );						
	}		
}	

function logout()
{
	try
	{
		var options = 
		{
			onSuccess: function ( resp ) 
			{
				var result = eval( resp.getResponseHeader( 'X-JSON' ) );
				
				if ( result != null )
				{	
					if ( 'Error' == result.oc )
					{
						controller.handleError( 'Main.logout()', result );
					}
					else
					{
						$('top').style.visibility = 'hidden';

						controller.user = null;

						controller.handleDialog( 'login' );
					}
				}
				else if ( resp.responseText != null )
				{
					controller.handleErrorText( 'Main.logout()', resp.responseText );
				}
			},
			parameters: 'action=logout'
		};
		
		new Ajax.Request( SERVICE_URI, options );	
	}
	catch ( error )
	{
		controller.handleErrorText( 'Main.logout()', error.message );						
	}	
}

function upload( id )
{
	try
	{
		$('upload').style.visibility = 'visible';
	
		$('upload').src="upload.php";
	}
	catch ( error )
	{
		controller.handleErrorText( 'Main.upload()', error.message );						
	}
}

function handleUpload( upload )
{
	$('upload').style.visibility = 'hidden';
	
	if ( upload != null )
	{
		if ( upload.result == 'ERROR' )
		{
			controller.handleErrorText( 'Main.handleUpload()', upload.error );
		}
		else
		{
			var channel = controller.getWidget( 'channel' );
			
			var postBody = '';
		
			postBody += 'action=insert';
			postBody += '&target=Link';
			postBody += '&id=-1';
			postBody += '&parent=' + channel.resource.id;
			postBody += '&user=' + controller.user.id;
			postBody += '&author=' + controller.user.cn;
			postBody += '&uri=' + upload.uri;
			
			alert( postBody );
			
			addItem( postBody );	
		}
	}
}

function addItem( postBody )
{
	try
	{
		var options = 
		{
			onSuccess: function ( resp ) 
			{
				var result = eval ( resp.getResponseHeader( 'X-JSON' ) );
				
				if ( result != null )
				{
					var editor = controller.getWidget( result.oc );
					
					if ( editor == null )
					{
						throw new Error( -1, 
							'Main.addItem() - could not find Widget for oc: ' + result.oc + '.' );
					}
					
					editor.container = controller.getWidget( 'contentContainer' );
					
					editor.load( result );
				}
				else if ( resp.responseText != null )
				{
					controller.handleErrorText( 'Main.addItem()', resp.responseText );
				}
			},
			postBody: postBody
		};
		
		new Ajax.Request( SERVICE_URI, options );	
	}
	catch( error )
	{
		controller.handleErrorText( 'Main.addItem()', error.message );
	}	
}

function addStory ( id )
{
	var channel = controller.getWidget( id );
	
	var postBody = '';
	
	postBody += 'action=insert';
	postBody += '&target=Story';
	postBody += '&id=-1';
	postBody += '&parent=' + channel.resource.id;
	postBody += '&user=' + controller.user.id;
	postBody += '&author=' + controller.user.cn;
	
	addItem( postBody );
}

function addProperty( id )
{
	var channel = controller.getWidget( id );
	
	var postBody = '';
	
	postBody += 'action=insert';
	postBody += '&target=Property';
	postBody += '&id=-1';
	postBody += '&parent=' + channel.resource.id;
	postBody += '&user=' + controller.user.id;
	postBody += '&author=' + controller.user.cn;
	
	addItem( postBody );	
}

function addLink ( id )
{
	var channel = controller.getWidget( id );
	
	var postBody = '';
	
	postBody += 'action=insert';
	postBody += '&target=Link';
	postBody += '&id=-1';
	postBody += '&parent=' + channel.resource.id;
	postBody += '&user=' + controller.user.id;
	postBody += '&author=' + controller.user.cn;
	
	addItem( postBody );
}

function updateImage( id )
{
	
}

function updateItem( id )
{
	try
	{
		var editor = controller.getWidget( id );
		
		editor.validate();
		
		var postBody = 'action=update&target=Story';
		
		var str = Form.serialize( id );
		
		if ( str != null && str.length > 0 ) postBody += '&' + str;
		
		var pageEditor = controller.getWidget( id + 'Pages' );
		
		if ( pageEditor != null )
		{
			str = pageEditor.getParams();
			
			if ( str != null && str.length > 0 )
			{
				postBody += '&' + str;
			}
		}
		
		var i = 1;
		
		var list = controller.getWidget( id + 'List' + i );
		
		while ( list != null )
		{
			try
			{
				str = list.getParams();
			
				if ( str != null && str.length > 0 )
				{
					postBody += '&' + str;
				}
			}
			catch ( e )
			{
				alert( 'Exception: ' + e.name + ': ' + e.description );
				
				return;
			}
			
			i++;

			list = controller.getWidget( id + 'List' + i );
		}
		
		var options = 
		{
			onSuccess: function ( resp ) 
			{
				var result = eval( resp.getResponseHeader( 'X-JSON' ) );
				
				if ( result != null )
				{					
					// controller.handleInfo( 'Artikel \'' + $(id).elements['cn'].value + '\' bewaard' );
					
					controller.handleInfo( 'Artikel \'' + editor.userObject.cn + '\' bewaard' );

					loadChannel( editor.userObject.parent );
				}
				else if ( resp.responseText != null )
				{
					controller.handleErrorText( 
						'Main.updateItem()', resp.responseText );						
				}
			},
			postBody: postBody
		};
		
		new Ajax.Request( SERVICE_URI, options );	
	}
	catch ( error )
	{
		controller.handleErrorText( 'Main.updateItem()', error.message );						
	}
}

function updateLink( id )
{
	try
	{
		var editor = controller.getWidget( id );
		
		var postBody = 'action=update&target=Link';
		
		var str = Form.serialize( id );
		
		if ( str != null && str.length > 0 ) postBody += '&' + str;
			
		var options = 
		{
			onSuccess: function ( resp ) 
			{
				var result = eval( resp.getResponseHeader( 'X-JSON' ) );
				
				if ( result != null )
				{					
					loadChannel( editor.userObject.parent );
					controller.handleInfo( 
						'Link \'' + editor.userObject.cn + '\' bewaard' );
				}
				else if ( resp.responseText != null )
				{
					controller.handleErrorText( 
						'Main.updateLink()', resp.responseText );						
				}
			},
			postBody: postBody
		};
		
		new Ajax.Request( SERVICE_URI, options );	
	}
	catch ( error )
	{
		controller.handleErrorText( 'Main.updateLink()', error.message );						
	}
}

function cancelItem( id )
{
	var editor = controller.getWidget( id );
	
	loadChannel( editor.userObject.parent );
}

function deleteItem( id )
{
	var title = $(id).elements['cn'].value;

	if ( confirm ( 'Artikel \'' + title + '\' verwijderen?' ) == false )
	{
		return;
	}

	try
	{
		var editor = controller.getWidget( id );
		
		var postBody = 'action=delete&target=Item';
		
		var str = Form.serialize( id );
		
		if ( str != null && str.length > 0 ) postBody += '&' + str;
			
		var options = 
		{
			onSuccess: function ( resp ) 
			{
				var result = eval( resp.getResponseHeader( 'X-JSON' ) );
				
				if ( result != null )
				{					
					loadChannel( editor.userObject.parent );
					
					controller.handleInfo( 
						'Artikel \'' + title + '\' verwijderd' );
				}
				else if ( resp.responseText != null )
				{
					controller.handleErrorText( 
						'Main.deleteItem()', resp.responseText );						
				}
			},
			postBody: postBody
		};
		
		new Ajax.Request( SERVICE_URI, options );	
	}
	catch ( error )
	{
		controller.handleErrorText( 'Main.deleteItem()', error.message );						
	}	
}

function loadChannel( id )
{
	/*
	var widget = controller.getWidget( 'channel' );
	
	widget.container = controller.getWidget( 'contentContainer' );
	
	widget.load( id );
	*/
	
	controller.load( id );
}

function updateInspector( id )
{
	try
	{
		var editor = controller.getWidget( id );
		
		editor.validate();
		
		var postBody = 'action=update&target=Resource';
		
		var str = Form.serialize( id );
		
		if ( str != null && str.length > 0 ) postBody += '&' + str;
			
		var options = 
		{
			onSuccess: function ( resp ) 
			{
				var result = eval( resp.getResponseHeader( 'X-JSON' ) );
				
				if ( result != null )
				{					
					controller.handleInfo( 
						'Folder \'' + $(id).elements['cn'].value + '\' bewaard' );
				}
				else if ( resp.responseText != null )
				{
					controller.handleErrorText( 
						'Main.updateInspector()', resp.responseText );						
				}
			},
			postBody: postBody
		};
		
		new Ajax.Request( SERVICE_URI, options );	
	}
	catch ( error )
	{
		controller.handleErrorText( 'Main.updateInspector()', error.message );						
	}
}

function updateProperty( id )
{
	try
	{
		var editor = controller.getWidget( id );
		
		editor.validate();
		
		var postBody = 'action=update&target=Property';
		
		var str = Form.serialize( id );
		
		if ( str != null && str.length > 0 ) postBody += '&' + str;
		
		postBody += ( '&type=' + $('PropertyList1').value );
				
		var options = 
		{
			onSuccess: function ( resp ) 
			{
				var result = eval( resp.getResponseHeader( 'X-JSON' ) );
				
				if ( result != null )
				{					
					loadChannel( editor.userObject.parent );
					
					controller.handleInfo( 
						'Pand \'' + $(id).elements['cn'].value + '\' bewaard' );
				}
				else if ( resp.responseText != null )
				{
					controller.handleErrorText( 
						'Main.updateProperty()', resp.responseText );						
				}
			},
			postBody: postBody
		};
		
		new Ajax.Request( SERVICE_URI, options );	
	}
	catch ( error )
	{
		controller.handleErrorText( 'Main.updateProperty()', error.message );						
	}
}
