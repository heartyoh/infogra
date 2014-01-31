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
