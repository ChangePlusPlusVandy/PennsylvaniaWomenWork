import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import * as routes from "./routes/index";
import router from "./routes";

var cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:3000" })); // Connect to the frontend PORT 3000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use("/user", routes.user);
app.use("/api", router);

app.use("/api/workshop", routes.workshop);
app.use("/api/resource", routes.resource);

app.listen(process.env.PORT || 8000, () => console.log("Server running..."));
