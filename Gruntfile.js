module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['src/**/*.js']
    },
    import: {
      _JZZ: {
        src: 'node_modules/jzz/javascript/JZZ.js',
        dest: 'src/_JZZ.js'
      },
      _SMF: {
        src: 'node_modules/jzz-midi-smf/javascript/JZZ.midi.SMF.js',
        dest: 'src/_SMF.js'
      },
      _Player: {
        src: 'node_modules/jzz-gui-player/javascript/JZZ.gui.Player.js',
        dest: 'src/_Player.js'
      }
    },
    uglify: {
      firefox: {
        expand: true,
        cwd: 'src',
        src: '*.js',
        dest: 'firefox'
      },
      safari: {
        expand: true,
        cwd: 'src',
        src: '*.js',
        dest: 'safari/midi-player.safariextension'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('import', require('./src/tools/import.js')(grunt));
  grunt.registerTask('default', ['import', 'uglify']);
};
