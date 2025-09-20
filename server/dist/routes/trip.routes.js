"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trip_controller_1 = require("../controllers/trip.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
router.post("/", auth_middleware_1.default, trip_controller_1.createTrip);
router.get("/", auth_middleware_1.default, trip_controller_1.getTrips);
router.put("/:id", auth_middleware_1.default, trip_controller_1.updateTrip);
router.delete("/:id", auth_middleware_1.default, trip_controller_1.deleteTrip);
router.get("/recent", auth_middleware_1.default, trip_controller_1.getRecentTrips);
exports.default = router;
