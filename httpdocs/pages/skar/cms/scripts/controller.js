
Controller = Class.create();

Controller.prototype = 
{	
	initialize: function()
	{		
		this.widgets = new Map();	
		this.action = null;			
		this.user = null;
		this.pass = null;
		
		// Register global responders that will occur on all AJAX requests
		
		Ajax.Responders.register ( 
		{
			onCreate: function(request) 
			{
				request['timeoutId'] = window.setTimeout 
				( 
					function() 
					{
						// If we have hit the timeout and the AJAX request is 
						// active, abort it and let the user know
					
						if ( isCallInProgress( request.transport ) )
						{
							request.transport.abort();
							
							controller.handleErrorText( 'Ajax.Responders.onCreate()', 'Network timeout' );
			
							// Run the onFailure method if we set one up when 
							// creating the AJAX object
					
							if ( request.options['onFailure'] ) 
							{
								request.options['onFailure'](request.transport, request.json);
							}
						}
					},
					2000 // Two seconds
				);
			},
			onComplete: function( request ) 
			{
				// Clear the timeout, the request completed ok
				
				window.clearTimeout( request['timeoutId'] );
			},
			onException : function ( request, exc )
			{
				var str = request.options['postBody'];
				
				if ( str == null ) str = request.options['parameters'];
				
				controller.handleErrorText( 
					'Ajax.Responders.onException()', 
					'Request: ' + str + ', ' + 
					'Exception: ' + exc.name + ' message: ' + exc.message );
			},
			onFailure : function ( resp )
			{
				if ( resp.responseText != null )
				{
					controller.handleErrorText( 
						'Ajax.Responders.onFailure()',
						resp.responseText + '<br/>' + 'Status: ' + resp.status );
				}
				else
				{
					controller.handleErrorText( 
						'Ajax.Responders.onFailure()',
						'Status: ' + resp.status );					
				}
			}			
		});
	},
	
	addWidget: function( widget )
	{
		if ( widget != null )
		{
			if ( widget.id != null )
			{
				this.widgets.add( widget.id, widget );
			}
			else
			{
				this.handleErrorText( 'Controller.addWidget()',
					'Widget \'' + widget + '\' has no property id' );
			}
		}
	},
	
	getWidget: function( key )
	{
		return this.widgets[key];
	},
	
	treeClicked: function( id )
	{
		var array = id.split( '.' );
		
		var target = this.widgets.get( array[0] );
		
		if ( target != null )
		{
			var node = null;
			
			var array = array.slice( 1 );

			if ( array.length == 0 )
			{
				node = target.root;
			}
			else 
			{
				node = target.root.find( array );
			}

			target.treeClicked( node );					
						
			if ( 'Folder' == node.userObject.oc  )
			{
				this.load( node.userObject.id );
			}
		}
	},
	
	load: function ( id )
	{
		try
		{
			if ( id == null )
			{
				throw new Error( -1, "id onbekend" );
			}
			
			var channel = this;
			
			var options = 
			{
				onSuccess: function ( resp ) 
				{
					var result = eval ( resp.getResponseHeader( 'X-JSON' ) );
					
					if ( result != null )
					{
						if ( 'Error' == result.oc )
						{
							this.handleError( 'Controller.load()', result );
						}
						else
						{
							var inspector = controller.getWidget( 'inspector' );
							inspector.container = controller.getWidget( 'inspectorContainer' );
							inspector.load( result );

							var channel = controller.getWidget( 'channel' );
							channel.container = controller.getWidget( 'contentContainer' );
							channel.load( result );
						}
					}
					else if ( resp.responseText != null )
					{
						this.handleErrorText( 'Controller.load()', resp.responseText );
					}
				},
				parameters: ( 'action=find&id=' + id )
			};
			
			new Ajax.Request( SERVICE_URI, options );	
		}
		catch( error )
		{
			this.handleErrorText( 'Controller.load()', error.message );
		}
	},
	
	submit: function ( id )
	{
		try
		{
			var code = this.action + '( \'' + id + '\' )';
			
			eval( code );
		}
		catch( error )
		{
			this.handleErrorText( 
				'Controller.submit()', 'Could not execute code:<br/>' + 
				'<code>' + code + '</code>:<br/>' + error.message );
		}
	},
	
	edit: function ( id )
	{
		if ( id == null )
		{
			this.handleErrorText(
				'Controller.edit()', 'id is undefined' );
				
			return;
		}
		
		var options = 
		{
			onSuccess: function ( resp ) 
			{
				var result = eval ( resp.getResponseHeader( 'X-JSON' ) );
				
				if ( result != null )
				{
					if ( 'Error' == result.oc )
					{
						controller.handleError( 'Controller.edit()', result );
					}
					else
					{
						var editor = controller.getWidget( result.oc );
		
						if ( editor != null )
						{
							editor.container = controller.getWidget( 'contentContainer' );
								
							editor.load( result );					
						}
						else
						{
							controller.handleErrorText(
								'Controller.edit()', 'item editor is undefined' );
						}
					}
				}
				else if ( resp.responseText != null )
				{
					controller.handleErrorText( 'Controller.edit()', resp.responseText );
				}
			},
			parameters: ( 'action=find&target=Resource&id=' + id )
		};
		
		new Ajax.Request( SERVICE_URI, options );		
		
	},
	
	handleError: function ( fun, error )
	{
		var html = '';
		
		html += '<div id="error-header">';
		html += '<div id="error-title">' + error.type + '</div>';
		html += '<div id="error-button" onclick="$(\'error\').style.visibility=\'hidden\';">';
		html += 'Sluiten';
		html += '</div>';
		html += '</div>';
		html += '<div id="error-message">';
		html += '<div>function: ' + fun + '</div>';
		html += '<div>' + error.description + '</div>';
		html += '<div>' + error.file + ', line ' + error.line + '</div>';
		html += '</div>';
		
		$('error').innerHTML = html;
		$('error').style.visibility = 'visible';	
	},

	handleErrorText: function ( fun, str )
	{
		var html = '';
		
		html += '<div id="error-header">';
		html += '<span id="error-title">Foutmelding</span>';
		html += '<span id="error-button" onclick="$(\'error\').style.visibility=\'hidden\';">';
		html += 'Sluiten';
		html += '</span>';
		html += '</div>';
		html += '<div id="error-message">';
		html += 'function: ';
		html += fun;
		html += '<br/>';
		html += str;
		html += '</div>';
		
		$('error').innerHTML = html;
		$('error').style.visibility = 'visible';	
	},
	
	handleDialog: function ( editorName )
	{
		var editor = this.getWidget( editorName );
		
		if ( editor != null )
		{
			$('dialog').innerHTML = editor.toHtml();
			$('dialog').style.visibility = 'visible';
		}
		else
		{
			this.handleError( 'Unknown editor: ' + editorName );
		}
	},
	
	handleInfo: function ( str )
	{
		$('info').innerHTML = ( "&gt; " + str );
	}
}

var controller = new Controller();
