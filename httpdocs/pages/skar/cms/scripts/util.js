
String.prototype.parseDate = function ()
{
	var month = this.substr( 5, 2 );
	if ( month.substr( 0, 1 ) == '0' ) month = month.substr( 1 );
	month = parseInt( month ) - 1;
	
	var day = this.substr( 8, 2 );
	if ( day.substr( 0, 1 ) == '0' ) day = day.substr( 1 );
	day = parseInt( day );
	
	return new Date( parseInt( this.substr( 0, 4 ) ), month, day );		
}

var gsMonthNames = new Array (
	'januari',
	'februari',
	'maart',
	'april',
	'mei',
	'juni',
	'juli',
	'augustus',
	'september',
	'oktober',
	'november',
	'december'
);

var gsDayNames = new Array (
	'zondag',
	'maandag',
	'dinsdag',
	'woensdag',
	'donderdag',
	'vrijdag',
	'zaterdag'
);

Date.prototype.format = function( f )
{
    if ( !this.valueOf() ) return '&nbsp;';

    var d = this;
    
    var regex = new RegExp( '(yyyy|mmmm|mmm|mm|dddd|ddd|dd)', 'gi' );
    
    return f.replace( regex,
        function( str )
        {
            switch ( str.toLowerCase() )
            {
	            case 'yyyy': return d.getFullYear();
	            case 'mmmm': return gsMonthNames[d.getMonth()];
	            case 'mmm':  return gsMonthNames[d.getMonth()].substr(0, 3);
	            case 'mm':   return (d.getMonth() + 1);
	            case 'dddd': return gsDayNames[d.getDay()];
	            case 'ddd':  return gsDayNames[d.getDay()].substr(0, 3);
	            case 'dd':   return d.getDate();
	            default: return ' ';
            }
        }
    );
}

Map = Class.create();

Map.prototype = {
	
	initialize: function()
	{		
	},
	
	add: function( key, value )
	{
		this[key] = value;
	},
	
	get: function( key )
	{
		return this[key];
	},
	
	remove: function( key )
	{
		this[key] = null;
	}
}

function assert ( fact )
{
	if ( fact == false )
	{
		var error = new Error();
		error.name = 'AssertionError';
		error.message = 'Assertion failed: ' + fact;
		throw error;
	}
}

function isCallInProgress ( xmlhttp ) 
{
	var result = false;
	
	switch ( xmlhttp.readyState ) 
	{
		case 1: 
		case 2: 
		case 3:
			result = true;
			break;
		// Case 4 and 0
		default:
			break;
	}
	
	return result;
}

// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function encode64(input) {
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
         enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
         enc4 = 64;
      }

      output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + 
         keyStr.charAt(enc3) + keyStr.charAt(enc4);
   } while (i < input.length);
   
   return output;
}

function decode64(input) {
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

   do {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
         output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
         output = output + String.fromCharCode(chr3);
      }
   } while (i < input.length);

   return output;
}