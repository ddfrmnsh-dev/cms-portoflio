import { io } from "socket.io-client";

const socket = "";
// const socket = io("http://localhost:3000", {
//   withCredentials: true, // 🔥 Pastikan ini aktif
//   transports: ["websocket", "polling"], // 🔥 Pakai fallback polling
// });

// socket.on("connect", () => {
//   console.log("✅ WebSocket Connected:", socket.id);
// });

// socket.on("disconnect", () => {
//   console.log("❌ WebSocket Disconnected");
// });

// export const connectUser = (userId) => {
//   console.log(`🔗 Connecting user_${userId} to WebSocket`);
//   socket.emit("joinRoom", `user_${userId}`); // 🔥 Bergabung ke channel khusus user
// };

export default socket;
