import { models } from "@@types";
import { admin, AppError, catchAsync } from "@utils";
import { admin_directory_v1 } from "googleapis";

export const getAllGroups = catchAsync(async (_, res, _2) => {
  res.sendJson(200, {
    groups:
      (await admin.groups.list({ maxResults: 200, customer: process.env.GOOGLE_CUSTOMER_ID })).data
        .groups || [],
  });
});

export const getGroup = catchAsync(async (req, res, next) => {
  const options = { groupKey: `${req.params.group}@cornerstone-schools.org` };
  try {
    const response = await Promise.all([
      admin.groups.get(options),
      admin.members.list(options),
      admin.users.list({
        customer: "C04bg2ija",
        // query: "isSuspended=false",
        maxResults: 500,
      }),
    ]);
    //prettier-ignore
    const [{data: group}, {data: {members}}, {data: {users}}] = response;
    const mappedUsers = users!.reduce(
      (prev, next) => ((prev[next.id!] = next), prev),
      {} as { [x: string]: admin_directory_v1.Schema$User }
    );

    const m: models.GroupMember[] | undefined = members?.map((member) => {
      const { kind, etag, delivery_settings, ...rest } = member;
      if (member.type === "GROUP") {
        return rest;
      }
      return Object.assign(rest, { fullName: mappedUsers[member.id!]?.name?.fullName });
    });

    res.sendJson(200, {
      group: { ...group, members: m },
    });
  } catch (err) {
    // console.log(err);
    return next(new AppError("Group not found: " + req.params.group, 404));
  }
});

export const createGroup = catchAsync(async (req, res) => {
  const { data: group } = await admin.groups.insert({
    requestBody: {
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
    },
  });

  res.sendJson(201, { group });
});