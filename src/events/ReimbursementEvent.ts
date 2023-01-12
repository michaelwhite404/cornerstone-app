import { ReimbursementDocument } from "@@types/models";
import { Reimbursement } from "@models";
import { io } from "@server";
import { chat, Email, formatUrl } from "@utils";
import { format } from "date-fns";
import { getUserSetting } from "./helpers";

const URL =
  process.env.NODE_ENV! === "development"
    ? "http://localhost:3000"
    : "https://app.cornerstone-schools.org";

class ReimbursementEvent {
  async submit(reimbursement: ReimbursementDocument) {
    reimbursement = await Reimbursement.populate(reimbursement, "user sendTo");
    // Do not send submit notifications to self
    if (reimbursement.sendTo._id.toString() === reimbursement.user._id.toString()) return;
    this.sendSubmitInApp(reimbursement);
    this.sendSubmitChat(reimbursement);
    this.sendSubmitEmail(reimbursement);
  }
  private async sendSubmitInApp(reimbursement: ReimbursementDocument) {
    const sockets = await io.fetchSockets();
    const foundSocket = sockets.find(
      (socket) => reimbursement.sendTo.email === socket.data.user?.email
    );
    if (foundSocket) io.to(foundSocket.id).emit("submittedReimbursement", reimbursement);
  }

  private async sendSubmitChat(reimbursement: ReimbursementDocument) {
    if (reimbursement.sendTo.space) {
      const response = await chat.spaces.messages.create({
        parent: reimbursement.sendTo.space,
        requestBody: {
          text: `${reimbursement.user.fullName} created a reimbursement request.`,
          cards: [
            {
              header: {
                title: "Reimbursement Request",
                subtitle: reimbursement.purpose,
                imageUrl: "https://i.ibb.co/qMHwLwK/Reimbursement-Blue.png",
              },
              sections: [
                {
                  widgets: [
                    {
                      keyValue: {
                        topLabel: "Payee Name",
                        content: reimbursement.payee,
                      },
                    },
                    {
                      keyValue: {
                        topLabel: "Purchase Date",
                        content: format(new Date(reimbursement.date), "P"),
                      },
                    },
                    {
                      keyValue: {
                        topLabel: "Amount",
                        content: (reimbursement.amount / 100).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        }),
                      },
                    },
                    {
                      keyValue: {
                        topLabel: "Status",
                        content: '<font color="#ffc566">Pending</font>',
                      },
                    },
                  ],
                },
                {
                  widgets: [
                    {
                      buttons: [
                        {
                          textButton: {
                            text: "APPROVE",
                            onClick: {
                              action: {
                                actionMethodName: "FINALIZE_REIMBURSEMENT",
                                parameters: [
                                  { key: "reimbursementId", value: reimbursement._id.toString() },
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
                                actionMethodName: "FINALIZE_REIMBURSEMENT",
                                parameters: [
                                  { key: "reimbursementId", value: reimbursement._id.toString() },
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
                                url: `${URL}/requests/reimbursements#${reimbursement._id}`,
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
      reimbursement.message = response.data.name!;
      await reimbursement.save();
    }
  }

  private async sendSubmitEmail(reimbursement: ReimbursementDocument) {
    const sendEmail = () => {
      const email = new Email(
        reimbursement.sendTo,
        formatUrl(`/requests/reimbursements#${reimbursement._id}`)
      );
      email.sendReimbursementRequest(reimbursement);
    };
    const userSetting = await getUserSetting(reimbursement.sendTo._id, "ReimbursementRequestEmail");
    // If setting is true or settting is not explicitly set, send email
    if (!userSetting || userSetting.value.reimbursementRequestEmail) return sendEmail();
  }

  async finalize(reimbursement: ReimbursementDocument) {
    reimbursement = (await Reimbursement.findById(reimbursement)
      .populate("user sendTo")
      .select("+message"))!;
    this.sendFinalizeInApp(reimbursement);
    this.sendFinalizeChat(reimbursement);
    this.sendFinalizeEmail(reimbursement);
  }

  private async sendFinalizeInApp(reimbursement: ReimbursementDocument) {
    const sendingEmails: string[] = [reimbursement.sendTo.email, reimbursement.user.email];
    const sockets = await io.fetchSockets();
    const sendSockets = sockets.filter((socket) => sendingEmails.includes(socket.data.user?.email));
    sendSockets.forEach((socket) => io.to(socket.id).emit("finalizeReimbursement", reimbursement));
  }

  private async sendFinalizeChat(reimbursement: ReimbursementDocument) {
    //Create card
    const card = {
      header: {
        title: "Reimbursement Request",
        subtitle: reimbursement.purpose,
        imageUrl: "https://i.ibb.co/qMHwLwK/Reimbursement-Blue.png",
      },
      sections: [
        {
          widgets: [
            {
              keyValue: {
                topLabel: "Payee Name",
                content: reimbursement.payee,
              },
            },
            {
              keyValue: {
                topLabel: "Purchase Date",
                content: format(new Date(reimbursement.date), "P"),
              },
            },
            {
              keyValue: {
                topLabel: "Amount",
                content: (reimbursement.amount / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                }),
              },
            },
            {
              keyValue: {
                topLabel: "Status",
                content: reimbursement.approval!.approved
                  ? '<font color="#00A602">Approved</font>'
                  : '<font color="#DC143C">Rejected</font>',
              },
            },
          ],
        },
        {
          widgets: [
            {
              buttons: [
                {
                  textButton: {
                    text: "OPEN IN APP",
                    onClick: {
                      openLink: {
                        url: `${URL}/requests/reimbursements#${reimbursement._id}`,
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
    const sameUser = reimbursement.sendTo._id.toString() === reimbursement.user._id.toString();
    if (reimbursement.user.space && !sameUser) {
      await chat.spaces.messages.create({
        parent: reimbursement.user.space,
        requestBody: {
          text: `Your reimbursement request for '${reimbursement.purpose}' has been ${
            reimbursement.approval!.approved ? "Approved" : "Rejected"
          }`,
          cards: [card],
        },
      });
    }
    // Updaee message to "sendTo" user
    if (!reimbursement.message) return;
    await chat.spaces.messages.update({
      name: reimbursement.message,
      updateMask: "cards",
      requestBody: {
        cards: [card],
      },
    });
  }

  private async sendFinalizeEmail(reimbursement: ReimbursementDocument) {
    const sendEmail = () => {
      const email = new Email(
        reimbursement.user,
        formatUrl(`/requests/reimbursements#${reimbursement._id}`)
      );
      email.sendReimbursementFinalized(reimbursement);
    };

    const userSetting = await getUserSetting(reimbursement.user._id, "ReimbursementFinalizedEmail");
    // If setting is not explicitly set, send email
    if (!userSetting) return sendEmail();
    // If setting has send all emails
    if (userSetting.value.reimbursementFinalizedEmail === "REIMBURSEMENT_FINALIZED_EMAIL_ENUM_ALL")
      return sendEmail();
    // If setting has only send approved reimbursement to email and reimbursement is approved
    if (
      userSetting.value.reimbursementFinalizedEmail ===
        "REIMBURSEMENT_FINALIZED_EMAIL_ENUM_APPROVED" &&
      reimbursement.approval?.approved
    )
      return sendEmail();
    if (
      userSetting.value.reimbursementFinalizedEmail ===
        "REIMBURSEMENT_FINALIZED_EMAIL_ENUM_REJECTED" &&
      !reimbursement.approval?.approved
    )
      return sendEmail();
  }
}

export const reimbursementEvent = new ReimbursementEvent();
