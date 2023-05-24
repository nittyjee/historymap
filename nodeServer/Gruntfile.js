module.exports = (grunt) => {
  const sass = require('node-sass');

  grunt.initConfig({
    concat: {
      js: {
        options: { separator: '' },
        src: ['./static/js/*.js'],
        dest: './static/concatenatedJS/master.js'
      },
      css: {
        options: { separator: '' },
        src: ['../main/current/processing/timeline/css/*.css'],
        dest: '../frontend/production/master.css'
      },
      nodeStyles: {
        options: { separator: '' },
        src: ['./static/styles/*.css'],
        dest: './static/concatenatedCSS/master.css'
      }
    },

    sass: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      dist: {
        files: {
          './static/styles/scssDerived.css': './sassStyles/*.scss'
        }
      }
    },

    watch: {
      js: {
        files: ['../main/current/processing/timeline/js/*.js', './static/js/*.js'],
        tasks: ['concat:js']
      },
      css: {
        files: ['../main/current/processing/timeline/css/*.css'],
        tasks: ['concat:css']
      },
      newNodeServerSass: {
        files: ['./sassStyles/*.scss'],
        tasks: ['sass']
      },
      newNodeStyles: {
        files: ['./static/styles/*.css'],
        tasks: ['concat:nodeStyles']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-sass');
};
