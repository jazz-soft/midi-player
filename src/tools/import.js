// cut out the middle part from JZZ modules
module.exports = function(grunt) {
  return function() {
    var config = grunt.config('import');
    for (var name in config) {
      process(name, config[name].src, config[name].dest);
    }
  };
  function process(name, input, output) {
console.log(name, input, output);
    var i;
    var eol = require('os').EOL;
    var src = grunt.file.read(input).split(/\r?\n/);
    var res = ['function ' + name + '() {'];
    for (i = 0; i < src.length; i++) {
      if (src[i].match(/}\)\(this, function\(\S*\)\s*{/)) break;
    }
    for (i++; i < src.length; i++) {
      if (src[i].match(/^}\);/)) break;
      res.push(src[i]);
    }
    res.push('}');
    res.push('');
    grunt.file.write(output, res.join(eol));
  };
};
