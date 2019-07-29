var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var UpdateRoadScript = /** @class */ (function (_super) {
    __extends(UpdateRoadScript, _super);
    function UpdateRoadScript() {
        var _this = _super.call(this) || this;
        _this.showingRoads = [];
        _this.showingClouds = [];
        _this.showingShadows = [];
        _this.roadWidth = 8;
        _this.recycleNormal = [];
        _this.recycleHole = [];
        _this.recycleLarger = [];
        _this.recycleSmaller = [];
        _this.recycleFaster = [];
        _this.recycleSlower = [];
        _this.recycleHeavier = [];
        _this.recycleLighter = [];
        _this.recycleCloud = [];
        _this.recycleShadow = [];
        _this.probNull = 0.01;
        _this.probLarger = 0.005;
        _this.probSmaller = 0.01;
        _this.probFaster = 0.005;
        _this.probSlower = 0.005;
        _this.probHeavier = 0.005;
        _this.probLighter = 0.005;
        _this.probCloud = 0.2;
        _this.random = new Laya.Rand(new Date().getMilliseconds());
        _this.maxRowDistence = 26;
        _this.firstRowZ = 7.5;
        _this.currentTouchX = 0;
        _this.speedX = 0;
        _this.speedY = 0;
        _this.speedZ = -4;
        _this.gameOverSpeedZ = -4;
        _this.ballRadius = 0.25;
        _this.playing = false;
        _this.score = 0;
        _this.cameraDistence = new Laya.Vector3(); //间距
        _this.cameraPosition = new Laya.Vector3();
        _this.isPlayingFalling = false;
        _this.mass = 1.8; //质量
        _this.playFallingOverHandler = new Laya.Handler(_this, _this.playFallingOver);
        _this.startPlayCountNumber = 3;
        _this.tips = ["小提示：吃到红色道具可以变大哦！", "小提示：吃到紫色道具会变小哦！", "小提示：吃到蓝色道具前进速度会变快哦！", "小提示：吃到黄色道具前进速度会变慢哦！", "小提示：吃到黑色道具小球会变重哦！", "小提示：吃到白色道具小球会变轻哦！"];
        _this.lastCreateShadowTime = 0;
        Laya.stage.on(Laya.Event.MOUSE_MOVE, _this, _this.onMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, _this, _this.onMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, _this, _this.onMouseMove);
        return _this;
    }
    UpdateRoadScript.prototype.reset = function () {
        this.score = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.speedZ = -4;
        this.ballRadius = 0.25;
        this.mass = 1.8;
        this.ballPostion = new Laya.Vector3(.5, 0.75, 0);
        this.probNull = 0.01;
        this.ball.transform.position = this.ballPostion;
        this.ball.transform.localScale = Laya.Vector3.ONE;
        Laya.Vector3.add(this.ball.transform.position, this.cameraDistence, this.cameraPosition);
        this.camera.transform.position = this.cameraPosition;
        this.arrow.transform.localScale = new Laya.Vector3(0, 1, 1);
        this.arrow.transform.position = this.ballPostion;
        this.currentTouchX = 0;
        this.firstRowZ = 7.5;
        this.random = new Laya.Rand(new Date().getMilliseconds());
        this.recycleAll();
        this.initStartRows();
    };
    UpdateRoadScript.prototype._load = function (owner) {
        //获取脚本所属对象
        this.ball = owner;
        this.ball.meshRender.castShadow = true;
        this.ballPostion = this.ball.transform.position;
        //球体幻影
        this.shadowPrefab = new Laya.MeshSprite3D(new Laya.SphereMesh(0.25, 16, 16), "ballShadow");
        this.shadowPrefab.transform.scale = new Laya.Vector3(0.8, 0.8, 0.8);
        var shadowMaterial = new Laya.StandardMaterial();
        shadowMaterial.albedo = new Laya.Vector4(.5, 1, 1, 0.2);
        shadowMaterial.renderMode = Laya.StandardMaterial.RENDERMODE_TRANSPARENT;
        this.shadowPrefab.meshRender.material = shadowMaterial;
        //普通方块
        this.normalPrefab = new Laya.MeshSprite3D(new Laya.BoxMesh(1, 1.1, 1), "normal");
        var material = new Laya.StandardMaterial();
        material.albedo = new Laya.Vector4(153 / 255, 241 / 255, 158 / 255);
        this.normalPrefab.meshRender.material = material;
        this.normalPrefab.meshRender.receiveShadow = true;
        //变大
        this.largerPrefab = this.normalPrefab.clone();
        this.largerPrefab.name = "larger";
        var prop = new Laya.MeshSprite3D(new Laya.BoxMesh(.3, .3, .3));
        prop.meshRender.castShadow = true;
        var largerMaterial = new Laya.StandardMaterial();
        largerMaterial.albedo = new Laya.Vector4(.91, .12, .39);
        largerMaterial.specularColor = new Laya.Vector4(.1, .1, .1, 1);
        prop.meshRender.material = largerMaterial;
        this.largerPrefab.addChild(prop);
        prop.transform.localPosition = new Laya.Vector3(0, 0.76, 0);
        prop.transform.localRotationEuler = new Laya.Vector3(45, 0, 45);
        //变小
        this.smallPrefab = this.largerPrefab.clone();
        this.smallPrefab.name = "smaller";
        this.smallPrefab.getChildAt(0).meshRender.material.albedo = new Laya.Vector4(.61, .15, 0.69);
        //变快
        this.fasterPrefab = this.largerPrefab.clone();
        this.fasterPrefab.name = "faster";
        this.fasterPrefab.getChildAt(0).meshRender.material.albedo = new Laya.Vector4(.01, 0.66, 0.96);
        //变慢
        this.slowerPrefab = this.largerPrefab.clone();
        this.slowerPrefab.name = "slower";
        this.slowerPrefab.getChildAt(0).meshRender.material.albedo = new Laya.Vector4(.80, 0.86, 0.22);
        //变重
        this.heavierPrefab = this.largerPrefab.clone();
        this.heavierPrefab.name = "heavier";
        this.heavierPrefab.getChildAt(0).meshRender.material.albedo = new Laya.Vector4(.15, 0.20, 0.22);
        //变轻
        this.lighterPrefab = this.largerPrefab.clone();
        this.lighterPrefab.name = "lighter";
        this.lighterPrefab.getChildAt(0).meshRender.material.albedo = new Laya.Vector4(.93, 0.94, 0.95);
        this.holePrefab = new Laya.Sprite3D("hole");
        //云朵
        var cloudTexture1 = Laya.Texture2D.load("imgunpack/cloud1.png");
        var cloudTexture2 = Laya.Texture2D.load("imgunpack/cloud2.png");
        this.cloudPrefab = new Cloud();
        this.cloudPrefab.meshFilter.sharedMesh = new Laya.QuadMesh(5, 2);
        this.cloudPrefab.name = "cloud";
        this.cloudMaterial1 = new Laya.StandardMaterial();
        this.cloudMaterial1.albedo = new Laya.Vector4(1, 1, 1, 0.3);
        this.cloudMaterial1.ambientColor = new Laya.Vector3(2, 2, 2);
        this.cloudMaterial1.diffuseTexture = cloudTexture1;
        this.cloudMaterial1.renderMode = Laya.StandardMaterial.RENDERMODE_TRANSPARENT;
        this.cloudMaterial2 = new Laya.StandardMaterial();
        this.cloudMaterial2.albedo = new Laya.Vector4(1, 1, 1, 0.3);
        this.cloudMaterial2.ambientColor = new Laya.Vector3(2, 2, 2);
        this.cloudMaterial2.diffuseTexture = cloudTexture2;
        this.cloudMaterial2.renderMode = Laya.StandardMaterial.RENDERMODE_TRANSPARENT;
        this.initStartRows();
    };
    UpdateRoadScript.prototype._start = function (state) {
        Laya.Vector3.subtract(this.camera.transform.position, this.ball.transform.position, this.cameraDistence);
    };
    UpdateRoadScript.prototype.initStartRows = function () {
        while (this.firstRowZ > -this.maxRowDistence) {
            this.createRow();
        }
    };
    UpdateRoadScript.prototype.createCloud = function () {
        var random = this.random.getFloat();
        var cloud;
        if (this.recycleCloud.length > 0) {
            cloud = this.recycleCloud.shift();
            cloud.active = true;
        }
        else {
            cloud = this.ball.scene.addChild(this.cloudPrefab.clone());
        }
        //位置x从路左边+3到路右边+3
        var x = (this.roadWidth + 6) * random - (this.roadWidth + 6) / 2;
        //位置y从路上方3~10
        var y = random * 7 + 3;
        //倍率从0.2~1
        var radio = random * 0.8 + 0.2;
        //方向要么1要么-1
        var direction = random < 0.5 ? 1 : -1;
        // console.log(direction)
        cloud.transform.scale = new Laya.Vector3(1 * radio * direction, 1 * radio, 1 * radio);
        cloud.transform.position = new Laya.Vector3(x, y, this.firstRowZ);
        cloud.speedX = random - 0.5;
        cloud.speedZ = this.random.getFloat() * 0.5;
        //贴图要么1号要么2号
        cloud.meshRender.material = random < 0.5 ? this.cloudMaterial1 : this.cloudMaterial2;
        this.showingClouds.push(cloud);
    };
    UpdateRoadScript.prototype.createRow = function () {
        this.firstRowZ -= 1;
        for (var i = 0; i < this.roadWidth; i++) {
            var floorOne;
            var random = this.random.getFloat();
            //解决开始就掉下去的情况
            if (this.firstRowZ > -5) {
                random += this.probNull;
            }
            if (random < this.probNull) { //洞
                if (this.recycleHole.length > 0) {
                    floorOne = this.recycleHole.shift();
                }
                else {
                    floorOne = this.ball.scene.addChild(this.holePrefab.clone());
                }
            }
            else if (random < this.probNull + this.probLarger) { //变大
                if (this.recycleLarger.length > 0) {
                    floorOne = this.recycleLarger.shift();
                    var prop = floorOne.getChildAt(0);
                    prop.active = true;
                }
                else {
                    floorOne = this.ball.scene.addChild(this.largerPrefab.clone());
                }
            }
            else if (random < this.probNull + this.probLarger + this.probSmaller) { //变小
                if (this.recycleSmaller.length > 0) {
                    floorOne = this.recycleSmaller.shift();
                    var prop = floorOne.getChildAt(0);
                    prop.active = true;
                }
                else {
                    floorOne = this.ball.scene.addChild(this.smallPrefab.clone());
                }
            }
            else if (random < this.probNull + this.probLarger + this.probSmaller + this.probFaster) { //变快
                if (this.recycleFaster.length > 0) {
                    floorOne = this.recycleFaster.shift();
                    var prop = floorOne.getChildAt(0);
                    prop.active = true;
                }
                else {
                    floorOne = this.ball.scene.addChild(this.fasterPrefab.clone());
                }
            }
            else if (random < this.probNull + this.probLarger + this.probSmaller + this.probFaster + this.probSlower) { //变慢
                if (this.recycleSlower.length > 0) {
                    floorOne = this.recycleSlower.shift();
                    var prop = floorOne.getChildAt(0);
                    prop.active = true;
                }
                else {
                    floorOne = this.ball.scene.addChild(this.slowerPrefab.clone());
                }
            }
            else if (random < this.probNull + this.probLarger + this.probSmaller + this.probFaster + this.probSlower + this.probHeavier) { //变重
                if (this.recycleHeavier.length > 0) {
                    floorOne = this.recycleHeavier.shift();
                    var prop = floorOne.getChildAt(0);
                    prop.active = true;
                }
                else {
                    floorOne = this.ball.scene.addChild(this.heavierPrefab.clone());
                }
            }
            else if (random < this.probNull + this.probLarger + this.probSmaller + this.probFaster + this.probSlower + this.probHeavier + this.probLighter) { //变轻
                if (this.recycleLighter.length > 0) {
                    floorOne = this.recycleLighter.shift();
                    var prop = floorOne.getChildAt(0);
                    prop.active = true;
                }
                else {
                    floorOne = this.ball.scene.addChild(this.lighterPrefab.clone());
                }
            }
            else { //普通方块
                if (this.recycleNormal.length > 0) {
                    floorOne = this.recycleNormal.shift();
                }
                else {
                    floorOne = this.ball.scene.addChild(this.normalPrefab.clone());
                }
            }
            //调整位置到行内,依次排过来
            floorOne.active = true;
            floorOne.transform.position = new Laya.Vector3(-3.5 + i, 0, this.firstRowZ);
            //设置道具方向随机
            if (floorOne.numChildren > 0) {
                var prop = floorOne.getChildAt(0);
                var rY = Math.floor(this.random.getFloat() * 360);
                prop.transform.rotate(new Laya.Vector3(0, rY, 0), false);
            }
            this.showingRoads.push(floorOne);
            if (i % this.roadWidth == 0 && random < this.probCloud) { //每行都有概率生成云朵
                this.createCloud();
            }
        }
    };
    UpdateRoadScript.prototype.rotateProps = function () {
        for (var _i = 0, _a = this.showingRoads; _i < _a.length; _i++) {
            var road = _a[_i];
            if (road.name == 'larger' || road.name == 'smaller' || road.name == 'faster' || road.name == 'slower' || road.name == 'heavier' || road.name == 'lighter') {
                var prop = road.getChildAt(0);
                var rY = Laya.timer.delta / 500;
                prop.transform.rotate(new Laya.Vector3(0, rY, 0), false);
            }
        }
    };
    UpdateRoadScript.prototype.recycleRow = function () {
        for (var _i = 0, _a = this.showingRoads.splice(0, this.roadWidth); _i < _a.length; _i++) {
            var road = _a[_i];
            this.recycleOne(road);
        }
    };
    UpdateRoadScript.prototype.recycleOne = function (road) {
        road.active = false;
        if (road.name == 'normal') {
            this.recycleNormal.push(road);
        }
        else if (road.name == 'hole') {
            this.recycleHole.push(road);
        }
        else if (road.name == 'larger') {
            this.recycleLarger.push(road);
        }
        else if (road.name == 'smaller') {
            this.recycleSmaller.push(road);
        }
        else if (road.name == 'faster') {
            this.recycleFaster.push(road);
        }
        else if (road.name == 'slower') {
            this.recycleSlower.push(road);
        }
        else if (road.name == 'heavier') {
            this.recycleHeavier.push(road);
        }
        else if (road.name == 'lighter') {
            this.recycleLighter.push(road);
        }
    };
    UpdateRoadScript.prototype.recycleAll = function () {
        for (var _i = 0, _a = this.showingRoads.splice(0); _i < _a.length; _i++) {
            var road = _a[_i];
            this.recycleOne(road);
        }
    };
    UpdateRoadScript.prototype._update = function (state) {
        //道具旋转
        this.rotateProps();
        if (!this.playing) {
            return;
        }
        if (this.ball.transform.position.z - this.firstRowZ < this.maxRowDistence) {
            this.createRow();
            this.score++;
            this.playingUI.lable_socre.text = this.score + ' m';
            if (this.probNull < 0.9) { //出现空的概率不能超过0.9
                this.probNull += 0.0005; //走的越远 出现洞的几率越大
            }
            this.recycleRow();
        }
        //云朵在摄像机后时，回收云朵
        if (this.showingClouds.length > 0 && this.showingClouds[0].transform.position.z > this.camera.position.z) {
            var cloud = this.showingClouds.shift();
            cloud.active = false;
            this.recycleCloud.push(cloud);
        }
        //左右移动
        this.speedX += this.currentTouchX / this.mass * Laya.timer.delta;
        //向下掉
        if (this.checkFalling()) {
            if (!this.isPlayingFalling) {
                Laya.SoundManager.playSound("sounds/falling.mp3", 1, this.playFallingOverHandler);
                this.isPlayingFalling = true;
            }
            this.speedY += -9.8 * Laya.timer.delta;
            this.speedX = 0;
            this.speedZ = 0;
        }
        else {
            this.gameOverSpeedZ = this.speedZ;
        }
        this.checkCollision();
        this.moveCloud();
        var deltaX = this.speedX * Laya.timer.delta / 100000;
        //let deltaX = 0;
        //向前移动
        var deltaZ = this.speedZ * Laya.timer.delta / 1000;
        // let deltaZ = 0;
        var deltaY = this.speedY * Laya.timer.delta / 1000000;
        this.ball.transform.rotate(new Laya.Vector3(deltaZ / this.ballRadius / 2.4, 0, -deltaX / this.ballRadius / 2.4), false);
        Laya.Vector3.add(this.ballPostion, new Laya.Vector3(deltaX, deltaY, deltaZ), this.ballPostion);
        this.ball.transform.position = this.ballPostion;
        this.arrow.transform.position = this.ballPostion;
        Laya.Vector3.add(this.ball.transform.position, this.cameraDistence, this.cameraPosition);
        this.camera.transform.position = this.cameraPosition;
        var now = Date.now();
        //每隔0.1s创建一个
        if (now - this.lastCreateShadowTime > 100) {
            this.createShadow();
            this.lastCreateShadowTime = now;
        }
        this.smallShadow();
        this.recycleLastShadow();
        if (this.ballPostion.y < -15) {
            this.gameOver();
        }
    };
    UpdateRoadScript.prototype.recycleLastShadow = function () {
        //大小小于0.1就回收
        if (this.showingShadows.length > 0 && this.showingShadows[0].scale < 0.1) {
            var lastShadow = this.showingShadows.shift();
            lastShadow.active = false;
            this.recycleShadow.push(lastShadow);
        }
    };
    UpdateRoadScript.prototype.smallShadow = function () {
        for (var _i = 0, _a = this.showingShadows; _i < _a.length; _i++) {
            var shadow = _a[_i];
            shadow.scale = shadow.scale - 0.02;
            shadow.transform.scale = new Laya.Vector3(shadow.scale, shadow.scale, shadow.scale);
        }
    };
    UpdateRoadScript.prototype.createShadow = function () {
        var shadow;
        if (this.recycleShadow.length > 0) {
            shadow = this.recycleShadow.shift();
            shadow.active = true;
        }
        else {
            shadow = this.ball.scene.addChild(this.shadowPrefab.clone());
        }
        shadow.transform.position = this.ballPostion;
        shadow.scale = this.ballRadius / 0.25;
        this.showingShadows.push(shadow);
    };
    UpdateRoadScript.prototype.moveCloud = function () {
        for (var _i = 0, _a = this.showingClouds; _i < _a.length; _i++) {
            var cloud = _a[_i];
            var z = cloud.speedZ * this.speedZ * Laya.timer.delta / 1000;
            var x = cloud.speedX * Laya.timer.delta / 1000;
            cloud.transform.position = new Laya.Vector3(cloud.transform.position.x + x, cloud.transform.position.y, cloud.transform.position.z + z);
        }
    };
    UpdateRoadScript.prototype.playFallingOver = function () {
        this.isPlayingFalling = false;
    };
    UpdateRoadScript.prototype.gameOver = function () {
        this.playing = false;
        try {
            wx.vibrateLong({});
        }
        catch (e) { }
        this.event("gameOver", this.score);
    };
    UpdateRoadScript.prototype.checkCollisionOne = function (road) {
        var prop = road.getChildAt(0);
        if (prop && prop.active) {
            //不要计算开方，只比较平方大小，可以提高性能，并减少精度丢失
            if (Laya.Vector3.distanceSquared(this.ballPostion, prop.transform.position) > (0.25 + this.ballRadius) * (0.25 + this.ballRadius)) {
                return; //没撞上
            }
            if (road.name == 'larger') {
                this.ballRadius += 0.02;
                var scale = this.ballRadius / 0.25;
                this.ball.transform.localScale = new Laya.Vector3(scale, scale, scale);
                Laya.Vector3.add(this.ballPostion, new Laya.Vector3(0, 0.02, 0), this.ballPostion);
                Laya.SoundManager.playSound("sounds/larger.mp3", 1);
                prop.active = false;
            }
            else if (road.name == 'smaller') {
                this.ballRadius -= 0.02;
                var scale = this.ballRadius / 0.25;
                this.ball.transform.localScale = new Laya.Vector3(scale, scale, scale);
                Laya.Vector3.subtract(this.ballPostion, new Laya.Vector3(0, 0.02, 0), this.ballPostion);
                Laya.SoundManager.playSound("sounds/smaller.mp3", 1);
                prop.active = false;
            }
            else if (road.name == 'faster') {
                this.speedZ *= 1.1;
                Laya.SoundManager.playSound("sounds/faster.mp3", 1);
                prop.active = false;
            }
            else if (road.name == 'slower') {
                this.speedZ *= 0.9;
                Laya.SoundManager.playSound("sounds/slower.mp3", 1);
                prop.active = false;
            }
            else if (road.name == 'heavier') {
                this.mass *= 1.5;
                Laya.SoundManager.playSound("sounds/metal.mp3", 1);
                prop.active = false;
            }
            else if (road.name == 'lighter') {
                this.mass *= 0.75;
                Laya.SoundManager.playSound("sounds/wood.mp3", 1);
                prop.active = false;
            }
            // console.log(this.mass,this.ballRadius,this.speedZ)
            //需要更新小球的状态面板
            this.playingUI.setPropertyPanelInfo(this.mass, this.ballRadius, this.speedZ);
            //**这里不要try catch  很卡 */
            // wx.vibrateShort({})
        }
    };
    UpdateRoadScript.prototype.checkCollision = function () {
        // 65 是因为起始在球的后面创建了6行road，球的位置范围-5~5 
        //65+球的x位置 刚好就是要判断的方块  向下取整
        var centerIndex = Math.floor(52 + this.ballPostion.x);
        //外部需要遍历的块数
        var number = Math.floor(this.ballRadius * 2);
        for (var i = -number; i <= number; i++) {
            for (var j = -number; j <= number; j++) {
                var road = this.showingRoads[centerIndex + i + j * this.roadWidth];
                this.checkCollisionOne(road);
            }
        }
    };
    UpdateRoadScript.prototype.checkFalling = function () {
        //超出边缘
        if (Math.abs(this.ballPostion.x) - this.ballRadius > 4) {
            return true;
        }
        // 65 是因为起始在球的后面创建了6行road，球的位置范围-5~5 
        //65+球的x位置 刚好就是要判断的方块
        var centerIndex = Math.floor(52 + this.ballPostion.x);
        var centerRoad = this.showingRoads[centerIndex];
        if (centerRoad.name != "hole") {
            return false; //排除中心块不是洞的情况
        }
        //外部需要遍历的块数
        var number = Math.ceil(this.ballRadius * 2); // 半径大于1就永远掉不进去1块
        for (var i = -number; i <= number; i++) {
            for (var j = -number; j <= number; j++) {
                var road = this.showingRoads[centerIndex + i + j * this.roadWidth];
                //算法： https://www.zhihu.com/question/24251545/answer/27184960
                var vX = Math.abs(this.ballPostion.x - road.transform.position.x);
                var vY = Math.abs(this.ballPostion.z - road.transform.position.z);
                var uX = vX - 0.5;
                var uY = vY - 0.5;
                if (uX < 0)
                    uX = 0;
                if (uY < 0)
                    uY = 0;
                if ((uX * uX + uY * uY) <= 0.5625 * this.ballRadius * this.ballRadius) {
                    if (road.name != 'hole') { //有影响时，不是洞的话就认为掉不下去
                        return false;
                    }
                }
            }
        }
        return true;
        // console.log(i+road.name);
    };
    UpdateRoadScript.prototype.onMouseMove = function () {
        this.currentTouchX = Laya.MouseManager.instance.mouseX * 2 / Laya.stage.width - 1;
        this.arrow.transform.localScale = new Laya.Vector3(this.currentTouchX, 1, 1);
    };
    UpdateRoadScript.prototype.onMouseUp = function () {
        this.currentTouchX = 0;
        this.arrow.transform.localScale = new Laya.Vector3(this.currentTouchX, 1, 1);
    };
    UpdateRoadScript.prototype.onMouseDown = function () {
        this.playingUI.help_text.visible = false;
        this.playingUI.help_bar.visible = false;
        this.playingUI.help_finger.visible = false;
        this.playingUI.start_count.visible = true;
        this.playingUI.tips.visible = true;
        this.startPlayCountNumber = 3;
        this.startPlayCount();
        this.currentTouchX = Laya.MouseManager.instance.mouseX * 2 / Laya.stage.width - 1;
        this.arrow.transform.localScale = new Laya.Vector3(this.currentTouchX, 1, 1);
    };
    UpdateRoadScript.prototype.startPlayCount = function () {
        this.playingUI.start_count.text = this.startPlayCountNumber.toString();
        if (this.startPlayCountNumber == 0) {
            this.playingUI.start_count.visible = false;
            this.playingUI.tips.visible = false;
            this.playing = true;
        }
        else {
            Laya.timer.once(1000, this, this.startPlayCount);
            this.startPlayCountNumber--;
        }
    };
    UpdateRoadScript.prototype.addTouchDownOnce = function () {
        Laya.stage.once(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
    };
    UpdateRoadScript.prototype.play = function () {
        var number = Math.floor(this.random.getFloat() * 6);
        this.playingUI.tips.text = this.tips[number];
        if (this.playingUI.help_text.visible) {
            this.playingUI.fingerMove.play();
            Laya.timer.once(50, this, this.addTouchDownOnce);
        }
        else {
            this.playingUI.start_count.visible = true;
            this.playingUI.tips.visible = true;
            this.startPlayCountNumber = 3;
            this.startPlayCount();
        }
        this.playingUI.setPropertyPanelInfo(this.mass, this.ballRadius, this.speedZ);
    };
    UpdateRoadScript.prototype.setPlayingUI = function (playingUI) {
        this.playingUI = playingUI;
    };
    /**
     * 复活
     */
    UpdateRoadScript.prototype.resurrect = function () {
        this.ballPostion = new Laya.Vector3(0.5, 0.5 + this.ballRadius, this.ballPostion.z);
        this.ball.transform.position = this.ballPostion;
        this.arrow.transform.position = this.ballPostion;
        Laya.Vector3.add(this.ball.transform.position, this.cameraDistence, this.cameraPosition);
        this.camera.transform.position = this.cameraPosition;
        this.speedZ = this.gameOverSpeedZ;
        this.speedY = 0;
        //替换当前的15行地面
        var floorOne;
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < this.roadWidth; j++) {
                //正在显示的地面方块
                var road = this.showingRoads[i * this.roadWidth + j];
                //新创建一个普通方块
                if (this.recycleNormal.length > 0) {
                    floorOne = this.recycleNormal.shift();
                }
                else {
                    floorOne = this.ball.scene.addChild(this.normalPrefab.clone());
                }
                floorOne.active = true;
                //位置相等 
                floorOne.transform.position = road.transform.position;
                //回收正在显示方块
                this.recycleOne(road);
                //替换
                this.showingRoads[i * this.roadWidth + j] = floorOne;
            }
        }
        this.playingUI.start_count.visible = true;
        this.playingUI.tips.visible = true;
        this.startPlayCountNumber = 3;
        this.startPlayCount();
    };
    return UpdateRoadScript;
}(Laya.Script));
//# sourceMappingURL=UpdateRoadScript.js.map