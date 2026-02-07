import { ShortUrl } from "@models";
import { catchAsync } from "@utils";
import * as factory from "./handlerFactory";

const Model = ShortUrl;
const key = "shortUrl";

export const getAllShortUrls = factory.getAll(Model, key);
export const getShortUrl = factory.getOneById(Model, key, {
  path: "createdBy",
  select: "fullName",
});
export const createShortUrl = catchAsync(async (req, res) => {
  const shortUrl = await Model.create({
    full: req.body.full,
    short: req.body.short,
    clicks: 0,
    createdBy: req.employee._id,
  });

  res.sendJson(201, { shortUrl });
});
