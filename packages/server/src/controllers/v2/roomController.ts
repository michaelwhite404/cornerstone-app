import { Room } from "@models";
import * as factory from "./handlerFactory";

const Model = Room;
const key = "room";

/** `GET` - Gets all rooms
 *  - All authorized users can access this route
 */
export const getAllRooms = factory.getAll(Model, `${key}s`);
/** `GET` - Gets a single room
 *  - All authorized users can access this route
 */
export const getRoom = factory.getOneById(Model, key);
/** `POST` - Creates a new room
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const createRoom = factory.createOne(Model, key);
/** `PATCH` - Updates a room
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const updateRoom = factory.updateOne(Model, key);
/** `DELETE` - Deletes a room
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const deleteRoom = factory.deleteOne(Model, key);
