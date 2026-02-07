import { Textbook, UserSetting } from "@models";
import { TextbookQuality } from "@@types/models";
import { Email, formatUrl } from "@utils";

class TextbookEvent {
  async checkIn(textbookIds: string[]) {
    // Get textbooks (name, number, last user, quality)
    const textbooks = await Textbook.find({ _id: { $in: textbookIds } }).populate(
      "textbookSet lastUser"
    );

    const qualities = textbooks.reduce((arr, textbook) => {
      if (!arr.includes(textbook.quality)) arr.push(textbook.quality);
      return arr;
    }, [] as TextbookQuality[]);

    // Email on every checkin
    const allCheckInsFilter = { "value.textbookCheckInEmail": "TEXTBOOK_CHECK_IN_EMAIL_ENUM_ALL" };
    // Email on speecific checkin status
    const specificCheckInFilter = {
      "value.textbookCheckInEmail": "TEXTBOOK_CHECK_IN_EMAIL_ENUM_PICK",
      "value.textbookCheckInQualityPick": { $in: qualities },
    };
    const docs = await UserSetting.find({
      $or: [allCheckInsFilter, specificCheckInFilter],
    }).populate("user");
    docs.forEach((setting) => {
      const email = new Email(setting.user, formatUrl("/textbooks"));
      email.sendTextbooksCheckInEmail(textbooks, setting);
    });
  }
}

export const textbookEvent = new TextbookEvent();
