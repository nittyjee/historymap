module.exports = (grunt) => {
  const sass = require('node-sass');

  grunt.initConfig({
    concat: {
      js: {
        options: { separator: '' },
        //'../main/current/processing/timeline/js/*.js', 
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

    /*sass: {
      orginal: {
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
      newNodeServerSass: {
        options: {
          implementation: sass,
          sourceMap: true
        },
        dist: {
          files: {
            './static/styles/scssDerived.css': './sassStyles/*.scss'
          }
        }
    },*/

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
      /*scss: {
        files: ['../main/current/processing/timeline/css/*.scss'],
        tasks: ['sass:original']
      },*/
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
