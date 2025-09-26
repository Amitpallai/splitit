// src/types/trip.ts

export interface Trip {
  _id: string;
  tripName: string;
  location: string;
  participants: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TripPayload {
  tripName: string;
  location: string;
  participants: string[];
}

export interface TripContextType {
  trips: Trip[];
  loading: boolean;
  fetchTrips: () => void;
  fetchRecentTrips: () => void;
  addTrip: (trip: TripPayload) => Promise<void>;
  updateTrip: (id: string, trip: TripPayload) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
}
