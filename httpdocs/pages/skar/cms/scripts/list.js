
List = Class.create();

List.prototype = {
	
	initialize: function ( id, p )
	{
		this.id = id;
		this.items = null;
		this.value = null;
		this.name = p.name;
		this.target = p.target;
		this.size = p.size;
		this.actions = null;
		this.onInsert = p.onInsert;
	},
	
	loadItem: function()
	{
		alert( 'loadItem() - ' + this.id );
	},
	
	openItem: function()
	{
		var item = this.getSelectedItem();		
		
		if ( item != null )
		{
			window.open( item.uri, '_blank' );
		}
		else
		{
			alert( 'Please select an item' );
		}
	},
	
	insertItem: function()
	{
		eval ( this.onInsert + '( \'' + this.id + '\' )' );
	},
	
	getValue: function()
	{
		return $(this.id).value;
	},
	
	getSelectedItem: function()
	{
		var item = null;
		
		for ( var i=0; i < this.items.length; i++ )
		{
			if ( this.items[i].id == $(this.id).value )
			{
				item = {
					'id': this.items[i].id,
					'cn': this.items[i].cn,
					'uri': this.items[i].uri,
					'type': this.items[i].type
				};

				break;
			}
		}

		return item;
	},
	
	getSelectedIndex: function()
	{
		var index = -1;
		
		var value = this.getValue();
		
		for ( var i=0; i < this.items.length; i++ )
		{
			if ( this.items[i].id == value )
			{
				index = i;
				break;
			}
		}		
		
		return index;
	},
	
	deleteItem: function()
	{
		var index = this.getSelectedIndex();
		
		if ( index != -1 && confirm ( 'Item verwijderen?' ) )
		{
			this.items.splice( index, 1 );
			this.render();
		}		
	},
	
	render: function()
	{
		$( this.id + '-container' ).innerHTML = this.toHtml();		
	},
	
	indexOfValue: function ( value )
	{
		var index = -1;
		
		var value = this.getValue();

		for ( var i=0; i < this.items.length; i++ )
		{
			if ( this.items[i].id == value )
			{
				index = i;
				break;
			}
		}
		
		return index;
	},
	
	toHtml: function()
	{
		var html = '';
		
		var obj = 'controller.getWidget( \'' + this.id + '\' )';
		
		html += '<div id="' + this.id + '-container">';
		
		if ( this.actions != null && this.actions.length > 0 )
		{
			html += '<div class="toolbar">';
			html += '<ul class="toolbar" id="' + this.id + '-toolbar">';
			
			for ( var i=0; i < this.actions.length; i++ )
			{
				html += this.actions[i].toHtml();
			}

			html += '</ul>';
			html += '</div>';
		}

		html += '<select name="' + this.name + '" id="' + this.id + '" class="list" size="' + this.size + '">';
		
		if ( this.items != null )
		{
			if ( 1 == this.size )
			{
				html += '<option value="null"></option>';				
			}
			
			for ( var i=0; i < this.items.length; i++ )
			{
				html += '<option value="' + this.items[i].id + '"';
				
				if ( this.value == this.items[i].id )
				{
					html += ' selected';
				}
				
				html += '>';
				
				html += this.items[i].cn;
				
				if ( 'Folder' == this.items[i].oc )
				{
					html += '*';
				}
				else if ( 'pdf' == this.items[i].type )
				{
					html += '+';
				}
								
				html += '</option>';
			}
		}
		
		html += '</select>';
		
		html += '</div>';
		
		// alert( 'html for ' + this.id + ': ' + html );
		
		return html;
	},
	
	getParams: function()
	{
		var result = '';
		
		for ( var i=0; i < this.items.length; i++ )
		{
			if ( i > 0 ) result += '&';
			
			result += this.target + '' + ( i + 1 );
			result += '=';
			result += this.items[i].id;
		}
		
		return result;		
	}
}

Action = Class.create();

Action.prototype = 
{

	initialize: function ( id, fun, title )
	{
		this.id = id;
		this.fun = fun;
		this.title = title;		
	},
	
	toHtml: function()
	{
		return ( '<li onclick="controller.getWidget( \'' + this.id + '\' ).' + 
			this.fun + '();">' + this.title + '</li>' );
	}
}