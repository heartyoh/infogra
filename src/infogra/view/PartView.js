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
