Delo.SelectionLayer = function(config) {
    this._initSelectionLayer(config);
};

Delo.SelectionLayer.prototype = {
    _initSelectionLayer : function(config) {
		config.id = 'selection_layer';
		
        // call super constructor
        Kinetic.Layer.call(this, config);
		
		/* set event handlers */
		var stage = this.getStage();
		var document = this.getAttr('document');

		document.bind('reset', this._reset, this);
		
		this._reset();
		
		// TODO stage나 model이 destroy 될 때 이벤트핸들러들을 모두 해제시켜주어야 한다.
    },
	
	_reset : function() {
		this.removeChildren();
		
		var background = new Kinetic.Rect({
			width: this.getAttr('document').width,
			height: this.getAttr('document').height,
			fill: 'white',
			stroke: 'black',
			strokeWidth: 1,
			name: 'background',
			x : 0,
			y : 0,
			draggable: true,
	        dragBoundFunc: function(pos) {
	          return {
	            x: this.getX(),
	            y: this.getY()
	          }
	        }
		});

		this.add(background);
		
		background.on('click', _.bind(function(e) {
			if(!e.shiftKey) {
				// 아무것도 선택하지 않도록 한다.
				this.getAttr('selection_manager').select();
			}
		}, this));
		
		
		function containes(r1, r2) {
			var r1x1 = Math.min(r1.x, r1.x + r1.width);
			var r2x1 = Math.min(r2.x, r2.x + r2.width);

			if(r1x1 > r2x1)
				return false;
			
			var r1x2 = Math.max(r1.x, r1.x + r1.width);
			var r2x2 = Math.max(r2.x, r2.x + r2.width);

			if(r1x2 < r2x2)
				return false;
			
			var r1y1 = Math.min(r1.y, r1.y + r1.height);
			var r2y1 = Math.min(r2.y, r2.y + r2.height);

			if(r1y1 > r2y1)
				return false;
			
			var r1y2 = Math.max(r1.y, r1.y + r1.height);
			var r2y2 = Math.max(r2.y, r2.y + r2.height);
			
			if(r1y2 < r2y2)
				return false;
				
			return true;
		}
		
		new Delo.DragTracker({
			ondragstart : function(e) {
				if(this._selectbox) {
					this._selectbox.remove();
					this._selectbox = undefined;
				}

				this._selectbox = new Kinetic.Rect({
					x : e.offsetX,
					y : e.offsetY,
					stroke : 'black',
					strokeWidth : 1,
					dashArray : [3, 3],
					name : 'selectbox',
					opacity : 0.5,
					width : 0,
					height : 0
				});
			
				this.add(this._selectbox);
			},
			
			ondragmove : function(e) {
				var bound = {}
				bound.x = this._selectbox.getX();
				bound.y = this._selectbox.getY();
				bound.width = e.offsetX - this._selectbox.getX();
				bound.height = e.offsetY - this._selectbox.getY();
			
				this._selectbox.setAttrs({
					width : bound.width,
					height : bound.height
				});

				var nodes = [];
				this.getAttr('parts_layer').getChildren().each(function(node) {
					if(containes(bound, {
						x : node.getX(),
						y : node.getY(),
						width : node.getWidth(),
						height : node.getHeight()
					})) {
						nodes.push(node);
					}
				});
				
				this.getAttr('selection_manager').select(nodes);
			},

			ondragend : function(e) {
				this._selectbox.remove();
				this._selectbox = undefined;
			
				this.draw();
			},

			self : this
		}).on(background);

		this.draw();
	}
};

Kinetic.Util.extend(Delo.SelectionLayer, Kinetic.Layer);
