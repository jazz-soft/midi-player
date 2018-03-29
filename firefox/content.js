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
  function toBool(attr) { return attr ? isTrue(attr.nodeValue) : false; }
  function getAttr(attr) { if (attr) return attr.nodeValue; }
  function search() {
    var a, x, i, j, s, obj;
    var all = [];
    var src;
    a = document.getElementsByTagName('BGSOUND');
    for (i = 0; i < a.length; i++) {
      x = a[i];
      if (x.attributes && x.attributes['src']) {
        s = x.attributes['src'].nodeValue;
        if (s.match(_mid) || s.match(_midi) || s.match(_kar)) {
          obj = { dom: x, type: 'bgsound', src: s, loop: toBool(x.attributes['loop']), auto: true, ctrl: false };
          all.push(obj);
        }
      }
    }
    a = document.getElementsByTagName('AUDIO');
    for (i = 0; i < a.length; i++) {
      x = a[i];
      src = [];
      if (x.attributes && x.attributes['src']) src.push([getAttr(x.attributes['src'])]);
      if (x.children) {
        for (j = 0; j < x.children.length; j++) {
          if (x.children[j].nodeName == 'SOURCE' && x.children[j].attributes) {
            src.push([getAttr(x.children[j].attributes['src']), getAttr(x.children[j].attributes['type'])]);
          }
        }
      }
      s = undefined;
      for (j = 0; j < src.length; j++) {
        if (src[j][0].match(_mid) || src[j][0].match(_midi) || src[j][0].match(_kar) || src[j][1] == __midi) {
          s = src[j][0]; break;
        }
        if (src[j][0].match(_mp3) || src[j][0].match(_wav) || src[j][0].match(_ogg) || src[j][1] == __mpeg || src[j][1] == __wav || src[1] == __ogg) {
          break;
        }
      }
      if (s) {
        obj = { dom: x, type: 'audio', src: s, loop: false, auto: false, ctrl: true };
        if (x.attributes) {
          obj.loop = toBool(x.attributes['loop']);
          obj.auto = toBool(x.attributes['autoplay']);
          obj.auto = toBool(x.attributes['controls']);
        }
        all.push(obj);
      }
    }
    //a = document.getElementsByTagName('EMBED');
    //a = document.getElementsByTagName('OBJECT');
  }
  console.log('Initializing MIDI Player...');
  search();
};

var script = document.createElement('script');
script.textContent = '(' + main.toString() + ')();';
document.documentElement.appendChild(script);
