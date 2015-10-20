
Browser = Class.create();

Browser.prototype = 
{
	initialize: function () 
	{
		this.name = this.searchString( this.dataBrowser )  || "An unknown browser";
	
		this.version = this.searchVersion( navigator.userAgent )
			|| this.searchVersion( navigator.appVersion )
			|| "an unknown version";
	
		this.os = this.searchString(this.dataOS) || "an unknown OS";
	},
	
	searchString: function (data) 
	{
		for (var i=0;i<data.length;i++)	
		{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
		
			this.versionSearchString = data[i].versionSearch || data[i].identity;
		
			if (dataString) 
			{
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
			{
				return data[i].identity;
			}
		}
	},
	
	searchVersion: function (dataString) 
	{
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	
	dataBrowser: [
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]
};

LocalizedDate = Class.create();

LocalizedDate.prototype = 
{
	initialize: function( str )
	{
		this.year = parseInt( str.substr( 0, 4 ) );
		
		this.month = str.substr( 5, 2 );
		if ( this.month[0] == '0' ) this.month = this.month.substr( 1, 1 );
		this.month = parseInt( this.month );
		
		this.day = str.substr( 8, 2 );
		if ( this.day[0] == '0' ) this.day = this.day.substr( 1, 1 );
		this.day = parseInt( this.day );
	},
	
	localizedMonth : function( lang )
	{
		return this.months[lang][this.month-1];
	},
		
	months: {
		'nl': [
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
		],
		'en': [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		]
	}
}
