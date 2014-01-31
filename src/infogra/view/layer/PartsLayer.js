Delo.PartsLayer = function(config) {
    this._initPartsLayer(config);
};

Delo.PartsLayer.prototype = {
    _initPartsLayer : function(config) {
		this.partMap = {};
		
		config.id = 'parts_layer';

        // call super constructor
        Kinetic.Layer.call(this, config);
		
		/* set event handlers */
		var document = this.getAttr('document');
		var mode = this.getAttr('mode');
		
		document.bind('add', this._add, this);
		document.bind('remove', this._remove, this);
		document.bind('reset', this._reset, this);
		
		this._reset();
		
		// TODO stage나 model이 destroy 될 때 이벤트핸들러들을 모두 해제시켜주어야 한다.
    },
	
	register: function(modelType, editpartClass) {
		this.partMap[modelType] = editpartClass;
	},
	
	findByModel : function(models) {
		if(!models) {
			return null;
		}
		
		if(!models instanceof Array) {
			models = [models];
		}

		var nodes = this.getChildren().toArray();
		var selnodes = [];

		for(var i = 0;i < models.length;i++) {
			var model = models[i];
			for(var j = 0;j < nodes.length;j++) {
				if(nodes[j].getAttr('model') === model) {
					selnodes.push(nodes[j]);
				}
			}
		}

		return selnodes;
	},

	_reset : function() {
		// 뷰를 클리어하기 전에 리소스들을 해제할 수 있는 기회를 제공해야 한다. removed 이벤트 fire
		this.removeChildren();
		this.draw();
	},
	
	_add : function(m) {
		var editPartClass = this.partMap[m.constructor.partType];

		var node = new editPartClass({
			model: m,
			mode : this.getAttr('mode')
		});
		this.add(node);
		
		this.draw();
	},

	_remove : function(m) {
		this.draw();
	}
};

Kinetic.Util.extend(Delo.PartsLayer, Kinetic.Layer);
