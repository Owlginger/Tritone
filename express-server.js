"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var TritoneApp = /** @class */ (function () {
    function TritoneApp() {
        var _this = this;
        this.run = function () {
            _this.tritone.use('/', express_1["default"].static('tritone'));
            /*  this.tritone.get('/', (req: Request, res: Response) => {
               res.send('index.html');
             }); */
            _this.tritone.listen(_this.port, function () {
                console.log("Tritone App listening on port ".concat(_this.port));
            });
        };
        this.tritone = (0, express_1["default"])();
        this.port = 3000;
    }
    return TritoneApp;
}());
new TritoneApp().run();
