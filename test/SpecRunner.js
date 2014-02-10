require.config({
  baseUrl: '..',
  paths: {
    'mocha'         : 'test/bower_components/mocha/mocha',
    'chai'          : 'test/bower_components/chai/chai',
    'underscore'    : 'bower_components/underscore/underscore-min',
    'jquery'        : 'bower_components/jquery/jquery.min',
    'bwip'          : 'bower_components/bwip/dist/bwip-min',
    'backbone'      : 'bower_components/backbone/backbone',
    'KineticJS'     : 'bower_components/KineticJS/kinetic.min',
    'infogra'       : 'dist/infogra'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    jquery: {
      exports: '$'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    KineticJS: {
      exports: 'Kinetic'
    },
    bwip: {
      exports: 'BWIP'
    },
    infogra: {
      deps: ['KineticJS', 'backbone', 'bwip'],
      exports: 'Delo'
    },
    mocha: {
      exports: 'mocha'
    }
  },
  urlArgs: 'bust=' + (new Date()).getTime()
});
 
require(['require', 'chai', 'mocha'], function(require, chai){
 
  var assert = chai.assert;
  var expect = chai.expect;
  var should = chai.should();

  mocha.setup('bdd');
 
  require([
    'spec/test-create.js',
    'spec/test-load.js'
  ], function(require) {
    mocha.run();
  });
 
});