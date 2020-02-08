module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['src/**/*.js']
    },
    import: {
      _JZZ: {
        src: 'node_modules/jzz/javascript/JZZ.js',
        dest: 'src/xJZZ.js'
      },
      _Tiny: {
        src: 'node_modules/jzz-synth-tiny/javascript/JZZ.synth.Tiny.js',
        dest: 'src/xTiny.js'
      },
      _SMF: {
        src: 'node_modules/jzz-midi-smf/javascript/JZZ.midi.SMF.js',
        dest: 'src/xSMF.js'
      },
      _Player: {
        src: 'node_modules/jzz-gui-player/javascript/JZZ.gui.Player.js',
        dest: 'src/xPlayer.js'
      }
    },
    copy: {
      edge: {
        expand: true,
        cwd: 'src',
        src: '*.js',
        dest: 'edge/Extension'
      },
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
      },
      safari12: {
        expand: true,
        cwd: 'src',
        src: '*.js',
        dest: 'safari/midi-player/extension'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('import', require('./src/tools/import.js')(grunt));
  grunt.registerTask('default', ['import', 'copy']);
};
