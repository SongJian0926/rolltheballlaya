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
var PlayingView = /** @class */ (function (_super) {
    __extends(PlayingView, _super);
    function PlayingView() {
        return _super.call(this) || this;
    }
    /**
     * 设置属性面板信息
     */
    PlayingView.prototype.setPropertyPanelInfo = function (weight, size, speed) {
        this.ball_weight.text = '重量:' + weight.toFixed(1) + 'kg';
        this.ball_size.text = '大小:' + (size * 2).toFixed(2) + 'm';
        this.ball_speed.text = '速度:' + Math.abs(speed).toFixed(1) + 'm/s';
    };
    return PlayingView;
}(ui.PlayingUI));
//# sourceMappingURL=PlayingView.js.map