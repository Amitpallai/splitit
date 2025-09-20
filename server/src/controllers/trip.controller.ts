import { Response, NextFunction } from "express";
import Trip from "../models/Trip";
import User from "../models/User";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
import { tripCreateSchema,tripUpdateSchema } from "../utils/validator";

// Validator

export const createTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validation = tripCreateSchema.safeParse(req.body);
    if (!validation.success)
      return res.status(400).json({ success: false, message: validation.error.issues[0].message });

    const { tripName, location, participants = [] } = validation.data;
    const creatorId = req.userId;
    if (!creatorId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // Clean names
    const participantsClean = participants.map(p => p.trim()).filter(Boolean);

    // Find registered users
    const participantUsers = await User.find({
      username: { $in: participantsClean.map(p => new RegExp(`^${p}$`, "i")) }
    }).select("_id username");

    // Extract matched usernames
    const matchedUsernames = participantUsers.map(u => u.username.toLowerCase());

    // Remaining names = guests
    const guestParticipants = participantsClean.filter(
      p => !matchedUsernames.includes(p.toLowerCase())
    );

    const allParticipants = [creatorId, ...participantUsers.map(u => u._id)];

    const trip = new Trip({
      tripName,
      location,
      creator: creatorId,
      participants: allParticipants,
      guestParticipants
    });

    await trip.save();

    await trip.populate([
      { path: "participants", select: "username" },
      { path: "creator", select: "username" },
    ]);

    res.status(201).json({ success: true, message: "Trip created successfully", trip });
  } catch (err) {
    console.error("Error creating trip:", err);
    next(err);
  }
};

// Get all trips
export const getTrips = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const trips = await Trip.find({ participants: userId })
      .sort({ createdAt: -1 })
      .populate("participants", "username")
      .populate("creator", "username");

    res.status(200).json({ success: true, message: "Trips fetched successfully", trips });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Get recent 5 trips
export const getRecentTrips = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const trips = await Trip.find({ participants: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("participants", "username")
      .populate("creator", "username");

    res.status(200).json({ success: true, message: "Recent trips fetched successfully", trips });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
 
export const updateTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tripId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID" });
    }

    const validation = tripUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, message: validation.error.issues[0].message });
    }

    const { tripName, location, participants } = validation.data;

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    // Authorization: Only creator can update
    if (trip.creator.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Only the creator can update the trip" });
    }

    // Update fields if provided
    if (tripName !== undefined) trip.tripName = tripName;
    if (location !== undefined) trip.location = location;

    if (participants !== undefined) {
      // Clean participant usernames
      const participantsClean = participants.map(p => p.trim()).filter(Boolean);

      // Find registered users by username (case-insensitive)
      const participantUsers = await User.find({
        username: { $in: participantsClean.map(p => new RegExp(`^${p}$`, "i")) },
      }).select("_id username");

      // Extract matched usernames (lowercase for comparison)
      const matchedUsernames = participantUsers.map(u => u.username.toLowerCase());

      // Identify guest participants
      const guestParticipants = participantsClean.filter(
        p => !matchedUsernames.includes(p.toLowerCase())
      );

      // Combine creator and participant user IDs
      const allParticipants = [
        trip.creator,
        ...participantUsers.map(u => u._id),
      ] as mongoose.Types.ObjectId[];

      // Deduplicate participants
      const uniqueParticipants = Array.from(
        new Set(allParticipants.map(id => id.toString()))
      ).map(strId => new mongoose.Types.ObjectId(strId));

      trip.participants = uniqueParticipants;
      trip.guestParticipants = guestParticipants;
    }

    await trip.save();

    // Populate participants and creator for response
    await trip.populate([
      { path: "participants", select: "username" },
      { path: "creator", select: "username" },
    ]);

    res.status(200).json({ success: true, message: "Trip updated successfully", trip });
  } catch (err) {
    console.error("Error updating trip:", err);
    next(err);
  }
};

export const deleteTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tripId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID" });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    // Authorization: Only creator can delete
    if (trip.creator.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Only the creator can delete the trip" });
    }

    await Trip.deleteOne({ _id: tripId });

    res.status(200).json({ success: true, message: "Trip deleted successfully" });
  } catch (err) {
    console.error("Error deleting trip:", err);
    next(err);
  }
};