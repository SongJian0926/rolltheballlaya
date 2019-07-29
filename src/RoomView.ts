/*
* name;
*/
class RoomView extends ui.RoomUI {

    public socket: Laya.Socket

    constructor() {
        super();
        //监听UI鼠标点击事件
        this.on(Laya.Event.MOUSE_DOWN, this, this.onClick);
    }

    private onClick(e: Laya.Event): void {
        //发送点击的组件名称
        this.event("btn_action", e.target.name);
    }


    public joinRoom(): void {
        this.socket.connectByUrl("ws://localhost:8080/websocket/roll")
        this.socket.on(Laya.Event.OPEN, this, this.openHandler);
        this.socket.on(Laya.Event.MESSAGE, this, this.receiveHandler);
        this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);
        this.socket.on(Laya.Event.ERROR, this, this.errorHandler);
    }


    public leaveRoom(): void {
        var message = {
            type: 'LeaveRoom',
            data: null,
            error: null,
            success: true
        }
        this.socket.send(JSON.stringify(message))
        this.socket.close()
    }


    private openHandler(event: any = null): void {
        //正确建立连接；
        console.log("openHandler->", event)

        var user = {
            openId:1,
            nickName:'昵称123',
            avatarUrl:'https://blog.wycode.cn/img/logo_48.png',
            city:'西安'
        }

        var message = {
            type: 'JoinRoom',
            data: user,
            error: null,
            success: true
        }
        this.socket.send(JSON.stringify(message))
    }
    private receiveHandler(msg: any = null): void {
        ///接收到数据触发函数
        console.log("receiveHandler->", msg)
    }
    private closeHandler(e: any = null): void {
        //关闭事件
        console.log("closeHandler->", e)
    }
    private errorHandler(e: any = null): void {
        //连接出错
        console.log("errorHandler->", e)
    }

}