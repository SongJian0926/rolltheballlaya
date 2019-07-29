// 程序入口
var LayaAir3D = /** @class */ (function () {
    function LayaAir3D() {
        var _this = this;
        //初始化微信小游戏
        Laya.MiniAdpter.init();
        //初始化引擎(此处需要配置适配策略)
        Laya3D.init(1080, 1920, true);
        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
        Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
        Laya.SoundManager.playMusic("sounds/solstice.mp3");
        Laya.SoundManager.setMusicVolume(0.5);
        //加载2D界面资源
        Laya.loader.load(["res/atlas/img.atlas"], Laya.Handler.create(this, this.onUIComplete));
        //开启统计信息
        // Laya.Stat.show();
        //添加3D场景
        var scene = Laya.stage.addChild(new Laya.Scene());
        scene.ambientColor = new Laya.Vector3(0.85, 0.85, 0.85);
        //添加照相机
        var camera = (scene.addChild(new Laya.Camera(0, 0.1, 50)));
        camera.transform.position = new Laya.Vector3(0, 5, 11);
        camera.transform.localRotationEuler = new Laya.Vector3(-15, 0, 0);
        camera.clearColor = new Laya.Vector4(165 / 255, 233 / 255, 249 / 255, 1);
        //添加方向光
        var directionLight = scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(0.8, 0.7, 0.7);
        directionLight.direction = new Laya.Vector3(0.3, -1, 0);
        //添加灯光投影
        directionLight.shadow = true;
        //产生投影的范围（如过小将不会产生投影）
        directionLight.shadowDistance = 30;
        //生成阴影贴图数量
        directionLight.shadowPSSMCount = 1;
        //模糊等级,越大越高,效果更好，更耗性能
        directionLight.shadowPCFType = 2;
        //投影质量
        directionLight.shadowResolution = 2048;
        //开启雾化效果
        scene.enableFog = true;
        //设置雾化的颜色
        scene.fogColor = new Laya.Vector3(165 / 255, 233 / 255, 249 / 255);
        //设置雾化的起始位置，相对于相机的距离
        scene.fogStart = 10;
        //设置雾化最浓处的距离。
        scene.fogRange = 30;
        this.ball = scene.addChild(new Laya.MeshSprite3D(new Laya.SphereMesh(0.25, 16, 16), "ball"));
        this.ball.transform.position = new Laya.Vector3(.5, 0.75, 0);
        var ballMaterial = new Laya.StandardMaterial();
        // ballMaterial.albedo = new Laya.Vector4(252/255, 145/255, 58/255);
        ballMaterial.diffuseTexture = Laya.Texture2D.load("imgunpack/football.png");
        this.ball.meshRender.material = ballMaterial;
        this.ball.meshRender.castShadow = true;
        //左右指示器
        var arrow = new Laya.MeshSprite3D(new Laya.QuadMesh(4, 0.2));
        var arrowMaterial = new Laya.StandardMaterial();
        arrowMaterial.diffuseTexture = Laya.Texture2D.load("imgunpack/arrow.png");
        arrowMaterial.renderMode = Laya.StandardMaterial.RENDERMODE_TRANSPARENT;
        arrow.meshRender.material = arrowMaterial;
        arrow.transform.localScale = new Laya.Vector3(0, 1, 1);
        arrow.name = "arrow";
        scene.addChild(arrow);
        this.ballScript = this.ball.addComponent(UpdateRoadScript);
        this.ballScript.camera = camera;
        this.ballScript.arrow = arrow;
        this.ballScript.on("gameOver", this, this.gameOver);
        this.socket = new Laya.Socket();
        try {
            var _a = wx.getSystemInfoSync(), screenWidth = _a.screenWidth, screenHeight_1 = _a.screenHeight;
            this.bannerAd = wx.createBannerAd({
                adUnitId: 'adunit-63037bf236ffdad6',
                style: {
                    left: 0,
                    top: 0,
                    width: screenWidth
                }
            });
            this.bannerAd.onResize(function (res) {
                _this.bannerAd.style.top = screenHeight_1 - res.height;
            });
            this.videoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-e2288928960f3950' });
        }
        catch (e) { }
    }
    /*界面资源加载完成后*/
    LayaAir3D.prototype.onUIComplete = function () {
        //创建主界面
        this.mainUI = new MainView();
        //游戏中界面
        this.playingUI = new PlayingView();
        //GameOver界面
        this.gameOverUI = new GameOverView();
        //游戏结束复活页面
        this.gameOverVideoUI = new GameOverVideoView();
        //排行榜
        this.scoreBoardUI = new ScoreBoardView();
        //房间页面
        this.roomUI = new RoomView();
        this.roomUI.socket = this.socket;
        //监听控制界面按钮信息
        this.mainUI.on("btn_action", this, this.onBtnAction);
        this.gameOverUI.on("btn_action", this, this.onBtnAction);
        this.scoreBoardUI.on("btn_action", this, this.onBtnAction);
        this.roomUI.on("btn_action", this, this.onBtnAction);
        this.gameOverVideoUI.on("btn_action", this, this.onBtnAction);
        Laya.stage.addChild(this.mainUI);
        Laya.timer.once(1000, this, this.postScreenInfo);
    };
    LayaAir3D.prototype.postScreenInfo = function () {
        try {
            var data = { width: Laya.stage.width, height: Laya.stage.height };
            var message = { type: "ui_info", data: data };
            var openDataContext = wx.getOpenDataContext();
            var sharedCanvas = openDataContext.canvas;
            sharedCanvas.width = Laya.stage.width;
            sharedCanvas.height = Laya.stage.height;
            openDataContext.postMessage(message);
        }
        catch (e) { }
    };
    LayaAir3D.prototype.gameOver = function (score) {
        this.playingUI.removeSelf();
        this.score = score;
        try {
            this.bannerAd.show();
        }
        catch (e) { }
        if (this.isResurrected) {
            Laya.stage.addChild(this.gameOverUI);
            this.gameOverUI.lable_score.text = '你滚了' + score + 'm';
            Laya.SoundManager.playMusic("sounds/solstice.mp3");
            //上传分数
            try {
                var value = { wxgame: { score: score, update_time: Math.round(new Date().getTime() / 1000) } };
                var data = [{ key: 'frdscore', value: JSON.stringify(value) }];
                var message = { type: "rank_score", data: data };
                var openDataContext = wx.getOpenDataContext();
                openDataContext.postMessage(message);
            }
            catch (e) { }
        }
        else {
            Laya.stage.addChild(this.gameOverVideoUI);
            this.gameOverVideoUI.lable_score.text = '你滚了' + score + 'm';
        }
    };
    /*控制界面动作监听回调
     action:当前执行的控制名称
    */
    LayaAir3D.prototype.onBtnAction = function (action) {
        var _this = this;
        console.log(action);
        if (action != null && action.length > 0) {
            Laya.SoundManager.playSound("sounds/wood.mp3", 1);
            try {
                wx.vibrateShort({});
            }
            catch (e) { }
        }
        if (action == "Start") {
            this.mainUI.removeSelf();
            this.playingUI.lable_socre.text = '0 m';
            Laya.stage.addChild(this.playingUI);
            this.ballScript.setPlayingUI(this.playingUI);
            Laya.SoundManager.playMusic("sounds/music_play.mp3");
            this.ballScript.play();
            this.isResurrected = false;
        }
        else if (action == "Score") {
            this.mainUI.removeSelf();
            Laya.stage.addChild(this.scoreBoardUI);
            try {
                var rankTexture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
                rankTexture.bitmap.alwaysChange = true;
                this.scoreBoardUI.view_canvas_content.graphics.clear();
                this.scoreBoardUI.view_canvas_content.graphics.drawTexture(rankTexture, 0, 0, rankTexture.width, rankTexture.height);
            }
            catch (e) { }
        }
        else if (action == "Back") {
            this.scoreBoardUI.removeSelf();
            this.gameOverUI.removeSelf();
            Laya.stage.addChild(this.mainUI);
            this.ballScript.reset();
            try {
                this.bannerAd.hide();
            }
            catch (e) { }
        }
        else if (action == "Restart") {
            this.playingUI.lable_socre.text = '0 m';
            this.gameOverUI.removeSelf();
            Laya.stage.addChild(this.playingUI);
            this.ballScript.reset();
            this.ballScript.play();
            Laya.SoundManager.playMusic("sounds/music_play.mp3");
            try {
                this.bannerAd.hide();
            }
            catch (e) { }
            this.isResurrected = false;
        }
        else if (action == "Share") {
            try {
                var number = 1;
                if (this.score > 200) {
                    number = 2;
                }
                if (this.score > 400) {
                    number = 3;
                }
                if (this.score > 600) {
                    number = 4;
                }
                if (this.score > 800) {
                    number = 5;
                }
                wx.shareAppMessage({
                    title: "我在滚蛋吧滚了" + this.score + "m，你能滚多远？",
                    imageUrl: "https://wycode.cn/upload/image/roll/share" + number + ".png"
                });
            }
            catch (e) { }
        }
        else if (action == "MainShare") {
            try {
                var number = Math.ceil(Math.random() * 5);
                wx.shareAppMessage({
                    title: "一起来玩滚蛋吧，看谁滚的远！",
                    imageUrl: "https://wycode.cn/upload/image/roll/share" + number + ".png"
                });
            }
            catch (e) { }
        }
        else if (action == "Voice") { //声音开关
            Laya.SoundManager.muted = !Laya.SoundManager.muted;
            if (Laya.SoundManager.muted) {
                this.mainUI.btn_voice._addChildsToLayout;
                this.mainUI.btn_voice.skin = 'img/mute.png';
            }
            else {
                this.mainUI.btn_voice.skin = 'img/unmute.png';
            }
        }
        else if (action == "Room") {
            this.mainUI.removeSelf();
            Laya.stage.addChild(this.roomUI);
            this.roomUI.joinRoom();
        }
        else if (action == "RoomBack") {
            this.roomUI.leaveRoom();
            this.roomUI.removeSelf();
            Laya.stage.addChild(this.mainUI);
        }
        else if (action == "Skip") {
            this.gameOverVideoUI.removeSelf();
            this.isResurrected = true; //放弃复活
            this.gameOver(this.score);
        }
        else if (action == "Watch") {
            try {
                this.videoAd.show()
                    .catch(function (err) {
                    console.log(err);
                    _this.videoAd.load()
                        .then(function () { return _this.videoAd.show(); });
                });
                Laya.SoundManager.stopAll();
                this.videoAd.onClose(function (res) {
                    // 用户点击了【关闭广告】按钮
                    // 小于 2.1.0 的基础库版本，res 是一个 undefined
                    if (res && res.isEnded || res === undefined) {
                        // 正常播放结束，可以下发游戏奖励
                        _this.bannerAd.hide();
                        //复活
                        _this.ballScript.resurrect();
                        _this.gameOverVideoUI.removeSelf();
                        Laya.stage.addChild(_this.playingUI);
                        _this.isResurrected = true;
                    }
                    Laya.SoundManager.playMusic("sounds/music_play.mp3");
                });
            }
            catch (e) { }
        }
    };
    return LayaAir3D;
}());
new LayaAir3D();
//# sourceMappingURL=LayaAir3D.js.map