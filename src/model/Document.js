// TODO Document를 Collection을 사용하지 말고, Model을 사용하는 것이 좋겠다.
Delo.Document = Backbone.Collection.extend({
	model : Delo.Part,
	width : 800,
	height : 600,
	
	load : function(data) {
		var collection = {
			components : [],
			width : 1024,
			height : 768
		};
		
		try {
			if(data) {
				collection = JSON.parse(data);
			}
		} catch(e) {
			console.log(e);
			// TODO Invalid Diagram.
		}
		
		if(collection.width !== undefined) {
			this.width = collection.width;
		}
		if(collection.height !== undefined) {
			this.height = collection.height;
		}

		this.reset();
		
		collection.components.forEach(function(component) {
			this.add(new (eval(component.type))(component.attrs));
		}, this);
		
	},
	
	serialize : function() {
		return '{"width":' + this.width + ',"height":' + this.height + ',"components":[' +
		this.models.map(function(model) {
			return model.serialize();
		}).join(',') + ']}';
	}
	
});