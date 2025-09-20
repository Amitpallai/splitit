// src/context/TripContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { tripApi } from "@/services/tripApi";
import type { Trip, TripPayload } from "@/services/tripApi";

import { toast } from "react-hot-toast";

interface TripContextType {
  trips: Trip[];
  loading: boolean;
  fetchTrips: () => void;
  fetchRecentTrips: () => void;
  addTrip: (trip: TripPayload) => Promise<void>;
  updateTrip: (id: string, trip: TripPayload) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await tripApi.getTrips();
      if (res.success) setTrips(res.trips);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTrips = async () => {
    setLoading(true);
    try {
      const res = await tripApi.getRecentTrips();
      if (res.success) setTrips(res.trips);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch recent trips");
    } finally {
      setLoading(false);
    }
  };

  const addTrip = async (trip: TripPayload) => {
    setLoading(true);
    try {
      const res = await tripApi.createTrip(trip);
      if (res.success) {
        setTrips(prev => [res.trip, ...prev]);
        toast.success(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (id: string, trip: TripPayload) => {
    setLoading(true);
    try {
      const res = await tripApi.updateTrip(id, trip);
      if (res.success) {
        setTrips(prev => prev.map(t => (t._id === id ? res.trip : t)));
        toast.success(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update trip");
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id: string) => {
    setLoading(true);
    try {
      const res = await tripApi.deleteTrip(id);
      if (res.success) {
        setTrips(prev => prev.filter(t => t._id !== id));
        toast.success(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete trip");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <TripContext.Provider value={{ trips, loading, fetchTrips, fetchRecentTrips, addTrip, updateTrip, deleteTrip }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTrip must be used within TripProvider");
  return context;
};
