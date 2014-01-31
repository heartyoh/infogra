!function(){"use strict";function a(b,c){var e=d(this,b,c);return e.extend=a,e}var b=window.Toolbox={},c=function(){},d=function(a,b,d){var e;return e=b&&b.hasOwnProperty("constructor")?b.constructor:function(){return a.apply(this,arguments)},_.extend(e,a),c.prototype=a.prototype,e.prototype=new c,b&&_.extend(e.prototype,b),d&&_.extend(e,d),e.prototype.constructor=e,e.__super__=a.prototype,e};b.Base=function(){},b.Base.extend=a}();var Delo=function(){return{}}();Delo.EDITMODE={SELECT:0,CREATE:1,PANE:2},Delo.Command=Toolbox.Base.extend({constructor:function(a){this._params=a},execute:function(){},unexecute:function(){}}),Delo.ModeManager=function(a){this.mode=a.mode,this.context=a.context,this.onmodechange=a.onmodechange},Delo.ModeManager.prototype={get:function(){return{mode:this.mode,context:this.context}},set:function(a,b){if(this.mode!=a||this.context!=b){var c=this.mode,d=this.context;this.mode=a,this.context=b,this.onmodechange&&this.onmodechange({beforeMode:c,afterMode:this.mode,beforeContext:d,afterContext:this.context})}}},Delo.CommandManager=function(){this._executed=[],this._unexecuted=[]},Delo.CommandManager.prototype={execute:function(a){a instanceof Delo.Command&&(a.execute(),this._executed.push(a),this._unexecuted=[])},undo:function(){var a=this._executed.pop();void 0!==a&&(a.unexecute(),this._unexecuted.push(a))},redo:function(){var a=this._unexecuted.pop();void 0!==a&&(a.execute(),this._executed.push(a))},undoable:function(){return this._executed.length>0},redoable:function(){return this._unexecuted.length>0},reset:function(){this._executed=[],this._unexecuted=[]}},Delo.SelectionManager=function(a){this.onselectionchange=a.onselectionchange,this.selections=[]},Delo.SelectionManager.prototype={get:function(){return _.clone(this.selections)},toggle:function(a){var b=_.clone(this.selections),c=[],d=[];this.selections.indexOf(a)>=0?(d.push(a),this.selections=_.without(this.selections,a)):(c.push(a),this.selections.push(a)),this.onselectionchange&&this.onselectionchange({added:c,removed:d,selected:this.selections,before:b})},select:function(a){var b=_.clone(this.selections);a instanceof Array||(a=a?[a]:[]),this.selections=a;var c=_.difference(this.selections,b),d=_.difference(b,this.selections);this.onselectionchange&&this.onselectionchange({added:c,removed:d,selected:this.selections,before:b})},reset:function(){this.selections=[]}},Delo.AlignManager=function(a){this.command_manager=a.command_manager},Delo.AlignManager.prototype={top:function(a){if(!(a.length<2)){for(var b=null,c=0;c<a.length;c++){var d=a[c].getBound();b=null!==b?Math.min(b,d.y):d.y}for(var e=[],c=0;c<a.length;c++){var f=a[c],g=f.getAttr("model"),d=f.getBound(),h=d.y,i=b;i!==h&&e.push({model:g,property:"y",before:h,after:i})}this.command_manager.execute(new Delo.CommandPropertyChange({changes:e}))}},bottom:function(a){if(!(a.length<2)){for(var b=null,c=0;c<a.length;c++){var d=a[c].getBound();b=null!==b?Math.max(b,d.y+d.height):d.y+d.height}for(var e=[],c=0;c<a.length;c++){var f=a[c],g=f.getAttr("model"),d=f.getBound(),h=d.y,i=d.y+(b-(d.y+d.height));i!==h&&e.push({model:g,property:"y",before:h,after:i})}this.command_manager.execute(new Delo.CommandPropertyChange({changes:e}))}},vcenter:function(a){if(!(a.length<2)){for(var b=null,c=null,d=0;d<a.length;d++){var e=a[d].getBound();null!==b?(b=Math.min(b,e.y),c=Math.max(c,e.y+e.height)):(b=e.y,c=e.y+e.height)}for(var f=b+(c-b)/2,g=[],d=0;d<a.length;d++){var h=a[d],i=h.getAttr("model"),e=h.getBound(),j=e.y,k=e.y+(f-(e.y+e.height/2));k!==j&&g.push({model:i,property:"y",before:j,after:k})}this.command_manager.execute(new Delo.CommandPropertyChange({changes:g}))}},left:function(a){if(!(a.length<2)){for(var b=null,c=0;c<a.length;c++){var d=a[c].getBound();b=null!==b?Math.min(b,d.x):d.x}for(var e=[],c=0;c<a.length;c++){var f=a[c],g=f.getAttr("model"),d=f.getBound(),h=d.x,i=b;i!==h&&e.push({model:g,property:"x",before:h,after:i})}this.command_manager.execute(new Delo.CommandPropertyChange({changes:e}))}},right:function(a){if(!(a.length<2)){for(var b=null,c=0;c<a.length;c++){var d=a[c].getBound();b=null!==b?Math.max(b,d.x+d.width):d.x+d.width}for(var e=[],c=0;c<a.length;c++){var f=a[c],g=f.getAttr("model"),d=f.getBound(),h=d.x,i=d.x+(b-(d.x+d.width));i!==h&&e.push({model:g,property:"x",before:h,after:i})}this.command_manager.execute(new Delo.CommandPropertyChange({changes:e}))}},hcenter:function(a){if(!(a.length<2)){for(var b=null,c=null,d=0;d<a.length;d++){var e=a[d].getBound();null!==b?(b=Math.min(b,e.x),c=Math.max(c,e.x+e.width)):(b=e.x,c=e.x+e.width)}for(var f=b+(c-b)/2,g=[],d=0;d<a.length;d++){var h=a[d],i=h.getAttr("model"),e=h.getBound(),j=e.x,k=e.x+(f-(e.x+e.width/2));k!==j&&g.push({model:i,property:"x",before:j,after:k})}this.command_manager.execute(new Delo.CommandPropertyChange({changes:g}))}}},Delo.ClipboardManager=function(a){this.document=a.document,this.command_manager=a.command_manager,this.selection_manager=a.selection_manager,this.reset()},Delo.ClipboardManager.prototype={cut:function(a){if(this.copiable(a)){!a instanceof Array&&(a=[a]),this.reset(-1);for(var b=[],c=0;c<a.length;c++){var d=a[c];if(d.getAttr instanceof Function){var e=d.getAttr("model");b.push(e),this._copied.push(e.clone())}}this.command_manager.execute(new Delo.CommandRemove({collection:this.document,model:b})),this.selection_manager.select()}},copy:function(a){if(this.copiable(a)){!a instanceof Array&&(a=[a]),this.reset();for(var b=0;b<a.length;b++)a[b].getAttr instanceof Function&&this._copied.push(a[b].getAttr("model").clone())}},paste:function(){if(!(this._copied.length<=0)){this._turn++;for(var a=[],b=0;b<this._copied.length;b++){var c=this._copied[b].clone();c.set("x",c.get("x")+20*this._turn),c.set("y",c.get("y")+20*this._turn),a.push(c)}return this.command_manager.execute(new Delo.CommandAdd({collection:this.document,model:a})),a}},copiable:function(a){if(!a)return!1;if(a instanceof Array){if(a.length<=0)return!1;for(var b=0;b<a.length;b++){var c=a[b];if(c.getAttr instanceof Function)return!0}}else if(a.getAttr instanceof Function)return!0;return!1},reset:function(a){this._copied=[],this._turn=void 0!==a?a:0}},Delo.Part=Backbone.Model.extend({defaults:{x:0,y:0,width:100,height:100,fill:"blue",stroke:"black",strokeWidth:3,rotationDeg:0},getPosition:function(){return{x:this.get("x"),y:this.get("y")}},getBound:function(){return this.adjustAttrs({x:this.get("x"),y:this.get("y"),width:this.get("width")||0,height:this.get("height")||0})},adjustAttrs:function(a){return a},serialize:function(){return'{"type":"'+this.constructor.partType+'","attrs":'+JSON.stringify(this)+"}"}},{partType:"Delo.Part"}),Delo.Document=Backbone.Collection.extend({model:Delo.Part,width:800,height:600,load:function(data){var collection={components:[],width:1024,height:768};try{data&&(collection=JSON.parse(data))}catch(e){console.log(e)}void 0!==collection.width&&(this.width=collection.width),void 0!==collection.height&&(this.height=collection.height),this.reset(),collection.components.forEach(function(component){this.add(new(eval(component.type))(component.attrs))},this)},serialize:function(){return'{"width":'+this.width+',"height":'+this.height+',"components":['+this.models.map(function(a){return a.serialize()}).join(",")+"]}"}}),Delo.PartView=function(){},Delo.PartView.prototype={handleset:[1,1,1,1,1,1,1,1,1,1],onChangePost:function(){},_remove:function(){this.remove()},_change:function(a){this.set(a.changed),this.getLayer().draw()},getBound:function(){return{x:this.getX(),y:this.getY(),width:this.getWidth(),height:this.getHeight()}},adjust:function(a){return a},set:function(){if(0==arguments.length)arguments.callee.call(null,{});else if(arguments.length>1&&"string"==typeof arguments[0]){var a={};a[arguments[0]]=arguments[1],arguments.callee.call(null,a)}var b=arguments[0],c=this.adjust(b),d={};for(var e in c)d[e]=this.getAttr(e);this.setAttrs(c);var f=!1,g={};for(var e in b){var h=this.getAttr(e);h!=d[e]?(g[e]=this.getAttr(e),f=!0):delete d[e]}f&&this.fire("change",{before:d,after:g},!0)}},Delo.Handle=function(a){this._initHandle(a)},Delo.Handle.prototype={_rotateImage:null,getRotateImage:function(){if(!this._rotateImage){this._rotateImage=new Image,this._rotateImage.src="assets/modeler/iconModelerAngle.png";var a=this;this._rotateImage.onload=function(){a.getLayer().draw()}}return this._rotateImage},_initHandle:function(a){this.target=a.target;var b=this.target.getBound();a.x=b.x,a.y=b.y,a.width=b.width,a.height=b.height,a.rotation=this.target.getAttr("rotation"),Kinetic.Group.call(this,a),this.shapeType="Handle",this.addHandles(),this.on("removed",this._removed)},_removed:function(){},getHandleDelta:function(a){var b=this.getChildren().toArray(),c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],i=b[6],j=b[7],k=b[8],l=b[9];switch(a){case e:return{x:e.getAttr("x"),y:e.getAttr("y"),width:-e.getAttr("x"),height:-e.getAttr("y")};case f:return{y:f.getAttr("y"),width:f.getAttr("x")-this.getAttr("width"),height:-f.getAttr("y")};case g:return{width:g.getAttr("x")-this.getAttr("width"),height:g.getAttr("y")-this.getAttr("height")};case h:return{x:h.getAttr("x"),width:-h.getAttr("x"),height:h.getAttr("y")-this.getAttr("height")};case i:return{y:i.getAttr("y"),height:-i.getAttr("y")};case j:return{height:j.getAttr("y")-this.getAttr("height")};case k:return{x:k.getAttr("x"),width:-k.getAttr("x")};case l:return{width:l.getAttr("x")-this.getAttr("width")};case d:var m=this.getAttr("width")/2,n=-16,o=d.getAttr("x"),p=d.getAttr("y"),q=Math.acos((m*o+n*p)/(Math.sqrt(m*m+n*n)*Math.sqrt(o*o+p*p)));(0==m||n/m>p/o)&&(q=-1*q);var r=((this.getAttr("rotationDeg")||0)+(q?q*(180/Math.PI):0))%360;return{rotationDeg:r-(this.getAttr("rotationDeg")||0)};case c:return{x:c.getAttr("x"),y:c.getAttr("y")}}},getModelDelta:function(){var a=this.target,b=a.getAttr("model"),c=b.getBound(),d=a.getBound();c.rotationDeg=b.get("rotationDeg")||0,d.rotationDeg=a.getAttr("rotationDeg")||0;var e={};return d=b.adjustAttrs(d),_.each(["x","y","width","height","rotationDeg"],function(a){var b=d[a]-(c[a]||0);b&&(e[a]=b)}),e},setHandlePositions:function(){var a=this.getChildren().toArray(),b=this.target.handleset[0]?a[0]:null;a[0];var c=this.target.handleset[1]?a[1]:null,d=this.target.handleset[2]?a[2]:null,e=this.target.handleset[3]?a[3]:null,f=this.target.handleset[4]?a[4]:null,g=this.target.handleset[5]?a[5]:null,h=this.target.handleset[6]?a[6]:null,i=this.target.handleset[7]?a[7]:null,j=this.target.handleset[8]?a[8]:null,k=this.target.handleset[9]?a[9]:null,l=this.getAttr("width"),m=this.getAttr("height");d&&d.setAttrs({x:0,y:0}),e&&e.setAttrs({x:l,y:0}),g&&g.setAttrs({x:0,y:m}),f&&f.setAttrs({x:l,y:m}),h&&h.setAttrs({x:l/2,y:0,width:Math.abs(l)>40?8:0,height:Math.abs(l)>40?8:0}),i&&i.setAttrs({x:l/2,y:m,width:Math.abs(l)>40?8:0,height:Math.abs(l)>40?8:0}),j&&j.setAttrs({x:0,y:m/2,width:Math.abs(m)>40?8:0,height:Math.abs(m)>40?8:0}),k&&k.setAttrs({x:l,y:m/2,width:Math.abs(m)>40?8:0,height:Math.abs(m)>40?8:0}),c&&c.setAttrs({x:l/2,y:-16}),b&&b.setAttrs({x:0,y:0,width:l,height:m})},addHandles:function(){this.add(this.target.handleset[0]?new Kinetic.Rect({stroke:"#7f7f7f",dashArray:[3,3],strokeWidth:1,draggable:!0}):new Kinetic.Rect({stroke:"#7f7f7f",fill:"white",strokeWidth:0,width:0,height:0,draggable:!1})),this.add(this.target.handleset[1]?new Kinetic.Image({image:this.getRotateImage(),offset:{x:5},draggable:!0}):new Kinetic.Ellipse({stroke:"black",fill:"white",radius:[0,0],strokeWidth:0,draggable:!1}));for(var a=2;6>a;a++)this.add(this.target.handleset[a]?new Kinetic.Ellipse({stroke:"black",fill:"white",radius:[4,4],strokeWidth:1,draggable:!0}):new Kinetic.Ellipse({stroke:"black",fill:"white",radius:[0,0],strokeWidth:1,draggable:!1}));for(var a=6;10>a;a++)this.add(this.target.handleset[a]?new Kinetic.Rect({stroke:"black",width:8,height:8,offset:{x:4,y:4},fill:"white",strokeWidth:1,draggable:!0}):new Kinetic.Rect({stroke:"black",fill:"white",strokeWidth:0,width:0,height:0,draggable:!1}));this.setHandlePositions()}},Kinetic.Util.extend(Delo.Handle,Kinetic.Group),Delo.DragTracker=Toolbox.Base.extend({constructor:function(a){this._init(a),this._onopen=_.bind(this._open,this),this._onclose=_.bind(this._close,this)},_init:function(a){this.config=a||{},this.config.self||(this.config.self=this.target),this.config.ondragstart||(this.config.ondragstart=this._ondragstart),this.config.ondragmove||(this.config.ondragmove=this._ondragmove),this.config.ondragend||(this.config.ondragend=this._ondragend),this.config.ondragstart=_.bind(this.config.ondragstart,this.config.self),this.config.ondragmove=_.bind(this.config.ondragmove,this.config.self),this.config.ondragend=_.bind(this.config.ondragend,this.config.self)},on:function(a,b){this.off(),this.target=a,b&&this._init(b),this.target.on("dragstart",this._onopen)},off:function(){this.target&&this.target.off("dragstart",this._onopen)},_ondragstart:function(){},_ondragmove:function(){},_ondragend:function(){},_open:function(a){this.target.on("dragmove",this.config.ondragmove),this.target.on("dragend",this.config.ondragend),this.target.on("dragend",this._onclose),this.config.ondragstart.call(this.config.self,a)},_close:function(){this.target.off("dragmove",this.config.ondragmove),this.target.off("dragend",this.config.ondragend),this.target.off("dragend",this._onclose)}}),Delo.Viewer=Backbone.View.extend({initialize:function(){this.stage=new Kinetic.Stage({container:this.el,width:this.collection.width,height:this.collection.height});this.partsLayer=new Delo.PartsLayer({target_stage:this.stage,document:this.collection,mode:"view"}),this.stage.add(this.partsLayer),this.register("Delo.Part",Delo.PartView),this.register("Delo.Line",Delo.LineView),this.register("Delo.Box",Delo.BoxView),this.register("Delo.Ellipse",Delo.EllipseView),this.register("Delo.Image",Delo.ImageView),this.register("Delo.Text",Delo.TextView),this.register("Barcode",BarcodeView),this.collection.bind("reset",this._reset,this)},register:function(a,b){this.partsLayer.register(a,b)},_reset:function(){this.stage.setSize(this.collection.width,this.collection.height)},toDataUrl:function(a){this.stage.toDataURL({callback:a})}}),Delo.DocumentView=Backbone.View.extend({stage:null,partsLayer:null,initialize:function(config){this.stage=new Kinetic.Stage({container:this.el,width:this.collection.width,height:this.collection.height});var self=this;this.command_manager=new Delo.CommandManager,this.editmode_manager=new Delo.ModeManager({mode:Delo.EDITMODE.SELECT,onmodechange:function(a){self.trigger("editmodechange",a)}}),this.selection_manager=new Delo.SelectionManager({onselectionchange:function(a){self.trigger("selectionchange",a)}}),this.align_manager=new Delo.AlignManager({command_manager:this.command_manager}),this.clipboard_manager=new Delo.ClipboardManager({document:this.collection,command_manager:this.command_manager,selection_manager:this.selection_manager}),this.partsLayer=new Delo.PartsLayer({document:this.collection,mode:"edit",offset:[-14,-14]}),this.stage.add(new Delo.SelectionLayer({document:this.collection,parts_layer:this.partsLayer,selection_manager:this.selection_manager})),this.stage.add(this.partsLayer),this.stage.add(new Delo.RulerLayer({target_stage:this.stage,document:this.collection,offset:[-14,-14]})),this.stage.add(new Delo.HandleLayer({docview:this,document:this.collection,command_manager:this.command_manager,editmode_manager:this.editmode_manager,selection_manager:this.selection_manager,parts_layer:this.partsLayer,offset:[-14,-14]})),this.register("Delo.Part",Delo.PartView),this.register("Delo.Line",Delo.LineView),this.register("Delo.Box",Delo.BoxView),this.register("Delo.Ellipse",Delo.EllipseView),this.register("Delo.Image",Delo.ImageView),this.register("Delo.Text",Delo.TextView),this.register("Barcode",BarcodeView),this.collection.bind("reset",this._reset,this),this.focusLayer=new Delo.FocusLayer({keydown_handler:config.keydown_handler}),this.stage.add(this.focusLayer),this.stage.on("click",_.bind(function(e){var editmode=this.editmode_manager.get();if(editmode.mode===Delo.EDITMODE.CREATE){var modelType=editmode.context,model=new(eval(modelType))({x:e.offsetX,y:e.offsetY});this.addNode(model)}},this))},movedelta:function(a){for(var b=this.selection_manager.get(),c=[],d=0;d<b.length;d++){var e=b[d],f=e.getAttr("model"),g={},h={};for(var i in a)g[i]=f.get(i),h[i]=f.get(i)+a[i];c.push({model:f,before:g,after:h})}this.command_manager.execute(new Delo.CommandPropertyChange({changes:c}))},register:function(a,b){this.partsLayer.register(a,b)},execute:function(a){this.command_manager.execute(a)},redo:function(){this.command_manager.redo()},undo:function(){this.command_manager.undo()},alignTop:function(){this.align_manager.top(this.selection_manager.get())},alignBottom:function(){this.align_manager.bottom(this.selection_manager.get())},alignVCenter:function(){this.align_manager.vcenter(this.selection_manager.get())},alignLeft:function(){this.align_manager.left(this.selection_manager.get())},alignRight:function(){this.align_manager.right(this.selection_manager.get())},alignHCenter:function(){this.align_manager.hcenter(this.selection_manager.get())},cut:function(){this.clipboard_manager.cut(this.selection_manager.get())},copy:function(){this.clipboard_manager.copy(this.selection_manager.get())},paste:function(){var a=this.clipboard_manager.paste();this.selection_manager.select(this.partsLayer.findByModel(a))},arrange_front:function(){for(var a=this.selection_manager.get(),b=0;b<a.length;b++)a[b].moveToTop();this.partsLayer.draw()},arrange_back:function(){for(var a=this.selection_manager.get(),b=0;b<a.length;b++)a[b].moveToBottom();this.partsLayer.draw()},arrange_forward:function(){for(var a=this.selection_manager.get(),b=0;b<a.length;b++)a[b].moveUp();this.partsLayer.draw()},arrange_backward:function(){for(var a=this.selection_manager.get(),b=0;b<a.length;b++)a[b].moveDown();this.partsLayer.draw()},set_size:function(a,b){this.collection.width=a,this.collection.height=b,this.stage.setSize(a,b),this.stage.draw()},set_scale:function(a){var b=this.collection.width,c=this.collection.height;this.stage.setWidth(b*a),this.stage.setHeight(c*a),this.stage.setScale({x:a,y:a}),this.stage.draw()},scale_enlarge:function(){var a=this.stage.getScale().x;this.set_scale(a+1>8?8:a+1)},scale_reduce:function(){var a=this.stage.getScale().x;this.set_scale(1>a-1?1:a-1)},addNode:function(a){this.execute(new Delo.CommandAdd({collection:this.collection,model:a})),this.selection_manager.select(this.partsLayer.findByModel(a))},setModelProperty:function(a,b,c){this.execute(new Delo.CommandPropertyChange({changes:[{model:a,property:b,before:a.get(b),after:c}]}))},setDocumentProperty:function(a,b){this.execute(new Delo.CommandDocPropertyChange({docview:this,document:this.collection,changes:[{property:a,before:document[a],after:b}]}))},getSelections:function(){return this.selection_manager.get()},_reset:function(){this.command_manager.reset(),this.clipboard_manager.reset(),this.selection_manager.reset(),this.stage.setScale(1),this.stage.setSize(this.collection.width,this.collection.height)},setEditMode:function(a,b){this.editmode_manager.set(a,b)},getFocusTarget:function(){return this.focusLayer.getFocusTarget()},toDataUrl:function(a){this.stage.toDataURL({callback:a})}}),Delo.CommandAdd=Delo.Command.extend({execute:function(){if(this._params.model instanceof Array)for(var a=0;a<this._params.model.length;a++)this._params.collection.add(this._params.model[a]);else this._params.collection.add(this._params.model)},unexecute:function(){if(this._params.model instanceof Array)for(var a=0;a<this._params.model.length;a++)this._params.collection.remove(this._params.model[a]);else this._params.collection.remove(this._params.model)}}),Delo.CommandDocPropertyChange=Delo.Command.extend({execute:function(){for(var a=this._params.changes,b=this._params.document,c=this._params.docview,d=0;d<a.length;d++){var e=a[d],f=e.property,g=e.after;switch(b[f]=g,f){case"width":case"height":c.set_size(b.width,b.height)}}},unexecute:function(){for(var a=this._params.changes,b=this._params.document,c=this._params.docview,d=0;d<a.length;d++){var e=a[d],f=e.property,g=e.before;switch(b[f]=g,f){case"width":case"height":c.set_size(b.width,b.height)}}}}),Delo.CommandMove=Delo.Command.extend({execute:function(){this._params.newx,this._params.newy;this._params.collection.add(this._params.model)},unexecute:function(){this._params.collection.remove(this._params.model)}}),Delo.CommandPropertyChange=Delo.Command.extend({execute:function(){for(var a=this._params.changes,b=0;b<a.length;b++){var c=a[b],d=c.property,e=c.after;d?c.model.set(d,e):c.model.set(e)}},unexecute:function(){for(var a=this._params.changes,b=0;b<a.length;b++){var c=a[b],d=c.property,e=c.before;d?c.model.set(d,e):c.model.set(e)}}}),Delo.CommandRemove=Delo.Command.extend({execute:function(){if(this._params.model instanceof Array)for(var a=0;a<this._params.model.length;a++)this._params.collection.remove(this._params.model[a]);else this._params.collection.remove(this._params.model)},unexecute:function(){if(this._params.model instanceof Array)for(var a=0;a<this._params.model.length;a++)this._params.collection.add(this._params.model[a]);else this._params.collection.add(this._params.model)}}),Delo.CommandResize=Delo.Command.extend({execute:function(){},unexecute:function(){}}),Barcode=Delo.Part.extend({defaults:{x:0,y:0,symbol:"code128",text:"1234567890",alttext:"1234567890",scale_h:2,scale_w:2,rotation:"N",includetext:!0,includecheckintext:!0,includecheck:!0,parsefnc:!0,segments:4,showborder:!0,version:"iata",barcolor:"#FF0000",rows:32,columns:8,height:64,width:64,backgroundcolor:"DD000011",format:"full",ccversion:"b",cccolumns:4,numeric:!0,guardwhitespace:!0}},{partType:"Barcode"}),Delo.Box=Delo.Part.extend({defaults:{x:0,y:0,width:100,height:100,stroke:"black",fill:"red",strokeWidth:3,rotationDeg:0}},{partType:"Delo.Box"}),Delo.Ellipse=Delo.Part.extend({defaults:{x:0,y:0,radius:[50,70],width:100,height:140,stroke:"black",fill:"red",strokeWidth:3,rotationDeg:0},adjustAttrs:function(a){return void 0!==a.x&&(a.x-=this.get("width")/2),void 0!==a.y&&(a.y-=this.get("height")/2),a}},{partType:"Delo.Ellipse"}),Delo.Image=Delo.Part.extend({defaults:{x:0,y:0,width:100,height:100,stroke:"black",strokeWidth:3,rotationDeg:0,url:"http://www.html5canvastutorials.com/demos/assets/yoda.jpg"}},{partType:"Delo.Image"}),Delo.Line=Delo.Part.extend({defaults:{x:0,y:0,width:100,height:100,stroke:"black",strokeWidth:10}},{partType:"Delo.Line"}),Delo.Text=Delo.Part.extend({defaults:{x:0,y:0,fontSize:30,fontFamily:"Calibri",fill:"black",stroke:"black",text:"ABCDEFG",rotationDeg:0}},{partType:"Delo.Text"}),Delo.FocusLayer=function(a){this._initFocusLayer(a)},Delo.FocusLayer.prototype={_initFocusLayer:function(a){a.id="focus_layer",Kinetic.Layer.call(this,a);var b=this.getFocusTarget();b.setAttribute("tabindex",0),b.addEventListener("click",function(){b.focus()}),a.keydown_handler&&b.addEventListener("keydown",a.keydown_handler)},getFocusTarget:function(){return this.getCanvas()._canvas}},Kinetic.Util.extend(Delo.FocusLayer,Kinetic.Layer),Delo.HandleLayer=function(a){this._initHandleLayer(a)},Delo.HandleLayer.prototype={_initHandleLayer:function(a){a.id="handle_layer",Kinetic.Layer.call(this,a);var b=this.getAttr("docview"),c=this.getAttr("document"),d=this.getAttr("command_manager"),e=this.getAttr("editmode_manager"),f=this.getAttr("selection_manager"),g=this.getAttr("parts_layer");b.on("selectionchange",_.bind(this._select,this)),c.bind("reset",this._reset,this),g.on("click",_.bind(function(a){e.get().mode===Delo.EDITMODE.SELECT&&(a.shiftKey?f.toggle(a.targetNode):f.select(a.targetNode))},this)),this.on("click",_.bind(function(a){var b=a.targetNode.getParent();e.get().mode===Delo.EDITMODE.SELECT&&(a.shiftKey?f.toggle(b.target):f.select(b.target))},this)),new Delo.DragTracker({ondragstart:function(a){var b=a.targetNode.getAttr("model");b&&(this.findHandleByPart(a.targetNode)||(a.shiftKey?f.toggle(a.targetNode):f.select(a.targetNode)))},ondragmove:function(a){for(var b=a.targetNode,c=b.getAttr("model"),d=b.getAttr("x")-c.get("x"),e=b.getAttr("y")-c.get("y"),g=f.get(),h={x:d,y:e},i=0;i<g.length;i++){var j=g[i],k=this.findHandleByPart(j),c=g[i].getAttr("model");if(k){var l={};for(var m in h)l[m]=c.get(m)+h[m];j.setAttrs(l),k.setAttrs(l),k.setHandlePositions()}}},ondragend:function(a){var b=a.targetNode,c=a.targetNode.getAttr("model");if(c){var e=b.getAttr("x")-c.get("x"),g=b.getAttr("y")-c.get("y"),h=f.get(),i=this.buildPropertyChangeSet(h,{x:e,y:g});d.execute(new Delo.CommandPropertyChange({changes:i}))}},self:this}).on(g),new Delo.DragTracker({ondragmove:function(a){for(var b=a.targetNode.getParent(),c=(b.target.getAttr("model"),b.getHandleDelta(a.targetNode)),d=f.get(),e=0;e<d.length;e++){var g=d[e],b=this.findHandleByPart(g);if(b){var h={};for(var i in c)h[i]=g.getAttr(i)+c[i];g.setAttrs(h),b.setAttrs(h),b.setHandlePositions()}}},ondragend:function(a){var b=a.targetNode.getParent(),c=(a.targetNode.getAttr("model"),b.getModelDelta(a.targetNode)),e=f.get();d.execute(new Delo.CommandPropertyChange({changes:this.buildPropertyChangeSet(e,c)}))},self:this}).on(this),g.on("change",_.bind(function(a){var b=a.targetNode,c=a.after,d=this.findHandleByPart(b);if(d){var e={};_.each(["x","y","width","height","rotation","rotationDeg"],function(a){void 0!==c[a]&&(e[a]=c[a])}),0!=_.keys(e).length&&(d.setAttrs(e),d.setHandlePositions(),this.draw())}},this))},_reset:function(){for(var a=this.getChildren().toArray(),b=0;b<a.length;b++)a[b].fire("removed"),a[b].destroy();this.draw()},_select:function(a){var b=this;a.removed.every(function(a){return b.removeHandleByPart(a),!0}),a.added.every(function(a){return b.add(new Delo.Handle({target:a})),!0}),this.draw()},buildPropertyChangeSet:function(a,b){for(var c=[],d=0;d<a.length;d++){var e=a[d],f=e.getAttr("model"),g={},h={};for(var i in b)g[i]=f.get(i),h[i]=f.get(i)+b[i];c.push({model:f,before:g,after:h})}return c},findHandleByPart:function(a){for(var b=this.getChildren().toArray(),c=0;c<b.length;c++)if(b[c].getAttr("target")===a)return b[c]},removeHandleByPart:function(a){var b=this.findHandleByPart(a);b&&(b.fire("removed"),b.destroy())}},Kinetic.Util.extend(Delo.HandleLayer,Kinetic.Layer),Delo.PartsLayer=function(a){this._initPartsLayer(a)},Delo.PartsLayer.prototype={_initPartsLayer:function(a){this.partMap={},a.id="parts_layer",Kinetic.Layer.call(this,a);{var b=this.getAttr("document");this.getAttr("mode")}b.bind("add",this._add,this),b.bind("remove",this._remove,this),b.bind("reset",this._reset,this),this._reset()},register:function(a,b){this.partMap[a]=b},findByModel:function(a){if(!a)return null;!a instanceof Array&&(a=[a]);for(var b=this.getChildren().toArray(),c=[],d=0;d<a.length;d++)for(var e=a[d],f=0;f<b.length;f++)b[f].getAttr("model")===e&&c.push(b[f]);return c},_reset:function(){this.removeChildren(),this.draw()},_add:function(a){var b=this.partMap[a.constructor.partType],c=new b({model:a,mode:this.getAttr("mode")});this.add(c),this.draw()},_remove:function(){this.draw()}},Kinetic.Util.extend(Delo.PartsLayer,Kinetic.Layer),Delo.RulerLayer=function(a){this._initRulerLayer(a)},Delo.RulerLayer.prototype={mmPixel:3.779527559,_initRulerLayer:function(a){this.partMap={},a.id="ruler_layer",Kinetic.Layer.call(this,a);var b=this.getAttr("target_stage"),c=this.getAttr("document");this.add(new Kinetic.Rect({offset:[14,14],fill:"#f3f4f6",x:0,y:0,width:b.getWidth(),height:14})),this.add(this.makeHRuler()),this.add(new Kinetic.Rect({offset:[14,14],fill:"#f3f4f6",x:0,y:0,width:14,height:b.getHeight()})),this.add(this.makeVRuler());var d=new Kinetic.Line({offset:[14,14],points:[0,0,0,15],stroke:"#ff0000",strokeWidth:2,opacity:1,draggable:!1});this.add(d);var e=new Kinetic.Line({offset:[14,14],points:[0,0,15,0],stroke:"#ff0000",strokeWidth:2,opacity:1,draggable:!1});this.add(e),new Delo.DragTracker({ondragmove:function(a){d.setPosition(a.layerX,0),e.setPosition(0,a.layerY),this.draw()},self:this}).on(b),b.on("mousemove",function(a){d.setPosition(a.layerX,0),e.setPosition(0,a.layerY),this.draw()}),c.bind("reset",this._reset,this)},_reset:function(){this.draw()},makeHRuler:function(){var a=this.mmPixel;return new Kinetic.Shape({offset:[0,14],drawFunc:function(b){var c=0,d=b.getCanvas().width-c,e=Math.ceil(d/a);b.beginPath(),b.moveTo(c,0),b.fillStyle="#848586",b.font="8px Verdana";for(var f=0;e>f;f++)f%10==0?(b.moveTo(c+f*a,0),b.lineTo(c+f*a,15),b.fillText(f/10+"",c+f*a+2,11,12)):f%5==0?(b.moveTo(c+f*a,9),b.lineTo(c+f*a,15)):(b.moveTo(c+f*a,12),b.lineTo(c+f*a,15));var g=c,h=Math.floor(g/a);b.moveTo(c,0);for(var i=1;h>i&&!(15>c-i*a);i++)i%10==0?(b.moveTo(c-i*a,0),b.lineTo(c-i*a,15),b.fillText("-"+i/10,c-i*a+2,11,12)):i%5==0?(b.moveTo(c-i*a,9),b.lineTo(c-i*a,15)):(b.moveTo(c-i*a,12),b.lineTo(c-i*a,15));b.closePath(),b.fillStrokeShape(this)},fill:"#FAF602",stroke:"#c2c3c5",strokeWidth:.5,x:0})},makeVRuler:function(){var a=this.mmPixel;return new Kinetic.Shape({offset:[14,0],drawFunc:function(b){var c=0,d=b.getCanvas().height-c,e=Math.ceil(d/a);b.beginPath(),b.moveTo(0,c),b.fillStyle="#848586",b.font="8px Verdana";for(var f=0;e>f;f++)f%10==0?(b.moveTo(0,c+f*a),b.lineTo(15,c+f*a),b.fillText(f/10+"",1,c+f*a+12,12)):f%5==0?(b.moveTo(9,c+f*a),b.lineTo(15,c+f*a)):(b.moveTo(12,c+f*a),b.lineTo(15,c+f*a));var g=c,h=Math.floor(g/a);b.moveTo(0,c);for(var i=1;h>i&&!(15>c-i*a);i++)i%10==0?(b.moveTo(0,c-i*a),b.lineTo(15,c-i*a),b.fillText("-"+i/10,1,c-i*a+12,12)):i%5==0?(b.moveTo(9,c-i*a),b.lineTo(15,c-i*a)):(b.moveTo(12,c-i*a),b.lineTo(15,c-i*a));b.closePath(),b.fillStrokeShape(this)},fill:"#FAF602",stroke:"#c2c3c5",strokeWidth:.5,x:0})}},Kinetic.Util.extend(Delo.RulerLayer,Kinetic.Layer),Delo.ScrollLayer=function(a){this._initScrollLayer(a)},Delo.ScrollLayer.prototype={_initScrollLayer:function(a){this.partMap={},a.id="scroll_layer",Kinetic.Layer.call(this,a);var b=this.getStage(),c=this.getAttr("document"),d=new Kinetic.Group,e=new Kinetic.Group,f=new Kinetic.Rect({x:0,y:b.getHeight()-20,width:b.getWidth(),height:20,fill:"black",opacity:.3}),g=new Kinetic.Rect({x:0,y:b.getHeight()-20,width:140,height:20,fill:"#9f005b",draggable:!0,dragBoundFunc:function(a){var c=a.x;return 0>c?c=0:c>b.getWidth()-160&&(c=b.getWidth()-160),{x:c,y:this.getAbsolutePosition().y}},opacity:.9,stroke:"black",strokeWidth:1}),h=new Kinetic.Rect({x:b.getWidth()-20,y:0,width:20,height:b.getHeight(),fill:"black",opacity:.3}),i=new Kinetic.Rect({x:b.getWidth()-20,y:0,width:20,height:80,fill:"#9f005b",draggable:!0,dragBoundFunc:function(a){var c=a.y;return 0>c?c=0:c>b.getHeight()-100&&(c=b.getHeight()-100),{x:this.getAbsolutePosition().x,y:c}},opacity:.9,stroke:"black",strokeWidth:1});e.on("mouseover",function(){c.body.style.cursor="pointer"}),e.on("mouseout",function(){c.body.style.cursor="default"});var j=function(){var a=-1*g.getPosition().x,b=-1*i.getPosition().y;targetLayer.setOffset(-a,-b),targetLayer.draw()};g.on("dragmove",j),i.on("dragmove",j),d.add(f),d.add(h),e.add(g),e.add(i),this.add(d),this.add(e)},_reset:function(){}},Kinetic.Util.extend(Delo.ScrollLayer,Kinetic.Layer),Delo.SelectionLayer=function(a){this._initSelectionLayer(a)},Delo.SelectionLayer.prototype={_initSelectionLayer:function(a){a.id="selection_layer",Kinetic.Layer.call(this,a);var b=(this.getStage(),this.getAttr("document"));b.bind("reset",this._reset,this),this._reset()},_reset:function(){function a(a,b){var c=Math.min(a.x,a.x+a.width),d=Math.min(b.x,b.x+b.width);if(c>d)return!1;var e=Math.max(a.x,a.x+a.width),f=Math.max(b.x,b.x+b.width);if(f>e)return!1;var g=Math.min(a.y,a.y+a.height),h=Math.min(b.y,b.y+b.height);if(g>h)return!1;var i=Math.max(a.y,a.y+a.height),j=Math.max(b.y,b.y+b.height);return j>i?!1:!0}this.removeChildren();var b=new Kinetic.Rect({width:this.getAttr("document").width,height:this.getAttr("document").height,fill:"white",stroke:"black",strokeWidth:1,name:"background",x:0,y:0,draggable:!0,dragBoundFunc:function(){return{x:this.getX(),y:this.getY()}}});this.add(b),b.on("click",_.bind(function(a){a.shiftKey||this.getAttr("selection_manager").select()
},this)),new Delo.DragTracker({ondragstart:function(a){this._selectbox&&(this._selectbox.remove(),this._selectbox=void 0),this._selectbox=new Kinetic.Rect({x:a.offsetX,y:a.offsetY,stroke:"black",strokeWidth:1,dashArray:[3,3],name:"selectbox",opacity:.5,width:0,height:0}),this.add(this._selectbox)},ondragmove:function(b){var c={};c.x=this._selectbox.getX(),c.y=this._selectbox.getY(),c.width=b.offsetX-this._selectbox.getX(),c.height=b.offsetY-this._selectbox.getY(),this._selectbox.setAttrs({width:c.width,height:c.height});var d=[];this.getAttr("parts_layer").getChildren().each(function(b){a(c,{x:b.getX(),y:b.getY(),width:b.getWidth(),height:b.getHeight()})&&d.push(b)}),this.getAttr("selection_manager").select(d)},ondragend:function(){this._selectbox.remove(),this._selectbox=void 0,this.draw()},self:this}).on(b),this.draw()}},Kinetic.Util.extend(Delo.SelectionLayer,Kinetic.Layer),BarcodeView=function(a){this.build(a)},BarcodeView.prototype={handleset:[1,0,0,0,0,0,0,0,0,0],build:function(a){var b=a.model,c={name:"image",draggable:"view"!=a.mode,x:b.get("x"),y:b.get("y")};Kinetic.Image.call(this,c),this.setAttr("model",b);var d=this;this.imageObj=new Image,this.imageObj.onload=function(){d.setImage(d.imageObj),b.set({width:d.imageObj.width,height:d.imageObj.height}),d.getLayer().draw()},this.imageObj.src=this.buildImageUrl(),b.bind("remove",this._remove,this),b.bind("change",this._change,this)},buildImageUrl:function(){var a=this.getAttr("model");return BWIPJS.imageUrl({symbol:a.get("symbol"),text:a.get("text"),alttext:a.get("alttext"),scale_h:a.get("scale_h"),scale_w:a.get("scale_w"),rotation:a.get("rotation")})},_change:function(a){var b=a.changed;b.x||b.y||(this.imageObj.src=this.buildImageUrl()),Delo.PartView.prototype._change.call(this,a)}},Kinetic.Util.extend(BarcodeView,Delo.PartView),Kinetic.Util.extend(BarcodeView,Kinetic.Image),Delo.BoxView=function(a){this.build(a)},Delo.BoxView.prototype={build:function(a){var b=a.model;Kinetic.Rect.call(this,a.model.attributes),this.setDraggable("view"!=a.mode),this.setAttr("model",b),b.bind("remove",this._remove,this),b.bind("change",this._change,this)}},Kinetic.Util.extend(Delo.BoxView,Delo.PartView),Kinetic.Util.extend(Delo.BoxView,Kinetic.Rect),Delo.EllipseView=function(a){this.build(a)},Delo.EllipseView.prototype={build:function(a){var b=a.model,c={width:b.get("width"),height:b.get("height"),fill:b.get("fill"),stroke:b.get("stroke"),strokeWidth:b.get("strokeWidth"),rotationDeg:b.get("rotationDeg"),draggable:"view"!=a.mode,x:b.get("x"),y:b.get("y"),radius:[b.get("width")/2,b.get("height")/2],offset:{x:-b.get("width")/2,y:-b.get("height")/2}};Kinetic.Ellipse.call(this,c),this.setAttr("model",b),b.bind("remove",this._remove,this),b.bind("change",this._change,this)},adjust:function(a){if(void 0!==a.x||void 0!==a.y||void 0!==a.width||void 0!==a.height){var b=void 0===a.width?this.getAttr("width"):a.width,c=void 0===a.height?this.getAttr("height"):a.height;a.radius=[Math.abs(b/2),Math.abs(c/2)],a.offset=[-b/2,-c/2]}return a}},Kinetic.Util.extend(Delo.EllipseView,Delo.PartView),Kinetic.Util.extend(Delo.EllipseView,Kinetic.Ellipse),Delo.ImageView=function(a){this.build(a)},Delo.ImageView.prototype={build:function(a){var b=a.model,c={x:b.get("x"),y:b.get("y"),width:b.get("width"),height:b.get("height"),rotationDeg:b.get("rotationDeg"),draggable:"view"!=a.mode};Kinetic.Image.call(this,c),this.setAttr("model",b);var d=this,e=new Image;e.onload=function(){d.setImage(e),d.getLayer().draw()},e.src=b.get("url"),b.bind("remove",this._remove,this),b.bind("change",this._change,this)}},Kinetic.Util.extend(Delo.ImageView,Delo.PartView),Kinetic.Util.extend(Delo.ImageView,Kinetic.Image),Delo.LineView=function(a){this.build(a)},Delo.LineView.prototype={handleset:[0,0,1,0,1,0,0,0,0,0],build:function(a){var b=a.model,c={points:[[0,0],[b.get("width"),b.get("height")]],fill:b.get("fill"),stroke:b.get("stroke"),strokeWidth:b.get("strokeWidth"),x:b.get("x"),y:b.get("y"),width:b.get("width"),height:b.get("height"),draggable:"view"!=a.mode};Kinetic.Line.call(this,c),this.setAttr("model",b),b.bind("remove",this._remove,this),b.bind("change",this._change,this)},adjust:function(a){return(void 0!==a.x||void 0!==a.y||void 0!==a.width||void 0!==a.height)&&(a.width=void 0===a.width?this.getAttr("width"):a.width,a.height=void 0===a.height?this.getAttr("height"):a.height,a.points=[[0,0],[a.width,a.height]]),a}},Kinetic.Util.extend(Delo.LineView,Delo.PartView),Kinetic.Util.extend(Delo.LineView,Kinetic.Line),Delo.TextView=function(a){this.build(a)},Delo.TextView.prototype={build:function(a){var b=a.model;Kinetic.Text.call(this,a.model.attributes),this.setDraggable("view"!=a.mode),this.setAttr("model",b),b.bind("remove",this._remove,this),b.bind("change",this._change,this)},onChangePost:function(){}},Kinetic.Util.extend(Delo.TextView,Delo.PartView),Kinetic.Util.extend(Delo.TextView,Kinetic.Text);