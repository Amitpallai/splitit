import express from "express";
import { createTrip, getTrips, getRecentTrips, updateTrip, deleteTrip } from "../controllers/trip.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getTrips);
router.put("/:id", authMiddleware, updateTrip);
router.delete("/:id", authMiddleware, deleteTrip);
router.get("/recent", authMiddleware, getRecentTrips);

export default router;