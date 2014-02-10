/* global describe, it */

define(function (require) {
    'use strict';

    var infogra = require('infogra');

    describe('Delo.DocumentView', function () {
        describe('when create a document view', function () {
            var modeler;

            beforeEach(function() {
                modeler = new infogra.DocumentView({
                    el : document.getElementById('modeler'),
                    collection : new Delo.Document()
                });
            });

            it('default width should be 800.', function() {
                modeler.collection.width.should.equal(800);
            });

            it('default height should be 600.', function() {
                modeler.collection.height.should.equal(600);
            });
        });
    });
});
