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
  function getBool(x, a) { 
    if (x && x.attributes && x.attributes[a]) return isTrue(x.attributes[a].nodeValue);
    return false;
  }
  function getAttr(x, a) { 
    if (x && x.attributes && x.attributes[a]) return x.attributes[a].nodeValue;
    return '';
  }
  function search() {
    var a, x, i, j, s, t;
    var all = [];
    var src;
    a = document.getElementsByTagName('BGSOUND');
    for (i = 0; i < a.length; i++) {
      x = a[i];
      s = getAttr(x, 'src');
      if (s.match(_mid) || s.match(_midi) || s.match(_kar)) {
        all.push({
          dom: x,
          type: 'bgsound',
          src: s,
          loop: getBool(x, 'loop'),
          auto: true,
          ctrl: false,
          h: 0,
          w: 0
        });
      }
    }
    a = document.getElementsByTagName('AUDIO');
    for (i = 0; i < a.length; i++) {
      x = a[i];
      src = [];
      if (x.attributes && x.attributes['src']) src.push([getAttr(x, 'src')]);
      if (x.children) {
        for (j = 0; j < x.children.length; j++) {
          if (x.children[j].nodeName == 'SOURCE' && x.children[j].attributes) {
            src.push([getAttr(x.children[j], 'src'), getAttr(x.children[j], 'type')]);
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
        all.push({
          dom: x,
          type: 'audio',
          src: s,
          loop: getBool(x, 'loop'),
          auto: getBool(x, 'autoplay'),
          ctrl: getBool(x, 'controls'),
          h: x.clientHeight,
          w: x.clientWidth
        });
      }
    }
    a = document.getElementsByTagName('EMBED');
    for (i = 0; i < a.length; i++) {
      x = a[i];
      s = getAttr(x, 'src');
      t = s ? getAttr(x.children[j], 'type') : undefined;
      if (s.match(_mid) || s.match(_midi) || s.match(_kar) || t ==__midi) {
        all.push({
          dom: x,
          type: 'embed',
          src: s,
          loop: false,
          auto: getBool(x, 'autostart'),
          ctrl: false,
          h: getAttr(x, 'height') || 0,
          w: getAttr(x, 'width') || 0
        });
      }
    }
    a = document.getElementsByTagName('OBJECT');
    for (i = 0; i < a.length; i++) {
      x = a[i];
      s = getAttr(x, 'data');
      t = s ? getAttr(x.children[j], 'type') : undefined;
      if (s.match(_mid) || s.match(_midi) || s.match(_kar) || t ==__midi) {
        all.push({
          dom: x,
          type: 'object',
          src: s,
          loop: false,
          auto: false,
          ctrl: false,
          h: getAttr(x, 'height') || 0,
          w: getAttr(x, 'width') || 0
        });
      }
      if (x.children) {
        for (j = 0; j < x.children.length; j++) {
          if (x.children[j].nodeName == 'PARAM' && x.children[j].attributes) {
            if (getAttr(x.children[j], 'name') == 'loop') all[all.length - 1].loop = getBool(x.children[j], 'value');
          }
        }
      }
    }
console.log(all);
  }
  console.log('Initializing MIDI Player...');
  search();
};

var script = document.createElement('script');
script.textContent = '(' + main.toString() + ')();';
document.documentElement.appendChild(script);
