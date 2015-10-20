<?php

class Observer
{
	var $_observers; 
	var $_state;

	function Observer()
	{ 
		$this->_observers = array(); 
		$this->_state = NULL; 
	 }

	function attach( &$observer )
	{ 
		$this->_observers[] =& $observer; 
	}

	function detach(&$observer)
	{ 
		foreach ( array_keys($this->_observers) as $key )
		{ 
			if ( $this->_observers[$key] === $observer )
			{ 
				unset($this->_observers[$key]); 
				return; 
			}
		}
	}

	function notify()
	{ 
		foreach ( array_keys($this->_observers) as $key )
		{ 
			$client=& $this->_observers[$key];
			
			$client->update( $this->_state ); 
		}
	}

	function setState( $state )
	{ 
		$this->_state = $state; 
		$this->notify(); 	
	}	
}

?>