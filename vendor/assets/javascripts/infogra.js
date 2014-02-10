/*! infogra - v0.1.4 - 2014-02-10
* https://github.com/heartyoh/infogra
* Copyright (c) 2014 Hearty, Oh.; Licensed MIT */
//refer to http://blog.usefunnel.com/2011/03/js-inheritance-with-backbone/
(function () {
    "use strict";

    var Toolbox = window.Toolbox = {};

    // `ctor` and `inherits` are from Backbone (with some modifications):
    // http://documentcloud.github.com/backbone/

    // Shared empty constructor function to aid in prototype-chain creation.
    var ctor = function () {};

    // Helper function to correctly set up the prototype chain, for subclasses.
    // Similar to `goog.inherits`, but uses a hash of prototype properties and
    // class properties to be extended.
    var inherits = function (parent, protoProps, staticProps) {
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call `super()`.
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () { return parent.apply(this, arguments); };
        }

        // Inherit class (static) properties from parent.
        _.extend(child, parent);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Add static properties to the constructor function, if supplied.
        if (staticProps) _.extend(child, staticProps);

        // Correctly set child's `prototype.constructor`.
        child.prototype.constructor = child;

        // Set a convenience property in case the parent's prototype is needed later.
        child.__super__ = parent.prototype;

        return child;
    };

    // Self-propagating extend function.
    // Create a new class that inherits from the class found in the `this` context object.
    // This function is meant to be called in the context of a constructor function.
    function extendThis(protoProps, staticProps) {
        var child = inherits(this, protoProps, staticProps);
        child.extend = extendThis;
        return child;
    }

    // A primitive base class for creating subclasses.
    // All subclasses will have the `extend` function.
    // Example:
    //     var MyClass = Toolbox.Base.extend({
    //         someProp: 'My property value',
    //         someMethod: function () { ... }
    //     });
    //     var instance = new MyClass();
    Toolbox.Base = function () {}
    Toolbox.Base.extend = extendThis;
})();

// Namespace for Delo
var Delo = (function(){
	return {};
})();
Delo.EDITMODE = {
	SELECT : 0x00,
	CREATE : 0x01,
	PANE : 0x02
}
Delo.Command = Toolbox.Base.extend({
	constructor : function(params) {
		this._params = params;
	},
	
	execute : function() {
	},
		
	unexecute : function() {
	}
});

Delo.ModeManager = function(config) {
	this.mode = config.mode;
	this.context = config.context;
	this.onmodechange = config.onmodechange;
}

Delo.ModeManager.prototype = {
	get : function() {
		return {
			mode : this.mode,
			context : this.context
		};
	},
	
	set : function(mode, context) {
		if(this.mode == mode && this.context == context)
			return;
		var oldMode = this.mode;
		var oldContext = this.context;
		this.mode = mode;
		this.context = context;
		
		if(this.onmodechange) {
			this.onmodechange({
				beforeMode : oldMode,
				afterMode : this.mode,
				beforeContext : oldContext,
				afterContext : this.context
			})
		}
	}
}

Delo.CommandManager = function() {
	this._executed = [];
	this._unexecuted = [];
}

Delo.CommandManager.prototype = {
	execute : function(cmd) {
		if(!(cmd instanceof Delo.Command))
			return;
		
	    cmd.execute();
		
	    this._executed.push(cmd);
		this._unexecuted = [];
	},
	
	undo : function() {
		var cmd = this._executed.pop();

		if(cmd !== undefined) {
			cmd.unexecute();
			this._unexecuted.push(cmd);
		}
	},
	
	redo : function() {
		var cmd = this._unexecuted.pop();

		if(cmd !== undefined) {
			cmd.execute();
			this._executed.push(cmd);
		}
	},
	
	undoable : function() {
		return this._executed.length > 0;
	},
	
	redoable : function() {
		return this._unexecuted.length > 0;
	},
	
	reset : function() {
		this._executed = [];
		this._unexecuted = [];
	}
}

Delo.SelectionManager = function(config) {
	this.onselectionchange = config.onselectionchange;
	this.selections = [];
}

Delo.SelectionManager.prototype = {
	get : function() {
		return _.clone(this.selections);
	},
	
	toggle : function(target) {
		/*
			target : 대상이 있는 경우는 Object. 없는 경우는 falsy
			toggle : 기존 선택된 것들을 기반으로 하면 true, 새로운 선택이면 false 또는 falsy
		*/
		
		// 1 단계 : 현재 선택된 리스트를 별도로 보관한다.
		var old_sels = _.clone(this.selections);

		// 2 단계 : 현재 선택된 리스트를 별도로 보관한다.
		var added = [];
		var removed = [];

		// 3 단계 : target이 현재 선택된 것인지 확인한다.
		if(this.selections.indexOf(target) >= 0) {
			removed.push(target);
			this.selections = _.without(this.selections, target);
		} else {
			added.push(target);
			this.selections.push(target);
		};
		
		if(this.onselectionchange) {
			this.onselectionchange({
				added : added,
				removed : removed,
				selected : this.selections,
				before : old_sels
			});
		}
	},

	select : function(target) {
		/*
			target : 복수개가 선택된 경우는 Array, 하나인 경우는 Object. 없는 경우는 falsy
			append : 기존 선택된 것들에 추가이면 true, 새로운 선택이면 false 또는 falsy
		*/
		
		// 1 단계 : 현재 선택된 리스트를 별도로 보관한다.
		var old_sels = _.clone(this.selections);
	
		// 2 단계 : target 타입을 Array로 통일한다.
		if(!(target instanceof Array)) {
			if(!target) {
				target = []
			} else {
				target = [target];
			}
		}
		
		// 3 단계 : 새로운 선택 리스트를 만든다.
		this.selections = target;
		
		// 4 단계 : 변화된 리스트를 찾는다.(선택리스트에서 빠진 것 찾기)
		var added = _.difference(this.selections, old_sels);
		var removed = _.difference(old_sels, this.selections);
		
		if(this.onselectionchange) {
			this.onselectionchange({
				added : added,
				removed : removed,
				selected : this.selections,
				before : old_sels
			});
		}
	},
	
	reset : function() {
		this.selections = [];
	}
}

Delo.AlignManager = function(config) {
	this.command_manager = config.command_manager;
}

Delo.AlignManager.prototype = {
	
	top : function(nodes) {

		if(nodes.length < 2) {
			return;
		}

		var top = null;
		
		for(var i = 0;i < nodes.length;i++) {
			var bound = nodes[i].getBound();
			if(top !== null) {
				top = Math.min(top, bound.y);
			} else {
				top = bound.y
			}
		}

		var changes = [];
		
		for(var i = 0;i < nodes.length;i++) {
			var node = nodes[i];
			var model = node.getAttr('model');

			var bound = node.getBound();
			var oldval = bound.y;
			var newval = top;
			
			if(newval !== oldval) {
				changes.push({
					model : model,
					property : 'y',
					before : oldval,
					after : newval
				});
			}
		}
		
		this.command_manager.execute(new Delo.CommandPropertyChange({
			changes : changes
		}));
	},
	
	bottom : function(nodes) {
		
		if(nodes.length < 2) {
			return;
		}

		var bottom = null;
		
		for(var i = 0;i < nodes.length;i++) {
			var bound = nodes[i].getBound();
			if(bottom !== null) {
				bottom = Math.max(bottom, bound.y + bound.height);
			} else {
				bottom = bound.y + bound.height
			}
		}

		var changes = [];
		
		for(var i = 0;i < nodes.length;i++) {
			var node = nodes[i];
			var model = node.getAttr('model');

			var bound = node.getBound();
			var oldval = bound.y;
			var newval = bound.y + (bottom - (bound.y + bound.height));
			
			if(newval !== oldval) {
				changes.push({
					model : model,
					property : 'y',
					before : oldval,
					after : newval
				});
			}
		}
		
		this.command_manager.execute(new Delo.CommandPropertyChange({
			changes : changes
		}));
	},
	
	vcenter : function(nodes) {
		
		if(nodes.length < 2) {
			return;
		}

		var top = null;
		var bottom = null;
		
		for(var i = 0;i < nodes.length;i++) {
			var bound = nodes[i].getBound();
			if(top !== null) {
				top = Math.min(top, bound.y); 
				bottom = Math.max(bottom, bound.y + bound.height);
			} else {
				top = bound.y;
				bottom = bound.y + bound.height
			}
		}

		var center = top + (bottom - top) / 2;
		var changes = [];
		
		for(var i = 0;i < nodes.length;i++) {
			var node = nodes[i];
			var model = node.getAttr('model');

			var bound = node.getBound();
			var oldval = bound.y;
			var newval = bound.y + (center - (bound.y + bound.height / 2));
			
			if(newval !== oldval) {
				changes.push({
					model : model,
					property : 'y',
					before : oldval,
					after : newval
				});
			}
		}
		
		this.command_manager.execute(new Delo.CommandPropertyChange({
			changes : changes
		}));
	},
	
	left : function(nodes) {

		if(nodes.length < 2) {
			return;
		}

		var left = null;
		
		for(var i = 0;i < nodes.length;i++) {
			var bound = nodes[i].getBound();
			if(left !== null) {
				left = Math.min(left, bound.x);
			} else {
				left = bound.x
			}
		}

		var changes = [];
		
		for(var i = 0;i < nodes.length;i++) {
			var node = nodes[i];
			var model = node.getAttr('model');

			var bound = node.getBound();
			var oldval = bound.x;
			var newval = left;
			
			if(newval !== oldval) {
				changes.push({
					model : model,
					property : 'x',
					before : oldval,
					after : newval
				});
			}
		}
		
		this.command_manager.execute(new Delo.CommandPropertyChange({
			changes : changes
		}));
	},

	right : function(nodes) {
		
		if(nodes.length < 2) {
			return;
		}

		var right = null;
		
		for(var i = 0;i < nodes.length;i++) {
			var bound = nodes[i].getBound();
			if(right !== null) {
				right = Math.max(right, bound.x + bound.width);
			} else {
				right = bound.x + bound.width
			}
		}

		var changes = [];
		
		for(var i = 0;i < nodes.length;i++) {
			var node = nodes[i];
			var model = node.getAttr('model');

			var bound = node.getBound();
			var oldval = bound.x;
			var newval = bound.x + (right - (bound.x + bound.width));
			
			if(newval !== oldval) {
				changes.push({
					model : model,
					property : 'x',
					before : oldval,
					after : newval
				});
			}
		}
		
		this.command_manager.execute(new Delo.CommandPropertyChange({
			changes : changes
		}));
	},
	
	hcenter : function(nodes) {
		
		if(nodes.length < 2) {
			return;
		}

		var left = null;
		var right = null;
		
		for(var i = 0;i < nodes.length;i++) {
			var bound = nodes[i].getBound();
			if(left !== null) {
				left = Math.min(left, bound.x); 
				right = Math.max(right, bound.x + bound.width);
			} else {
				left = bound.x;
				right = bound.x + bound.width
			}
		}

		var center = left + (right - left) / 2;
		var changes = [];
		
		for(var i = 0;i < nodes.length;i++) {
			var node = nodes[i];
			var model = node.getAttr('model');

			var bound = node.getBound();
			var oldval = bound.x;
			var newval = bound.x + (center - (bound.x + bound.width / 2));
			
			if(newval !== oldval) {
				changes.push({
					model : model,
					property : 'x',
					before : oldval,
					after : newval
				});
			}
		}
		
		this.command_manager.execute(new Delo.CommandPropertyChange({
			changes : changes
		}));
	}
}

Delo.ClipboardManager = function(config) {
	this.document = config.document;
	this.command_manager = config.command_manager;
	this.selection_manager = config.selection_manager;
	this.reset();
}

Delo.ClipboardManager.prototype = {
	cut : function(nodes) {
		if(!this.copiable(nodes)) {
			return;
		}
		
		if(!nodes instanceof Array) {
			nodes = [nodes];
		}

		this.reset(-1);
		var models = [];

		for(var i = 0;i < nodes.length;i++) {
			var node = nodes[i];
			if(node.getAttr instanceof Function) {
				var model = node.getAttr('model');
				models.push(model);
				this._copied.push(model.clone());
			}
		}
	
		this.command_manager.execute(new Delo.CommandRemove({
			collection : this.document,
			model : models
		}));
	
		this.selection_manager.select();
	},
	
	copy : function(nodes) {
		if(!this.copiable(nodes)) {
			return;
		}
		
		if(!nodes instanceof Array) {
			nodes = [nodes];
		}
		
		this.reset();
		for(var i = 0;i < nodes.length;i++) {
			if(nodes[i].getAttr instanceof Function) {
				this._copied.push(nodes[i].getAttr('model').clone());
			}
		}
	},
	
	paste : function(config) {
		if(this._copied.length <= 0) {
			return;
		}
		
		this._turn++;
		
		var models = [];
		for(var i = 0;i < this._copied.length;i++) {
			var model = this._copied[i].clone();
			
			model.set('x', model.get('x') + this._turn * 20);
			model.set('y', model.get('y') + this._turn * 20);
			
			models.push(model);
		}
		
		this.command_manager.execute(new Delo.CommandAdd({
			collection : this.document,
			model : models
		}));
		
		return models;
	},
	
	copiable : function(nodes) {
		if(!nodes) {
			return false;
		}
		
		if(nodes instanceof Array) {
			if(nodes.length <= 0) {
				return false;
			}
			
			/* Nodes Element 중에 하나라도 PartView이면 카피 가능 대상으로 본다. */
			for(var i = 0;i < nodes.length;i++) {
				var node = nodes[i];
				if(node.getAttr instanceof Function) {
					return true;
				}
			}
		} else {
			if(nodes.getAttr instanceof Function) {
				return true;
			}
		}
		
		return false;
	},
	
	reset : function(initturn) {
		this._copied = [];
		
		this._turn = (initturn !== undefined) ? initturn : 0;
	}
}

Delo.Part = Backbone.Model.extend({
	defaults : {
		x : 0,
		y : 0,
		width : 100,
		height : 100,
		fill : 'blue',
		stroke : 'black',
		strokeWidth : 3,
		rotationDeg : 0
	},
	
	getPosition : function() {
		return {
			x : this.get('x'),
			y : this.get('y')
		}
	},
	
	getBound : function() {
		return this.adjustAttrs({
			x : this.get('x'),
			y : this.get('y'),
			width : this.get('width') || 0,
			height : this.get('height') || 0
		});
	},
	
	adjustAttrs : function(attrs) {
		return attrs;
	},
	
	serialize : function() {
		return '{"type":"' + this.constructor.partType + '","attrs":' + JSON.stringify(this) + '}'
	}
}, {
	partType : 'Delo.Part',
});
// TODO Document를 Collection을 사용하지 말고, Model을 사용하는 것이 좋겠다.
Delo.Document = Backbone.Collection.extend({
	model : Delo.Part,
	width : 800,
	height : 600,
	
	load : function(data) {
		var collection = {
			components : [],
			width : 1024,
			height : 768
		};
		
		try {
			if(data) {
				if(typeof(data) === 'string') {
					collection = JSON.parse(data);
				} else {
					collection = data;
				}
			}
		} catch(e) {
			console.log(e);
			// TODO Invalid Diagram.
		}
		
		if(collection.width !== undefined) {
			this.width = collection.width;
		}
		if(collection.height !== undefined) {
			this.height = collection.height;
		}

		this.reset();
		
		collection.components.forEach(function(component) {
			this.add(new (eval(component.type))(component.attrs));
		}, this);
		
	},
	
	serialize : function() {
		return '{"width":' + this.width + ',"height":' + this.height + ',"components":[' +
		this.models.map(function(model) {
			return model.serialize();
		}).join(',') + ']}';
	}
	
});
Delo.PartView = function(config) {
    // this.build(config);
};

Delo.PartView.prototype = {
	handleset : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	
	onChangePost : function(e) {
		// 모델이 변경되었을 때, 특별히 해당 뷰모델에서 추가로 할 작업을 정의한다.
		return;
	},
	
	_remove : function(e) {
		this.remove();
	},
	
	_change : function(e) {
		this.set(e.changed);
		
		this.getLayer().draw();
	},
	
	getBound : function() {
		return {
			x : this.getX(),
			y : this.getY(),
			width : this.getWidth(),
			height : this.getHeight()
		}
	},
	
	adjust : function(attrs) {
		return attrs;
	},
	
	set : function() {
		if(arguments.length == 0) {
			arguments.callee.call(null, {});
		} else if(arguments.length > 1 && typeof(arguments[0]) == 'string') {
			var obj = {};
			obj[arguments[0]] = arguments[1];
			arguments.callee.call(null, obj);
		}
		
		var arg0 = arguments[0];
		var attrs = this.adjust(arg0);
		
		var before = {};
		for(var key in attrs) {
			before[key] = this.getAttr(key);
		}
		
		this.setAttrs(attrs);
		
		var changed = false;
		
		var after = {};
		
		for(var key in arg0) {
			var val = this.getAttr(key);
			if(val != before[key]) {
				after[key] = this.getAttr(key);
				changed = true;
			} else {
				delete before[key];
			}
		}

		if(changed) {
			this.fire('change', {
				before : before,
				after : after
			}, true);
		}
	}
};

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

Delo.DragTracker = Toolbox.Base.extend({
	constructor : function(config) {
		this._init(config);
		
		this._onopen = _.bind(this._open, this);
		this._onclose = _.bind(this._close, this);
	},
	
	_init : function(config) {
		this.config = config || {};
		
		if(!this.config.self) {
			this.config.self = this.target;
		}

		if(!this.config.ondragstart) {
			this.config.ondragstart = this._ondragstart;
		}
		if(!this.config.ondragmove) {
			this.config.ondragmove = this._ondragmove;
		}
		if(!this.config.ondragend) {
			this.config.ondragend = this._ondragend;
		}
		
		this.config.ondragstart = _.bind(this.config.ondragstart, this.config.self)
		this.config.ondragmove = _.bind(this.config.ondragmove, this.config.self)
		this.config.ondragend = _.bind(this.config.ondragend, this.config.self)
	},
	
	on : function(target, config) {
		this.off();
		
		this.target = target;
		
		/* 만약, 트래커를 재 사용하고 싶으면, config 옵션을 갱신한다. */
		if(config) {
			this._init(config);
		}

		this.target.on('dragstart', this._onopen);
	},
	
	off : function() {
		if(this.target) {
			this.target.off('dragstart', this._onopen);
		}
	},
	
	_ondragstart : function(e) {
		// console.log('dragstart', this.target, e);
	},
	
	_ondragmove : function(e) {
		// console.log('dragmove', this.target, e);
	},
		
	_ondragend : function(e) {
		// console.log('dragend', this.target, e);
	},
	
	_open : function(e) {
		this.target.on('dragmove', this.config.ondragmove);
		this.target.on('dragend', this.config.ondragend);
		this.target.on('dragend', this._onclose);
		
		this.config.ondragstart.call(this.config.self, e);
	},

	_close : function(e) {
		this.target.off('dragmove', this.config.ondragmove);
		this.target.off('dragend', this.config.ondragend);
		this.target.off('dragend', this._onclose);
	}
});

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

Delo.DocumentView = Backbone.View.extend({
	stage: null,

	partsLayer: null,

	initialize: function(config) {
		
		this.stage = new Kinetic.Stage({
			container: this.el,
			width: this.collection.width,
			height: this.collection.height,
		});
		
		var self = this;
		
		this.command_manager = new Delo.CommandManager();
		this.editmode_manager = new Delo.ModeManager({
			mode : Delo.EDITMODE.SELECT,
			onmodechange : function(e) {
				self.trigger('editmodechange', e);
			}
		});
		this.selection_manager = new Delo.SelectionManager({
			onselectionchange : function(e) {
				self.trigger('selectionchange', e);
			}
		});
		this.align_manager = new Delo.AlignManager({
			command_manager : this.command_manager
		});
		this.clipboard_manager = new Delo.ClipboardManager({
			document : this.collection,
			command_manager : this.command_manager,
			selection_manager : this.selection_manager
		});

		this.partsLayer = new Delo.PartsLayer({
			document : this.collection,
			mode : 'edit',
			offset : [-14, -14]
		});
		
		this.stage.add(new Delo.SelectionLayer({
			document : this.collection,
			parts_layer : this.partsLayer,
			selection_manager : this.selection_manager
		}));
		
		this.stage.add(this.partsLayer);

		this.stage.add(new Delo.RulerLayer({
			target_stage : this.stage,
			document : this.collection,
			offset : [-14, -14]
		}));
		
		this.stage.add(new Delo.HandleLayer({
			docview : this,
			document : this.collection,
			command_manager : this.command_manager,
			editmode_manager : this.editmode_manager,
			selection_manager : this.selection_manager,
			parts_layer : this.partsLayer,
			offset : [-14, -14]
		}));
		
		this.register('Delo.Part', Delo.PartView);
		this.register('Delo.Line', Delo.LineView);
		this.register('Delo.Box', Delo.BoxView);
		this.register('Delo.Ellipse', Delo.EllipseView);
		this.register('Delo.Image', Delo.ImageView);
		this.register('Delo.Text', Delo.TextView);
		this.register('Barcode', BarcodeView);

		this.collection.bind('reset', this._reset, this);

		/* FocusLayer 맨 나중에 추가되어야 한다. */
		this.focusLayer = new Delo.FocusLayer({
			keydown_handler : config.keydown_handler
		});
		this.stage.add(this.focusLayer);

		/* 모델러 특징의 이벤트 핸들러들 - 이 핸들러들이 한곳으로 모이면 좋겠는데... */
		this.stage.on('click', _.bind(function(e) {
			var editmode = this.editmode_manager.get();
			
			if(editmode.mode === Delo.EDITMODE.CREATE) {
				var modelType = editmode.context;
				var model = new (eval(modelType))({
					x : e.offsetX,
					y : e.offsetY
				});
			
				this.addNode(model);
			}
		}, this));
	},
	
	movedelta : function(delta) {
		var sels = this.selection_manager.get();
		var changes = [];
	
		for(var i = 0;i < sels.length;i++) {
			var node = sels[i];
			var model = node.getAttr('model');
	
			var before = {};
			var after = {};
	
			for(var attr in delta) {
				before[attr] = model.get(attr);
				after[attr] = model.get(attr) + delta[attr];
			}
	
			changes.push({
				model : model,
				before : before,
				after : after
			});
		}
	
		this.command_manager.execute(new Delo.CommandPropertyChange({
			changes : changes
		}));
	},

	register: function(modelType, editpartClass) {
		// 레이어에 있는 것을 옮길 방안 필요함.
		this.partsLayer.register(modelType, editpartClass);
	},
	
	execute : function(command) {
		this.command_manager.execute(command);
	},
	
	redo : function() {
		this.command_manager.redo();
	},
	
	undo : function() {
		this.command_manager.undo();
	},
	
	alignTop : function() {
		this.align_manager.top(this.selection_manager.get());
	},
	
	alignBottom : function() {
		this.align_manager.bottom(this.selection_manager.get());
	},
	
	alignVCenter : function() {
		this.align_manager.vcenter(this.selection_manager.get());
	},
	
	alignLeft : function() {
		this.align_manager.left(this.selection_manager.get());
	},
	
	alignRight : function() {
		this.align_manager.right(this.selection_manager.get());
	},
	
	alignHCenter : function() {
		this.align_manager.hcenter(this.selection_manager.get());
	},
	
	cut : function() {
		this.clipboard_manager.cut(this.selection_manager.get());
	},

	copy : function() {
		this.clipboard_manager.copy(this.selection_manager.get());
	},
	
	paste : function() {
		var models = this.clipboard_manager.paste();
		
		this.selection_manager.select(this.partsLayer.findByModel(models));
	},

	arrange_front : function() {
		var nodes = this.selection_manager.get();
		for(var i = 0;i < nodes.length;i++) {
			nodes[i].moveToTop();
		}
		
		this.partsLayer.draw();
	},
	
	arrange_back : function() {
		var nodes = this.selection_manager.get();
		for(var i = 0;i < nodes.length;i++) {
			nodes[i].moveToBottom();
		}
		
		this.partsLayer.draw();
	},
	
	arrange_forward : function() {
		var nodes = this.selection_manager.get();
		for(var i = 0;i < nodes.length;i++) {
			nodes[i].moveUp();
		}
		
		this.partsLayer.draw();
	},
	
	arrange_backward : function() {
		var nodes = this.selection_manager.get();
		for(var i = 0;i < nodes.length;i++) {
			nodes[i].moveDown();
		}
		
		this.partsLayer.draw();
	},
	
	set_size : function(width, height) {
		this.collection.width = width;
		this.collection.height = height;
		
		this.stage.setSize(width, height);
		this.stage.draw();
	},
	
	set_scale : function(scale) {
		var width = this.collection.width;
		var height = this.collection.height;
		
		this.stage.setWidth(width * scale);
		this.stage.setHeight(height * scale);
		this.stage.setScale({
			x : scale,
			y : scale
		});
		
		this.stage.draw();
	},
	
	scale_enlarge : function() {
		var scale = this.stage.getScale().x;
		
		this.set_scale((scale + 1 > 8) ? 8 : scale + 1);
	},
	
	scale_reduce : function() {
		var scale = this.stage.getScale().x;
		
		this.set_scale((scale - 1 < 1) ? 1 : scale - 1);
	},

	addNode : function(model) {
		this.execute(new Delo.CommandAdd({
			collection : this.collection,
			model : model
		}));

		/* TODO 복수개 추가 경우를 커버하라. */
		this.selection_manager.select(this.partsLayer.findByModel(model));
	},
	
	// removeNode : function(model) {
	// 	this.execute(new Delo.CommandRemove({
	// 		collection : this.collection,
	// 		model : model
	// 	}));
	// 	
	// 	this.selection_manager.select();
	// },
	// 
	// removeSelections : function() {
	// 	var sels = this.selection_manager.get();
	// 
	// 	var model = [];
	// 	for(var i = 0;i < sels.length;i++) {
	// 		model.push(sels[i].getAttr('model'));
	// 	}
	// 	
	// 	this.removeNode(model);
	// },
	
	setModelProperty : function(model, property, value) {
		this.execute(new Delo.CommandPropertyChange({
			changes : [{
				model : model,
				property : property,
				before : model.get(property),
				after : value
			}]
		}));
	},
	
	setDocumentProperty : function(property, value) {
		this.execute(new Delo.CommandDocPropertyChange({
			docview : this,
			document : this.collection,
			changes : [{
				property : property,
				before : document[property],
				after : value
			}]
		}));
	},
	
	getSelections : function() {
		return this.selection_manager.get();
	},
	
	_reset : function() {
		this.command_manager.reset();
		this.clipboard_manager.reset();
		this.selection_manager.reset();
		
		this.stage.setScale(1);
		this.stage.setSize(this.collection.width, this.collection.height);
	},
	
	setEditMode : function(mode, context) {
		this.editmode_manager.set(mode, context);
	},
	
	getFocusTarget : function() {
		return this.focusLayer.getFocusTarget();
	},
	
	toDataUrl : function(callback) {
		this.stage.toDataURL({
			callback : callback
		});
	}
});

Delo.CommandAdd = Delo.Command.extend({
	execute : function() {
		if(this._params.model instanceof Array) {
			for(var i = 0;i < this._params.model.length;i++) {
				this._params.collection.add(this._params.model[i]);
			}
		} else {
			this._params.collection.add(this._params.model);
		}
	},
	
	unexecute : function() {
		if(this._params.model instanceof Array) {
			for(var i = 0;i < this._params.model.length;i++) {
				this._params.collection.remove(this._params.model[i]);
			}
		} else {
			this._params.collection.remove(this._params.model);
		}
	}
});


Delo.CommandDocPropertyChange = Delo.Command.extend({
	execute : function() {
		var changes = this._params.changes;
		var document = this._params.document;
		var docview = this._params.docview;
		
		for(var i = 0;i < changes.length;i++) {
			var change = changes[i];
			var property = change.property;
			var after = change.after;
		
			document[property] = after;

			switch(property) {
			case 'width' :
			case 'height' :
				docview.set_size(document.width, document.height);
				break;
			}
		}
	},
		
	unexecute : function() {
		var changes = this._params.changes;
		var document = this._params.document;
		var docview = this._params.docview;

		for(var i = 0;i < changes.length;i++) {
			var change = changes[i];
			var property = change.property;
			var before = change.before;
		
			document[property] = before;

			switch(property) {
			case 'width' :
			case 'height' :
				docview.set_size(document.width, document.height);
				break;
			}
		}
	}
});

Delo.CommandMove = Delo.Command.extend({
	execute : function() {
		var x = this._params.newx;
		var y = this._params.newy;
		
		this._params.collection.add(this._params.model);
	},
		
	unexecute : function() {
		this._params.collection.remove(this._params.model);
	}
});

Delo.CommandPropertyChange = Delo.Command.extend({
	execute : function() {
		var changes = this._params.changes;
		
		for(var i = 0;i < changes.length;i++) {
			var change = changes[i];
			var property = change.property;
			var after = change.after;
		
			if(property) {
				change.model.set(property, after);
			} else {
				change.model.set(after);
			}
		}
	},
		
	unexecute : function() {
		var changes = this._params.changes;

		for(var i = 0;i < changes.length;i++) {
			var change = changes[i];
			var property = change.property;
			var before = change.before;
		
			if(property) {
				change.model.set(property, before);
			} else {
				change.model.set(before);
			}
		}
	}
});

// TODO 빼고 넣는 Index를 고려해야 한다.
Delo.CommandRemove = Delo.Command.extend({
	execute : function() {
		if(this._params.model instanceof Array) {
			for(var i = 0;i < this._params.model.length;i++) {
				this._params.collection.remove(this._params.model[i]);
			}
		} else {
			this._params.collection.remove(this._params.model);
		}
	},
		
	unexecute : function() {
		if(this._params.model instanceof Array) {
			for(var i = 0;i < this._params.model.length;i++) {
				this._params.collection.add(this._params.model[i]);
			}
		} else {
			this._params.collection.add(this._params.model);
		}
	}
});

Delo.CommandResize = Delo.Command.extend({
	execute : function() {
		// this._params.collection.add(this._params.model);
	},
		
	unexecute : function() {
		// this._params.collection.remove(this._params.model);
	}
});

Barcode = Delo.Part.extend({
	defaults : {
		x : 0,
		y : 0,
		symbol : 'code128',
		text : '1234567890',
		alttext : '1234567890',
		scale_h : 2,
		scale_w : 2,
		rotation : 'N',
		includetext : true,
		includecheckintext : true,
		includecheck : true,
		parsefnc : true,
		segments : 4,
		showborder : true,
		version : 'iata',
		barcolor : '#FF0000',
		rows : 32,
		columns : 8,
		// height : 0.5,
		height : 64,
		width : 64,
		backgroundcolor : 'DD000011',
		format : 'full',
		ccversion : 'b',
		cccolumns : 4,
		numeric : true,
		guardwhitespace : true
	}
}, {
	partType : 'Barcode'
});

Delo.Box = Delo.Part.extend({
	defaults : {
		x : 0,
		y : 0,
		width : 100,
		height : 100,
		stroke : 'black',
		fill : 'red',
		strokeWidth : 3,
		rotationDeg : 0
	}
}, {
	partType : 'Delo.Box'
});
Delo.Ellipse = Delo.Part.extend({
	defaults : {
		x : 0,
		y : 0,
		radius : [50, 70],
		width : 100,
		height : 140,
		stroke : 'black',
		fill : 'red',
		strokeWidth : 3,
		rotationDeg : 0
	},
	
	adjustAttrs : function(attrs) {
		if(attrs.x !== undefined) {
			attrs.x -= this.get('width') / 2
		}
		if(attrs.y !== undefined) {
			attrs.y -= this.get('height') / 2
		}
		
		return attrs;
	}
	
}, {
	partType : 'Delo.Ellipse'
});
Delo.Image = Delo.Part.extend({
	defaults : {
		x : 0,
		y : 0,
		width : 100,
		height : 100,
		stroke : 'black',
		strokeWidth : 3,
		rotationDeg : 0,
		url : 'http://www.html5canvastutorials.com/demos/assets/yoda.jpg'
	}
}, {
	partType : 'Delo.Image'
});
Delo.Line = Delo.Part.extend({
	defaults : {
		x : 0,
		y : 0,
		width : 100,
		height : 100,
		stroke : 'black',
		strokeWidth : 10
	}
}, {
	partType : 'Delo.Line'
});
Delo.Text = Delo.Part.extend({
	defaults : {
		x : 0,
		y : 0,
		fontSize : 30,
		fontFamily : 'Calibri',
		fill : 'black',
		stroke : 'black',
		text : 'ABCDEFG',
		rotationDeg : 0
	}
}, {
	partType : 'Delo.Text'
});

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

Delo.HandleLayer = function(config) {
    this._initHandleLayer(config);
};

Delo.HandleLayer.prototype = {
    _initHandleLayer : function(config) {
		config.id = 'handle_layer';

        // call super constructor
        Kinetic.Layer.call(this, config);
		
		/* set event handlers */
		var docview = this.getAttr('docview');
		var document = this.getAttr('document');
		var command_manager = this.getAttr('command_manager');
		var editmode_manager = this.getAttr('editmode_manager');
		var selection_manager = this.getAttr('selection_manager');
		var partsLayer = this.getAttr('parts_layer');
		
		docview.on('selectionchange', _.bind(this._select, this));
		document.bind('reset', this._reset, this);
		
		/* 핸들이 없는 노드에 클릭 이벤트가 발생했을 때의 동작을 정의한다. */
		partsLayer.on('click', _.bind(function(e) {
			if(editmode_manager.get().mode !== Delo.EDITMODE.SELECT) {
				return;
			}
			
			if(e.shiftKey) {
				selection_manager.toggle(e.targetNode);
			} else {
				selection_manager.select(e.targetNode);
			}
		}, this));
		
		/* 이미 존재하는 핸들에 클릭 이벤트가 발생했을 때의 동작을 정의한다. */
		this.on('click', _.bind(function(e) {
			var handle = e.targetNode.getParent();

			if(editmode_manager.get().mode !== Delo.EDITMODE.SELECT) {
				return;
			}
			
			if(e.shiftKey) {
				selection_manager.toggle(handle.target);
			} else {
				selection_manager.select(handle.target);
			}
		}, this));
		
		/*
		PartsLayer에서 Part의 드래깅이 발생한 경우에 대한 처리이다.
		1. 드래깅이 시작될 때는 해당 파트를 선택되도록 한다.
		2. 드래깅이 진행될 때는 해당 파트의 핸들들이 따라오도록 한다.
		3. 드리깅이 완료되면, 모델의 위치 정보를 수정한다.
		*/
		new Delo.DragTracker({
			ondragstart : function(e) {
			
				var model = e.targetNode.getAttr('model');
				if(!model)
					return;
			
				if(!this.findHandleByPart(e.targetNode)) {
					if(e.shiftKey) {
						selection_manager.toggle(e.targetNode);
					} else {
						selection_manager.select(e.targetNode);
					}
				}
			},
			
			ondragmove : function(e) {
				
				var part = e.targetNode;
				var model = part.getAttr('model');
				
				var dx = part.getAttr('x') - model.get('x');
				var dy = part.getAttr('y') - model.get('y');

				var sels = selection_manager.get();
				
				var delta = {
					x : dx,
					y : dy
				};
				
				for(var i = 0;i < sels.length;i++) {
					var node = sels[i];
					var handle = this.findHandleByPart(node);
					var model = sels[i].getAttr('model');
		
					if(handle) {
						var attrs = {};
				
						for(var attr in delta) {
							attrs[attr] = model.get(attr) + delta[attr];
						}

						node.setAttrs(attrs);
						handle.setAttrs(attrs);
						handle.setHandlePositions();
					}
				}
			},
			
			ondragend : function(e) {
			
				var node = e.targetNode;
				var model = e.targetNode.getAttr('model');

				if(!model)
					return;
			
				var dx = node.getAttr('x') - model.get('x');
				var dy = node.getAttr('y') - model.get('y');

				var sels = selection_manager.get();

				var changes = this.buildPropertyChangeSet(sels, {
					x : dx,
					y : dy
				});
				
				command_manager.execute(new Delo.CommandPropertyChange({
					changes : changes
				}));
			},
			
			self : this
		}).on(partsLayer);
		
		/*
		HandleLayer에서 Handle의 드래깅이 발생한 경우에 대한 처리이다.
		1. 드래깅이 시작될 때는 해당 파트를 선택되도록 한다.
		2. 드래깅이 진행될 때는 해당 파트의 핸들들이 따라오도록 한다.
		3. 드리깅이 완료되면, 모델의 위치 정보를 수정한다.
		*/
		
		new Delo.DragTracker({
			ondragmove : function(e) {
				var handle = e.targetNode.getParent();
				var model = handle.target.getAttr('model');
			
				var delta = handle.getHandleDelta(e.targetNode);
				var sels = selection_manager.get();

				for(var i = 0;i < sels.length;i++) {
					var node = sels[i];
					var handle = this.findHandleByPart(node);
		
					if(handle) {
						var attrs = {};
						
						for(var attr in delta) {
							attrs[attr] = node.getAttr(attr) + delta[attr];
						}

						node.setAttrs(attrs);
						handle.setAttrs(attrs);
						handle.setHandlePositions();
					}
				}
			},

			ondragend : function(e) {
				var handle = e.targetNode.getParent();
				var model = e.targetNode.getAttr('model');
			
				var delta = handle.getModelDelta(e.targetNode);
				var sels = selection_manager.get();
				
				command_manager.execute(new Delo.CommandPropertyChange({
					changes : this.buildPropertyChangeSet(sels, delta)
				}));
			},

			self : this
		}).on(this);

		/*
		Handle의 타겟의 변화를 감지하여 핸들을 리프레쉬하도록 한다.
		*/
		
		partsLayer.on('change', _.bind(function(e) {
			var part = e.targetNode;
			var changed = e.after;
			
			var handle = this.findHandleByPart(part);

			if(!handle) {
				return;
			}

			var attrs = {};
			
			_.each(['x', 'y', 'width', 'height', 'rotation', 'rotationDeg'], function(attr) {
				if(changed[attr] !== undefined) {
					attrs[attr] = changed[attr];
				}
			});
		
			if(_.keys(attrs).length == 0) {
				return;
			}

			handle.setAttrs(attrs);
			handle.setHandlePositions();
			this.draw();
		}, this));

		// TODO stage나 model이 destroy 될 때 이벤트핸들러들을 모두 해제시켜주어야 한다.
    },
	
	_reset : function() {
		var handles = this.getChildren().toArray();
		for(var i = 0;i < handles.length;i++) {
			handles[i].fire('removed');
			handles[i].destroy();
		}
		this.draw();
	},
	
	_select : function(e) {

		var self = this;
		
		e.removed.every(function(node) {
			self.removeHandleByPart(node);
			return true;
		});

		e.added.every(function(node) {
			self.add(new Delo.Handle({
				target : node
			}));
			return true;
		});
		
		this.draw();
	},
	
	buildPropertyChangeSet : function(sels, delta) {
	
		var changes = [];
	
		for(var i = 0;i < sels.length;i++) {
			var node = sels[i];
			var model = node.getAttr('model');
	
			var before = {};
			var after = {};
	
			for(var attr in delta) {
				before[attr] = model.get(attr);
				after[attr] = model.get(attr) + delta[attr];
			}
	
			changes.push({
				model : model,
				before : before,
				after : after
			});
		}
	
		return changes;
	},

	findHandleByPart : function(t) {
		var handles = this.getChildren().toArray();
		for(var i = 0;i < handles.length;i++) {
			if(handles[i].getAttr('target') === t) {
				return handles[i];
			}
		}
	},
	
	removeHandleByPart : function(part) {
		var handle = this.findHandleByPart(part);
		if(handle) {
			handle.fire('removed');
			handle.destroy();
		}
	}
};

Kinetic.Util.extend(Delo.HandleLayer, Kinetic.Layer);

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

		return BWIPJS.imageUrl({
			symbol : model.get('symbol'),
			text : model.get('text'),
			alttext : model.get('alttext'),
			scale_h : model.get('scale_h'),
			scale_w : model.get('scale_w'),
			rotation : model.get('rotation')
		});
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


Delo.EllipseView = function(config) {
    this.build(config);
};

Delo.EllipseView.prototype = {
    build : function(config) {
		var model = config.model;
		var attributes = {
			width: model.get('width'),
			height: model.get('height'),
			fill: model.get('fill'),
			stroke: model.get('stroke'),
			strokeWidth: model.get('strokeWidth'),
			rotationDeg : model.get('rotationDeg'),
			// dashArray: [6, 6],
			// name: 'ellipse',
			draggable: (config.mode != 'view'),
			x : model.get('x'),
			y : model.get('y'),
			radius : [model.get('width') / 2, model.get('height') / 2],
			offset : {
				x : -model.get('width') / 2,
				y : -model.get('height') / 2
			}
		};
		
        // call super constructor
        Kinetic.Ellipse.call(this, attributes);
		
		this.setAttr('model', model);
		
        // this.shapeType = 'BoxView';
        // this._setDrawFuncs();
		
		/* set event handlers */
		model.bind('remove', this._remove, this);
		model.bind('change', this._change, this);
    },

	adjust : function(attrs) {
		if(attrs.x !== undefined || attrs.y !== undefined || attrs.width !== undefined || attrs.height !== undefined) {
			var width = attrs.width === undefined ? this.getAttr('width') : attrs.width;
			var height = attrs.height === undefined ? this.getAttr('height') : attrs.height;
			
			attrs.radius = [Math.abs(width / 2), Math.abs(height / 2)];
			attrs.offset = [-width / 2, -height / 2];
		}
		return attrs;
	}
};

Kinetic.Util.extend(Delo.EllipseView, Delo.PartView);
Kinetic.Util.extend(Delo.EllipseView, Kinetic.Ellipse);

Delo.ImageView = function(config) {
    this.build(config);
};

Delo.ImageView.prototype = {
    build : function(config) {
		var model = config.model;
		var attributes = {
			x : model.get('x'),
			y : model.get('y'),
			width: model.get('width'),
			height: model.get('height'),
			rotationDeg : model.get('rotationDeg'),
			// name : 'image',
			draggable: (config.mode != 'view')
		};
		
        // call super constructor
        Kinetic.Image.call(this, attributes);
		
		this.setAttr('model', model);
		
		var self = this;

		var imageObj = new Image();

		imageObj.onload = function() {
			self.setImage(imageObj);
			self.getLayer().draw();
		};
				
		imageObj.src = model.get('url');
        // this.shapeType = 'BoxView';
        // this._setDrawFuncs();
		
		/* set event handlers */
		model.bind('remove', this._remove, this);
		model.bind('change', this._change, this);
	}
};

Kinetic.Util.extend(Delo.ImageView, Delo.PartView);
Kinetic.Util.extend(Delo.ImageView, Kinetic.Image);

Delo.LineView = function(config) {
    this.build(config);
};

Delo.LineView.prototype = {
	handleset : [0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
	
    build : function(config) {
		var model = config.model;
		var attributes = {
			points : [[0, 0], [model.get('width'), model.get('height')]],
			fill: model.get('fill'),
			stroke: model.get('stroke'),
			strokeWidth: model.get('strokeWidth'),
			x : model.get('x'),
			y : model.get('y'),
			width : model.get('width'),
			height : model.get('height'),
			// dashArray: [6, 6],
			// name: 'line',
			draggable: (config.mode != 'view')
		};
		
        // call super constructor
        Kinetic.Line.call(this, attributes);
		
		this.setAttr('model', model);
		
        // this.shapeType = 'BoxView';
        // this._setDrawFuncs();
		
		/* set event handlers */
		model.bind('remove', this._remove, this);
		model.bind('change', this._change, this);
    },

	adjust : function(attrs) {
		if(attrs.x !== undefined || attrs.y !== undefined || attrs.width !== undefined || attrs.height !== undefined) {
			attrs.width = attrs.width === undefined ? this.getAttr('width') : attrs.width;
			attrs.height = attrs.height === undefined ? this.getAttr('height') : attrs.height;

			attrs.points = [[0, 0], [attrs.width, attrs.height]];
		}
		return attrs;
	}
};

Kinetic.Util.extend(Delo.LineView, Delo.PartView);
Kinetic.Util.extend(Delo.LineView, Kinetic.Line);

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
