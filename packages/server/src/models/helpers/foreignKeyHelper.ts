import { Model, ObjectId } from "mongoose";

const FKHelper = (Model: Model<any>, id: ObjectId): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Model.findById(id);

      if (!doc) return reject(`No ${Model.modelName} with id '${id}'`);
      return resolve(true);
    } catch (err) {
      return reject(err);
    }
  });
};

export default FKHelper;
