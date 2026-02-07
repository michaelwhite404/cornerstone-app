import { studentQueries } from "./student";

const resolvers = {
  Query: {
    ...studentQueries,
  },
};

export default resolvers;
