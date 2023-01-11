import { ReimbursementDocument } from "@@types/models";
import { Reimbursement } from "@models";
import { io } from "@server";
import { chat } from "@utils";
import { format } from "date-fns";

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

  async finalize(reimbursement: ReimbursementDocument) {
    reimbursement = (await Reimbursement.findById(reimbursement)
      .populate("user sendTo")
      .select("+message"))!;
    if (!reimbursement) return;
    const sendingEmails: string[] = [reimbursement.sendTo.email, reimbursement.user.email];
    const sockets = await io.fetchSockets();
    const sendSockets = sockets.filter((socket) => sendingEmails.includes(socket.data.user?.email));
    sendSockets.forEach((socket) => io.to(socket.id).emit("finalizeReimbursement", reimbursement));
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
}

export const reimbursementEvent = new ReimbursementEvent();
