

# ---------------------------------------------------
# 端末の状態監視
# ---------------------------------------------------
class DStateChecker
  
  
  # -----------------------------------------------
  # コンストラクタ 
  # -----------------------------------------------
  constructor: ->
    
    
    @_ac = {};
    
    
    @_isMoved = false
    @_delay = 0;
    
    # コールバック デバイス動いた 一度だけ呼ばれる
    @onMoveDevice;
    
    
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  init: =>
    
    # 傾き監視
    window.addEventListener("devicemotion", @_eDeviceMotion);
    
  
  # -----------------------------------------------
  # 再び監視
  # -----------------------------------------------
  resume: =>
    
    @_isMoved = false;
    @_ac.sx = null;
    @_delay = -5;
    
  
  # -----------------------------------------------
  # イベント 傾き取得
  # -----------------------------------------------
  _eDeviceMotion: (e) =>
    
    ac = e.accelerationIncludingGravity;  
    if ac? && ++@_delay > 0
      
      if @_ac.sx? && !@_isMoved
        p = 0.225;
        if Math.abs(ac.x - @_ac.sx) > p || Math.abs(ac.y - @_ac.sy) > p || Math.abs(ac.z - @_ac.sz) > p
          @_isMoved = true;
          if @onMoveDevice? then @onMoveDevice();
      else
        @_ac.sx = ac.x;
        @_ac.sy = ac.y;
        @_ac.sz = ac.z;






module.exports = DStateChecker;