Delo.BoxView = function(config) {
    this.build(config);
};

Delo.BoxView.prototype = {
    build : function(config) {
		var model = config.model;
		
        // call super constructor
        Kinetic.Rect.call(this, config.model.attributes);
		
		this.setDraggable(config.mode != 'view');
		this.setAttr('model', model);
		
        // this.shapeType = 'BoxView';
        // this._setDrawFuncs();
		
		/* set event handlers */
		model.bind('remove', this._remove, this);
		model.bind('change', this._change, this);
	//     },
	// 
	// onChangePost : function(e) {
	// 	// 모델이 변경되었을 때, 특별히 해당 뷰모델에서 추가로 할 작업을 정의한다.
	// 	return;
	// },
	// 
	// _remove : function(e) {
	// 	this.remove();
	// },
	// 
	// _change : function(e) {
	// 	this.setAttrs(e.changed);
	// 	
	// 	this.onChangePost(e);
	// 	
	// 	this.getLayer().draw();
	}
};

Kinetic.Util.extend(Delo.BoxView, Delo.PartView);
Kinetic.Util.extend(Delo.BoxView, Kinetic.Rect);

