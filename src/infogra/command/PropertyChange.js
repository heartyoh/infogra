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
