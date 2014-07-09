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

        // src = document.location.protocol + '://' + document.location.host;
        // if(document.location.port != 80)
        //   src += ':' + document.location.port
        src = 'http://barcode.hatiolab.com:81/?';
        src += 'text=' + window.escape(model.get('text'));
        src += '&bcid=' + (model.get('symbol') || 'code128');
        src += '&wscale=' + (model.get('scale_w') || 2);
        src += '&hscale=' + (model.get('scale_h') || 2);
        src += '&rotate=' + (model.get('rotation') || 'N');

        if(model.get('alttext'))
            src += '&alttext=' + window.escape(model.get('alttext'));
        else if(model.get('includetext'))
            src += '&alttext=' + window.escape(model.get('text'));

        if(model.get('barcolor') && model.get('barcolor') != '#000000')
            src += '&barcolor=' + window.escape(model.get('barcolor'));
        if(model.get('backgroundcolor') && model.get('backgroundcolor') != '#FFFFFF')
            src += '&backgroundcolor=' + window.escape(model.get('backgroundcolor'));

        return src;
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
