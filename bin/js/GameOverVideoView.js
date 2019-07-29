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
var GameOverVideoView = /** @class */ (function (_super) {
    __extends(GameOverVideoView, _super);
    function GameOverVideoView() {
        var _this = _super.call(this) || this;
        //监听UI鼠标点击事件
        _this.on(Laya.Event.MOUSE_DOWN, _this, _this.onClick);
        return _this;
    }
    GameOverVideoView.prototype.onClick = function (e) {
        //发送点击的组件名称
        this.event("btn_action", e.target.name);
    };
    return GameOverVideoView;
}(ui.GameOverVideoUI));
//# sourceMappingURL=GameOverVideoView.js.map