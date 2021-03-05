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
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("./router"));
class Server {
    constructor() {
        this.app = express_1.default();
    }
    bootstrap() {
        this.configureDatabase(); /* Connect to the Database */
        this.configureMiddleware(); /* Configuration set up*/
        this.configureRoutes(); /* Configure routes */
        return this.app;
    }
    configureDatabase() {
        mongoose_1.default.connect(config_1.default.get("database"), {
            useCreateIndex: true,
            useNewUrlParser: true,
        });
    }
    configureRoutes() {
        router_1.default(this.app);
    }
    configureMiddleware() {
        /* Enable Cross Origin Resource Sharing to all origins by default */
        this.app.use(cors_1.default());
        /* Disable default cache */
        this.app.set("etag", false);
        // set the view engine to ejs
        this.app.set("view engine", "ejs");
        // set public path for static assets
        this.app.use("/static", express_1.default.static(path_1.default.join(__dirname, "public")));
        /* Configure requests body parsing */
        this.app.use(body_parser_1.default.urlencoded({ extended: true, limit: "50mb" }));
        this.app.use(body_parser_1.default.json({ limit: "50mb" }));
        /* Adds some security defaults */
        this.app.use(helmet_1.default());
        this.app.use(morgan_1.default(config_1.default.get("env")));
    }
}
exports.default = Server;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsOERBQXFDO0FBQ3JDLG9EQUE0QjtBQUM1QixnREFBd0I7QUFDeEIsc0RBQThCO0FBQzlCLG9EQUE0QjtBQUM1Qix3REFBZ0M7QUFDaEMsb0RBQTRCO0FBQzVCLGdEQUF3QjtBQUN4QixzREFBOEI7QUFFOUIsTUFBcUIsTUFBTTtJQUEzQjtRQUNVLFFBQUcsR0FBZ0IsaUJBQU8sRUFBRSxDQUFDO0lBMEN2QyxDQUFDO0lBeENRLFNBQVM7UUFDZCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLDZCQUE2QjtRQUN2RCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QjtRQUNyRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxzQkFBc0I7UUFDOUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7SUFFTyxpQkFBaUI7UUFDdkIsa0JBQVEsQ0FBQyxPQUFPLENBQUMsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDdkMsY0FBYyxFQUFFLElBQUk7WUFDcEIsZUFBZSxFQUFFLElBQUk7U0FDdEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGVBQWU7UUFDckIsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVPLG1CQUFtQjtRQUN6QixvRUFBb0U7UUFDcEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBSSxFQUFFLENBQUMsQ0FBQztRQUVyQiwyQkFBMkI7UUFDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTVCLDZCQUE2QjtRQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbkMsb0NBQW9DO1FBQ3BDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFeEUscUNBQXFDO1FBQ3JDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHFCQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHFCQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVqRCxpQ0FBaUM7UUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsZ0JBQU0sRUFBRSxDQUFDLENBQUM7UUFFdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsZ0JBQU0sQ0FBQyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQztDQUNGO0FBM0NELHlCQTJDQyJ9