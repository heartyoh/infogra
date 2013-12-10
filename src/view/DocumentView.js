Delo.DocumentView = Backbone.View.extend({
	stage: null,

	partsLayer: null,

	initialize: function(config) {
		
		this.stage = new Kinetic.Stage({
			container: this.el,
			width: this.collection.width,
			height: this.collection.height,
		});
		
		var self = this;
		
		this.command_manager = new Delo.CommandManager();
		this.editmode_manager = new Delo.ModeManager({
			mode : Delo.EDITMODE.SELECT,
			onmodechange : function(e) {
				self.trigger('editmodechange', e);
			}
		});
		this.selection_manager = new Delo.SelectionManager({
			onselectionchange : function(e) {
				self.trigger('selectionchange', e);
			}
		});
		this.align_manager = new Delo.AlignManager({
			command_manager : this.command_manager
		});
		this.clipboard_manager = new Delo.ClipboardManager({
			document : this.collection,
			command_manager : this.command_manager,
			selection_manager : this.selection_manager
		});

		this.partsLayer = new Delo.PartsLayer({
			document : this.collection,
			mode : 'edit',
			offset : [-14, -14]
		});
		
		this.stage.add(new Delo.SelectionLayer({
			document : this.collection,
			parts_layer : this.partsLayer,
			selection_manager : this.selection_manager
		}));
		
		this.stage.add(this.partsLayer);

		this.stage.add(new Delo.RulerLayer({
			target_stage : this.stage,
			document : this.collection,
			offset : [-14, -14]
		}));
		
		this.stage.add(new Delo.HandleLayer({
			docview : this,
			document : this.collection,
			command_manager : this.command_manager,
			editmode_manager : this.editmode_manager,
			selection_manager : this.selection_manager,
			parts_layer : this.partsLayer,
			offset : [-14, -14]
		}));
		
		this.register('Delo.Part', Delo.PartView);
		this.register('Delo.Line', Delo.LineView);
		this.register('Delo.Box', Delo.BoxView);
		this.register('Delo.Ellipse', Delo.EllipseView);
		this.register('Delo.Image', Delo.ImageView);
		this.register('Delo.Text', Delo.TextView);
		this.register('Barcode', BarcodeView);

		this.collection.bind('reset', this._reset, this);

		/* FocusLayer 맨 나중에 추가되어야 한다. */
		this.focusLayer = new Delo.FocusLayer({
			keydown_handler : config.keydown_handler
		});
		this.stage.add(this.focusLayer);

		/* 모델러 특징의 이벤트 핸들러들 - 이 핸들러들이 한곳으로 모이면 좋겠는데... */
		this.stage.on('click', _.bind(function(e) {
			var editmode = this.editmode_manager.get();
			
			if(editmode.mode === Delo.EDITMODE.CREATE) {
				var modelType = editmode.context;
				var model = new (eval(modelType))({
					x : e.offsetX,
					y : e.offsetY
				});
			
				this.addNode(model);
			}
		}, this));
	},
	
	movedelta : function(delta) {
		var sels = this.selection_manager.get();
		var changes = [];
	
		for(var i = 0;i < sels.length;i++) {
			var node = sels[i];
			var model = node.getAttr('model');
	
			var before = {};
			var after = {};
	
			for(var attr in delta) {
				before[attr] = model.get(attr);
				after[attr] = model.get(attr) + delta[attr];
			}
	
			changes.push({
				model : model,
				before : before,
				after : after
			});
		}
	
		this.command_manager.execute(new Delo.CommandPropertyChange({
			changes : changes
		}));
	},

	register: function(modelType, editpartClass) {
		// 레이어에 있는 것을 옮길 방안 필요함.
		this.partsLayer.register(modelType, editpartClass);
	},
	
	execute : function(command) {
		this.command_manager.execute(command);
	},
	
	redo : function() {
		this.command_manager.redo();
	},
	
	undo : function() {
		this.command_manager.undo();
	},
	
	alignTop : function() {
		this.align_manager.top(this.selection_manager.get());
	},
	
	alignBottom : function() {
		this.align_manager.bottom(this.selection_manager.get());
	},
	
	alignVCenter : function() {
		this.align_manager.vcenter(this.selection_manager.get());
	},
	
	alignLeft : function() {
		this.align_manager.left(this.selection_manager.get());
	},
	
	alignRight : function() {
		this.align_manager.right(this.selection_manager.get());
	},
	
	alignHCenter : function() {
		this.align_manager.hcenter(this.selection_manager.get());
	},
	
	cut : function() {
		this.clipboard_manager.cut(this.selection_manager.get());
	},

	copy : function() {
		this.clipboard_manager.copy(this.selection_manager.get());
	},
	
	paste : function() {
		var models = this.clipboard_manager.paste();
		
		this.selection_manager.select(this.partsLayer.findByModel(models));
	},

	arrange_front : function() {
		var nodes = this.selection_manager.get();
		for(var i = 0;i < nodes.length;i++) {
			nodes[i].moveToTop();
		}
		
		this.partsLayer.draw();
	},
	
	arrange_back : function() {
		var nodes = this.selection_manager.get();
		for(var i = 0;i < nodes.length;i++) {
			nodes[i].moveToBottom();
		}
		
		this.partsLayer.draw();
	},
	
	arrange_forward : function() {
		var nodes = this.selection_manager.get();
		for(var i = 0;i < nodes.length;i++) {
			nodes[i].moveUp();
		}
		
		this.partsLayer.draw();
	},
	
	arrange_backward : function() {
		var nodes = this.selection_manager.get();
		for(var i = 0;i < nodes.length;i++) {
			nodes[i].moveDown();
		}
		
		this.partsLayer.draw();
	},
	
	set_size : function(width, height) {
		this.collection.width = width;
		this.collection.height = height;
		
		this.stage.setSize(width, height);
		this.stage.draw();
	},
	
	set_scale : function(scale) {
		var width = this.collection.width;
		var height = this.collection.height;
		
		this.stage.setWidth(width * scale);
		this.stage.setHeight(height * scale);
		this.stage.setScale({
			x : scale,
			y : scale
		});
		
		this.stage.draw();
	},
	
	scale_enlarge : function() {
		var scale = this.stage.getScale().x;
		
		this.set_scale((scale + 1 > 8) ? 8 : scale + 1);
	},
	
	scale_reduce : function() {
		var scale = this.stage.getScale().x;
		
		this.set_scale((scale - 1 < 1) ? 1 : scale - 1);
	},

	addNode : function(model) {
		this.execute(new Delo.CommandAdd({
			collection : this.collection,
			model : model
		}));

		/* TODO 복수개 추가 경우를 커버하라. */
		this.selection_manager.select(this.partsLayer.findByModel(model));
	},
	
	// removeNode : function(model) {
	// 	this.execute(new Delo.CommandRemove({
	// 		collection : this.collection,
	// 		model : model
	// 	}));
	// 	
	// 	this.selection_manager.select();
	// },
	// 
	// removeSelections : function() {
	// 	var sels = this.selection_manager.get();
	// 
	// 	var model = [];
	// 	for(var i = 0;i < sels.length;i++) {
	// 		model.push(sels[i].getAttr('model'));
	// 	}
	// 	
	// 	this.removeNode(model);
	// },
	
	setModelProperty : function(model, property, value) {
		this.execute(new Delo.CommandPropertyChange({
			changes : [{
				model : model,
				property : property,
				before : model.get(property),
				after : value
			}]
		}));
	},
	
	setDocumentProperty : function(property, value) {
		this.execute(new Delo.CommandDocPropertyChange({
			docview : this,
			document : this.collection,
			changes : [{
				property : property,
				before : document[property],
				after : value
			}]
		}));
	},
	
	getSelections : function() {
		return this.selection_manager.get();
	},
	
	_reset : function() {
		this.command_manager.reset();
		this.clipboard_manager.reset();
		this.selection_manager.reset();
		
		this.stage.setScale(1);
		this.stage.setSize(this.collection.width, this.collection.height);
	},
	
	setEditMode : function(mode, context) {
		this.editmode_manager.set(mode, context);
	},
	
	getFocusTarget : function() {
		return this.focusLayer.getFocusTarget();
	},
	
	toDataUrl : function(callback) {
		this.stage.toDataURL({
			callback : callback
		});
	}
});
