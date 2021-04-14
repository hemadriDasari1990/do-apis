"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const ejs_1 = __importDefault(require("ejs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = this.createTransport();
    }
    async createTransport() {
        try {
            this.transporter = await nodemailer_1.default.createTransport({
                host: config_1.default.get("email.host"),
                port: config_1.default.get("email.port"),
                // secure: true,
                // service: "gmail",
                secure: false,
                requireTLS: true,
                auth: {
                    user: config_1.default.get("email.user"),
                    pass: config_1.default.get("email.password"),
                },
            });
        }
        catch (err) {
            throw err || err.message;
        }
    }
    async getTransport() {
        try {
            return await this.transporter;
        }
        catch (err) {
            throw err || err.message;
        }
    }
    async sendEmail(fileName, input, to, subject, attachments) {
        try {
            const data = await ejs_1.default.renderFile(process.env.PWD + fileName, input);
            const mainOptions = {
                from: config_1.default.get("email.from"),
                to: to,
                subject: subject,
                html: data,
                attachments: attachments || [],
            };
            return await this.transporter.sendMail(mainOptions);
        }
        catch (err) {
            this.transporter.close();
            throw new Error(err || err.message);
        }
    }
}
// attachments: [{
//     filename: 'Logo.png',
//     path: __dirname +'/folder/Logo.png',
//     cid: 'logo' //my mistake was putting "cid:logo@cid" here!
// }]
// <img src="cid:logo">
exports.default = EmailService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2aWNlcy9lbWFpbC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUM1Qiw4Q0FBc0I7QUFDdEIsNERBQW9DO0FBRXBDLE1BQU0sWUFBWTtJQUdoQjtRQUNFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzVDLENBQUM7SUFFTyxLQUFLLENBQUMsZUFBZTtRQUMzQixJQUFJO1lBQ0YsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLG9CQUFVLENBQUMsZUFBZSxDQUFDO2dCQUNsRCxJQUFJLEVBQUUsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO2dCQUM5QixJQUFJLEVBQUUsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO2dCQUM5QixnQkFBZ0I7Z0JBQ2hCLG9CQUFvQjtnQkFDcEIsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO29CQUM5QixJQUFJLEVBQUUsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQ25DO2FBQ0YsQ0FBQyxDQUFDO1NBQ0o7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLFlBQVk7UUFDaEIsSUFBSTtZQUNGLE9BQU8sTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQy9CO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDO1NBQzFCO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxTQUFTLENBQ2IsUUFBZ0IsRUFDaEIsS0FBNkIsRUFDN0IsRUFBVSxFQUNWLE9BQWUsRUFDZixXQUEyQztRQUUzQyxJQUFJO1lBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxhQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNyRSxNQUFNLFdBQVcsR0FBRztnQkFDbEIsSUFBSSxFQUFFLGdCQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztnQkFDOUIsRUFBRSxFQUFFLEVBQUU7Z0JBQ04sT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLElBQUksRUFBRSxJQUFJO2dCQUNWLFdBQVcsRUFBRSxXQUFXLElBQUksRUFBRTthQUMvQixDQUFDO1lBQ0YsT0FBTyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3JEO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7Q0FDRjtBQUVELGtCQUFrQjtBQUNsQiw0QkFBNEI7QUFDNUIsMkNBQTJDO0FBQzNDLGdFQUFnRTtBQUNoRSxLQUFLO0FBRUwsdUJBQXVCO0FBRXZCLGtCQUFlLFlBQVksQ0FBQyJ9