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
/*
* name;
*/
var RoomView = /** @class */ (function (_super) {
    __extends(RoomView, _super);
    function RoomView() {
        var _this = _super.call(this) || this;
        //监听UI鼠标点击事件
        _this.on(Laya.Event.MOUSE_DOWN, _this, _this.onClick);
        return _this;
    }
    RoomView.prototype.onClick = function (e) {
        //发送点击的组件名称
        this.event("btn_action", e.target.name);
    };
    RoomView.prototype.joinRoom = function () {
        this.socket.connectByUrl("ws://localhost:8080/websocket/roll");
        this.socket.on(Laya.Event.OPEN, this, this.openHandler);
        this.socket.on(Laya.Event.MESSAGE, this, this.receiveHandler);
        this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);
        this.socket.on(Laya.Event.ERROR, this, this.errorHandler);
    };
    RoomView.prototype.leaveRoom = function () {
        var message = {
            type: 'LeaveRoom',
            data: null,
            error: null,
            success: true
        };
        this.socket.send(JSON.stringify(message));
        this.socket.close();
    };
    RoomView.prototype.openHandler = function (event) {
        if (event === void 0) { event = null; }
        //正确建立连接；
        console.log("openHandler->", event);
        var user = {
            openId: 1,
            nickName: '昵称123',
            avatarUrl: 'https://blog.wycode.cn/img/logo_48.png',
            city: '西安'
        };
        var message = {
            type: 'JoinRoom',
            data: user,
            error: null,
            success: true
        };
        this.socket.send(JSON.stringify(message));
    };
    RoomView.prototype.receiveHandler = function (msg) {
        if (msg === void 0) { msg = null; }
        ///接收到数据触发函数
        console.log("receiveHandler->", msg);
    };
    RoomView.prototype.closeHandler = function (e) {
        if (e === void 0) { e = null; }
        //关闭事件
        console.log("closeHandler->", e);
    };
    RoomView.prototype.errorHandler = function (e) {
        if (e === void 0) { e = null; }
        //连接出错
        console.log("errorHandler->", e);
    };
    return RoomView;
}(ui.RoomUI));
//# sourceMappingURL=RoomView.js.map