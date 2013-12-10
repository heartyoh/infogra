Barcode = Delo.Part.extend({
	defaults : {
		x : 0,
		y : 0,
		symbol : 'code128',
		text : '1234567890',
		alttext : '1234567890',
		scale_h : 2,
		scale_w : 2,
		rotation : 'N',
		includetext : true,
		includecheckintext : true,
		includecheck : true,
		parsefnc : true,
		segments : 4,
		showborder : true,
		version : 'iata',
		barcolor : '#FF0000',
		rows : 32,
		columns : 8,
		// height : 0.5,
		height : 64,
		width : 64,
		backgroundcolor : 'DD000011',
		format : 'full',
		ccversion : 'b',
		cccolumns : 4,
		numeric : true,
		guardwhitespace : true
	}
}, {
	partType : 'Barcode'
});
