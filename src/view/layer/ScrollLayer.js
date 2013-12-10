Delo.ScrollLayer = function(config) {
    this._initScrollLayer(config);
};

Delo.ScrollLayer.prototype = {
    _initScrollLayer : function(config) {
		this.partMap = {};
		
		config.id = 'scroll_layer';

        // call super constructor
        Kinetic.Layer.call(this, config);
		
		/* set event handlers */
		var stage = this.getStage();
		var document = this.getAttr('document');
		
		var areas = new Kinetic.Group();
		var scrollbars = new Kinetic.Group();

		var hscrollArea = new Kinetic.Rect({
			x: 0,
			y: stage.getHeight() - 20,
			width: stage.getWidth(),
			height: 20,
			fill: 'black',
			opacity: 0.3
		});

		var hscroll = new Kinetic.Rect({
			x: 0,
			y: stage.getHeight() - 20,
			width: 140,
			height: 20,
			fill: '#9f005b',
			draggable: true,

			dragBoundFunc: function(pos) {
				var newX = pos.x;
				if (newX < 0) {
					newX = 0;
				} else if (newX > stage.getWidth() - 160) {
					newX = stage.getWidth() - 160;
				}
				return {
					x: newX,
					y: this.getAbsolutePosition().y
				}
			},
			opacity: 0.9,
			stroke: 'black',
			strokeWidth: 1
		});

		var vscrollArea = new Kinetic.Rect({
			x: stage.getWidth() - 20,
			y: 0,
			width: 20,
			height: stage.getHeight(),
			fill: 'black',
			opacity: 0.3
		});

		var vscroll = new Kinetic.Rect({
			x: stage.getWidth() - 20,
			y: 0,
			width: 20,
			height: 80,
			fill: '#9f005b',
			draggable: true,
			dragBoundFunc: function(pos) {
				var newY = pos.y;
				if (newY < 0) {
					newY = 0;
				} else if (newY > stage.getHeight() - 100) {
					newY = stage.getHeight() - 100;
				}
				return {
					x: this.getAbsolutePosition()
						.x,
					y: newY
				}
			},
			opacity: 0.9,
			stroke: 'black',
			strokeWidth: 1
		});

		scrollbars.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});

		scrollbars.on('mouseout', function() {
			document.body.style.cursor = 'default';
		});

		var updateBackgroundPos = function() {
			var x = -1 * (hscroll.getPosition().x);
			var y = -1 * (vscroll.getPosition().y);
			
			targetLayer.setOffset(-x, -y);
			targetLayer.draw();
			// container.style.backgroundPosition = x + 'px ' + y + 'px';
		};

		hscroll.on('dragmove', updateBackgroundPos);
		vscroll.on('dragmove', updateBackgroundPos);

		areas.add(hscrollArea);
		areas.add(vscrollArea);
		scrollbars.add(hscroll);
		scrollbars.add(vscroll);
		this.add(areas);
		this.add(scrollbars);
		
		// TODO stage나 model이 destroy 될 때 이벤트핸들러들을 모두 해제시켜주어야 한다.
    },
	
	_reset : function() {
		
	}
};

Kinetic.Util.extend(Delo.ScrollLayer, Kinetic.Layer);
