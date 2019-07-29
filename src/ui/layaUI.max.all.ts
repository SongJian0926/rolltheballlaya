
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class GameOverUI extends View {
		public content:Laya.Image;
		public score_block:Laya.Image;
		public lable_score:Laya.Label;
		public restart:Laya.Button;
		public back:Laya.Button;
		public share:Laya.Button;
		public cicle:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.5}},{"type":"Image","props":{"var":"content","top":400,"skin":"img/over_center.png","right":120,"renderType":"render","left":120,"height":1127}},{"type":"View","props":{"width":803,"top":641,"height":842,"centerX":0},"child":[{"type":"Image","props":{"var":"score_block","skin":"img/textContent.png","right":40,"renderType":"render","left":40,"height":157}},{"type":"Label","props":{"var":"lable_score","valign":"middle","top":0,"text":"你滚了0m","right":40,"left":40,"height":120,"fontSize":80,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Button","props":{"var":"restart","top":198,"stateNum":1,"skin":"img/restart.png","right":60,"renderType":"render","name":"Restart","left":60,"height":196}},{"type":"Button","props":{"var":"back","top":401,"stateNum":1,"skin":"img/back_to_main.png","right":60,"renderType":"render","name":"Back","left":60,"height":194}},{"type":"Button","props":{"var":"share","top":614,"stateNum":1,"skin":"img/share.png","right":69,"renderType":"render","name":"Share","left":69,"height":172}}]},{"type":"Image","props":{"width":255,"var":"cicle","top":266,"skin":"img/over_cicle.png","height":303,"centerX":0,"sizeGrid":"0,0,0,0"}},{"type":"Image","props":{"width":200,"top":407,"skin":"img/center_left_pattern.png","height":100,"centerX":-232}},{"type":"Image","props":{"width":200,"top":407,"skin":"img/center_right_pattern.png","height":100,"centerX":229}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.GameOverUI.uiView);

        }

    }
}

module ui {
    export class GameOverVideoUI extends View {
		public content:Laya.Image;
		public score_block:Laya.Image;
		public lable_score:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.5}},{"type":"Image","props":{"var":"content","top":400,"skin":"img/over_center.png","right":120,"renderType":"render","left":120,"height":1028}},{"type":"View","props":{"width":803,"top":435,"height":949,"centerX":0},"child":[{"type":"Image","props":{"var":"score_block","top":130,"skin":"img/textContent.png","right":40,"renderType":"render","left":40,"height":157}},{"type":"Label","props":{"var":"lable_score","top":148,"text":"你滚了0m","right":40,"left":40,"height":122,"fontSize":80,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"top":404,"text":"看视频原地复活","right":40,"left":40,"fontSize":60,"font":"Microsoft YaHei","color":"#ef5285","align":"center"}},{"type":"Button","props":{"top":592,"stateNum":1,"skin":"img/resurrection.png","right":60,"renderType":"render","name":"Watch","left":60,"height":166}},{"type":"Button","props":{"width":113,"top":787,"stateNum":1,"skin":"img/skip.png","renderType":"render","name":"Skip","height":53,"centerX":0}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.GameOverVideoUI.uiView);

        }

    }
}

module ui {
    export class MainUI extends View {
		public btn_voice:Laya.Button;
		public btn_start:Laya.Button;
		public btn_share:Laya.Button;
		public btn_score_board:Laya.Button;
		public version:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.5}},{"type":"Image","props":{"width":753,"top":373,"skin":"img/title.png","height":229,"centerX":0}},{"type":"Button","props":{"y":100,"x":75,"var":"btn_voice","stateNum":1,"skin":"img/unmute.png","name":"Voice"}},{"type":"Button","props":{"width":599,"var":"btn_start","stateNum":1,"skin":"img/start.png","name":"Start","height":170,"centerY":0,"centerX":0}},{"type":"Button","props":{"width":592,"var":"btn_share","stateNum":1,"skin":"img/share.png","name":"MainShare","height":154,"centerY":384,"centerX":0}},{"type":"Button","props":{"width":601,"var":"btn_score_board","stateNum":1,"skin":"img/board.png","name":"Score","height":171,"centerY":188,"centerX":0}},{"type":"Label","props":{"var":"version","text":"v1.1r","left":76,"fontSize":40,"color":"#ffffff","bottom":33}},{"type":"Label","props":{"text":"wycode.cn","right":54,"fontSize":40,"color":"#ffffff","bottom":34}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.MainUI.uiView);

        }

    }
}

module ui {
    export class PlayingUI extends View {
		public fingerMove:Laya.FrameAnimation;
		public lable_socre:Laya.Label;
		public help_bar:Laya.Image;
		public help_finger:Laya.Image;
		public help_text:Laya.Label;
		public start_count:Laya.Label;
		public tips:Laya.Label;
		public ball_weight:Laya.Label;
		public ball_size:Laya.Label;
		public ball_speed:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":300,"var":"lable_socre","text":"0 m","fontSize":120,"color":"#f6b352","centerX":0}},{"type":"Panel","props":{"right":0,"left":0,"height":600,"bottom":1},"child":[{"type":"Image","props":{"x":161,"width":758,"var":"help_bar","skin":"img/left_right.png","centerY":39,"centerX":0}},{"type":"Image","props":{"x":729,"width":220,"var":"help_finger","skin":"img/finger.png","height":204,"bottom":62},"compId":3},{"type":"Label","props":{"width":0,"var":"help_text","text":"左右滑动控制小球","height":80,"fontSize":60,"font":"Microsoft YaHei","color":"#fb8c00","centerY":-159,"centerX":0}}]},{"type":"Label","props":{"visible":false,"var":"start_count","text":"3","fontSize":256,"color":"#fb8c00","centerY":0,"centerX":0}},{"type":"Label","props":{"visible":false,"var":"tips","text":"小提示：吃到红色道具会变大哦！","fontSize":48,"font":"Microsoft YaHei","color":"#fb8c00","centerX":0,"bottom":372}},{"type":"Panel","props":{"y":81,"x":30,"width":453,"name":"GameStates","height":302},"child":[{"type":"Label","props":{"y":147,"x":20,"width":300,"var":"ball_weight","text":"重量：","height":20,"fontSize":56,"font":"Microsoft YaHei","color":"#ffc952"}},{"type":"Label","props":{"y":70,"x":20,"width":300,"var":"ball_size","text":"大小:","height":20,"fontSize":56,"font":"Microsoft YaHei","color":"#ff7473"}},{"type":"Label","props":{"y":1,"x":20,"width":300,"var":"ball_speed","text":"速度:","height":20,"fontSize":56,"font":"Microsoft YaHei","color":"#47b8e0","align":"left"}}]}],"animations":[{"nodes":[{"target":3,"keyframes":{"width":[{"value":200,"tweenMethod":"linearNone","tween":true,"target":3,"key":"width","index":0}],"height":[{"value":240,"tweenMethod":"linearNone","tween":true,"target":3,"key":"height","index":0}],"centerY":[{"value":156,"tweenMethod":"linearNone","tween":true,"target":3,"key":"centerY","index":0}],"centerX":[{"value":256,"tweenMethod":"linearNone","tween":true,"target":3,"key":"centerX","index":0},{"value":-180,"tweenMethod":"linearNone","tween":true,"target":3,"key":"centerX","index":30},{"value":256,"tweenMethod":"linearNone","tween":true,"target":3,"key":"centerX","index":60}],"bottom":[{"value":0,"tweenMethod":"linearNone","tween":true,"target":3,"key":"bottom","index":0}]}}],"name":"fingerMove","id":1,"frameRate":24,"action":0}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.PlayingUI.uiView);

        }

    }
}

module ui {
    export class RoomUI extends View {
		public bg:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"var":"bg","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.5}},{"type":"Button","props":{"y":90,"x":90,"width":128,"stateNum":1,"skin":"img/return.png","name":"RoomBack","height":128}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.RoomUI.uiView);

        }

    }
}

module ui {
    export class ScoreBoardUI extends View {
		public view_canvas_content:View;

        public static  uiView:any ={"type":"View","props":{"top":0,"right":0,"renderType":"render","left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.5}},{"type":"Button","props":{"y":100,"x":64,"stateNum":1,"skin":"img/return.png","renderType":"render","name":"Back"}},{"type":"View","props":{"y":0,"x":0,"var":"view_canvas_content","top":0,"right":0,"left":0,"bottom":0}},{"type":"Label","props":{"width":120,"name":"Before","mouseEnabled":true,"height":200,"centerY":0}},{"type":"Label","props":{"width":120,"right":0,"name":"Next","mouseEnabled":true,"height":200,"centerY":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.ScoreBoardUI.uiView);

        }

    }
}
