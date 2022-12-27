import { EmployeeDocument, LeaveDocument } from "@@types/models";

import nodemailer, { SendMailOptions } from "nodemailer";
import pug from "pug";
import { htmlToText } from "html-to-text";

// new Email(user, url).sendWelcome();
// new Email(user, url).sendReset();

export default class Email {
  to: string;
  firstName: string;
  url: string;
  password: string;
  from: string;
  constructor(user: EmployeeDocument, url: string) {
    this.to = user.email;
    this.firstName = user.firstName.split(" ")[0];
    this.url = url;
    this.password = user.password;
    this.from = `Cornerstone App <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      // @ts-ignore
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT!,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template: string, subject: string, data?: any) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
      password: this.password,
      email: this.to,
      data,
    });

    // 2) Define email options
    const mailOptions: SendMailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // 3) Create a transport and send email
    return await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    return await this.send("welcome", "Welcome to the new Cornerstone App!");
  }

  async sendPasswordReset() {
    return await this.send("passwordReset", "Reset your password");
  }

  async sendLeaveRequest(leave: LeaveDocument) {
    return await this.send("leaveRequested", `Leave Request Submission - ${leave.user.fullName}`, {
      leave,
    });
  }
}
