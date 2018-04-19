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
  var _svg = "http://www.w3.org/2000/svg";
  var _w = 270;
  var _h = 40;
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
        if (x.children) {
          for (j = 0; j < x.children.length; j++) {
            if (x.children[j].nodeName == 'PARAM' && x.children[j].attributes) {
              if (getAttr(x.children[j], 'name') == 'loop') all[all.length - 1].loop = getAttr(x.children[j], 'value') || 0;
            }
          }
        }
      }
    }
    _all = all;
  }
  function Player(x) {
    this.dom = x.dom;
    this.type = x.type;
    this.src = x.src;
    this.ctrl = x.type == 'object' || x.type == 'embed' || x.ctrl;
  }
  Player.prototype.create = function() {
    var self = this;
    var parent = self.dom.parentNode;
    if (self.ctrl) {
      self.div = document.createElement('div');
      self.div.title = 'Loading ' + this.src;
      self.div.style.display = 'inline-block';
      self.div.style.margin = '0px';
      self.div.style.padding = '0px';
      self.div.style.borderStyle = 'none';
      self.div.style.cursor = 'default';
      self.div.style.width = _w + 'px';
      self.div.style.height = _h + 'px';

      var svg = document.createElementNS(_svg, 'svg');
      svg.setAttributeNS(null, 'width', _w);
      svg.setAttributeNS(null, 'height', _h);
      self.div.appendChild(svg);

      var rect = document.createElementNS(_svg, 'rect');
      rect.setAttributeNS(null, 'x', 0);
      rect.setAttributeNS(null, 'y', 0);
      rect.setAttributeNS(null, 'rx', 4);
      rect.setAttributeNS(null, 'ry', 4);
      rect.setAttributeNS(null, 'width', _w);
      rect.setAttributeNS(null, 'height', _h);
      rect.setAttributeNS(null, 'fill', '#888');
      svg.appendChild(rect);

      parent.insertBefore(self.div, self.dom);
    }
    parent.removeChild(self.dom);
    delete self.dom;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var r = xhttp.responseText;
          self.data = '';
          for (var i = 0; i < r.length; i++) self.data += String.fromCharCode(r.charCodeAt(i) & 0xff);
          if (self.div) {
            self.div.title = self.src;
          }
          console.log('MIDI loaded', self.src);
        }
        else {
          console.log('Cannot load', self.src);
          if (self.div) self.div.title = 'Cannot load ' + self.src + ' ' + self.type;
        }
      }
    };
    xhttp.overrideMimeType("text/plain; charset=x-user-defined");
    xhttp.open("GET", self.src, true);
    xhttp.send();
  }

  search();
  for (var i = 0; i < _all.length; i++) {
    var p = new Player(_all[i]);
    p.create();
  }
  _all = [];
};

if (document instanceof HTMLDocument) {
  var script = document.createElement('script');
  script.textContent = '(' + main.toString() + ')();';
  document.documentElement.appendChild(script);
}
