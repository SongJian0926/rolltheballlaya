/*
* name;
*/
class PlayingView extends ui.PlayingUI {
    constructor() {
        super();
    }

    /**
     * 设置属性面板信息
     */
    public setPropertyPanelInfo(weight: number, size: number, speed: number) {
        this.ball_weight.text = '重量:' + weight.toFixed(1)+'kg';
        this.ball_size.text = '大小:' + (size*2).toFixed(2)+'m';
        this.ball_speed.text = '速度:' + Math.abs(speed).toFixed(1)+'m/s';
    }


}