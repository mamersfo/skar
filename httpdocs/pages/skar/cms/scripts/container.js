
Container = Class.create();

Container.prototype = 
{
	initialize: function( id )
	{
		this.id = id;
		this.decorator = null;
	},
	
	setTitle: function( title )
	{
		if ( this.decorator != null ) this.decorator.title = title;
	},
	
	setDecorator: function( d )
	{
		this.decorator = d;
		this.decorator.id = this.id;
	},
	
	render: function( contentHtml )
	{
		var html = '';
		
		html += this.decorator.renderTop();
		
		if ( contentHtml != null )
		{
			html += contentHtml;
		}
		
		html += this.decorator.renderBottom();
		
		$(this.id).innerHTML = html;	
	}
}