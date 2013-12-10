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
