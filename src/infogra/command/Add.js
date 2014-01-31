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

