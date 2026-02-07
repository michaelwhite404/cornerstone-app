import { models } from "@@types";
import { admin, AppError, catchAsync, isObject } from "@utils";
import { GaxiosResponse } from "gaxios";
import { admin_directory_v1 } from "googleapis";

// const domainEnding = "@cornerstone-schools.org"

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

export const addMembersToGroup = catchAsync(async (req, res, next) => {
  if (!req.body.users || !Array.isArray(req.body.users)) {
    return next(new AppError("The request body must have an array for the property `users`.", 400));
  }
  const validObjects = (req.body.users as any[]).filter(
    (user) => isObject(user) && typeof user.email === "string" && typeof user.role == "string"
  );
  const requests = validObjects.map((user) =>
    admin.members.insert({
      groupKey: `${req.params.group}@cornerstone-schools.org`,
      requestBody: {
        email: user.email,
        role: user.role,
      },
    })
  );

  const responses = await Promise.allSettled(requests);

  const fulfilled = responses.filter(
    (response) => response.status === "fulfilled"
  ) as PromiseFulfilledResult<GaxiosResponse<admin_directory_v1.Schema$Member>>[];
  const members = fulfilled.map((r) => r.value.data);

  res.sendJson(200, { members });
});

export const updateGroup = catchAsync(async (req, res) => {
  const groupKey = `${req.params.group}@cornerstone-schools.org`;
  const { name, description, email /* , aliases  */ } = req.body;
  const requests = [
    admin.groups.patch({
      groupKey,
      requestBody: { name, description, email },
    }),
  ];

  // if (aliases) {
  //   if (!Array.isArray(aliases)) {
  //     return next(new AppError("The `aliases` property must be an array", 400));
  //   }
  //   if (!aliases.every((alias: any) => typeof alias === "string" && alias.endsWith(domainEnding))) {
  //     return next(new AppError(`Each alias must end with \`${domainEnding}\``, 400));
  //   }
  //   requests.push(admin.groups.aliases.insert({
  //     groupKey,
  //     requestBody: {
  //       // alias:
  //     }
  //   }))
  // }

  const [{ data: group }] = await Promise.all(requests);
  res.sendJson(200, { group });
});
