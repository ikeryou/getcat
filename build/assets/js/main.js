(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Contents, DStateChecker, ObjObject,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ObjObject = require('./ObjObject');

DStateChecker = require('./DStateChecker');

Contents = (function() {
  function Contents() {
    this._eMoveDevice = bind(this._eMoveDevice, this);
    this._eClear = bind(this._eClear, this);
    this._update = bind(this._update, this);
    this._resize = bind(this._resize, this);
    this._add3DModel = bind(this._add3DModel, this);
    this.init = bind(this.init, this);
    this._scene;
    this._camera;
    this._ambLight;
    this._dLight;
    this._renderer;
    this._hAxis;
    this._trackBall;
    this._checker;
    this._obj;
    this._floor = 30;
  }

  Contents.prototype.init = function() {
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
    this._ambLight = new THREE.AmbientLight(0xffffff);
    this._scene.add(this._ambLight);
    this._ambLight.position.set(0, 0, 0);
    this._renderer = new THREE.WebGLRenderer({
      antialias: false
    });
    if (window.devicePixelRatio != null) {
      this._renderer.setPixelRatio(window.devicePixelRatio);
    }
    this._renderer.setClearColor(0x000000);
    $("#main").append(this._renderer.domElement);
    MY.con = {};
    MY.con.scene = this._scene;
    MY.con.camera = this._camera;
    MY.con.renderer = this._renderer;
    this._checker = new DStateChecker();
    this._checker.init();
    this._checker.onMoveDevice = this._eMoveDevice;
    this._add3DModel();
    MY.resize.add(this._resize, true);
    return MY.update.add(this._update);
  };

  Contents.prototype._add3DModel = function() {
    var param;
    if (this._obj != null) {
      this._obj.dispose();
      this._obj = null;
    }
    switch (0) {
      case 0:
        param = ["./assets/3d/Cat_OrangeTabby/Cat_OrgTabby.obj", "./assets/3d/Cat_OrangeTabby/Cat_Tabby_Org_512.jpg"];
        break;
      default:
        param = ["./assets/3d/android.obj"];
    }
    this._obj = new ObjObject(param);
    this._obj.init();
    return this._obj.onClear = this._eClear;
  };

  Contents.prototype._resize = function(w, h) {
    var cameraZ;
    $("#main").css({
      width: w,
      height: h
    });
    this._camera.aspect = w / h;
    this._camera.updateProjectionMatrix();
    cameraZ = -(h / 2) / Math.tan((this._camera.fov * Math.PI / 180) / 2);
    this._camera.position.set(0, this._floor, cameraZ);
    this._camera.lookAt(new THREE.Vector3(0, 0, 0));
    return this._renderer.setSize(w, h);
  };

  Contents.prototype._update = function() {
    if ((this._obj != null) && !this._obj.isBareta()) {
      this._camera.position.y = this._floor + Math.sin(Date.now() * 0.0015) * 20;
      this._camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    return this._renderer.render(this._scene, this._camera);
  };

  Contents.prototype._eClear = function() {
    alert("つかまえました！");
    this._add3DModel();
    return this._checker.resume();
  };

  Contents.prototype._eMoveDevice = function() {
    if (this._obj != null) {
      this._obj.setBareta();
      return setTimeout((function(_this) {
        return function() {
          alert("スマホを動かしたので\n気づかれてしまいました。。。");
          _this._obj.reStart();
          return _this._checker.resume();
        };
      })(this), 1000);
    }
  };

  return Contents;

})();

module.exports = Contents;


},{"./DStateChecker":2,"./ObjObject":4}],2:[function(require,module,exports){
var DStateChecker,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

DStateChecker = (function() {
  function DStateChecker() {
    this._eDeviceMotion = bind(this._eDeviceMotion, this);
    this.resume = bind(this.resume, this);
    this.init = bind(this.init, this);
    this._ac = {};
    this._isMoved = false;
    this._delay = 0;
    this.onMoveDevice;
  }

  DStateChecker.prototype.init = function() {
    return window.addEventListener("devicemotion", this._eDeviceMotion);
  };

  DStateChecker.prototype.resume = function() {
    this._isMoved = false;
    this._ac.sx = null;
    return this._delay = -5;
  };

  DStateChecker.prototype._eDeviceMotion = function(e) {
    var ac, p;
    ac = e.accelerationIncludingGravity;
    if ((ac != null) && ++this._delay > 0) {
      if ((this._ac.sx != null) && !this._isMoved) {
        p = 0.225;
        if (Math.abs(ac.x - this._ac.sx) > p || Math.abs(ac.y - this._ac.sy) > p || Math.abs(ac.z - this._ac.sz) > p) {
          this._isMoved = true;
          if (this.onMoveDevice != null) {
            return this.onMoveDevice();
          }
        }
      } else {
        this._ac.sx = ac.x;
        this._ac.sy = ac.y;
        return this._ac.sz = ac.z;
      }
    }
  };

  return DStateChecker;

})();

module.exports = DStateChecker;


},{}],3:[function(require,module,exports){
var Contents, Main, ResizeMgr, UpdateMgr, Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

UpdateMgr = require('./libs/mgr/UpdateMgr');

ResizeMgr = require('./libs/mgr/ResizeMgr');

Utils = require('./libs/Utils');

Contents = require('./Contents');

Main = (function() {
  function Main() {
    this.init = bind(this.init, this);
  }

  Main.prototype.init = function() {
    var c;
    window.MY = {};
    window.MY.u = new Utils();
    window.MY.update = new UpdateMgr();
    window.MY.resize = new ResizeMgr();
    c = new Contents();
    return c.init();
  };

  return Main;

})();

$(window).ready((function(_this) {
  return function() {
    var app;
    app = new Main();
    return app.init();
  };
})(this));


},{"./Contents":1,"./libs/Utils":5,"./libs/mgr/ResizeMgr":7,"./libs/mgr/UpdateMgr":8}],4:[function(require,module,exports){
var ObjObject,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ObjObject = (function() {
  function ObjObject(param) {
    this.dispose = bind(this.dispose, this);
    this.isBareta = bind(this.isBareta, this);
    this.getCon = bind(this.getCon, this);
    this._update = bind(this._update, this);
    this.setBareta = bind(this.setBareta, this);
    this.reStart = bind(this.reStart, this);
    this._eCompleteObj = bind(this._eCompleteObj, this);
    this.init = bind(this.init, this);
    this._param = param;
    this._container;
    this._objMesh;
    this._defZ = 500;
    this._defRY = 45;
    this._isBareta = false;
    this._isClear = false;
    this.onClear;
  }

  ObjObject.prototype.init = function() {
    var objLoader, s;
    this._container = new THREE.Object3D();
    MY.con.scene.add(this._container);
    s = 3;
    this._container.scale.set(s, s, s);
    this.reStart();
    objLoader = new THREE.OBJLoader();
    objLoader.load(this._param[0], this._eCompleteObj);
    return MY.update.add(this._update);
  };

  ObjObject.prototype._eCompleteObj = function(obj) {
    if (this._container == null) {
      return;
    }
    return obj.traverse((function(_this) {
      return function(child) {
        var b;
        if (child instanceof THREE.Mesh) {
          if (_this._param[1] != null) {
            child.material.map = THREE.ImageUtils.loadTexture(_this._param[1]);
          }
          child.material.side = THREE.DoubleSide;
          child.geometry.computeBoundingBox();
          b = child.geometry.boundingBox;
          child.position.x = -b.min.x - (b.max.x - b.min.x) * 0.5;
          child.position.y = -b.min.y - (b.max.y - b.min.y) * 0.5;
          child.position.z = -b.min.z - (b.max.z - b.min.z) * 0.5;
          _this._objMesh = child;
          return _this._container.add(_this._objMesh);
        }
      };
    })(this));
  };

  ObjObject.prototype.reStart = function() {
    this._isBareta = false;
    this._isClear = false;
    this._container.position.z = this._defZ;
    return this._container.rotation.y = MY.u.radian(MY.u.range(60));
  };

  ObjObject.prototype.setBareta = function() {
    return this._isBareta = true;
  };

  ObjObject.prototype._update = function() {
    var ty;
    if (this._isClear) {
      return;
    }
    if (!this._isBareta) {
      this._container.position.z -= 2;
      if (this._container.position.z < -400) {
        this._isClear = true;
        if (this.onClear != null) {
          return this.onClear();
        }
      }
    } else {
      ty = MY.u.radian(180);
      return this._container.rotation.y += (ty - this._container.rotation.y) * 0.1;
    }
  };

  ObjObject.prototype.getCon = function() {
    return this._container;
  };

  ObjObject.prototype.isBareta = function() {
    return this._isBareta;
  };

  ObjObject.prototype.dispose = function() {
    MY.update.remove(this._update);
    if (this._objMesh != null) {
      this._container.remove(this._objMesh);
      this._objMesh.geometry.dispose();
      this._objMesh.material.dispose();
      this._objMesh = null;
    }
    if (this._container != null) {
      MY.con.scene.remove(this._container);
      this._container = null;
    }
    this._param = null;
    return this.onClear = null;
  };

  return ObjObject;

})();

module.exports = ObjObject;


},{}],5:[function(require,module,exports){
var Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Utils = (function() {
  function Utils() {
    this.price = bind(this.price, this);
    this.getHexColor = bind(this.getHexColor, this);
    this.scrollTop = bind(this.scrollTop, this);
    this.windowHeight = bind(this.windowHeight, this);
    this.numStr = bind(this.numStr, this);
    this._A = Math.PI / 180;
  }

  Utils.prototype.random = function(min, max) {
    if (min < 0) {
      min--;
    }
    return ~~(Math.random() * ((max + 1) - min) + min);
  };

  Utils.prototype.hit = function(range) {
    return this.random(0, range - 1) === 0;
  };

  Utils.prototype.range = function(val) {
    return this.random(-val, val);
  };

  Utils.prototype.arrRand = function(arr) {
    return arr[this.random(0, arr.length - 1)];
  };

  Utils.prototype.map = function(num, resMin, resMax, baseMin, baseMax) {
    var p;
    if (num < baseMin) {
      return resMin;
    }
    if (num > baseMax) {
      return resMax;
    }
    p = (resMax - resMin) / (baseMax - baseMin);
    return ((num - baseMin) * p) + resMin;
  };

  Utils.prototype.radian = function(degree) {
    return degree * this._A;
  };

  Utils.prototype.degree = function(radian) {
    return radian / this._A;
  };

  Utils.prototype.decimal = function(num, n) {
    var i, pos;
    num = String(num);
    pos = num.indexOf(".");
    if (n === 0) {
      return num.split(".")[0];
    }
    if (pos === -1) {
      num += ".";
      i = 0;
      while (i < n) {
        num += "0";
        i++;
      }
      return num;
    }
    num = num.substr(0, pos) + num.substr(pos, n + 1);
    return num;
  };

  Utils.prototype.floor = function(num, min, max) {
    return Math.min(max, Math.max(num, min));
  };

  Utils.prototype.strReverse = function(str) {
    var i, len, res;
    res = "";
    len = str.length;
    i = 1;
    while (i <= len) {
      res += str.substr(-i, 1);
      i++;
    }
    return res;
  };

  Utils.prototype.shuffle = function(arr) {
    var i, j, k, results;
    i = arr.length;
    results = [];
    while (--i) {
      j = Math.floor(Math.random() * (i + 1));
      if (i === j) {
        continue;
      }
      k = arr[i];
      arr[i] = arr[j];
      results.push(arr[j] = k);
    }
    return results;
  };

  Utils.prototype.sliceNull = function(arr) {
    var i, l, len1, newArr, val;
    newArr = [];
    for (i = l = 0, len1 = arr.length; l < len1; i = ++l) {
      val = arr[i];
      if (val !== null) {
        newArr.push(val);
      }
    }
    return newArr;
  };

  Utils.prototype.replaceAll = function(val, org, dest) {
    return val.split(org).join(dest);
  };

  Utils.prototype.sort = function(arr, para, desc) {
    if (desc === void 0) {
      desc = false;
    }
    if (desc) {
      return arr.sort(function(a, b) {
        return b[para] - a[para];
      });
    } else {
      return arr.sort(function(a, b) {
        return a[para] - b[para];
      });
    }
  };

  Utils.prototype.unique = function() {
    return new Date().getTime();
  };

  Utils.prototype.numStr = function(num, keta) {
    var i, len, str;
    str = String(num);
    if (str.length >= keta) {
      return str;
    }
    len = keta - str.length;
    i = 0;
    while (i < len) {
      str = "0" + str;
      i++;
    }
    return str;
  };

  Utils.prototype.buttonMode = function(flg) {
    if (flg) {
      return $("body").css("cursor", "pointer");
    } else {
      return $("body").css("cursor", "default");
    }
  };

  Utils.prototype.getQuery = function(key) {
    var qs, regex;
    key = key.replace(/[€[]/, "€€€[").replace(/[€]]/, "€€€]");
    regex = new RegExp("[€€?&]" + key + "=([^&#]*)");
    qs = regex.exec(window.location.href);
    if (qs === null) {
      return "";
    } else {
      return qs[1];
    }
  };

  Utils.prototype.hash = function() {
    return location.hash.replace("#", "");
  };

  Utils.prototype.isSmt = function() {
    return navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0;
  };

  Utils.prototype.isAndroid = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('BlackBerry') > 0 || u.indexOf('Android') > 0 || u.indexOf('Windows Phone') > 0;
  };

  Utils.prototype.isIos = function() {
    return navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0;
  };

  Utils.prototype.isPs3 = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('PLAYSTATION 3') > 0;
  };

  Utils.prototype.isVita = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('PlayStation Vita') > 0;
  };

  Utils.prototype.isIe8Under = function() {
    var msie;
    msie = navigator.appVersion.toLowerCase();
    msie = msie.indexOf('msie') > -1 ? parseInt(msie.replace(/.*msie[ ]/, '').match(/^[0-9]+/)) : 0;
    return msie <= 8 && msie !== 0;
  };

  Utils.prototype.isIe9Under = function() {
    var msie;
    msie = navigator.appVersion.toLowerCase();
    msie = msie.indexOf('msie') > -1 ? parseInt(msie.replace(/.*msie[ ]/, '').match(/^[0-9]+/)) : 0;
    return msie <= 9 && msie !== 0;
  };

  Utils.prototype.isIe = function() {
    var ua;
    ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('msie') !== -1 || ua.indexOf('trident/7') !== -1;
  };

  Utils.prototype.isIpad = function() {
    return navigator.userAgent.indexOf('iPad') > 0;
  };

  Utils.prototype.isTablet = function() {
    return this.isIpad() || (this.isAndroid() && navigator.userAgent.indexOf('Mobile') === -1);
  };

  Utils.prototype.isWin = function() {
    return navigator.platform.indexOf("Win") !== -1;
  };

  Utils.prototype.isChrome = function() {
    return navigator.userAgent.indexOf('Chrome') > 0;
  };

  Utils.prototype.isFF = function() {
    return window.navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  };

  Utils.prototype.isIOSUiView = function() {
    var a;
    a = window.navigator.userAgent.toLowerCase();
    return (this.isIos() && a.indexOf('safari') === -1) || (this.isIos() && a.indexOf('crios') > 0) || (this.isIos() && a.indexOf('gsa') > 0);
  };

  Utils.prototype.getCookie = function(key) {
    var a, arr, i, l, len1, val;
    if (document.cookie === void 0 || document.cookie === null) {
      return null;
    }
    arr = document.cookie.split("; ");
    for (i = l = 0, len1 = arr.length; l < len1; i = ++l) {
      val = arr[i];
      a = val.split("=");
      if (a[0] === key) {
        return a[1];
      }
    }
    return null;
  };

  Utils.prototype.setCookie = function(key, val) {
    return document.cookie = key + "=" + val;
  };

  Utils.prototype.windowHeight = function() {
    return $(document).height();
  };

  Utils.prototype.scrollTop = function() {
    return Math.max($(window).scrollTop(), $(document).scrollTop());
  };

  Utils.prototype.getHexColor = function(r, g, b) {
    var str;
    str = (r << 16 | g << 8 | b).toString(16);
    return "#" + new Array(7 - str.length).join("0") + str;
  };

  Utils.prototype.price = function(num) {
    return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  };

  return Utils;

})();

module.exports = Utils;


},{}],6:[function(require,module,exports){
var BaseMgr, Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Utils = require('../Utils');

BaseMgr = (function() {
  function BaseMgr() {
    this._init = bind(this._init, this);
    this._u = new Utils();
  }

  BaseMgr.prototype._init = function() {};

  return BaseMgr;

})();

module.exports = BaseMgr;


},{"../Utils":5}],7:[function(require,module,exports){
var BaseMgr, ResizeMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseMgr = require('./BaseMgr');

ResizeMgr = (function(superClass) {
  extend(ResizeMgr, superClass);

  function ResizeMgr() {
    this.sh = bind(this.sh, this);
    this.sw = bind(this.sw, this);
    this._setStageSize = bind(this._setStageSize, this);
    this._eResize = bind(this._eResize, this);
    this.refresh = bind(this.refresh, this);
    this._init = bind(this._init, this);
    ResizeMgr.__super__.constructor.call(this);
    this._resizeList = [];
    this.ws = {
      w: 0,
      h: 0,
      oldW: -1,
      oldH: -1
    };
    this._init();
  }

  ResizeMgr.prototype._init = function() {
    ResizeMgr.__super__._init.call(this);
    $(window).bind("resize", this._eResize);
    return this._setStageSize();
  };

  ResizeMgr.prototype.add = function(func, isCall) {
    this._resizeList.push(func);
    if ((isCall != null) && isCall) {
      return func(this.ws.w, this.ws.h);
    }
  };

  ResizeMgr.prototype.remove = function(func) {
    var arr, i, j, len, ref, val;
    arr = [];
    ref = this._resizeList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val !== func) {
        arr.push(val);
      }
    }
    return this._resizeList = arr;
  };

  ResizeMgr.prototype.refresh = function() {
    return this._eResize();
  };

  ResizeMgr.prototype._eResize = function(e) {
    var i, j, len, ref, results, val;
    this._setStageSize();
    ref = this._resizeList;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      results.push(val(this.ws.w, this.ws.h));
    }
    return results;
  };

  ResizeMgr.prototype._setStageSize = function() {
    var h, w;
    if (this._u.isSmt()) {
      w = window.innerWidth;
      h = window.innerHeight;
    } else {
      if (this._u.isIe8Under()) {
        w = $(window).width();
        h = $(window).height();
      } else {
        w = $(window).width();
        h = window.innerHeight;
      }
    }
    this.ws.oldW = this.ws.w;
    this.ws.oldH = this.ws.h;
    this.ws.w = w;
    return this.ws.h = h;
  };

  ResizeMgr.prototype.sw = function() {
    return this.ws.w;
  };

  ResizeMgr.prototype.sh = function() {
    return this.ws.h;
  };

  return ResizeMgr;

})(BaseMgr);

module.exports = ResizeMgr;


},{"./BaseMgr":6}],8:[function(require,module,exports){
var BaseMgr, UpdateMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseMgr = require('./BaseMgr');

UpdateMgr = (function(superClass) {
  extend(UpdateMgr, superClass);

  function UpdateMgr(isRAF) {
    this._update = bind(this._update, this);
    this._init = bind(this._init, this);
    UpdateMgr.__super__.constructor.call(this);
    this._isRAF = isRAF || true;
    this._updateList = [];
    this._init();
  }

  UpdateMgr.prototype._init = function() {
    UpdateMgr.__super__._init.call(this);
    if (this._isRAF && (window.requestAnimationFrame != null)) {
      return window.requestAnimationFrame(this._update);
    } else {
      return setInterval(this._update, 1000 / 60);
    }
  };

  UpdateMgr.prototype.add = function(func) {
    return this._updateList.push(func);
  };

  UpdateMgr.prototype.remove = function(func) {
    var arr, i, j, len, ref, val;
    arr = [];
    ref = this._updateList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val !== func) {
        arr.push(val);
      }
    }
    return this._updateList = arr;
  };

  UpdateMgr.prototype._update = function() {
    var i, j, len, ref, val;
    ref = this._updateList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      val();
    }
    if (this._isRAF && (window.requestAnimationFrame != null)) {
      return window.requestAnimationFrame(this._update);
    }
  };

  return UpdateMgr;

})(BaseMgr);

module.exports = UpdateMgr;


},{"./BaseMgr":6}]},{},[3]);
