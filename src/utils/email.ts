import {
  DeviceDocument,
  EmployeeDocument,
  ErrorLogModel,
  LeaveDocument,
  ReimbursementDocument,
  TextbookDocument,
  TicketDocument,
  UserSettingDocument,
} from "@@types/models";

import nodemailer, { SendMailOptions } from "nodemailer";
import pug from "pug";
import { htmlToText } from "html-to-text";
import pluralize from "pluralize";

// new Email(user, url).sendWelcome();
// new Email(user, url).sendReset();

export default class Email {
  private to: string;
  private firstName: string;
  private url: string;
  private password: string;
  private from: string;
  constructor(user: EmployeeDocument, url: string) {
    this.to = user.email;
    this.firstName = user.firstName.split(" ")[0];
    this.url = url;
    this.password = user.password;
    this.from = `Cornerstone App <${process.env.EMAIL_FROM}>`;
  }

  private newTransport() {
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
  private async send(template: string, subject: string, data?: any) {
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

  async sendLeaveFinalized(leave: LeaveDocument) {
    const status = leave.approval!.approved ? "approved" : "rejected";
    return await this.send("leaveFinalized", `Your leave request has been ${status}`, { leave });
  }

  async sendReimbursementRequest(reimbursement: ReimbursementDocument) {
    return await this.send(
      "reimbursementRequest",
      `Reimbursement Request Submission - ${reimbursement.user.fullName}`,
      { reimbursement }
    );
  }

  async sendReimbursementFinalized(reimbursement: ReimbursementDocument) {
    const status = reimbursement.approval!.approved ? "approved" : "rejected";
    return await this.send(
      "reimbursementFinalized",
      `Your reimbursement request has been ${status}`,
      { reimbursement }
    );
  }

  async sendDeviceCheckInEmail(
    device: DeviceDocument,
    checkedInBy: Employee,
    error?: ErrorLogModel
  ) {
    let subject = `${device.name} Checked In`;
    if (error) subject += ` - Broken`;
    return await this.send("deviceCheckedIn", subject, { device, checkedInBy, error });
  }

  async sendTextbooksCheckInEmail(textbooks: TextbookDocument[], userSetting: UserSettingDocument) {
    return await this.send(
      "textbooksCheckedIn",
      `${pluralize("Textbooks", textbooks.length, true)} Checked In`,
      { textbooks, userSetting, pluralize }
    );
  }

  async sendTicketAssign(ticket: TicketDocument, newTicket: boolean) {
    let subject = newTicket ? "New ticket submission" : "Assigned to new ticket";
    subject += ` - #${ticket.ticketId}`;
    return await this.send("assignTicket", subject, {
      ticket,
      newTicket,
    });
  }

  async sendTicketComment(ticket: TicketDocument, commenter: EmployeeDocument, comment: string) {
    return await this.send("ticketComment", `Comment left on ticket #${ticket.ticketId}`, {
      ticket,
      commenter,
      comment,
    });
  }

  async sendTicketClose(
    ticket: TicketDocument,
    user: EmployeeDocument,
    closedBy: EmployeeDocument
  ) {
    return await this.send("ticketClose", `Ticket #${ticket.ticketId} is now closed`, {
      ticket,
      user,
      closedBy,
    });
  }
}
