/* global describe, it */

(function () {
    'use strict';

    describe('Give it some context', function () {
        describe('maybe a bit more context here', function () {
            it('should run here few assertions', function () {
            	Delo.DocumentView.should.equal(undefined);
            });
            it('should run here few assertions 2', function () {
            	[1,2,3].indexOf(4).should.equal(-1);
            });
        });
    });
})();
