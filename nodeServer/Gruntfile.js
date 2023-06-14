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
      },
      scss: {
        options: { separator: '' },
        src: [
          './sassStyles/variables.scss',
          './sassStyles/general.scss',
          './sassStyles/include-media.scss',
          './sassStyles/desktop.scss',
          './sassStyles/mobile.scss',
          './sassStyles/slider.scss',
          './sassStyles/admin.scss'
        ],
        dest: './sassStyles/concatenated.scss'
      }
    },

    sass: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      dist: {
        files: {
          './static/styles/scssDerived.css': './sassStyles/concatenated.scss'
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
        tasks: ['concat:scss', 'sass']
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
