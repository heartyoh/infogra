Delo.DragTracker = Toolbox.Base.extend({
	constructor : function(config) {
		this._init(config);
		
		this._onopen = _.bind(this._open, this);
		this._onclose = _.bind(this._close, this);
	},
	
	_init : function(config) {
		this.config = config || {};
		
		if(!this.config.self) {
			this.config.self = this.target;
		}

		if(!this.config.ondragstart) {
			this.config.ondragstart = this._ondragstart;
		}
		if(!this.config.ondragmove) {
			this.config.ondragmove = this._ondragmove;
		}
		if(!this.config.ondragend) {
			this.config.ondragend = this._ondragend;
		}
		
		this.config.ondragstart = _.bind(this.config.ondragstart, this.config.self)
		this.config.ondragmove = _.bind(this.config.ondragmove, this.config.self)
		this.config.ondragend = _.bind(this.config.ondragend, this.config.self)
	},
	
	on : function(target, config) {
		this.off();
		
		this.target = target;
		
		/* 만약, 트래커를 재 사용하고 싶으면, config 옵션을 갱신한다. */
		if(config) {
			this._init(config);
		}

		this.target.on('dragstart', this._onopen);
	},
	
	off : function() {
		if(this.target) {
			this.target.off('dragstart', this._onopen);
		}
	},
	
	_ondragstart : function(e) {
		// console.log('dragstart', this.target, e);
	},
	
	_ondragmove : function(e) {
		// console.log('dragmove', this.target, e);
	},
		
	_ondragend : function(e) {
		// console.log('dragend', this.target, e);
	},
	
	_open : function(e) {
		this.target.on('dragmove', this.config.ondragmove);
		this.target.on('dragend', this.config.ondragend);
		this.target.on('dragend', this._onclose);
		
		this.config.ondragstart.call(this.config.self, e);
	},

	_close : function(e) {
		this.target.off('dragmove', this.config.ondragmove);
		this.target.off('dragend', this.config.ondragend);
		this.target.off('dragend', this._onclose);
	}
});
