import {
  EmployeeDocument,
  TicketAssignUpdateDocument,
  TicketCommentUpdateDocument,
  TicketDocument,
} from "@@types/models";
import { Ticket, UserSetting } from "@models";
import { chat, Email, formatUrl } from "@utils";
import capitalize from "capitalize";
import { chat_v1 } from "googleapis";

const URL =
  process.env.NODE_ENV! === "development"
    ? "http://localhost:3000"
    : "https://app.cornerstone-schools.org";

interface AssignMessageData {
  ticket: TicketDocument;
  parent: string;
  text: string;
  headerTitle: string;
}
class TicketEvent {
  private createAssignChatMessage(
    data: AssignMessageData
  ): chat_v1.Params$Resource$Spaces$Messages$Create {
    const { ticket, parent, text, headerTitle } = data;
    return {
      parent,
      requestBody: {
        text,
        cards: [
          {
            header: {
              title: headerTitle,
              subtitle: `#${ticket.ticketId}`,
              imageUrl: "https://i.ibb.co/Ypsrycx/Ticket-Blue.png",
            },
            sections: [
              {
                widgets: [
                  { keyValue: { topLabel: "Title", content: ticket.title } },
                  { keyValue: { topLabel: "Description", content: ticket.description } },
                  {
                    keyValue: {
                      topLabel: "Priority",
                      content: capitalize(ticket.priority.toLowerCase()),
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
                              url: `${URL}/tickets/${ticket.ticketId}`,
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
    };
  }

  async submit(ticket: TicketDocument) {
    ticket = await Ticket.populate(ticket, { path: "assignedTo submittedBy" });
    const assignedUsers = ticket.assignedTo as EmployeeDocument[];
    this.sendSubmitChatMessages(assignedUsers, ticket);
    this.sendSubmitEmails(assignedUsers, ticket);
  }

  private async sendSubmitEmails(users: EmployeeDocument[], ticket: TicketDocument) {
    const sendEmail = (user: EmployeeDocument) =>
      new Email(user, formatUrl(`/tickets/${ticket.ticketId}`)).sendTicketAssign(ticket, true);
    // Get the users' email setting
    const userSettings = await UserSetting.find({
      user: { $in: users },
      settingName: "settings.users.notification.TicketAssignEmail",
    });
    users.forEach((user) => {
      // Get the setting for a specific user
      const emailSetting = userSettings.find(
        (setting) => setting.user.toString() === user._id.toString()
      );
      // If setting not set or set to true, set email
      if (!emailSetting || emailSetting.value.ticketAssignEmail) sendEmail(user);
    });
  }

  private sendSubmitChatMessages(users: EmployeeDocument[], ticket: TicketDocument) {
    const spaces = users.filter((e) => e.space).map((e) => e.space) as string[];
    spaces.forEach(async (space) => {
      const params = this.createAssignChatMessage({
        ticket,
        parent: space,
        text: `${ticket.submittedBy.fullName} has submitted a ticket`,
        headerTitle: "New Ticket",
      });
      chat.spaces.messages.create(params).catch();
    });
  }

  async assign(update: TicketAssignUpdateDocument) {
    const ticket = await Ticket.findById(update.ticket).populate({
      path: "assignedTo submittedBy",
    });
    if (!ticket) return;

    const user = (ticket.assignedTo as EmployeeDocument[]).find(
      (user) => user._id.toString() === update.assign.toString()
    );
    if (!user || !user.space) return;
    const params = this.createAssignChatMessage({
      ticket,
      parent: user.space,
      text: "You have been assigned to a ticket",
      headerTitle: "Assigned Ticket",
    });
    await chat.spaces.messages.create(params);
  }

  async comment(update: TicketCommentUpdateDocument) {
    const commenterId = update.createdBy.toString();
    const ticket = await Ticket.findById(update.ticket).populate({
      path: "assignedTo submittedBy",
    });
    if (!ticket) return;

    const users = [...(ticket.assignedTo as EmployeeDocument[])];
    if (!users.some((user) => user._id.toString() === commenterId)) users.push(ticket.submittedBy);

    const { commenter, rest } = users.reduce(
      (value, currEmployee) => {
        currEmployee._id.toString() === commenterId
          ? (value.commenter = currEmployee)
          : value.rest.push(currEmployee);
        return value;
      },
      { commenter: undefined, rest: [] } as {
        commenter?: EmployeeDocument;
        rest: EmployeeDocument[];
      }
    );

    rest.forEach(async (user) => {
      if (!user.space) return;
      await chat.spaces.messages.create({
        parent: user.space,
        requestBody: {
          text: `${commenter?.fullName} left a comment on ticket #${ticket.ticketId}`,
          cards: [
            {
              header: {
                title: "Ticket Comment",
                subtitle: `#${ticket.ticketId}`,
                imageUrl: "https://i.ibb.co/Ypsrycx/Ticket-Blue.png",
              },
              sections: [
                {
                  widgets: [
                    { keyValue: { topLabel: "Title", content: ticket.title } },
                    { keyValue: { topLabel: "Comment", content: update.comment } },
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
                                url: `${URL}/tickets/${ticket.ticketId}`,
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
    });
  }

  async close(ticket: TicketDocument) {
    await ticket.populate("assignedTo submittedBy closedBy").execPopulate();
    const closerId = ticket.closedBy!._id.toString();

    const users = [...(ticket.assignedTo as EmployeeDocument[])];
    if (!users.some((user) => user._id.toString() === closerId)) users.push(ticket.submittedBy);

    const { closer, rest } = users.reduce(
      (value, currEmployee) => {
        currEmployee._id.toString() === closerId
          ? (value.closer = currEmployee)
          : value.rest.push(currEmployee);
        return value;
      },
      { closer: undefined, rest: [] } as {
        closer?: EmployeeDocument;
        rest: EmployeeDocument[];
      }
    );

    rest.forEach(async (user) => {
      if (!user.space) return;
      await chat.spaces.messages.create({
        parent: user.space,
        requestBody: {
          text: `${closer?.fullName} has closed ticket #${ticket.ticketId}`,
          cards: [
            {
              header: {
                title: "Closed Ticket",
                subtitle: `#${ticket.ticketId}`,
                imageUrl: "https://i.ibb.co/Ypsrycx/Ticket-Blue.png",
              },
              sections: [
                {
                  widgets: [
                    { keyValue: { topLabel: "Title", content: ticket.title } },
                    { keyValue: { topLabel: "Description", content: ticket.description } },
                    {
                      keyValue: {
                        topLabel: "Priority",
                        content: capitalize(ticket.priority.toLowerCase()),
                      },
                    },
                    { keyValue: { topLabel: "Status", content: "Closed" } },
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
                                url: `${URL}/tickets/${ticket.ticketId}`,
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
    });
  }
}

export const ticketEvent = new TicketEvent();
