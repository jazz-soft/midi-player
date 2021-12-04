module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['src/**/*.js']
    },
    assemble: {
      main: 'src/tools/main.js',
      src: [
        'node_modules/jzz/javascript/JZZ.js',
        'node_modules/jzz-synth-tiny/javascript/JZZ.synth.Tiny.js',
        'node_modules/jzz-midi-smf/javascript/JZZ.midi.SMF.js',
        'node_modules/jzz-gui-player/javascript/JZZ.gui.Player.js'
      ],
      dest: 'src/inject.js'
    },
    copy: {
      firefox: {
        expand: true,
        cwd: 'src',
        src: '*.js',
        dest: 'firefox/midi-player'
      },
      safari: {
        expand: true,
        cwd: 'src',
        src: '*.js',
        dest: 'safari/midi-player/extension'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('assemble', require('./src/tools/assemble.js')(grunt));
  grunt.registerTask('default', ['assemble', 'copy']);
};
