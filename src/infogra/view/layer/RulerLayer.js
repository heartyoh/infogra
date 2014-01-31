Delo.RulerLayer = function(config) {
    this._initRulerLayer(config);
};

Delo.RulerLayer.prototype = {
	mmPixel: 3.779527559,

    _initRulerLayer : function(config) {
		this.partMap = {};
		
		config.id = 'ruler_layer';

        // call super constructor
        Kinetic.Layer.call(this, config);
		
		/* set event handlers */
		var stage = this.getAttr('target_stage');
		var document = this.getAttr('document');
		
		this.add(new Kinetic.Rect({
			offset : [14, 14],
			fill : '#f3f4f6',
			x : 0,
			y : 0,
			width : stage.getWidth(),
			height : 14
		}));

		this.add(this.makeHRuler());

		this.add(new Kinetic.Rect({
			offset : [14, 14],
			fill : '#f3f4f6',
			x : 0,
			y : 0,
			width : 14,
			height : stage.getHeight()
		}));

		this.add(this.makeVRuler());

		var hpoint = new Kinetic.Line({
			offset : [14, 14],
			points: [0, 0, 0, 15],
			stroke: '#ff0000',
			strokeWidth: 2,
			opacity: 1,
			draggable: false
		});
		this.add(hpoint);

		var vpoint = new Kinetic.Line({
			offset : [14, 14],
			points: [0, 0, 15, 0],
			stroke: '#ff0000',
			strokeWidth: 2,
			opacity: 1,
			draggable: false
		});
		this.add(vpoint);
		
		new Delo.DragTracker({
			ondragmove : function(evt) {
				hpoint.setPosition(evt.layerX, 0);
				vpoint.setPosition(0, evt.layerY);

				this.draw();
			},
			self : this
		}).on(stage);
		
		stage.on('mousemove', function(evt) {
			hpoint.setPosition(evt.layerX, 0);
			vpoint.setPosition(0, evt.layerY);

			this.draw();
		});
		
		document.bind('reset', this._reset, this);

		// TODO stage나 model이 destroy 될 때 이벤트핸들러들을 모두 해제시켜주어야 한다.
    },
	
	_reset : function() {
		this.draw();
	},
	
	makeHRuler: function() {
		var mmPixel = this.mmPixel;

		return new Kinetic.Shape({
			offset : [0, 14],
			drawFunc: function(context) {
				var startX = 0;
				var plusWidth = context.getCanvas().width - startX;
				var plusCount = Math.ceil(plusWidth / mmPixel);

				context.beginPath();
				context.moveTo(startX, 0);

				context.fillStyle = '#848586';
				context.font = '8px Verdana';

				for (var i = 0; i < plusCount; i++) {
					if (i % 10 == 0) {
						context.moveTo(startX + i * mmPixel, 0);
						context.lineTo(startX + i * mmPixel, 15);
						context.fillText(i / 10 + '', startX + i * mmPixel + 2, 11, 12);
					} else if (i % 5 == 0) {
						context.moveTo(startX + i * mmPixel, 9);
						context.lineTo(startX + i * mmPixel, 15);
					} else {
						context.moveTo(startX + i * mmPixel, 12);
						context.lineTo(startX + i * mmPixel, 15);
					}
				}
				var minusWidth = startX;
				var minusCount = Math.floor(minusWidth / mmPixel);
				context.moveTo(startX, 0);
				for (var j = 1; j < minusCount; j++) {
					if (startX - j * mmPixel < 15) {
						break;
					}
					if (j % 10 == 0) {
						context.moveTo(startX - j * mmPixel, 0);
						context.lineTo(startX - j * mmPixel, 15);
						context.fillText('-' + j / 10, startX - j * mmPixel + 2, 11, 12);
					} else if (j % 5 == 0) {
						context.moveTo(startX - j * mmPixel, 9);
						context.lineTo(startX - j * mmPixel, 15);
					} else {
						context.moveTo(startX - j * mmPixel, 12);
						context.lineTo(startX - j * mmPixel, 15);
					}
				}
				context.closePath();
				context.fillStrokeShape(this);
			},
			fill: '#FAF602',
			stroke: '#c2c3c5',
			strokeWidth: 0.5,
			x: 0
		});
	},

	makeVRuler: function() {
		var mmPixel = this.mmPixel;

		return new Kinetic.Shape({
			offset : [14, 0],
			drawFunc: function(context) {
				var startY = 0;
				var plusHeight = context.getCanvas().height - startY;
				var plusCount = Math.ceil(plusHeight / mmPixel);

				context.beginPath();
				context.moveTo(0, startY);

				context.fillStyle = '#848586';
				context.font = '8px Verdana';

				for (var i = 0; i < plusCount; i++) {
					if (i % 10 == 0) {
						context.moveTo(0, startY + i * mmPixel);
						context.lineTo(15, startY + i * mmPixel);
						context.fillText(i / 10 + '', 1, startY + i * mmPixel + 12, 12)
					} else if (i % 5 == 0) {
						context.moveTo(9, startY + i * mmPixel);
						context.lineTo(15, startY + i * mmPixel);
					} else {
						context.moveTo(12, startY + i * mmPixel);
						context.lineTo(15, startY + i * mmPixel);
					}
				}
				var minusHeight = startY;
				var minusCount = Math.floor(minusHeight / mmPixel);
				context.moveTo(0, startY);
				for (var j = 1; j < minusCount; j++) {
					if (startY - j * mmPixel < 15) {
						break;
					}
					if (j % 10 == 0) {
						context.moveTo(0, startY - j * mmPixel);
						context.lineTo(15, startY - j * mmPixel);
						context.fillText('-' + j / 10, 1, startY - j * mmPixel + 12, 12);
					} else if (j % 5 == 0) {
						context.moveTo(9, startY - j * mmPixel);
						context.lineTo(15, startY - j * mmPixel);
					} else {
						context.moveTo(12, startY - j * mmPixel);
						context.lineTo(15, startY - j * mmPixel);
					}
				}
				context.closePath();
				context.fillStrokeShape(this);
			},
			fill: '#FAF602',
			stroke: '#c2c3c5',
			strokeWidth: 0.5,
			x: 0
		});
		return shape;
	}
};

Kinetic.Util.extend(Delo.RulerLayer, Kinetic.Layer);

