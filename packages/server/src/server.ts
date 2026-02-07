import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { green, red } from "chalk";
import cron from "node-cron";

dotenv.config({ path: path.resolve(__dirname, "../config.env") });
import { AftercareSession } from "@models";
import app from "@app";
import { EmployeeModel } from "@@types/models";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  process.env.NODE_ENV === "development" && console.log(green`A user connected: ${socket.id}`);

  socket.on("userConnected", (user: EmployeeModel) => {
    socket.data.user = user;
  });
  socket.on("disconnect", () => {
    process.env.NODE_ENV === "development" && console.log(red`A user disconnected: ${socket.id}`);
  });
});

const DB = process.env.DATABASE!.replace("<PASSWORD>", process.env.DATABASE_PASSWORD!);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

cron.schedule(
  "0 0 * * *",
  async () => {
    await AftercareSession.findOneAndUpdate({ active: true }, { active: false });
    io.emit("newDay");
  },
  { timezone: "America/New_York" }
);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log("App running on port " + port);
});
