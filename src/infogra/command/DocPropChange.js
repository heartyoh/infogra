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
