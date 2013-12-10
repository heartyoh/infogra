Delo.Handle = function(config) {
    this._initHandle(config);
};

Delo.Handle.prototype = {
	_rotateImage : null,
	
	getRotateImage : function() {
		if(!this._rotateImage) {
			this._rotateImage = new Image();
			/* TODO 로테이션 핸들의 이미지 리소스를 설정할 수 있도록 해야한다. 직접 그리면 제일 좋다. */
			this._rotateImage.src = 'assets/modeler/iconModelerAngle.png';

			var self = this;
			this._rotateImage.onload = function() {
				self.getLayer().draw();
			};
		}
		return this._rotateImage;
	},

    _initHandle: function(config) {
		this.target = config.target;
		var bound = this.target.getBound();

		config.x = bound.x;
		config.y = bound.y;
		config.width = bound.width;
		config.height = bound.height;
		config.rotation = this.target.getAttr('rotation');
		
        // call super constructor
        Kinetic.Group.call(this, config);
        this.shapeType = 'Handle';
		
        this.addHandles();
		
		this.on('removed', this._removed);
    },
	
	_removed : function(e) {
	},
	
	/* 현재의 노드 디멘션 정보와 이벤트가 발생한 핸들의 정보와의 차이를 계산해서 제공한다. */
	getHandleDelta : function(handle) {
		var children = this.getChildren().toArray();
		
		var bh = children[0]; // bound handle
		var rh = children[1]; // rotation handle
		var lt = children[2];
		var rt = children[3];
		var rb = children[4];
		var lb = children[5];
		var ct = children[6]; // center top
		var cb = children[7]; // center bottom
		var lc = children[8]; // left center
		var rc = children[9]; // right center
		
		switch(handle) {
		case lt :
			return {
				x : lt.getAttr('x'),
				y : lt.getAttr('y'),
				width : -lt.getAttr('x'),
				height : -lt.getAttr('y')
			}
			break;
		case rt :
			return {
				y : rt.getAttr('y'),
				width : rt.getAttr('x') - this.getAttr('width'),
				height : -rt.getAttr('y')
			}
			break;
		case rb :
			return {
				width : rb.getAttr('x') - this.getAttr('width'),
				height : rb.getAttr('y') - this.getAttr('height')
			}
			break;
		case lb :
			return {
				x : lb.getAttr('x'),
				width : -lb.getAttr('x'),
				height : lb.getAttr('y') - this.getAttr('height')
			}
			break;
		case ct : // center top
			return {
				y : ct.getAttr('y'),
				height : -ct.getAttr('y')
			}
			break;
		case cb : // center bottom
			return {
				height : cb.getAttr('y') - this.getAttr('height')
			}
			break;
		case lc : // left center
			return {
				x : lc.getAttr('x'),
				width : -lc.getAttr('x')
			}
			break;
		case rc : // right center
			return {
				width : rc.getAttr('x') - this.getAttr('width')
			}
			break;
		case rh : // rotation handle
			/* 벡터의 내적을 적용한, 두 벡터 사이의 각도 구하기 */
			var x = this.getAttr('width') / 2;
			var y = -16;
			var x2 = rh.getAttr('x');
			var y2 = rh.getAttr('y');
			
			var theta = Math.acos((x * x2 + y * y2) / (Math.sqrt(x * x + y * y) * Math.sqrt(x2 * x2 + y2 * y2)));
			if(x == 0 || (y / x) > (y2 / x2)) {
				theta = theta * -1;
			}
			
			var rtdegree = ((this.getAttr('rotationDeg') || 0) + (theta ? theta * (180 / Math.PI) : 0)) % 360;
			
			return {
				rotationDeg : rtdegree - (this.getAttr('rotationDeg') || 0)
			}
			break;
		case bh : // bound handle
			return {
				x : bh.getAttr('x'),
				y : bh.getAttr('y')
			}
		}
	},
	
	/* 현재의 노드 디멘션 정보와 이벤트가 발생한 핸들의 정보와의 차이를 계산해서 제공한다. */
	getModelDelta : function(handle) {
		var node = this.target;
		var model = node.getAttr('model');
		
		var before = model.getBound();
		var after = node.getBound();
		
		before['rotationDeg'] = model.get('rotationDeg') || 0;
		after['rotationDeg'] = node.getAttr('rotationDeg') || 0;
		
		var delta = {};
		
		after = model.adjustAttrs(after);
		
		_.each(['x', 'y', 'width', 'height', 'rotationDeg'], function(attr) {
			var diff = after[attr] - (before[attr] || 0);
			if(diff) {
				delta[attr] = diff;
			}
		});
		
		return delta;
	},
	
	setHandlePositions : function() {
		var children = this.getChildren().toArray();
		
		var bound = this.target.handleset[0] ? children[0] : null;children[0]; // bound
		var rotation = this.target.handleset[1] ? children[1] : null; // rotation handle
		var lt = this.target.handleset[2] ? children[2] : null; // left top
		var rt = this.target.handleset[3] ? children[3] : null; // right top
		var rb = this.target.handleset[4] ? children[4] : null; // right bottom
		var lb = this.target.handleset[5] ? children[5] : null; // left bottom
		var ct = this.target.handleset[6] ? children[6] : null; // center top
		var cb = this.target.handleset[7] ? children[7] : null; // center bottom
		var lc = this.target.handleset[8] ? children[8] : null; // left center
		var rc = this.target.handleset[9] ? children[9] : null; // right center
		
		var w = this.getAttr('width');
		var h = this.getAttr('height');

		if(lt) {
			lt.setAttrs({
				x : 0,
				y : 0
			});
		}
		
		if(rt) {
			rt.setAttrs({
				x : w,
				y : 0
			});
		}
		
		if(lb) {
			lb.setAttrs({
				x : 0,
				y : h
			});
		}
		
		if(rb) {
			rb.setAttrs({
				x : w,
				y : h
			});
		}
		
		if(ct) {
			ct.setAttrs({
				x : w / 2,
				y : 0,
				width : Math.abs(w) > 40 ? 8 : 0,
				height : Math.abs(w) > 40 ? 8 : 0
			});
		}

		if(cb) {
			cb.setAttrs({
				x : w / 2,
				y : h,
				width : Math.abs(w) > 40 ? 8 : 0,
				height : Math.abs(w) > 40 ? 8 : 0
			});
		}
		
		if(lc) {
			lc.setAttrs({
				x : 0,
				y : h / 2,
				width : Math.abs(h) > 40 ? 8 : 0,
				height : Math.abs(h) > 40 ? 8 : 0
			});
		}
		
		if(rc) {
			rc.setAttrs({
				x : w,
				y : h / 2,
				width : Math.abs(h) > 40 ? 8 : 0,
				height : Math.abs(h) > 40 ? 8 : 0
			});
		}
		
		if(rotation) {
			rotation.setAttrs({
				x : w / 2,
				y : -16
			});
		}

		if(bound) {
			bound.setAttrs({
				x : 0,
				y : 0,
				width : w,
				height : h
			});
		}
	},
	
    addHandles : function() {
		// 경계를 그린다.
		if(this.target.handleset[0]) {
			this.add(new Kinetic.Rect({
				stroke : '#7f7f7f',
				dashArray : [3, 3],
				strokeWidth : 1,
				draggable : true
			}));
		} else {
			this.add(new Kinetic.Rect({
				stroke : '#7f7f7f',
				fill : 'white',
				strokeWidth : 0,
				width : 0,
				height : 0,
				draggable : false
			}));
		}
		
		// 회전 핸들을 만든다.
		if(this.target.handleset[1]) {
			this.add(new Kinetic.Image({
				image : this.getRotateImage(),
				offset : {
					x : 5
				},
				draggable: true
			}));
		} else {
			this.add(new Kinetic.Ellipse({
				stroke : 'black',
				fill : 'white',
				radius : [0, 0],
				strokeWidth : 0,
				draggable : false
			}));
		}
		
		// 네 귀퉁이 핸들을 만든다.
		for(var i = 2;i < 6;i++) {
			if(this.target.handleset[i]) {
				this.add(new Kinetic.Ellipse({
					stroke : 'black',
					fill : 'white',
					radius : [4, 4],
					strokeWidth : 1,
					draggable : true
				}));
			} else {
				this.add(new Kinetic.Ellipse({
					stroke : 'black',
					fill : 'white',
					radius : [0, 0],
					strokeWidth : 1,
					draggable : false
				}));
			}
		}
		
		// 상하좌우 핸들을 만든다.
		for(var i = 6;i < 10;i++) {
			if(this.target.handleset[i]) {
				this.add(new Kinetic.Rect({
					stroke : 'black',
					width : 8,
					height : 8,
					offset : {
						x : 4,
						y : 4
					},
					fill : 'white',
					strokeWidth : 1,
					draggable : true
				}));
			} else {
				this.add(new Kinetic.Rect({
					stroke : 'black',
					fill : 'white',
					strokeWidth : 0,
					width : 0,
					height : 0,
					draggable : false
				}));
			}
		}
		
		this.setHandlePositions();
	}
};

Kinetic.Util.extend(Delo.Handle, Kinetic.Group);
