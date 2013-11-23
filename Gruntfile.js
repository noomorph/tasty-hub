/* jshint maxlen:120 */
/* global module, process */
module.exports = function(grunt) {

grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  meta: {
    banner:
      '/*!\n' +
      ' * Wix Sample App <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
      ' * https://github.com/noomorph/wix-sample-app\n' +
      ' * (c) <%= grunt.template.today("yyyy") %>, Iaroslav Sergieiev' +
      ' */'
  },

  env: {
    dev: {
      NODE_ENV: 'development'
    },
    prod: {
      NODE_ENV: 'production'
    }
  },

  clean: ['dist/'],

  preprocess : {
    html : {
      src : 'src/index.html',
      dest : 'dist/index.html'
    }
  },

  jasmine: {
    src: ['dist/js/app.js'],
    options: {
      specs: 'spec/**/*.js'
    }
  },

  uglify: {
    options: {
      banner: '<%= meta.banner %>\n'
    },
    build: {
      files: {
        'dist/js/app.min.js' : ['dist/js/app.js']
      }
    }
  },

  cssmin: {
    minify: {
      expand: true,
      cwd: 'dist/css/',
      src: ['*.css', '!*.min.css'],
      dest: 'dist/css',
      ext: '.min.css'
    }
  },

  csslint: {
    strict: {
      options: {
        "box-sizing": false,
        "adjoining-classes": false,
        "ids": false,
        "outline-none": false
      },
      src: ['dist/css/*.css', '!dist/css/*.min.css']
    }
  },

  sass: {
    main: {
      options: {
        compass: true
      },
      files: {
        'dist/css/app.css': 'src/sass/app.scss'
      }
    }
  },

  jshint: {
    files: [ 'Gruntfile.js', 'dist/js/**/*.js',  '!dist/js/**/*.min.js' ],
    options: {
      jshintrc: '.jshintrc'
    }
  },

  concat: {
    options: {
      separator: '\n\n;\n\n'
    },
    app: {
      src: [
        'src/js/app.js'
      ],
      dest: 'dist/js/app.js'
    }
  },

  connect: {
    server: {
      options: {
        port: process.env.PORT || 8000,
        base: './dist/',
        hostname: '0.0.0.0',
        middleware: function(connect, options) {
          var middlewares = [];
          var directory = options.directory || options.base[options.base.length - 1];
          if (!Array.isArray(options.base)) {
            options.base = [options.base];
          }
          middlewares.push(connect.compress());
          options.base.forEach(function(base) {
            middlewares.push(connect.static(base));
          });
          middlewares.push(connect.directory(directory));
          return middlewares;
        }
      }
    }
  },

  watch: {
    main: {
      files: [ 'Gruntfile.js', 'src/js/**/*.js', 'src/sass/**/*.scss', 'src/*.html' ],
      tasks: 'build'
    },
    test: {
      files: [ 'Gruntfile.js', 'spec/**/*.js', 'src/js/**/*.js' ],
      tasks: 'test'
    }
  }

});

// Dependencies
grunt.loadNpmTasks( 'grunt-contrib-jasmine' );
grunt.loadNpmTasks( 'grunt-contrib-jshint' );
grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
grunt.loadNpmTasks( 'grunt-contrib-csslint' );
grunt.loadNpmTasks( 'grunt-contrib-uglify' );
grunt.loadNpmTasks( 'grunt-contrib-watch' );
grunt.loadNpmTasks( 'grunt-contrib-sass' );
grunt.loadNpmTasks( 'grunt-contrib-connect' );
grunt.loadNpmTasks( 'grunt-contrib-concat' );
grunt.loadNpmTasks( 'grunt-contrib-clean' );
grunt.loadNpmTasks( 'grunt-env' );
grunt.loadNpmTasks( 'grunt-preprocess' );

grunt.registerTask( 'build', [ 'clean', 'concat', 'sass', 'preprocess', 'cssmin', 'uglify' ] );
grunt.registerTask( 'test', [ 'csslint', 'jshint', 'concat', 'jasmine' ] );
grunt.registerTask( 'release', [ 'env:prod', 'build', 'test' ] );
grunt.registerTask( 'serve', [ 'build', 'test', 'connect', 'watch' ] );
grunt.registerTask( 'default', [ 'env:dev', 'serve' ] );

};
