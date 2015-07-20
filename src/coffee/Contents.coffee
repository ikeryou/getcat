ObjObject = require('./ObjObject');
DStateChecker = require('./DStateChecker');


# ---------------------------------------------------
# コンテンツ
# ---------------------------------------------------
class Contents
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    # シーン
    @_scene;
    
    # カメラ
    @_camera;
    
    # ライト
    @_ambLight;
    @_dLight;
    
    # レンダラー
    @_renderer;
    
    # 軸ヘルパー
    @_hAxis;
    
    # トラックボール
    @_trackBall;
    
    # デバイス監視
    @_checker;
    
    
    @_obj;
    
    @_floor = 30;
    
    
    
    
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  init: =>
    
    # シーン
    @_scene = new THREE.Scene();
    
    # カメラ
    @_camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
    
    # ライト 環境光
    @_ambLight = new THREE.AmbientLight(0xffffff);
    @_scene.add(@_ambLight);
    @_ambLight.position.set(0, 0, 0);
#     @_dLight = new THREE.DirectionalLight(0xffffff, 1);
#     @_dLight.position.set( 0, 0, -50 );
#     @_scene.add(@_dLight);
    
    # レンダラー
    @_renderer = new THREE.WebGLRenderer({
      antialias:false
    });
    if window.devicePixelRatio?
      @_renderer.setPixelRatio(window.devicePixelRatio);
    @_renderer.setClearColor(0x000000);
    $("#main").append(@_renderer.domElement);
    
    # どこからでもアクセスできるように
    MY.con = {};
    MY.con.scene    = @_scene;
    MY.con.camera   = @_camera;
    MY.con.renderer = @_renderer;
    
    
    # トラックボール
#     @_trackBall = new THREE.TrackballControls(@_camera);
#     @_trackBall.staticMoving = true;
#     @_trackBall.target = new THREE.Vector3(0, 0, 0);
    
    # 軸ヘルパー
    #@_hAxis = new THREE.AxisHelper(200);
    #@_scene.add(@_hAxis);
    
    
    # デバイス監視
    @_checker = new DStateChecker();
    @_checker.init();
    @_checker.onMoveDevice = @_eMoveDevice;
    
    
    @_add3DModel();
    
    
    MY.resize.add(@_resize, true);
    MY.update.add(@_update);
  
  
  # -----------------------------------
  # 3Dモデル配置
  # -----------------------------------
  _add3DModel: =>
    
    if @_obj?
      @_obj.dispose();
      @_obj = null;
    
    switch 0
      when 0
        param = [
          "./assets/3d/Cat_OrangeTabby/Cat_OrgTabby.obj",
          "./assets/3d/Cat_OrangeTabby/Cat_Tabby_Org_512.jpg"
        ];
      else
        param = [
          "./assets/3d/android.obj"
        ];
    
    @_obj = new ObjObject(param);
    @_obj.init();
    @_obj.onClear = @_eClear;
  
  
  
  # -----------------------------------
  # resize
  # -----------------------------------
  _resize: (w, h) =>
    
    $("#main").css({
      width:w,
      height:h
    });
    
    # ピクセル等倍にする
    @_camera.aspect = w / h;
    @_camera.updateProjectionMatrix();
    cameraZ = -(h / 2) / Math.tan((@_camera.fov * Math.PI / 180) / 2);
    @_camera.position.set(0, @_floor, cameraZ);
    @_camera.lookAt(new THREE.Vector3(0, 0, 0));
    #@_camera.position.set(0, 0, 0);
    
    @_renderer.setSize(w, h);
  
  
  # -----------------------------------
  # update
  # -----------------------------------
  _update: =>
    
    # 歩いてるように見せる
    if @_obj? && !@_obj.isBareta()
      @_camera.position.y = @_floor + Math.sin(Date.now() * 0.0015) * 20;
      @_camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    #@_trackBall.update();
    @_renderer.render(@_scene, @_camera);
   
  
  
  # -----------------------------------
  # イベント 猫捕まえた
  # -----------------------------------
  _eClear: =>
    
    alert("つかまえました！");
    @_add3DModel();
    @_checker.resume();
    
  
  
  # -----------------------------------
  # イベント デバイス動いた
  # -----------------------------------
  _eMoveDevice: =>
    
    if @_obj?
      @_obj.setBareta();
    
      setTimeout(=>
        alert("スマホを動かしたので\n気づかれてしまいました。。。");
        @_obj.reStart();
        @_checker.resume();
      , 1000);






























module.exports = Contents;