import user from "./user";
import express from "express";
import workshop from "./workshop"; // Import workshop routes

// export { workshops }
export { user, workshop };

// import express, { Request, Response, Application } from "express"
// import cors from "cors"
// import dbConnect from "./config/dbConnect"
// import mongoose from "mongoose"

// import { Group, IGroup } from "./model/Group"
// import { User, IUser } from "./model/User"
// import { Expense } from "./model/Expense"
// import { populate } from "dotenv"

// dbConnect()

// const app: Application = express()
// app.use(cors())
// app.use(express.json()) // To parse JSON bodies
// const port = process.env.PORT || 8000

// // Test POST endpoint
// app.post("/test", (req: Request, res: Response) => {
//   console.log(req.body) // Log the request body to check what you are receiving

//   const { key } = req.body // Extract "key" from the request body
//   if (!key) {
//     return res.status(400).json({ message: "No key provided" })
//   }

//   return res.status(200).json({
//     message: "Data received successfully",
//     receivedKey: key,
//   })
// })

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`)
// })
