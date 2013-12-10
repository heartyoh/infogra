Delo.Viewer = Backbone.View.extend({
	initialize: function(config) {
		
		this.stage = new Kinetic.Stage({
			container: this.el,
			width: this.collection.width,
			height: this.collection.height,
		});

		var self = this;
		
		this.partsLayer = new Delo.PartsLayer({
			target_stage : this.stage,
			document : this.collection,
			mode : 'view'
		});
		
		this.stage.add(this.partsLayer);

		this.register('Delo.Part', Delo.PartView);
		this.register('Delo.Line', Delo.LineView);
		this.register('Delo.Box', Delo.BoxView);
		this.register('Delo.Ellipse', Delo.EllipseView);
		this.register('Delo.Image', Delo.ImageView);
		this.register('Delo.Text', Delo.TextView);
		this.register('Barcode', BarcodeView);

		this.collection.bind('reset', this._reset, this);
	},

	register: function(modelType, editpartClass) {
		// 레이어에 있는 것을 옮길 방안 필요함.
		this.partsLayer.register(modelType, editpartClass);
	},
	
	_reset : function() {
		this.stage.setSize(this.collection.width, this.collection.height);
	},
	
	toDataUrl : function(callback) {
		this.stage.toDataURL({
			callback : callback
		});
	}
});
