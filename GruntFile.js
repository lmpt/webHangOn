/**
 * Created by leothornton on 21/06/15.
 */
module.exports = function(grunt) {
  var banner = '/*n<%= pkg.name %> <%= pkg.version %>';
  banner += '- <%= pkg.description %>n<%= pkg.repository.url %>n';
  banner += 'Built on <%= grunt.template.today("yyyy-mm-dd") %>n*/n';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['gruntfile.js', 'src/*.js'],
      options: {
        maxlen: 120,
        quotmark: 'single'
      }
    },
    simplemocha: {
      options: {
        globals: ['expect'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'nyan'
      },
      all: { src: ['test/*.js'] }
    },
    execute: {
      make: {
        src: ['buildScript.js']
      }
    },
    shell: {
      target: {
        command: '/bin/sh ./test.checker.sh'
      }
    },
    watch: {
      scripts: {
        files: ['gruntfile.js', 'src/*.js', 'src/**/*.js', 'test/**/*.js'],
        tasks: ['test']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build',
    ['shell', 'jshint', 'simplemocha', 'execute']);

  grunt.registerTask('test',
    ['shell', 'jshint', 'simplemocha']);

};