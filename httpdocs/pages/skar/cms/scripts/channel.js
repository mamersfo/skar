
Channel = Class.create();

Channel.prototype = 
{
	initialize: function( id )
	{
		this.id = id;
		this.resource = null;
		this.actions = new Array();
		this.container = null;
	},
	
	addAction: function( a )
	{
		this.actions.push( a );
	},
	
	toHtml: function()
	{
		var html = '';
		
		html += '<form id="' + this.id + '" method="post" action="" ' +
			'onsubmit="controller.submit( \'' + this.id + '\' ); return false;">';
		
		html += '<table class="channel">';
		
		if ( this.resource.items != null )
		{
			for ( var i=0; i < this.resource.items.length; i++ )
			{
				var item = this.resource.items[i];
				
				html += '<tr class="channel">';
				
				html += '<td class="channel">';

				if ( item.oc == 'Story' )
				{
					if ( item.pubdate != null && item.pubdate.length > 0 )
					{
						html += item.pubdate.parseDate().format( 'dd mmm yyyy' );
					}
					else
					{
						html += '<span class="unpublished">Nog niet gepubliceerd</span>';
					}
					
					html += '<br/>';
				}

				html += '<a href="#" class="channel" ';
				html += 'onclick="controller.edit( ' + item.id + ' )">';
				html += item.cn;
				html += '</a>';				
				
				if ( item.description != null )
				{
					html += '<br/>';
					html += item.description;
				}
								
				html += '</td>';
				html += '</tr>';
			}
		}
		
		if ( this.actions.length > 0 )
		{
			html += '<tr><td align="right">';
			
			for ( var i=0; i < this.actions.length; i++ )
			{
				var a = this.actions[i];

				switch( this.resource.type )
				{
					case 'alert':
						continue;
					case 'function':
						if ( 'story' != a.img ) continue;
						break;
					case 'journal':
					case 'link':
						if ( 'link' != a.img ) continue;
						break;
					case 'menu':
						if ( 'story' != a.img ) continue;
						break;
					case 'property':
						if ( 'property' != a.img ) continue;
						break;
					case 'story':
						if ( 'story' != a.img ) continue;
						break;
					default:
						break;
				}
				
				html += '<input ' +
					'type="image" ' +
					'src="' + ACTION_ASSETS_URI + a.img + '.gif" ' +
					( a.title != null ? ( 'alt="' + a.title + '" ' ) : '' ) +
					'onclick="controller.action=\'' + a.action + '\';" ' +
					'/>&nbsp;';				
			}
			
			html += '</td></tr>';
		}
		
		html += '</table>';
		
		html += '</form>';
		
		return html;		
	},
	
	load: function ( o )
	{
		try
		{
			this.resource = o;
			
			assert ( this.container != null );
			
			this.container.setTitle( this.resource.cn );

			this.container.render( this.toHtml() );
		}
		catch ( error )
		{
			controller.handleErrorText( 
				'Channel.load()', 
				error.name + ': ' + error.message );
		}
	}
}