"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddTripDialog } from "./trips/AddTripDialog";
import { TripCard } from "./trips/TripCard";
import { useTrip } from "@/context/TripContext";
import PaymentsTable from "./trips/RecentTripExpense";

export function AddTrip() {
  const { trips, fetchTrips } = useTrip();
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);

  // Fetch trips and expenses on mount
 
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-background border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Split Bill Dashboard</h1>
        <Button onClick={() => setIsAddTripOpen(true)}>Add New Trip</Button>
      </header>

      {/* Add Trip Dialog */}
      <AddTripDialog
        isOpen={isAddTripOpen}
        onClose={() => {
          setIsAddTripOpen(false);
          fetchTrips(); // refresh trips
        }}
      />

      {/* All Trips */}
      <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <TripCard
              key={trip._id}
              id={trip._id}
              name={trip.tripName}
              location={trip.location}
              participants={trip.participants.map(
                (p: { username?: string; _id?: string } | string) =>
                  typeof p === "string" ? p : p.username || p._id || ""
              )}
              guestParticipants={trip.guestParticipants || []}
            />
          ))
        ) : (
          <p className="text-gray-500">
            No trips found. Add a new trip to get started.
          </p>
        )}
      </div>

      {/* Recent Expenses */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Expenses</h2>
        <PaymentsTable/>
      </div>
    </div>
  );
}
