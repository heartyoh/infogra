/* global describe, it */

(function () {
    'use strict';

    describe('Delo.DocumentView', function() {
    	describe('when create', function() {
    		var modeler;

			before(function() {
				modeler = new Delo.DocumentView({
					el : undefined,
				    collection : new Delo.Document()
				});
			});

    		it('default width should be 800.', function() {
            	modeler.collection.width.should.equal(800);
    		});

    		it('default height should be 600.', function() {
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
