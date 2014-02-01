'use strict';

module.exports = function (grunt) {
  var sourceFiles = [
    'toolbox.js',
    'module.js',
    'Constant.js',
    'Command.js',
    'ModeManager.js',
    'CommandManager.js',
    'SelectionManager.js',
    'AlignManager.js',
    'ClipboardManager.js',
    'model/Part.js',
    'model/Document.js',
    'view/PartView.js',
    'view/Handle.js',
    'view/DragTracker.js',
    'view/Viewer.js',
    'view/DocumentView.js',
    'command/*.js',
    'model/part/*.js',
    'view/layer/*.js',
    'view/part/*.js' 
  ].map(function(file) {
    return require('path').join('src', 'infogra', file);
  });

  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      }, 
      dist: {
        src: sourceFiles,
        dest: 'dist/infogra.js'
      }
    },
    uglify: {
      dist: {
        src: 'dist/infogra.js',
        dest: 'dist/infogra-min.js'
      }
    },
    copy: {
      rails: {
        files: [
          {
            expand: true,
            cwd: 'dist',
            src: ['**'],
            dest: 'vendor/assets/javascripts/',
            filter: 'isFile'
          }
        ]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      }
    }
  });

  grunt.registerTask('dist', ['concat:dist', 'uglify:dist', 'copy:rails'])

  // Default task.
  grunt.registerTask('default', ['dist']);

};
