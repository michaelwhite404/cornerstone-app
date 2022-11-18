import { addDays, format } from "date-fns";
import { JWT } from "google-auth-library";
import { calendar_v3, google } from "googleapis";

/**
 *
 * @param scopes list of requested scopes or a single scope.
 * @param imperonatedEmail impersonated account's email address.
 */
export const googleAuthJWT = (scopes?: string | string[], imperonatedEmail?: string): JWT => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes,
    imperonatedEmail
  );
  return auth;
};

const scopes = [
  "https://www.googleapis.com/auth/admin.directory.device.chromeos",
  "https://www.googleapis.com/auth/admin.directory.orgunit",
  "https://www.googleapis.com/auth/admin.directory.group",
  "https://www.googleapis.com/auth/admin.directory.user",
];
export default google.admin({
  version: "directory_v1",
  auth: googleAuthJWT(scopes, process.env.GOOGLE_ADMIN_EMAIL),
});

export const chat = google.chat({
  version: "v1",
  auth: new google.auth.JWT({
    email: process.env.GOOGLE_CHAT_SERVICE_ACCOUNT_CLIENT_EMAIL,
    key: process.env.GOOGLE_CHAT_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/chat.bot"],
  }),
});

export const sheets = (email: string) =>
  google.sheets({
    version: "v4",
    auth: googleAuthJWT(["https://www.googleapis.com/auth/spreadsheets"], email),
  });

export class StaffCalendar {
  private calendarId = process.env.GOOGLE_STAFF_CALENDAR_ID!;
  private calendarAPI: calendar_v3.Calendar;
  private timeZone = "America/New_York";
  constructor(impersonatedEmail: string) {
    this.calendarAPI = google.calendar({
      version: "v3",
      auth: googleAuthJWT(["https://www.googleapis.com/auth/calendar"], impersonatedEmail),
    });
  }

  async addEvent(eventDetails: EventDetails) {
    const formatDate = (date: Date) =>
      eventDetails.allDay ? { date: format(date, "yyyy-MM-dd") } : { dateTime: date.toISOString() };
    if (eventDetails.allDay) eventDetails.end = addDays(eventDetails.end, 1);

    const response = await this.calendarAPI.events.insert({
      calendarId: this.calendarId,
      requestBody: {
        summary: eventDetails.title,
        description: eventDetails.description,
        start: {
          timeZone: this.timeZone,
          ...formatDate(eventDetails.start),
        },
        end: {
          timeZone: this.timeZone,
          ...formatDate(eventDetails.end),
        },
      },
    });

    return response.data;
  }

  async listEvents() {
    const response = await this.calendarAPI.events.list({
      calendarId: this.calendarId,
    });
    return response.data.items || [];
  }

  async getEvent(eventId: string) {
    const response = await this.calendarAPI.events.get({
      calendarId: this.calendarId,
      eventId,
    });
    return response.data;
  }
}

interface EventDetails {
  start: Date;
  description?: string;
  title: string;
  end: Date;
  allDay?: boolean;
}
