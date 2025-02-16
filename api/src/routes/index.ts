import user from "./user";
import express from "express";
import workshop from "./workshop"; // workshop routes
import mentor from "./mentor"; // mentor routes
import mentee from "./mentee"; // mentee routes
import event from "./event"; // event routes
import resource from "./resource"; // resource routes

const router = express.Router();

// Route definitions
router.use("/user", user);
router.use("/workshop", workshop);
router.use("/mentor", mentor);
router.use("/mentee", mentee);
router.use("/event", event);
router.use("/resource", resource);

export default router;

// export { workshops }
export { user, workshop, resource };
