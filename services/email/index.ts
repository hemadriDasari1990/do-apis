import config from "config";
import ejs from "ejs";
import nodemailer from "nodemailer";

class EmailService {
  private transporter: any;

  constructor() {
    this.transporter = this.createTransport();
  }

  private async createTransport() {
    try {
      this.transporter = await nodemailer.createTransport({
        host: config.get("email.host"),
        port: config.get("email.port"),
        // secure: true,
        // service: "gmail",
        secure: false,
        requireTLS: true,
        auth: {
          user: config.get("email.user"),
          pass: config.get("email.password"),
        },
      });
    } catch (err) {
      throw err || err.message;
    }
  }

  async getTransport(): Promise<any> {
    try {
      return await this.transporter;
    } catch (err) {
      throw err || err.message;
    }
  }

  async sendEmail(
    fileName: string,
    input: { [Key: string]: any },
    to: string,
    subject: string,
    attachments?: Array<{ [Key: string]: any }>
  ) {
    try {
      const data = await ejs.renderFile(process.env.PWD + fileName, input);
      const mainOptions = {
        from: config.get("email.from"),
        to: to,
        subject: subject,
        html: data,
        attachments: attachments || [],
      };
      await this.transporter.sendMail(mainOptions);
    } catch (err) {
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

export default EmailService;
