Delo.HandleLayer = function(config) {
    this._initHandleLayer(config);
};

Delo.HandleLayer.prototype = {
    _initHandleLayer : function(config) {
		config.id = 'handle_layer';

        // call super constructor
        Kinetic.Layer.call(this, config);
		
		/* set event handlers */
		var docview = this.getAttr('docview');
		var document = this.getAttr('document');
		var command_manager = this.getAttr('command_manager');
		var editmode_manager = this.getAttr('editmode_manager');
		var selection_manager = this.getAttr('selection_manager');
		var partsLayer = this.getAttr('parts_layer');
		
		docview.on('selectionchange', _.bind(this._select, this));
		document.bind('reset', this._reset, this);
		
		/* 핸들이 없는 노드에 클릭 이벤트가 발생했을 때의 동작을 정의한다. */
		partsLayer.on('click', _.bind(function(e) {
			if(editmode_manager.get().mode !== Delo.EDITMODE.SELECT) {
				return;
			}
			
			if(e.shiftKey) {
				selection_manager.toggle(e.targetNode);
			} else {
				selection_manager.select(e.targetNode);
			}
		}, this));
		
		/* 이미 존재하는 핸들에 클릭 이벤트가 발생했을 때의 동작을 정의한다. */
		this.on('click', _.bind(function(e) {
			var handle = e.targetNode.getParent();

			if(editmode_manager.get().mode !== Delo.EDITMODE.SELECT) {
				return;
			}
			
			if(e.shiftKey) {
				selection_manager.toggle(handle.target);
			} else {
				selection_manager.select(handle.target);
			}
		}, this));
		
		/*
		PartsLayer에서 Part의 드래깅이 발생한 경우에 대한 처리이다.
		1. 드래깅이 시작될 때는 해당 파트를 선택되도록 한다.
		2. 드래깅이 진행될 때는 해당 파트의 핸들들이 따라오도록 한다.
		3. 드리깅이 완료되면, 모델의 위치 정보를 수정한다.
		*/
		new Delo.DragTracker({
			ondragstart : function(e) {
			
				var model = e.targetNode.getAttr('model');
				if(!model)
					return;
			
				if(!this.findHandleByPart(e.targetNode)) {
					if(e.shiftKey) {
						selection_manager.toggle(e.targetNode);
					} else {
						selection_manager.select(e.targetNode);
					}
				}
			},
			
			ondragmove : function(e) {
				
				var part = e.targetNode;
				var model = part.getAttr('model');
				
				var dx = part.getAttr('x') - model.get('x');
				var dy = part.getAttr('y') - model.get('y');

				var sels = selection_manager.get();
				
				var delta = {
					x : dx,
					y : dy
				};
				
				for(var i = 0;i < sels.length;i++) {
					var node = sels[i];
					var handle = this.findHandleByPart(node);
					var model = sels[i].getAttr('model');
		
					if(handle) {
						var attrs = {};
				
						for(var attr in delta) {
							attrs[attr] = model.get(attr) + delta[attr];
						}

						node.setAttrs(attrs);
						handle.setAttrs(attrs);
						handle.setHandlePositions();
					}
				}
			},
			
			ondragend : function(e) {
			
				var node = e.targetNode;
				var model = e.targetNode.getAttr('model');

				if(!model)
					return;
			
				var dx = node.getAttr('x') - model.get('x');
				var dy = node.getAttr('y') - model.get('y');

				var sels = selection_manager.get();

				var changes = this.buildPropertyChangeSet(sels, {
					x : dx,
					y : dy
				});
				
				command_manager.execute(new Delo.CommandPropertyChange({
					changes : changes
				}));
			},
			
			self : this
		}).on(partsLayer);
		
		/*
		HandleLayer에서 Handle의 드래깅이 발생한 경우에 대한 처리이다.
		1. 드래깅이 시작될 때는 해당 파트를 선택되도록 한다.
		2. 드래깅이 진행될 때는 해당 파트의 핸들들이 따라오도록 한다.
		3. 드리깅이 완료되면, 모델의 위치 정보를 수정한다.
		*/
		
		new Delo.DragTracker({
			ondragmove : function(e) {
				var handle = e.targetNode.getParent();
				var model = handle.target.getAttr('model');
			
				var delta = handle.getHandleDelta(e.targetNode);
				var sels = selection_manager.get();

				for(var i = 0;i < sels.length;i++) {
					var node = sels[i];
					var handle = this.findHandleByPart(node);
		
					if(handle) {
						var attrs = {};
						
						for(var attr in delta) {
							attrs[attr] = node.getAttr(attr) + delta[attr];
						}

						node.setAttrs(attrs);
						handle.setAttrs(attrs);
						handle.setHandlePositions();
					}
				}
			},

			ondragend : function(e) {
				var handle = e.targetNode.getParent();
				var model = e.targetNode.getAttr('model');
			
				var delta = handle.getModelDelta(e.targetNode);
				var sels = selection_manager.get();
				
				command_manager.execute(new Delo.CommandPropertyChange({
					changes : this.buildPropertyChangeSet(sels, delta)
				}));
			},

			self : this
		}).on(this);

		/*
		Handle의 타겟의 변화를 감지하여 핸들을 리프레쉬하도록 한다.
		*/
		
		partsLayer.on('change', _.bind(function(e) {
			var part = e.targetNode;
			var changed = e.after;
			
			var handle = this.findHandleByPart(part);

			if(!handle) {
				return;
			}

			var attrs = {};
			
			_.each(['x', 'y', 'width', 'height', 'rotation', 'rotationDeg'], function(attr) {
				if(changed[attr] !== undefined) {
					attrs[attr] = changed[attr];
				}
			});
		
			if(_.keys(attrs).length == 0) {
				return;
			}

			handle.setAttrs(attrs);
			handle.setHandlePositions();
			this.draw();
		}, this));

		// TODO stage나 model이 destroy 될 때 이벤트핸들러들을 모두 해제시켜주어야 한다.
    },
	
	_reset : function() {
		var handles = this.getChildren().toArray();
		for(var i = 0;i < handles.length;i++) {
			handles[i].fire('removed');
			handles[i].destroy();
		}
		this.draw();
	},
	
	_select : function(e) {

		var self = this;
		
		e.removed.every(function(node) {
			self.removeHandleByPart(node);
			return true;
		});

		e.added.every(function(node) {
			self.add(new Delo.Handle({
				target : node
			}));
			return true;
		});
		
		this.draw();
	},
	
	buildPropertyChangeSet : function(sels, delta) {
	
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
	
		return changes;
	},

	findHandleByPart : function(t) {
		var handles = this.getChildren().toArray();
		for(var i = 0;i < handles.length;i++) {
			if(handles[i].getAttr('target') === t) {
				return handles[i];
			}
		}
	},
	
	removeHandleByPart : function(part) {
		var handle = this.findHandleByPart(part);
		if(handle) {
			handle.fire('removed');
			handle.destroy();
		}
	}
};

Kinetic.Util.extend(Delo.HandleLayer, Kinetic.Layer);
