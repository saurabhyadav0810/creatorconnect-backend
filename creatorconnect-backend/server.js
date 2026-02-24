import "dotenv/config";
// import cloudinary from "./config/cloudinary.js";
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./config/db.js";
import cors from "cors";
import http from "http";
import initializeSocket from "./socket/socket.js";

const PORT = process.env.PORT || 3000;
connectDB();

const server = http.createServer(app);
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
