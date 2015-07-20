UpdateMgr = require('./libs/mgr/UpdateMgr');
ResizeMgr = require('./libs/mgr/ResizeMgr');
Utils = require('./libs/Utils');
Contents = require('./Contents');


# ------------------------------------
# メイン
# ------------------------------------
class Main
  
  # ------------------------------------
  # コンストラクタ
  # ------------------------------------
  constructor: ->
    
   
  
  
  
  # ------------------------------------
  # 初期化
  # ------------------------------------
  init: =>
    
    # app専用オブジェクト
    window.MY = {};
    
    # ユーティリティー
    window.MY.u = new Utils();
    
    # 画面更新管理
    window.MY.update = new UpdateMgr();
    
    # リサイズ管理
    window.MY.resize = new ResizeMgr();
    
    c = new Contents();
    c.init();






$(window).ready(=>
  app = new Main();
  app.init();
);