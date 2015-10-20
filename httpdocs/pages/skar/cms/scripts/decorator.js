
Decorator = Class.create();

Decorator.prototype = {
	
	initialize: function( title )
	{
		this.id = null;
		this.title = title;		
		
		this.titleHeight = 16;
		this.contentMargin = 4;
	},
	
	getHeight: function( str )
	{
		return str.substr( 0, str.indexOf( 'px' ) );
	},
	
	renderTop: function()
	{
		var html = '';
		
		height = this.getHeight( Element.getStyle( this.id, 'height' ) );
		
		if ( height > 0 )
		{
			height -= this.titleHeight;
			
			height -= ( 2 * this.contentMargin );
		}
		
		style = 'height: ' + height + 'px;';
		
		html += '<div class="decorator-box">';
		
		html += '<div class="decorator-title">';
		html += '&nbsp;' + this.title;
		html += '</div>';
		
		html += '<div class="decorator-content"';
		html += ' style="' + style + '"';
		html += '>';
		
		return html;
	},
	
	renderBottom: function()
	{
		var html = '';
		
		// end decorator content
		html += '</div>';
		
		// end decorator box
		html += '</div>';
		
		return html;
	}
}