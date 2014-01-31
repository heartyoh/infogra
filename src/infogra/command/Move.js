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
