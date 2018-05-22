var i;
var main = function() {
  var _mid = /\.mid$/i;
  var _midi = /\.midi$/i;
  var _kar = /\.kar$/i;
  var _rmi = /\.rmi$/i;
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
  function getInt(x, a) {
    var n = getAttr(x, a);
    return n == parseInt(n) ? n : 0;
  }
  function isMidi(s, t) { return s.match(_mid) || s.match(_midi) || s.match(_kar) || s.match(_rmi) || t ==__midi; }
  function isAudio(s, t) { return s.match(_mp3) || s.match(_wav) || s.match(_ogg) || t == __mpeg || t == __wav || t == __ogg; }
  function search() {
    var a, x, i, j, s, t, h, w;
    var all = [];
    var src;
    a = document.getElementsByTagName('BGSOUND');
    for (i = 0; i < a.length; i++) {
      x = a[i];
      s = getAttr(x, 'src');
      w = getAttr(x, 'loop');
      if (w.toLowerCase() == 'infinity') w = -1;
      else if (w != parseInt(w) || w < 2) w = 0;
      if (isMidi(s)) {
        all.push({
          dom: x,
          type: 'bgsound',
          src: s,
          loop: w,
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
        if (isMidi(src[j][0], src[j][1])) {
          s = src[j][0]; break;
        }
        if (isAudio(src[j][0], src[j][1])) {
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
      if (isMidi(s, t)) {
        h = getInt(x, 'height');
        w = getInt(x, 'width');
        all.push({
          dom: x,
          type: 'embed',
          src: s,
          loop: 0,
          auto: getBool(x, 'autostart') || getBool(x, 'autoplay'),
          h: h,
          w: w,
          ctrl: !!(h || w)
        });
      }
    }
    a = document.getElementsByTagName('OBJECT');
    for (i = 0; i < a.length; i++) {
      x = a[i];
      s = getAttr(x, 'data');
      t = s ? getAttr(x.children[j], 'type') : undefined;
      if (isMidi(s, t)) {
        h = getInt(x, 'height');
        w = getInt(x, 'width');
        all.push({
          dom: x,
          type: 'object',
          src: s,
          loop: 0,
          auto: false,
          h: h,
          w: w,
          ctrl: !!(h || w)
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
  function create(x) {
//console.log(x);
    var player;
    var parent = x.dom.parentNode;
    var div;
    if (x.ctrl) {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.margin = '0px';
      div.style.padding = '0px';
      div.style.borderStyle = 'none';
      div.style.cursor = 'default';
      parent.insertBefore(div, x.dom);
      player = new JZZ.gui.Player(div);
    }
    else {
      player = new JZZ.gui.Player();
    }
    parent.removeChild(x.dom);
    div = player.gui;
    div.title = 'Loading ' + x.src;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var r = xhttp.responseText;
          var data = '';
          for (var i = 0; i < r.length; i++) data += String.fromCharCode(r.charCodeAt(i) & 0xff);
          try {
            player.load(new JZZ.MIDI.SMF(data));
            div.title = x.src;
            player.loop(x.loop);
            if (x.auto) player.play();
          }
          catch (e) {
            console.log(e.message ? e.message : e);
            div.title = 'Cannot load ' + x.src;
          }
        }
        else {
          div.title = 'Cannot load ' + x.src;
        }
      }
    };
    xhttp.overrideMimeType("text/plain; charset=x-user-defined");
    xhttp.open("GET", x.src, true);
    xhttp.send();
  }
  var init = function() {
    if (!window.JZZ) window.JZZ = _JZZ();
    if (!JZZ.synth || !JZZ.synth.OSC) _OSC();
    JZZ.synth.OSC.register('Web Audio');
    JZZ().openMidiOut();
    if (!JZZ.MIDI.SMF) _SMF();
    if (!JZZ.gui || !JZZ.gui.Player) _Player();
    init = function() {};
  };

  search();
  if (_all.length) init();
  for (i = 0; i < _all.length; i++) create(_all[i]);
  _all = [];
};

if (document instanceof HTMLDocument) {
  var code = main.toString();
  code = '(' + code.substring(0, code.lastIndexOf('}')) + _JZZ.toString() + _OSC.toString() + _SMF.toString() + _OSC.toString() + _Player.toString() + '})()';
  var script = document.createElement('script');
  script.textContent = code;
  document.documentElement.appendChild(script);
}
