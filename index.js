import express from "express";
import AuthRoutes from "./routes/AuthRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import ErrorHandler from "./utils/ErrorHandler.js";
import HandleConnectDB from "./utils/MongoConnect.js";
import LocationRoutes from "./routes/LocationRoutes.js"
import ReelRoutes from "./routes/ReelRoutes.js"

const app = express();
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["POST", "GET", "PATCH", "DELETE"]
  })
);
HandleConnectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_Cloud,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY
});

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
  })
);


app.get("/", (req, res) => {
  res.send("Welcome To The API");
});

app.use("/api", AuthRoutes);
app.use("/api", LocationRoutes);
app.use("/api", ReelRoutes);

app.use(ErrorHandler);

app.listen(5000, () => {
  console.log("APP Listening To 5000");
});
