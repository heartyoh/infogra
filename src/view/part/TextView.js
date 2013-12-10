Delo.TextView = function(config) {
    this.build(config);
};

Delo.TextView.prototype = {
    build : function(config) {
		var model = config.model;
		
        // call super constructor
        Kinetic.Text.call(this, config.model.attributes);
		
		this.setDraggable(config.mode != 'view');
		this.setAttr('model', model);
		
        // this.shapeType = 'BoxView';
        // this._setDrawFuncs();
		
		/* set event handlers */
		model.bind('remove', this._remove, this);
		model.bind('change', this._change, this);
	},

	onChangePost : function(e) {

		return;
	}
};

Kinetic.Util.extend(Delo.TextView, Delo.PartView);
Kinetic.Util.extend(Delo.TextView, Kinetic.Text);
