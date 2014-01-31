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
