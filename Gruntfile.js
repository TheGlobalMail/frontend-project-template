'use strict';

/* Load the livereload <script> snippet
 * This gets inject into our HTML in the connect dev server with middleware
 */
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// Grunt!!!
module.exports = function(grunt) {
  // Look in package.json for grunt devDependencies and load them into grunt
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project folders (relative to this Gruntfile)
  var project = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    // Add the project dirs into the config so we can reference
    // them below using the underscore template syntax
    project: project,

    // Read our package.json file for extra info
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      // Recompile LESS which will then trigger the livereload watcher below
      less: {
        files: ['app/styles/{,*/}*.less', 'app/components/tgm-bootstrap/less/*.less'],
        tasks: ['less']
      },

      /* When any main assets in `project.app` change we should reload the browser
       * Globbing now has OR statements, i.e. app/{js,scripts} will search app/js and app/scripts
       * If you omit the first value it works like an optional match so app/{,js}/*.js
       * Will match app/myscript.js and app/js/otherscript.js
       *
       * Any precompiled resources (i.e. compiled CSS, compiled Handlebars templates) live in the .tmp folder
       */
      livereload: {
        files: [
          '<%= project.app %>/index.html',
          '{.tmp,<%= project.app %>}/styles/{,/*}*.css',
          '{.tmp,<%= project.app %>}/js/{,/*}*.js',
          '<%= project.app %>/images/{,*/}*.{png,jpg,jpeg,webp}'
        ],
        tasks: ['livereload']
      }
    },

    // develpment server
    connect: {
      options: {
        port: 9000,
        // Use 0.0.0.0 to listen from anywhere
        // Can be changed to localhost to lock it down
        hostname: '0.0.0.0'
      },

      // dev server with livereload snippet injected
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              // change to project.app?
              mountFolder(connect, 'app')
            ];
          }
        }
      },

      // dev server that ONLY runs the /dist folder, good for checking a build before deployment
      dist: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, 'dist')
            ];
          }
        }
      }
    },

    clean: {
      dist: ['.tmp', '<%= project.dist %>/*'],
      server: ['.tmp']
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },

      // have to use with_overrides because the jshint task doesn't automatically merge options with .jshintrc
      with_overrides: {
        options: {
          globals: {
            jQuery: true,
            $: true,
            _: true,
            Backbone: true,
            Modernizr: true
          }
        }
      },

      all: [
        // Yo dawg, I heard you like linting when building
        // So I put a lint task in your build file so you can lint your build file while you build
        'Gruntfile.js',
        '<%= project.app %>/js/{,/*}*.js',

        // ! = Ignore the libs folder which contains dodgy 3rd-party code
        '!<%= project.app %>/js/libs/'
      ]
    },

    // LESS task has two targets so we can run unminified CSS in dev mode
    less: {
      server: {
        files: {
          // compile to our .tmp, this folder is mounted in the dev server
          '.tmp/styles/main.css': '<%= project.app %>/styles/main.less'
        }
      },

      dist: {
        yuicompress: true,
        files: {
          '<%= project.dist %>/styles/main.css': '<%= project.app %>/styles/main.less'
        }
      }
    },

    // useminPrepare scans files for <!-- build:(js|css) --> blocks
    // and injects config into the grunt-contrib-concat task
    useminPrepare: {
      html: '<%= project.app %>/index.html',
      options: {
        dest: '<%= project.dist %>'
      }
    },

    usemin: {
      html: ['<%= project.dist %>/{,*/}*.html'],
      css: ['<%= project.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= project.dist %>']
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= project.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          collapseBolleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true
        },
        files: {
          '<%= project.dist %>/index.html': '<%= project.dist %>/index.html'
        }
      }
    },

    rev: {
      options: {
        algorithm: 'sha512',
        length: 16
      },
      files: {
        src: ['<%= project.dist %>/js/*.js', '<%= project.dist %>/styles/*.css'],
      }
    },

    // A whitelist of extra files to copy
    // Processed assets like JS, CSS, Images, etc are all copied over
    // by their respective tasks.
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= project.app %>',
          dest: '<%= project.dist %>',
          src: [
            'index.html',
            '*.{ico,txt}',
            '.htaccess'
          ]
        }]
      }
    },

    cdn: {
      dist: {
        src: ['<%= project.dist %>/index.html'],
        cdn: 'http://newproject-assets.theglobalmail.org'
      },

      staging: {
        src: ['<%= cdn.dist.src %>'],
        cdn: 'http://newproject-staging-assets.theglobalmail.org'
      }
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'jshint:with_overrides',
      'less:server',
      'livereload-start',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', function(target) {
    var targets = [
      'jshint:with_overrides',
      'clean:dist',
      'less:dist',
      'useminPrepare',
      'imagemin',
      'concat',
      'copy:dist',
      'uglify',
      'rev',
      'usemin'
    ];

    if (target === 'staging') {
      targets.push('cdn:staging');
    } else {
      targets.push('cdn:dist');
    }

    targets.concat([
      'htmlmin'
    ]);

    grunt.task.run(targets);
  });

  // TODO: Testing
  grunt.registerTask('test');

  // default is run if you invoke grunt without a target
  grunt.registerTask('default', 'build');
};