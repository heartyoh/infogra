/* global describe, it */

define(function (require) {
    'use strict';

    var infogra = require('infogra');

    var model = {
        "width": 800,
        "height": 600,
        "components": [{
            "type": "Delo.Text",
            "attrs": {
                "x": 21,
                "y": 21,
                "fontSize": 40,
                "fontFamily": "Arial black",
                "fill": "black",
                "stroke": "",
                "text": "esticker",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 274,
                "y": 19,
                "fontSize": 50,
                "fontFamily": "Arial ",
                "fill": "black",
                "stroke": "",
                "text": "DOX",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 471,
                "y": 17,
                "fontSize": 20,
                "fontFamily": "Arial",
                "fill": "black",
                "stroke": "",
                "text": "Piece :",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 538,
                "y": 41,
                "fontSize": 30,
                "fontFamily": "Arial",
                "fill": "black",
                "stroke": "",
                "text": "1/2",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 24,
                "y": 97,
                "fontSize": 25,
                "fontFamily": "Arial",
                "fill": "black",
                "stroke": "",
                "text": "2100 MANILA, PHILIPPINES",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 82.5,
                "y": 136,
                "fontSize": 40,
                "fontFamily": "Arial",
                "fill": "#fff",
                "stroke": "",
                "text": "DG-ND-SB-CD",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Delo.Box",
            "attrs": {
                "x": 11,
                "y": 130,
                "width": 418,
                "height": 52,
                "stroke": "",
                "fill": "#333",
                "strokeWidth": 0,
                "rotationDeg": 0
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 14,
                "y": 197,
                "fontSize": 18,
                "fontFamily": "Arial",
                "fill": "black",
                "stroke": "",
                "text": "Shipment No. : 874193123",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 14,
                "y": 221,
                "fontSize": 18,
                "fontFamily": "Arial",
                "fill": "black",
                "stroke": "",
                "text": "Sender's reference : Braun25017",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 14,
                "y": 245,
                "fontSize": 18,
                "fontFamily": "Arial",
                "fill": "black",
                "stroke": "",
                "text": "AIRWAYBILL : ",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Barcode",
            "attrs": {
                "x": 14,
                "y": 271,
                "symbol": "code39",
                "text": "1234567890",
                "alttext": "8741493123493123",
                "scale_h": 1,
                "scale_w": 2,
                "rotation": "N",
                "includetext": true,
                "includecheckintext": true,
                "includecheck": true,
                "parsefnc": true,
                "segments": 4,
                "showborder": true,
                "version": "iata",
                "barcolor": "#FF0000",
                "rows": 45,
                "columns": 15,
                "height": 111,
                "backgroundcolor": "DD000011",
                "format": "full",
                "ccversion": "b",
                "cccolumns": 7,
                "numeric": true,
                "guardwhitespace": true,
                "width": 434
            }
        }, {
            "type": "Barcode",
            "attrs": {
                "x": 17,
                "y": 398,
                "symbol": "code39",
                "text": "1234567890",
                "alttext": "ISBN 0 - 8120 - 4824 - 5",
                "scale_h": 1,
                "scale_w": 3,
                "rotation": "N",
                "includetext": true,
                "includecheckintext": true,
                "includecheck": true,
                "parsefnc": true,
                "segments": 2,
                "showborder": true,
                "version": "iata",
                "barcolor": "#FF0000",
                "rows": 25,
                "columns": 8,
                "height": 1.5,
                "backgroundcolor": "DD000011",
                "format": "full",
                "ccversion": "b",
                "cccolumns": 3,
                "numeric": true,
                "guardwhitespace": true,
                "width": 64
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 530,
                "y": 208,
                "fontSize": 18,
                "fontFamily": "Arial",
                "fill": "black",
                "stroke": "",
                "text": "ORIGIN : BRU",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Delo.Line",
            "attrs": {
                "x": 9,
                "y": 80,
                "width": 647,
                "height": -1,
                "stroke": "black",
                "strokeWidth": 3
            }
        }, {
            "type": "Delo.Line",
            "attrs": {
                "x": 11,
                "y": 380,
                "width": 647,
                "height": -1,
                "stroke": "black",
                "strokeWidth": 3
            }
        }, {
            "type": "Delo.Line",
            "attrs": {
                "x": 236,
                "y": 17,
                "width": 0,
                "height": 62,
                "stroke": "black",
                "strokeWidth": 2
            }
        }, {
            "type": "Delo.Line",
            "attrs": {
                "x": 456,
                "y": 17,
                "width": 0,
                "height": 62,
                "stroke": "black",
                "strokeWidth": 2
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 613,
                "y": 225,
                "fontSize": 45,
                "fontFamily": "Arial black",
                "fill": "black",
                "stroke": "",
                "text": "A",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 530,
                "y": 279,
                "fontSize": 18,
                "fontFamily": "Arial",
                "fill": "black",
                "stroke": "",
                "text": "SORT : AA135",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 508,
                "y": 301,
                "fontSize": 18,
                "fontFamily": "Arial",
                "fill": "black",
                "stroke": "",
                "text": "Lot Code : PA370",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 531,
                "y": 324,
                "fontSize": 18,
                "fontFamily": "Arial",
                "fill": "black",
                "stroke": "",
                "text": "Net Wt : 9.5 kg",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Delo.Image",
            "attrs": {
                "x": 530,
                "y": 97,
                "width": 123,
                "height": 51,
                "stroke": "black",
                "strokeWidth": 3,
                "rotationDeg": 0,
                "url": "/uploads/attachment/path/1/site_brand.png"
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 535,
                "y": 148,
                "fontSize": 28,
                "fontFamily": "Arial",
                "fill": "#003366",
                "stroke": "",
                "text": "Vzion",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }, {
            "type": "Delo.Text",
            "attrs": {
                "x": 607,
                "y": 148,
                "fontSize": 28,
                "fontFamily": "Arial",
                "fill": "#333",
                "stroke": "",
                "text": "sys",
                "rotationDeg": 0,
                "width": "auto",
                "height": "auto"
            }
        }]
    };

    describe('Delo.Viewer', function() {
        describe('when load a model', function() {
            var viewer;

            beforeEach(function() {
                viewer = new infogra.Viewer({
                    el : $('#diagram'),
                    collection : new Delo.Document()
                });

                viewer.collection.load(model);
            });

            it('diagram width should be 800.', function() {
                viewer.collection.width.should.equal(800);
            });

            it('diagram height should be 600.', function() {
                viewer.collection.height.should.equal(600);
            });

            it('diagram has 24 components.', function() {
                viewer.collection.toArray().length.should.equal(24);
            })
        })
    })
});

