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
