import dotenv from "dotenv";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import * as routes from "./routes/index";
import router from "./routes";

dotenv.config({ path: path.resolve(__dirname, "../.env.staging") });
var cors = require("cors");

const app = express();
app.use(cors({
    origin: process.env.CLIENT_ORIGIN_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use("/api/user", routes.user);
app.use("/api", router);

app.use("/api/workshop", routes.workshop);
app.use("/api/resource", routes.resource);

app.listen(process.env.PORT || 8000, () => console.log(`Server running on port ${process.env.PORT}`));
