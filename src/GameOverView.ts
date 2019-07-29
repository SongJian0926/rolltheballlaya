/*
* name;
*/
class GameOverView extends ui.GameOverUI{
    constructor(){
        super();
        //监听UI鼠标点击事件
        this.on(Laya.Event.MOUSE_DOWN,this,this.onClick);
    }

    private onClick(e:Laya.Event):void{
        //发送点击的组件名称
        this.event("btn_action",e.target.name);
    }
    
}