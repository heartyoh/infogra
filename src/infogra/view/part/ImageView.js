Delo.ImageView = function(config) {
    this.build(config);
};

Delo.ImageView.prototype = {
    build : function(config) {
		var model = config.model;
		var attributes = {
			x : model.get('x'),
			y : model.get('y'),
			width: model.get('width'),
			height: model.get('height'),
			rotationDeg : model.get('rotationDeg'),
			// name : 'image',
			draggable: (config.mode != 'view')
		};
		
        // call super constructor
        Kinetic.Image.call(this, attributes);
		
		this.setAttr('model', model);
		
		var self = this;

		var imageObj = new Image();

		imageObj.onload = function() {
			self.setImage(imageObj);
			self.getLayer().draw();
		};
				
		imageObj.src = model.get('url');
        // this.shapeType = 'BoxView';
        // this._setDrawFuncs();
		
		/* set event handlers */
		model.bind('remove', this._remove, this);
		model.bind('change', this._change, this);
	}
};

Kinetic.Util.extend(Delo.ImageView, Delo.PartView);
Kinetic.Util.extend(Delo.ImageView, Kinetic.Image);
