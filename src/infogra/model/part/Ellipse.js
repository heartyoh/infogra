Delo.Ellipse = Delo.Part.extend({
	defaults : {
		x : 0,
		y : 0,
		radius : [50, 70],
		width : 100,
		height : 140,
		stroke : 'black',
		fill : 'red',
		strokeWidth : 3,
		rotationDeg : 0
	},
	
	adjustAttrs : function(attrs) {
		if(attrs.x !== undefined) {
			attrs.x -= this.get('width') / 2
		}
		if(attrs.y !== undefined) {
			attrs.y -= this.get('height') / 2
		}
		
		return attrs;
	}
	
}, {
	partType : 'Delo.Ellipse'
});