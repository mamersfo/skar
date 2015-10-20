
Tree = Class.create();
Node = Class.create();

Tree.prototype = {
	
	initialize: function( root ) 
	{
		this.id = root.userObject.id;
		this.root = root;
		this.current = this.root;
		this.container = null;
	},
	
	setElement: function( e )
	{
		this.element = e;
	},
	
	treeLoaded: function ( userObjects )
	{
		this.current.clear();			
		
		if ( userObjects != null )
		{
			for ( var i=0; i < userObjects.length; i++ )
			{
				this.current.add( new Node( userObjects[i] ) );
			}
		}
		
		this.current.expanded = true;

		var html = '';
		
		if ( this.current == this.root )
		{
			html += '<div class="tree">';
			html += this.current.innerHtml( false );
			html += '</div>';
			
			this.container.render( html );
		}
		else
		{
			html += this.current.innerHtml( true );
			$(this.current.getId()).innerHTML = html;
		}
	},
	
	treeClicked: function ( node )
	{
		if ( node == null ) return;
		
		if ( node == this.root )
		{
			this.current = this.root;
			this.load();
			return;
		}
		
		if ( this.current != null && this.current != node && this.current.userObject.oc != 'root' )
		{
			var html = this.current.innerHtml( false );
		
			$(this.current.getId()).innerHTML = html;
		}
		
		this.current = node;
		
		if ( 'branch' == this.current.userObject.nt )
		{
			if ( this.current.expanded )
			{
				// collapse
				this.current.expanded = false;
				var html = this.current.innerHtml( true );
				$(this.current.getId()).innerHTML = html;
			}
			else
			{
				// expand
				this.load( this.current.userObject.id );				
			}			
		}
		else
		{
			$(this.current.getId()).innerHTML = this.current.innerHtml( true );
		}
	},
	
	load: function ( id )
	{
		try
		{
			if ( id == null ) id = 0;
			
			var tree = this;
			
			var options = 
			{
				onSuccess: function ( resp ) 
				{
					var result = eval ( resp.getResponseHeader( 'X-JSON' ) );
					
					if ( result != null )
					{
						tree.treeLoaded( result );
					}
					else if ( resp.responseText )
					{
						controller.handleErrorText( 'Tree.load()', resp.responseText );
					}
				},
				postBody: ( 'action=list&target=Folders&id=' + id )
			};
			
			new Ajax.Request( SERVICE_URI, options );		
		}
		catch( error )
		{
			controller.handleErrorText( 'Tree.load()', error.message );
		}
	}	
}

Node.prototype = {
	
	initialize : function ( userObject ) 
	{
		this.parent = null;
		this.children = new Array();
		this.userObject = userObject;
		this.expanded = false;
		this.active = false;
	},
	
	getRoot : function()
	{
		if( this.parent == null )
		{
			return this;
		}
		
		return this.parent.getRoot();
	},
	
	remove : function( node )
	{
		if ( node == null ) return;

		for ( var i=0;i < this.children.length; i++ )
		{
			if ( node == this.children[i] )
			{
				this.children.splice( i, 1 );

				break;
			}
		}
	},
	
	find : function ( array )
	{
		var child = null;

		for ( var i=0; i < this.children.length; i++ )
		{
			if ( this.children[i].userObject.id == array[0] )
			{
				child = this.children[i];

				break;
			}
		}

		if ( child != null && array.length > 1 )
		{
			child = child.find( array.slice( 1 ) );
		}

		return child;
	},
	
	isLast : function ( node )
	{
		return ( node == this.children[this.children.length-1] );
	},
	
	getId : function ( node )
	{
		var result = '';

		if ( this.parent != null )
		{
			result = this.parent.getId();

			if ( result.length > 0 ) result += '.';
		}

		if ( this.userObject.id != null )
		{
			result += this.userObject.id;
		}

		return result;
	},
	
	add : function ( node )
	{
		node.parent = this;
		this.children.push( node );
	},
	
	imageHtml : function ( type, state, last )
	{
		var html = ( 
			'<img class="treeControl" src="' + 
			TREE_ASSETS_URI + type 
		);
			
		if ( state != null ) html += ( '-' + state );
		
		if ( last ) html += '-last';
		
		html += '.gif"/>';
		
		return html;
	},
	
	beforeHtml : function ( node, leaf )
	{
		var text = '';

		if ( this.parent != null )
		{
			text += this.parent.beforeHtml( this, leaf );
		}

		if ( leaf.parent == this )
		{
			var last = this.isLast( leaf );

			if ( 'branch' == leaf.userObject.nt )
			{
				text += this.imageHtml( 'leaf', leaf.expanded ? 'open' : 'close', last );
			}
			else
			{
				text += this.imageHtml( 'leaf', null, last );
			}
		}
		else
		{
			if ( this.isLast( node ) )
			{
				text += this.imageHtml( 'leaf', 'blank', false );
			}
			else
			{
				text += this.imageHtml( 'leaf', 'line', false );
			}
		}

		return text;
	},
	
	innerHtml : function ( active )
	{
		var id = this.getId();

		var classname = 'treeRow';

		if ( this.active = active ) classname += '-active';

		var result = '';
		
		// propagate treeClick to controller for inspection and content listing
		result += '<a class="treeLink" onclick="controller.treeClicked( \'' + id + '\' )">';
		
		result += '<table class="' + classname + '" cellpadding="0" cellspacing="0"><tr>';

		result += '<td class="treeNode">';

		if ( this.parent != null )
		{
			result += this.parent.beforeHtml( this, this );
		}

		if ( 'branch' == this.userObject.nt )
		{
			result += this.imageHtml( 'branch', ( this.expanded ? 'open' : 'close' ) );
		}
		else
		{
			result += this.imageHtml( 'leaf-node', null, false );
		}
		
		// Label
		result += '<span';
		if ( this.active ) result += ' class="treeActive"';
		result += '>';
		result += '&nbsp;' + this.toString();
		result += '</span>'

		result += '</td>';
		result += '</tr></table></a>';
		
		result += '</a>';

		if ( this.expanded )
		{
			for ( var i=0; i < this.children.length; i++ )
			{
				result += this.children[i].html();
			}
		}
		
		return result;
	},
	
	html : function ()
	{
		return ( 
			'<div id="' + this.getId() + 
			'" class="line">' + this.innerHtml() + 
			'</div>' 
		);
	},
	
	clear : function ()
	{
		this.children = null;
		this.children = new Array();
	},
	
	toString : function()
	{
		return ( this.userObject.cn );
	}
}
