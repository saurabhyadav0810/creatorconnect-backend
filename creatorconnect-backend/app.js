import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";


const app = express();


if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}


app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use(morgan("dev"));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CMS Backend is running"
  });
});


// testing();
// app.use("/chats", chatRoutes);
// app.use("/webhooks", webhookRoutes);
app.use("/auth", authRoutes);
// app.use("/artifacts", artifactRoutes);
// app.use("/likes", likes);
// app.use("/comments", comment);

export default app;