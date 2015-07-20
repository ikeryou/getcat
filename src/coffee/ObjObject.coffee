

# ---------------------------------------------------
# obj3Dデータ
# ---------------------------------------------------
class ObjObject
  
  
  # -----------------------------------------------
  # コンストラクタ
  # @param : 
  # -----------------------------------------------
  constructor: (param) ->
    
    @_param = param;
    
    @_container;
    @_objMesh;
    
    @_defZ = 500;
    @_defRY = 45;
    
    @_isBareta = false;
    @_isClear = false;
    
    
    # コールバック 捕まえた
    @onClear;
    
    
    
    
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  init: =>
    
    @_container = new THREE.Object3D();
    MY.con.scene.add(@_container);
    s = 3;
    @_container.scale.set(s, s, s);
    @reStart();
    
    # obj読み込み
    objLoader = new THREE.OBJLoader();
    objLoader.load(@_param[0], @_eCompleteObj);
    
    
    
    
    MY.update.add(@_update);
  
  
  
  # -----------------------------------
  # イベント obj読み込み完了
  # -----------------------------------
  _eCompleteObj: (obj) =>
    
    if !@_container?
      return;
    
    obj.traverse((child) =>
      if (child instanceof THREE.Mesh)
        
#         normalMaterial = new THREE.MeshPhongMaterial();
#         normalMaterial.map = THREE.ImageUtils.loadTexture(@_param[1]);
#         normalMaterial.normalMap = THREE.ImageUtils.loadTexture(@_param[2]);
#         normalMaterial.side = THREE.DoubleSide;
#         child.material = normalMaterial;
        
        if @_param[1]?
          child.material.map = THREE.ImageUtils.loadTexture(@_param[1]);
        #child.material.wireframe = true;
        child.material.side = THREE.DoubleSide;
        
        # 原点を真ん中に
        child.geometry.computeBoundingBox();
        b = child.geometry.boundingBox;
        child.position.x = -b.min.x - (b.max.x - b.min.x) * 0.5;
        child.position.y = -b.min.y - (b.max.y - b.min.y) * 0.5;
        child.position.z = -b.min.z - (b.max.z - b.min.z) * 0.5;
        
        @_objMesh = child;
        @_container.add(@_objMesh);
    );
    
    
  # -----------------------------------
  # 最初から
  # -----------------------------------
  reStart: =>
    
    @_isBareta = false;
    @_isClear = false;
    @_container.position.z = @_defZ;
    @_container.rotation.y = MY.u.radian(MY.u.range(60));
   
  
  
  # -----------------------------------
  # ばれたときの演出
  # -----------------------------------
  setBareta: =>
    
    @_isBareta = true;
    #@_container.rotation.y = MY.u.radian(180);
  
  
  # -----------------------------------
  # update
  # -----------------------------------
  _update: =>
    
    if @_isClear
      return;
    
    if !@_isBareta
      
      # 前面へ
      @_container.position.z -= 2;
      if @_container.position.z < -400
        @_isClear = true;
        if @onClear? then @onClear();
    
    else
      
      ty = MY.u.radian(180);
      @_container.rotation.y += (ty - @_container.rotation.y) * 0.1;
  
  
  # -----------------------------------
  # コンテナ取得
  # -----------------------------------
  getCon: =>
    
    return @_container;
    
  
  # -----------------------------------
  # 
  # -----------------------------------
  isBareta: =>
    
    return @_isBareta;
  
  
  # -----------------------------------
  # 破棄
  # -----------------------------------
  dispose: =>
    
    MY.update.remove(@_update);
    
    if @_objMesh?
      @_container.remove(@_objMesh);
      @_objMesh.geometry.dispose();
      @_objMesh.material.dispose();
      @_objMesh = null;
    
    if @_container?
      MY.con.scene.remove(@_container);
      @_container = null;
    
    @_param = null;
    @onClear = null;





















module.exports = ObjObject;