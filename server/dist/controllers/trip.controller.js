"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrip = exports.updateTrip = exports.getRecentTrips = exports.getTrips = exports.createTrip = void 0;
const Trip_1 = __importDefault(require("../models/Trip"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = require("../utils/validator");
// Validator
const createTrip = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = validator_1.tripCreateSchema.safeParse(req.body);
        if (!validation.success)
            return res.status(400).json({ success: false, message: validation.error.issues[0].message });
        const { tripName, location, participants = [] } = validation.data;
        const creatorId = req.userId;
        if (!creatorId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        // Clean names
        const participantsClean = participants.map(p => p.trim()).filter(Boolean);
        // Find registered users
        const participantUsers = yield User_1.default.find({
            username: { $in: participantsClean.map(p => new RegExp(`^${p}$`, "i")) }
        }).select("_id username");
        // Extract matched usernames
        const matchedUsernames = participantUsers.map(u => u.username.toLowerCase());
        // Remaining names = guests
        const guestParticipants = participantsClean.filter(p => !matchedUsernames.includes(p.toLowerCase()));
        const allParticipants = [creatorId, ...participantUsers.map(u => u._id)];
        const trip = new Trip_1.default({
            tripName,
            location,
            creator: creatorId,
            participants: allParticipants,
            guestParticipants
        });
        yield trip.save();
        yield trip.populate([
            { path: "participants", select: "username" },
            { path: "creator", select: "username" },
        ]);
        res.status(201).json({ success: true, message: "Trip created successfully", trip });
    }
    catch (err) {
        console.error("Error creating trip:", err);
        next(err);
    }
});
exports.createTrip = createTrip;
// Get all trips
const getTrips = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const trips = yield Trip_1.default.find({ participants: userId })
            .sort({ createdAt: -1 })
            .populate("participants", "username")
            .populate("creator", "username");
        res.status(200).json({ success: true, message: "Trips fetched successfully", trips });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
exports.getTrips = getTrips;
// Get recent 5 trips
const getRecentTrips = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const trips = yield Trip_1.default.find({ participants: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("participants", "username")
            .populate("creator", "username");
        res.status(200).json({ success: true, message: "Recent trips fetched successfully", trips });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
exports.getRecentTrips = getRecentTrips;
const updateTrip = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tripId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({ success: false, message: "Invalid Trip ID" });
        }
        const validation = validator_1.tripUpdateSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ success: false, message: validation.error.issues[0].message });
        }
        const { tripName, location, participants } = validation.data;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const trip = yield Trip_1.default.findById(tripId);
        if (!trip) {
            return res.status(404).json({ success: false, message: "Trip not found" });
        }
        // Authorization: Only creator can update
        if (trip.creator.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Only the creator can update the trip" });
        }
        // Update fields if provided
        if (tripName !== undefined)
            trip.tripName = tripName;
        if (location !== undefined)
            trip.location = location;
        if (participants !== undefined) {
            // Clean participant usernames
            const participantsClean = participants.map(p => p.trim()).filter(Boolean);
            // Find registered users by username (case-insensitive)
            const participantUsers = yield User_1.default.find({
                username: { $in: participantsClean.map(p => new RegExp(`^${p}$`, "i")) },
            }).select("_id username");
            // Extract matched usernames (lowercase for comparison)
            const matchedUsernames = participantUsers.map(u => u.username.toLowerCase());
            // Identify guest participants
            const guestParticipants = participantsClean.filter(p => !matchedUsernames.includes(p.toLowerCase()));
            // Combine creator and participant user IDs
            const allParticipants = [
                trip.creator,
                ...participantUsers.map(u => u._id),
            ];
            // Deduplicate participants
            const uniqueParticipants = Array.from(new Set(allParticipants.map(id => id.toString()))).map(strId => new mongoose_1.default.Types.ObjectId(strId));
            trip.participants = uniqueParticipants;
            trip.guestParticipants = guestParticipants;
        }
        yield trip.save();
        // Populate participants and creator for response
        yield trip.populate([
            { path: "participants", select: "username" },
            { path: "creator", select: "username" },
        ]);
        res.status(200).json({ success: true, message: "Trip updated successfully", trip });
    }
    catch (err) {
        console.error("Error updating trip:", err);
        next(err);
    }
});
exports.updateTrip = updateTrip;
const deleteTrip = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tripId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({ success: false, message: "Invalid Trip ID" });
        }
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const trip = yield Trip_1.default.findById(tripId);
        if (!trip) {
            return res.status(404).json({ success: false, message: "Trip not found" });
        }
        // Authorization: Only creator can delete
        if (trip.creator.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Only the creator can delete the trip" });
        }
        yield Trip_1.default.deleteOne({ _id: tripId });
        res.status(200).json({ success: true, message: "Trip deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting trip:", err);
        next(err);
    }
});
exports.deleteTrip = deleteTrip;
