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
