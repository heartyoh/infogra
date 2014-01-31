Delo.FocusLayer = function(config) {
    this._initFocusLayer(config);
};

Delo.FocusLayer.prototype = {
    _initFocusLayer : function(config) {
		config.id = 'focus_layer';

        // call super constructor
        Kinetic.Layer.call(this, config);
		
		var target = this.getFocusTarget(); /* 문서화되지 않은 접근 */
		target.setAttribute('tabindex', 0);
		target.addEventListener("click", function(e) {
			target.focus();
		});
		
		if(config.keydown_handler) {
			target.addEventListener('keydown', config.keydown_handler);
		}
		
		// TODO stage나 model이 destroy 될 때 이벤트핸들러들을 모두 해제시켜주어야 한다.
	},
	
	getFocusTarget : function() {
		return this.getCanvas()._canvas;
	}
};

Kinetic.Util.extend(Delo.FocusLayer, Kinetic.Layer);
