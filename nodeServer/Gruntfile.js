module.exports = (grunt) => {
  const sass = require('node-sass');

  grunt.initConfig({
    concat: {
      js: {
        options: { separator: '' },
        src: ['../main/current/processing/timeline/js/*.js'],
        dest: '../frontend/production/master.js'
      },
      css: {
        options: { separator: '' },
        src: ['../main/current/processing/timeline/css/*.css'],
        dest: '../frontend/production/master.css'
      }
    },
    sass: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      dist: {
        files: {
          '../main/current/processing/timeline/css/scssDerived.css': '../main/current/processing/timeline/css/*.scss'
        }
      }
    },
    watch: {
      js: {
        files: ['../main/current/processing/timeline/js/*.js'],
        tasks: ['concat:js']
      },
      css: {
        files: ['../main/current/processing/timeline/css/*.css'],
        tasks: ['concat:css']
      },
      scss: {
        files: ['../main/current/processing/timeline/css/*.scss'],
        tasks: ['sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-sass');
};
