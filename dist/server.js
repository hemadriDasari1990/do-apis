"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = __importDefault(require("config"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const router_1 = __importDefault(require("./router"));
class Server {
    constructor() {
        this.app = express_1.default();
    }
    bootstrap() {
        this.configureDatabase(); /* Connect to the Database */
        this.configureMiddleware(); /* Configuration set up*/
        this.configureRoutes();
        return this.app;
    }
    configureDatabase() {
        mongoose_1.default.connect(config_1.default.get("database"), { useCreateIndex: true, useNewUrlParser: true });
    }
    configureRoutes() {
        router_1.default(this.app);
    }
    configureMiddleware() {
        /* Enable Cross Origin Resource Sharing to all origins by default */
        this.app.use(cors_1.default());
        /* Disable default cache */
        this.app.set("etag", false);
        /* Configure requests body parsing */
        this.app.use(body_parser_1.default.urlencoded({ extended: true, limit: "50mb" }));
        this.app.use(body_parser_1.default.json({ limit: '50mb' }));
        /* Adds some security defaults */
        this.app.use(helmet_1.default());
        this.app.use(morgan_1.default(config_1.default.get("env")));
    }
}
exports.default = Server;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsOERBQXFDO0FBQ3JDLG9EQUE0QjtBQUM1QixnREFBd0I7QUFDeEIsc0RBQThCO0FBQzlCLG9EQUE0QjtBQUM1Qix3REFBZ0M7QUFDaEMsb0RBQTRCO0FBQzVCLHNEQUE4QjtBQUU5QixNQUFxQixNQUFNO0lBQTNCO1FBQ1UsUUFBRyxHQUFnQixpQkFBTyxFQUFFLENBQUM7SUFpQ3ZDLENBQUM7SUEvQlEsU0FBUztRQUNkLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsNkJBQTZCO1FBQ3ZELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMseUJBQXlCO1FBQ3JELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDbEIsQ0FBQztJQUVPLGlCQUFpQjtRQUN2QixrQkFBUSxDQUFDLE9BQU8sQ0FBQyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDNUYsQ0FBQztJQUVPLGVBQWU7UUFDckIsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVPLG1CQUFtQjtRQUN6QixvRUFBb0U7UUFDcEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBSSxFQUFFLENBQUMsQ0FBQztRQUVyQiwyQkFBMkI7UUFDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTVCLHFDQUFxQztRQUNyQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBVSxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0MsaUNBQWlDO1FBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFNLEVBQUUsQ0FBQyxDQUFDO1FBRXZCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFNLENBQUMsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FDRjtBQWxDRCx5QkFrQ0MifQ==