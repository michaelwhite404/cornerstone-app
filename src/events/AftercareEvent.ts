import { AftercareAttendanceEntryModel } from "@@types/models";
import { AftercareAttendanceEntry, Department } from "@models";
import { chat } from "@utils";

class AftercareEvent {
  async signOut(entry: AftercareAttendanceEntryModel) {
    if (entry.student.aftercare) return;
    const arrRes = await AftercareAttendanceEntry.aggregate([
      {
        $match: {
          signOutDate: { $gt: new Date("2022-08-25T13:20:57.010+00:00") },
          student: entry.student._id,
          dropIn: true,
        },
      },
      { $count: "dropIns" },
    ]);

    const dropIns: number | undefined = arrRes[0]?.dropIns;
    if (!dropIns) return;
    const spaces = await getAftercareLeaderSpaces();
    spaces.forEach(async (space) => {
      await chat.spaces.messages.create({
        parent: space,
        requestBody: {
          text: `${entry.student.fullName} now has ${dropIns} drop ins.`,
          cards: [
            {
              header: {
                title: "Lions Den",
                subtitle: '<font color="#b0b0b0">Drop In Update</font>',
                imageUrl: "https://i.ibb.co/Msb2RDD/Lion-Light-Blue.png",
              },
              sections: [
                {
                  widgets: [
                    {
                      keyValue: {
                        topLabel: "Student",
                        content: entry.student.fullName,
                      },
                    },
                    {
                      keyValue: {
                        topLabel: "Drop Ins",
                        content: `${dropIns}`,
                      },
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

export const aftercareEvent = new AftercareEvent();

const getAftercareLeaderSpaces = async () => {
  const leaders = await Department.aggregate([
    {
      $match: {
        name: "Lions Den",
      },
    },
    {
      $lookup: {
        from: "departmentmembers",
        localField: "_id",
        foreignField: "department",
        as: "dm",
      },
    },
    {
      $unwind: {
        path: "$dm",
      },
    },
    {
      $match: {
        "dm.role": "LEADER",
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "dm.member",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
    {
      $replaceRoot: {
        newRoot: "$user",
      },
    },
  ]);

  return leaders.filter((l) => l.space).map((l) => l.space);
};
