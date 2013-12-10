Delo.Part = Backbone.Model.extend({
	defaults : {
		x : 0,
		y : 0,
		width : 100,
		height : 100,
		fill : 'blue',
		stroke : 'black',
		strokeWidth : 3,
		rotationDeg : 0
	},
	
	getPosition : function() {
		return {
			x : this.get('x'),
			y : this.get('y')
		}
	},
	
	getBound : function() {
		return this.adjustAttrs({
			x : this.get('x'),
			y : this.get('y'),
			width : this.get('width') || 0,
			height : this.get('height') || 0
		});
	},
	
	adjustAttrs : function(attrs) {
		return attrs;
	},
	
	serialize : function() {
		return '{"type":"' + this.constructor.partType + '","attrs":' + JSON.stringify(this) + '}'
	}
}, {
	partType : 'Delo.Part',
});