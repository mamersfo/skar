
ResourceEditor = Class.create();

ResourceEditor.prototype = 
{	
	initialize: function( id )
	{
		this.id = id;
		this.css = 'default';
		this.userObject = null;
		this.container = null;
		this.properties = new Array();
		this.actions = new Array();
	},
	
	runModal: function()
	{
		$('dialog').innerHTML = this.toHtml();
		$('dialog').style.visibility = 'visible';
	},
	
	addProperty: function ( p )
	{
		this.properties.push( p );
	},
	
	addAction: function ( a )
	{
		this.actions.push( a );
	},
	
	load: function ( o )
	{
		try
		{
			this.userObject = o;
			
			assert ( this.container != null );
			
			this.container.render( this.toHtml() );
		}
		catch ( error )
		{
			controller.handleErrorText( 
				'ResourceEditor.load()', 
				error.name + ': ' + error.message );
		}
	},
	
	toHtml: function()
	{
		var html = '';
		
		try
		{
			var listCount = 0;
			
			html += '<form id="' + this.id + '"';
			html += ' method="post"';
			html += ' action=""';
			html += ' onsubmit="controller.submit( \'' + this.id + '\' ); return false;"';
			html += '>';
				
			html += '<table class="' + this.css + '" cellpadding="0" cellspacing="0">';
			
			for ( var i=0; i < this.properties.length; i++ )
			{
				var p = this.properties[i];
				
				var value = null;
				if ( p.value != null ) value = p.value;
				else if ( this.userObject != null ) value = this.userObject[p.name];
				
				if ( 'input' == p.element && 'hidden' == p.type )
				{
					html += '<input class="' + this.css + '" ';
					html += 'type="' + p.type + '" ';
					html += 'name="' + p.name + '" ';
					html += 'value="' + value + '" ';
					html += '/>';
				}
				else
				{
					html += '<tr>';

					html += '<td class="' + this.css + '-property">' + p.title + '</td>';
					
					html += '<td class="' + this.css + '-value">';
					
					switch( p.element )
					{
						case 'input':
						{
							html += '<input class="' + this.css + '" ';
							html += 'type="' + p.type + '" ';
							html += 'name="' + p.name + '" ';
							html += 'value="' + ( value != null ? value : '' ) + '" ';
							
							if ( p.edit != null )
							{
								switch( p.edit )
								{
									case 'disabled':
									{
										html += 'disabled ';
										break;
									}
									case 'write-once':
									{
										if ( value != null )
										{
											html += 'disabled ';
										}
									}
									default:
										break;
								}
							}							
							
							html += ( p.pattern != null ? ( 'pattern="' + p.pattern + '" ' ) : '' );
							html += '/>';
							break;
						}
						case 'textarea':
						{
							html += '<textarea ';
							html += 'class="' + this.css + '" ';
							html += 'name="' + p.name + '" ';
							html += '>';
							html += ( value != null ? value : '' );
							html += '</textarea>';
							break;
						}
						case 'pages':
						{
							var pageEditor = new PageEditor( this.id + 'Pages' );
							controller.addWidget( pageEditor );
							pageEditor.setPages( value );
							html += pageEditor.toHtml();
							break;
						}
						case 'list':
						{
							var list = new List( this.id + 'List' + ( ++listCount ), p );
							
							controller.addWidget( list );
							
							if ( p.items != null )
							{
								list.items = eval( p.items );
																
								list.value = value;
							}
							else
							{
								list.items = value;
							}
							
							if ( p.actions != null )
							{
								list.actions = p.actions;
								
								for ( var j=0; j < list.actions.length; j++ )
								{
									list.actions[j].id = list.id;
								}
							}
														
							html += list.toHtml();
							
							break;
						}
						default:
						{
							break;
						}
					}
					
					html += '</td>';
					
					html += '</tr>';
				}
			}
			
			html += '<tr><td class="' + this.css + '-property"><br/></td>';
			
			html += '<td class="' + this.css + '-value">';
			
			for ( var i=0; i < this.actions.length; i++ )
			{
				var a = this.actions[i];
				
				html += '<input ' +
					'type="image" ' +
					'src="' + ACTION_ASSETS_URI + a.img + '.gif" ' +
					( a.title != null && a.title.length > 0 ? ( 'alt="' + a.title + '" ' ) : '' ) +
					'onclick="controller.action=\'' + a.action + '\';" ' +
					'/>&nbsp;';
			}
				
			html += '</td></tr>';
			
			html += '</table>';
			
			html + '</form>';
			
			// alert( html );
		}
		catch ( error )
		{
			controller.handleErrorText( 
				'ResourceEditor.toHtml()', error.message );
		}
		
		return html;				
	},
	
	validate: function()
	{
		var elements = $( this.id ).elements;
		
		for ( var i=0; i < elements.length; i++ )
		{
			var element = elements[i];
			
			if ( element.pattern != null )
			{
				var regex = new RegExp( element.pattern );
				
				if ( regex.test( element.value ) == false )
				{
					element.focus();

					throw ( new Error(
						'Value for ' + element.name + ': "' + 
						element.value + '" ' + ' is incorrect.' ) );
				}
			}
		}
	}	
}

PageEditor = Class.create();

PageEditor.prototype = 
{
	initialize: function ( id )
	{
		this.id = id;
		this.pages = new Array();
		this.current = 0;
		this.type = 'div';
	},
	
	setType: function ( type )
	{
		this.type = type;
		
		$(this.id + '-toolbar').innerHTML = this.toolbarHtml( this.current );	

		html = '<' + this.type + ' id="' + this.id + '-content" class="contenteditor" contenteditable="true" ';
		html += 'class="pages" ';
		html += 'onblur="controller.getWidget( \'' + this.id + '\' ).updatePage();" ';
		html += '>';
		html += ( this.getContent( this.current ) );
		html += '</' + this.type + '>';
		
		$( this.id + '-container' ).innerHTML = html;
	},
	
	toolbarHtml: function ( index )
	{
		var obj = 'controller.getWidget( \'' + this.id + '\' )';

		var html = '';
		
		html += ( '<li onclick="' + obj + '.addPage( ' + index + ' );">Nieuw</li>' );
		html += ( '<li onclick="' + obj + '.deletePage( ' + index + ' );">Verwijder</li>' );
		
		if ( this.type == 'div' )
		{
			html += ( '<li onclick="' + obj + '.setType( \'textarea\' );">Tekst</li>' );
		}
		else
		{
			html += ( '<li onclick="' + obj + '.setType( \'div\' );">HTML</li>' );
		}
		
		for ( var i=0; i < this.pages.length; i++ )
		{
			html += '<li ' + ( i == index ? ' class="selected" ' : ' ' ); 
			html += 'onclick="' + obj + '.editPage( ' + i + ' );">';
			html += 'Pagina ' + ( i+1 );
			html += '</li>';
		}			

		return html;		
	},
	
	setPages: function ( pages )
	{
		if ( pages != null )
		{
			this.pages = pages;
		}
		else
		{
			this.pages = new Array();
		}
		
		if ( this.pages.length == 0 )
		{
			this.pages.push( '' );
		}
	},
	
	getContent: function ( index )
	{
		return this.pages[index];
	},
		
	setContent: function ( value, index )
	{
		if ( value == null ) alert( 'setContent() - expected value argument' );
		
		var page = value;
		
	    var regex = new RegExp( '(&lt;|&gt;|&amp;|<br>)', 'gi' );
	    
	    page = page.replace( regex,
	        function( str )
	        {
	            switch ( str.toLowerCase() )
	            {
		            case '&lt;':	
		            	return '<';
		            case '&gt;': 	
		            	return '>';
		            case '&amp;':  	
		            	return '&';
		            case '<br>':   	
		            	return '<br/>';
		            default: 
		            	return '';
	            }
	        }
	    );
	    
	    var temp = '';
	    
	    for ( var i=0; i < page.length; i++ )
	    {
	    	var code = page.charCodeAt( i );
	    	
	    	if ( code < 160 )
	    	{
	    		temp += String.fromCharCode( code );
	    	}
	    	else
	    	{
	    		temp += ( '&#' + code + ';' );
	    	}
	    }
	    
		page = temp;
	
//		alert( 'setContent() - ' + page );
				
		this.pages[index] = page;
	},
	
	addPage: function ( index )
	{
		this.pages.push( '' );
		
		this.editPage( this.pages.length - 1 );
	},
	
	editPage: function ( index )
	{
		if ( this.current != index )
		{
			this.setContent( $( this.id + '-content' ).innerHTML, this.current );
			
			$( this.id + '-toolbar' ).innerHTML = this.toolbarHtml( index );	
			
			try
			{
				$( this.id + '-content' ).innerHTML = this.getContent( index );
			}
			catch( error )
			{
				controller.handleErrorText( 
					'PageEditor.editPage()', error.message + '<br/>Error editing page ' + index );
			}
			
			this.current = index;
		}
	},
	
	deletePage: function ( index )
	{
		if ( index < this.pages.length )
		{
			if ( confirm ( 'Pagina ' + ( index + 1 ) + ' verwijderen?' ) )
			{
				this.pages.splice( index, 1 );
				
				if ( index >= this.pages.length )
				{
					index = this.pages.length - 1;
				}				
				
				$( this.id + '-toolbar' ).innerHTML = this.toolbarHtml( index );	
				
				try
				{
					$( this.id + '-content' ).innerHTML = this.getContent( index );
				}
				catch( error )
				{
					controller.handleErrorText( 
						'PageEditor.deletePage()', error.message + '<br/>Error editing page ' + index );
				}
				
				this.current = index;
			}
		}
	},		
	
	updatePage: function()
	{
		if ( this.pages.length == 0 )
		{
			controller.handleErrorText( 'PageEditor.updatePage()', 'Geen pagina gedefinieerd' );
			
			return;
		}
		
		var value = $(this.id + '-content').innerHTML;
		
		this.setContent ( value, this.current );
	},
		
	toHtml: function ()
	{
		var obj = 'controller.getWidget( \'' + this.id + '\' )';

		var html = '';
		
		html += '<div class="toolbar">';
		html += '<ul class="toolbar" id="' + this.id + '-toolbar">';
		html += this.toolbarHtml( 0 );
		html += '</ul>';
		html += '</div>';
		
		html += '<div id="' + this.id + '-container">';
		html += '<' + this.type + ' id="' + this.id + '-content" class="contenteditor" contenteditable="true" ';
		html += 'class="pages" ';
		html += 'onblur="' + obj + '.updatePage();" ';
		html += '>';
		html += ( this.getContent( 0 ) );
		html += '</' + this.type + '>';
		html += '</div>';			
		
		return html;
	},
	
	getParams: function()
	{
		var result = '';
		
		for ( var i=0; i < this.pages.length; i++ )
		{
			if ( i > 0 ) result += '&';
			
			var str = this.getContent( i );
			
			str = encode64( str );
			
			// alert( str );
						
			result += 'Page' + ( i + 1 ) + '=' + str;
		}
		
		return result;
	}
}
