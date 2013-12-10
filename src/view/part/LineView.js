Delo.LineView = function(config) {
    this.build(config);
};

Delo.LineView.prototype = {
	handleset : [0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
	
    build : function(config) {
		var model = config.model;
		var attributes = {
			points : [[0, 0], [model.get('width'), model.get('height')]],
			fill: model.get('fill'),
			stroke: model.get('stroke'),
			strokeWidth: model.get('strokeWidth'),
			x : model.get('x'),
			y : model.get('y'),
			width : model.get('width'),
			height : model.get('height'),
			// dashArray: [6, 6],
			// name: 'line',
			draggable: (config.mode != 'view')
		};
		
        // call super constructor
        Kinetic.Line.call(this, attributes);
		
		this.setAttr('model', model);
		
        // this.shapeType = 'BoxView';
        // this._setDrawFuncs();
		
		/* set event handlers */
		model.bind('remove', this._remove, this);
		model.bind('change', this._change, this);
    },

	adjust : function(attrs) {
		if(attrs.x !== undefined || attrs.y !== undefined || attrs.width !== undefined || attrs.height !== undefined) {
			attrs.width = attrs.width === undefined ? this.getAttr('width') : attrs.width;
			attrs.height = attrs.height === undefined ? this.getAttr('height') : attrs.height;

			attrs.points = [[0, 0], [attrs.width, attrs.height]];
		}
		return attrs;
	}
};

Kinetic.Util.extend(Delo.LineView, Delo.PartView);
Kinetic.Util.extend(Delo.LineView, Kinetic.Line);
