import { LeaveDocument } from "@@types/models";
import { Leave } from "@models";
import { io } from "@server";
import { chat, Email, formatUrl } from "@utils";
import { format } from "date-fns";
import { getUserSetting } from "./helpers";

const URL =
  process.env.NODE_ENV! === "development"
    ? "http://localhost:3000"
    : "https://app.cornerstone-schools.org";

const generateWidgets = (leave: LeaveDocument) => {
  const statusText = {
    Pending: '<font color="#ffc566">Pending</font>',
    Approved: '<font color="#00A602">Approved</font>',
    Rejected: '<font color="#DC143C">Rejected</font>',
  };
  const text = leave.approval?.date
    ? leave.approval.approved
      ? "Approved"
      : "Rejected"
    : "Pending";
  const widgets = [
    {
      keyValue: {
        topLabel: "Submitted By",
        content: leave.user.fullName,
      },
    },
    {
      keyValue: {
        topLabel: "Reason",
        content: leave.reason,
      },
    },
  ];
  if (leave.comments) {
    widgets.push({
      keyValue: {
        topLabel: "Comments",
        content: leave.comments,
      },
    });
  }
  widgets.push(
    {
      keyValue: {
        topLabel: "Dates Requested",
        content: `${format(new Date(leave.dateStart), "P")} → ${format(
          new Date(leave.dateEnd),
          "P"
        )}`,
      },
    },
    {
      keyValue: {
        topLabel: "Status",
        content: statusText[text],
      },
    }
  );
  return widgets;
};

class LeaveEvent {
  async submit(leave: LeaveDocument) {
    leave = await Leave.populate(leave, "user sendTo");
    this.sendSubmitInApp(leave);
    this.sendSubmitChat(leave);
    this.sendSubmitEmail(leave);
  }

  private async sendSubmitChat(leave: LeaveDocument) {
    // Do not send submit notifications to self
    if (leave.sendTo.space) {
      const response = await chat.spaces.messages.create({
        parent: leave.sendTo.space,
        requestBody: {
          text: `${leave.user.fullName} created a leave request.`,
          cards: [
            {
              header: {
                title: "Leave Request",
                imageUrl: "https://i.ibb.co/gTPJqV1/Leave-Blue.png",
              },
              sections: [
                { widgets: generateWidgets(leave) },
                {
                  widgets: [
                    {
                      buttons: [
                        {
                          textButton: {
                            text: "APPROVE",
                            onClick: {
                              action: {
                                actionMethodName: "FINALIZE_LEAVE",
                                parameters: [
                                  { key: "leaveId", value: leave._id.toString() },
                                  { key: "approved", value: "true" },
                                ],
                              },
                            },
                          },
                        },
                        {
                          textButton: {
                            text: "REJECT",
                            onClick: {
                              action: {
                                actionMethodName: "FINALIZE_LEAVE",
                                parameters: [
                                  { key: "leaveId", value: leave._id.toString() },
                                  { key: "approved", value: "false" },
                                ],
                              },
                            },
                          },
                        },
                        {
                          textButton: {
                            text: "OPEN IN APP",
                            onClick: {
                              openLink: {
                                url: `${URL}/requests/leaves#${leave._id}`,
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      });
      leave.message = response.data.name!;
      await leave.save();
    }
  }

  private async sendSubmitEmail(leave: LeaveDocument) {
    const sendEmail = () => {
      const email = new Email(leave.sendTo, formatUrl(`/requests/leaves#${leave._id}`));
      email.sendLeaveRequest(leave);
    };
    const userSetting = await getUserSetting(leave.sendTo._id, "LeaveRequestEmail");
    // If setting is true or settting is not explicitly set, send email
    if (!userSetting || userSetting.value.leaveRequestEmail) return sendEmail();
  }

  private async sendSubmitInApp(leave: LeaveDocument) {
    const sockets = await io.fetchSockets();
    const foundSocket = sockets.find((socket) => leave.sendTo.email === socket.data.user?.email);
    if (foundSocket) io.to(foundSocket.id).emit("submittedLeave", leave);
  }

  async finalize(leave: LeaveDocument) {
    leave = await Leave.populate(leave, "user sendTo");
    this.sendFinalizeInApp(leave);
    this.sendFinalizeChat(leave);
    this.sendFinalizeEmail(leave);
  }

  private async sendFinalizeEmail(leave: LeaveDocument) {
    const sendEmail = () =>
      new Email(leave.user, formatUrl(`/requests/leaves#${leave._id}`)).sendLeaveFinalized(leave);
    // Get user setting
    const userSetting = await getUserSetting(leave.user._id, "LeaveFinalizedEmail");
    // If setting is not explicitly set, send email
    if (!userSetting) return sendEmail();
    // If setting has send all emails
    if (userSetting.value.leaveFinalizedEmail === "LEAVE_FINALIZED_EMAIL_ENUM_ALL")
      return sendEmail();
    // If setting has only send approved leave to email and leave is approved
    if (
      userSetting.value.leaveFinalizedEmail === "LEAVE_FINALIZED_EMAIL_ENUM_APPROVED" &&
      leave.approval?.approved
    )
      return sendEmail();
    if (
      userSetting.value.leaveFinalizedEmail === "LEAVE_FINALIZED_EMAIL_ENUM_REJECTED" &&
      !leave.approval?.approved
    )
      return sendEmail();
  }

  private async sendFinalizeInApp(leave: LeaveDocument) {
    const sendingEmails: string[] = [leave.sendTo.email, leave.user.email];
    const sockets = await io.fetchSockets();
    const sendSockets = sockets.filter((socket) => sendingEmails.includes(socket.data.user?.email));
    sendSockets.forEach((socket) => io.to(socket.id).emit("finalizeLeave", leave));
  }

  private async sendFinalizeChat(leave: LeaveDocument) {
    // Create card
    const card = {
      header: {
        title: "Leave Request",
        imageUrl: "https://i.ibb.co/gTPJqV1/Leave-Blue.png",
      },
      sections: [
        { widgets: generateWidgets(leave) },
        {
          widgets: [
            {
              buttons: [
                {
                  textButton: {
                    text: "OPEN IN APP",
                    onClick: {
                      openLink: {
                        url: `${URL}/requests/leaves#${leave._id}`,
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    // Create message for submitting user
    const sameUser = leave.sendTo._id.toString() === leave.user._id.toString();
    if (leave.user.space && !sameUser) {
      await chat.spaces.messages.create({
        parent: leave.user.space,
        requestBody: {
          text: `Your leave request for '${leave.reason}' has been ${
            leave.approval!.approved ? "Approved" : "Rejected"
          }`,
          cards: [card],
        },
      });
    }
    // Updaee message to "sendTo" user
    if (!leave.message) return;
    await chat.spaces.messages.update({
      name: leave.message,
      updateMask: "cards",
      requestBody: {
        cards: [card],
      },
    });
  }
}

export const leaveEvent = new LeaveEvent();
