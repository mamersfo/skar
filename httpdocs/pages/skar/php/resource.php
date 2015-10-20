<?php

class Resource
{
	var $id;
	var $oc;
	var $nt;
	var $cn;
	var $parent;
	var $description;
	var $pubdate;
	var $uri;
	var $modified;
	var $home;
	var $type;
	
	function Resource()
	{
		$this->id = -1;
		$this->oc = 'Resource';
		$this->nt = 'branch';
		$this->cindex = 0;
		$this->type = 'default';
	}
	
	function getValue( $key, $values )
	{
		$value = null;
		
		if ( isset ( $values[$key] ) )
		{
			$value = $values[$key];
			
			if ( 'null' == $value ) $value = null;
		}
		
		return $value;
	}
	
	function setValues( $values )
	{
		if ( $values != null )
		{
			$this->id = $this->getValue( 'id', $values );
			$this->parent = $this->getValue( 'parent', $values );
			$this->cn = $this->getValue( 'cn', $values );
			$this->description = $this->getValue( 'description', $values );
			$this->pubdate = $this->getValue( 'pubdate', $values );
			$this->cindex = $this->getValue( 'cindex', $values );
			$this->uri = $this->getValue( 'uri', $values );
			$this->modified = $this->getValue( 'modified', $values );
			$this->author = $this->getValue( 'author', $values );
			$this->home = $this->getValue( 'home', $values );
			$this->type = $this->getValue( 'type', $values );
		}
	}
	
	function path( $extension )
	{
		$result = null;
	
		if ( $this->uri != null && strncmp( $this->uri, 'http://', 7 ) != 0 )
		{
			$result = realpath( '.' );
			
			if ( strchr( $result, '/' ) )
			{
				$result .= $this->uri;
			}			
			else
			{
				$result .= str_replace( '/', '\\', $this->uri );
			}
			
			if ( $extension != null )
			{				
				$result .= ( '.' . $extension );			
			}
		}
				
		return $result;
	}
	
	function url()
	{
		return $this->uri;
	}
}

class Folder extends Resource
{
	function Folder()
	{
		$this->id = -1;
		$this->oc = 'Folder';
		$this->nt = 'branch';
		$this->items = array();
		$this->folders = array();
	}
	
	function path ( $extension )
	{
		$result = null;
	
		if ( $this->uri != null )
		{
			$result = realpath( '.' );
			
			if ( strchr( $result, '/' ) )
			{
				$result .= $this->uri;
				$result .= '/';
			}			
			else
			{
				$result .= str_replace( '/', '\\', $this->uri );
				$result .= '\\';
			}
			
			if ( $extension != null )
			{
				$result .= $extension;
			}			
		}
		
		return $result;
	}
}

class Item extends Resource
{
	function Item()
	{
		$this->id = -1;
		$this->oc = 'Item';
		$this->nt = 'leaf';
	}
}

class Story extends Item
{
	var $pages;
	var $links;
	
	function Story()
	{
		$this->id = -1;
		$this->oc = 'Story';
		$this->nt = 'leaf';
		$this->pages = array();
		$this->links = array();
	}

	function url()
	{	
		return ( DOC_LOCATION . $this->uri . '.html' );
	}		
}

class Link extends Item
{
	function Link()
	{
		$this->id = -1;
		$this->oc = 'Link';
		$this->nt = 'leaf';
	}
	
	function path()
	{
		return null;
	}
	
	function url()
	{
		return $this->uri;
	}	
}

class Form extends Item
{
	function Form()
	{
		$this->id = -1;
		$this->oc = 'Form';
		$this->nt = 'leaf';
	}
	
	function url()
	{
		return $this->uri;
	}
}

class Property extends Item
{
	function Property()
	{
		$this->id = -1;
		$this->oc = 'Property';
		$this->nt = 'leaf';
		$this->images = array();
	}
}

class Image extends Item
{
	var $property;
	
	function Image()
	{
		$this->id = -1;
		$this->oc = 'Image';
		$this->nt = 'leaf';
		$this->property = null;
	}
}

class User
{
	var $id;
	var $dn;
	var $cn;

	function User()
	{
	}
}

?>