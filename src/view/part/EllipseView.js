Delo.EllipseView = function(config) {
    this.build(config);
};

Delo.EllipseView.prototype = {
    build : function(config) {
		var model = config.model;
		var attributes = {
			width: model.get('width'),
			height: model.get('height'),
			fill: model.get('fill'),
			stroke: model.get('stroke'),
			strokeWidth: model.get('strokeWidth'),
			rotationDeg : model.get('rotationDeg'),
			// dashArray: [6, 6],
			// name: 'ellipse',
			draggable: (config.mode != 'view'),
			x : model.get('x'),
			y : model.get('y'),
			radius : [model.get('width') / 2, model.get('height') / 2],
			offset : {
				x : -model.get('width') / 2,
				y : -model.get('height') / 2
			}
		};
		
        // call super constructor
        Kinetic.Ellipse.call(this, attributes);
		
		this.setAttr('model', model);
		
        // this.shapeType = 'BoxView';
        // this._setDrawFuncs();
		
		/* set event handlers */
		model.bind('remove', this._remove, this);
		model.bind('change', this._change, this);
    },

	adjust : function(attrs) {
		if(attrs.x !== undefined || attrs.y !== undefined || attrs.width !== undefined || attrs.height !== undefined) {
			var width = attrs.width === undefined ? this.getAttr('width') : attrs.width;
			var height = attrs.height === undefined ? this.getAttr('height') : attrs.height;
			
			attrs.radius = [Math.abs(width / 2), Math.abs(height / 2)];
			attrs.offset = [-width / 2, -height / 2];
		}
		return attrs;
	}
};

Kinetic.Util.extend(Delo.EllipseView, Delo.PartView);
Kinetic.Util.extend(Delo.EllipseView, Kinetic.Ellipse);
