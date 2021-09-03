import { Server } from "socket.io";
import {
  addFriend,
  deleteRequestFriend,
} from "../controllers/UserController.js";

export const ConnectSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);

    socket.on("join_room", (User) => {
      socket.join(User._id);
    });

    socket.on("add_friend", async (data) => {
      const { userFrom, userTo } = data;

      await addFriend(userFrom, userTo);

      io.emit("add_friend_success");
      io.to(userTo._id).emit("new_request_friend");
    });

    socket.on("delete_request_friend", async (data) => {
      const { userFrom, userTo } = data;
      await deleteRequestFriend(userFrom, userTo);
      io.emit("delete_request_friend_success");
      io.to(userTo._id).emit("person_delete_request_friend");
    });
  });
};
