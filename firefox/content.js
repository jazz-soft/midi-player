var main = function() {
  var _mid = /\.mid$/i;
  var _midi = /\.midi$/i;
  var _kar = /\.kar$/i;
  var _mp3 = /\.mp3$/i;
  var _wav = /\.wav$/i;
  var _ogg = /\.ogg$/i;
  var __midi = 'audio/midi';
  var __mpeg = 'audio/mpeg';
  var __ogg = 'audio/ogg';
  var __wav = 'audio/wav';
  function isTrue(str) {
    if (str == '') return true;
    str = str.toLowerCase();
    if (str == 'f' || str == 'false' || str == 0) return false;
    return !!str;
  }
  function toBool(attr) {
    return attr ? isTrue(attr.nodeValue) : false;
  }
  function search() {
    var a, x, i, j, s, obj;
    var all = [];
    a = document.getElementsByTagName('BGSOUND');
    for (i = 0; i < a.length; i++) {
      x = a[i];
      if (x.attributes && x.attributes['src']) {
        s = x.attributes['src'].nodeValue;
        if (s.match(_mid) || s.match(_midi) || s.match(_kar)) {
          obj = { dom: x, type: 'bgsound', src: s, loop: toBool(x.attributes['loop']), auto: true };
          all.push(obj);
        }
      }
    }
    //a = document.getElementsByTagName('AUDIO');
    //a = document.getElementsByTagName('EMBED');
    //a = document.getElementsByTagName('OBJECT');
  }
  console.log('Initializing MIDI Player...');
  search();
};

var script = document.createElement('script');
script.textContent = '(' + main.toString() + ')();';
document.documentElement.appendChild(script);
