declare class EmailService {
    private transporter;
    constructor();
    private createTransport;
    getTransport(): Promise<any>;
    sendEmail(fileName: string, input: {
        [Key: string]: any;
    }, to: string, subject: string, attachments?: Array<{
        [Key: string]: any;
    }>): Promise<any>;
}
export default EmailService;
