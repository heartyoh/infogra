Delo.SelectionManager = function(config) {
	this.onselectionchange = config.onselectionchange;
	this.selections = [];
}

Delo.SelectionManager.prototype = {
	get : function() {
		return _.clone(this.selections);
	},
	
	toggle : function(target) {
		/*
			target : 대상이 있는 경우는 Object. 없는 경우는 falsy
			toggle : 기존 선택된 것들을 기반으로 하면 true, 새로운 선택이면 false 또는 falsy
		*/
		
		// 1 단계 : 현재 선택된 리스트를 별도로 보관한다.
		var old_sels = _.clone(this.selections);

		// 2 단계 : 현재 선택된 리스트를 별도로 보관한다.
		var added = [];
		var removed = [];

		// 3 단계 : target이 현재 선택된 것인지 확인한다.
		if(this.selections.indexOf(target) >= 0) {
			removed.push(target);
			this.selections = _.without(this.selections, target);
		} else {
			added.push(target);
			this.selections.push(target);
		};
		
		if(this.onselectionchange) {
			this.onselectionchange({
				added : added,
				removed : removed,
				selected : this.selections,
				before : old_sels
			});
		}
	},

	select : function(target) {
		/*
			target : 복수개가 선택된 경우는 Array, 하나인 경우는 Object. 없는 경우는 falsy
			append : 기존 선택된 것들에 추가이면 true, 새로운 선택이면 false 또는 falsy
		*/
		
		// 1 단계 : 현재 선택된 리스트를 별도로 보관한다.
		var old_sels = _.clone(this.selections);
	
		// 2 단계 : target 타입을 Array로 통일한다.
		if(!(target instanceof Array)) {
			if(!target) {
				target = []
			} else {
				target = [target];
			}
		}
		
		// 3 단계 : 새로운 선택 리스트를 만든다.
		this.selections = target;
		
		// 4 단계 : 변화된 리스트를 찾는다.(선택리스트에서 빠진 것 찾기)
		var added = _.difference(this.selections, old_sels);
		var removed = _.difference(old_sels, this.selections);
		
		if(this.onselectionchange) {
			this.onselectionchange({
				added : added,
				removed : removed,
				selected : this.selections,
				before : old_sels
			});
		}
	},
	
	reset : function() {
		this.selections = [];
	}
}
