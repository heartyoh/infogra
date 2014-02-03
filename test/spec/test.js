/* global describe, it */

(function () {
    'use strict';

    describe('모델러의 생성에 있어서', function() {
    	describe('Dimension과 관련해서는', function() {
    		var modeler = new Delo.DocumentView({
				el : undefined,
			    collection : new Delo.Document()
        	});

    		it('기본 폭은 800 픽셀이다.', function() {
            	modeler.collection.width.should.equal(800);
    		});
    		it('기본 높이은 600 픽셀이다.', function() {
            	modeler.collection.height.should.equal(600);
    		});
    	})
    })

    describe('Give it some context', function () {
        describe('maybe a bit more context here', function () {
            it('should run here few assertions 2', function () {
            	[1,2,3].indexOf(4).should.equal(-1);
            });
        });
    });
})();
