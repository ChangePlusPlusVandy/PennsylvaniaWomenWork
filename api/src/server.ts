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

// Only connect to DB if not in test environment
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Use all routes
app.use("/api", router);

app.use("/api/workshop", routes.workshop);
app.use("/api/resource", routes.resource);

// Export the server instance for testing
export { app };

// Only listen if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT || 8000, () => {
    console.log("Server running...");
  });
}
