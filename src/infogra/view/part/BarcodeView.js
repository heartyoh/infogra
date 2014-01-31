BarcodeView = function(config) {
    this.build(config);
};

BarcodeView.prototype = {
	handleset : [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],

    build : function(config) {
		var model = config.model;
		var attributes = {
			name: 'image',
			draggable: (config.mode != 'view'),
			x : model.get('x'),
			y : model.get('y')
		};
		
        // call super constructor
        Kinetic.Image.call(this, attributes);
        // this.shapeType = 'BarcodeView';

		this.setAttr('model', model);
		
		var self = this;

		this.imageObj = new Image();
		
		this.imageObj.onload = function() {
			self.setImage(self.imageObj);
			model.set({
				width : self.imageObj.width,
				height : self.imageObj.height
			});
			self.getLayer().draw();
		};
				
		this.imageObj.src = this.buildImageUrl();
		
		/* set event handlers */
		model.bind('remove', this._remove, this);
		model.bind('change', this._change, this);
    },
	
	buildImageUrl : function() {
		var model = this.getAttr('model');

		return BWIPJS.imageUrl({
			symbol : model.get('symbol'),
			text : model.get('text'),
			alttext : model.get('alttext'),
			scale_h : model.get('scale_h'),
			scale_w : model.get('scale_w'),
			rotation : model.get('rotation')
		});
	},
	
	_change : function(e) {
		var changed = e.changed;
		
		// TODO 이미지 변경 조건이 불분명함.
		if(!changed.x && !changed.y) {
			this.imageObj.src = this.buildImageUrl();
		}
		
		Delo.PartView.prototype._change.call(this, e);
	}
};

Kinetic.Util.extend(BarcodeView, Delo.PartView);
Kinetic.Util.extend(BarcodeView, Kinetic.Image);
