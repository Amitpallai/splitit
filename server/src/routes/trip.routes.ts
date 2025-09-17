import express from 'express';
import { createTrip, getTrips, getRecentTrips } from '../controllers/trip.controller';

const router = express.Router();

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/recent', getRecentTrips);

export default router;