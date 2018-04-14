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
  var _all;
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
          loop: getAttr(x, 'loop') || 0,
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
          loop: getBool(x, 'loop') ? -1 : 0,
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
          loop: 0,
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
          loop: 0,
          auto: false,
          ctrl: false,
          h: getAttr(x, 'height') || 0,
          w: getAttr(x, 'width') || 0
        });
      }
      if (x.children) {
        for (j = 0; j < x.children.length; j++) {
          if (x.children[j].nodeName == 'PARAM' && x.children[j].attributes) {
            if (getAttr(x.children[j], 'name') == 'loop') all[all.length - 1].loop = getAttr(x.children[j], 'value') || 0;
          }
        }
      }
    }
    _all = all;
  }
  function Player(x) {
//console.log('x =', x);
    this.src = x.src;
    this.h = 40;
    this.w = 270;
  }
  Player.prototype.create = function() {
    var self = this;
    var div = document.createElement('div');
    div.title = 'Loading ' + this.src;
    div.style.display = 'inline-block';
    div.style.margin = '0px';
    div.style.padding = '0px';
    div.style.borderStyle = 'solid';
    div.style.borderColor = '#f00';
    div.style.borderWidth = '1px';
    div.style.cursor = 'default';
    div.style.width = this.w + 'px';
    div.style.height = this.h + 'px';
    document.body.appendChild(div);
    self.div = div;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          self.div.style.borderColor = '#0f0';
          var r = xhttp.responseText;
          self.data = '';
          for (var i = 0; i < r.length; i++) self.data += String.fromCharCode(r.charCodeAt(i) & 0xff);
          self.div.title = self.src;
        }
        else {
          self.div.title = 'Cannot load ' + self.src;
        }
      }
    };
    xhttp.overrideMimeType("text/plain; charset=x-user-defined");
    xhttp.open("GET", self.src, true);
    xhttp.send();
  }

  console.log('Initializing MIDI Player...');
  search();
  for (var i in _all) {
    var p = new Player(_all[i]);
    p.create();
  }
};

var script = document.createElement('script');
script.textContent = '(' + main.toString() + ')();';
document.documentElement.appendChild(script);
