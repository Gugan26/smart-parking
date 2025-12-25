import React, { useState } from "react";
import { motion } from "framer-motion";
import { ParkingSpot } from "./ParkingSpot";
import { StatusCard } from "./StatusCard";
import { ReservationPanel } from "./ReservationPanel";
import { Car, CheckCircle, MapPin, Bike } from "lucide-react";

const INITIAL_SPOTS = [
  // CAR SPOTS
  ...Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    type: "car",
    capacity: 1,
    occupancy: 0,
    status: "available",
    formData: null,
  })),
  // BIKE SPOTS
  ...Array.from({ length: 4 }, (_, i) => ({
    id: i + 9,
    type: "bike",
    capacity: 4,
    occupancy: 0,
    status: "available",
    formData: null,
  })),
];

export function ParkingDashboard() {
  const [spots, setSpots] = useState(INITIAL_SPOTS);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const selectedSpot = spots.find(s => s.id === selectedSpotId);

  const stats = {
    availableCars: spots.filter(s => s.type === "car" && s.status === "available").length,
    availableBikes: spots.reduce((acc, s) => s.type === "bike" ? acc + (s.capacity - s.occupancy) : acc, 0),
    totalOccupied: spots.reduce((acc, s) => acc + s.occupancy, 0),
  };

  const handleSpotSelect = (id) => {
    setSelectedSpotId(id);
    setIsPanelOpen(true);
  };

  const handleReservation = (spotId, data) => {
    setSpots(prev => prev.map(spot => {
      if (spot.id !== spotId) return spot;
      const newOccupancy = spot.type === "bike" ? Math.min(spot.capacity, spot.occupancy + 1) : 1;
      return { ...spot, occupancy: newOccupancy, status: newOccupancy > 0 ? "occupied" : "available", formData: data };
    }));
    setIsPanelOpen(false);
    setSelectedSpotId(null);
  };

  const handleCancelReservation = (spotId) => {
    setSpots(prev => prev.map(spot => {
      if (spot.id !== spotId) return spot;
      return { ...spot, occupancy: 0, status: "available", formData: null };
    }));
    setIsPanelOpen(false);
    setSelectedSpotId(null);
    alert("Reservation cancelled successfully");
  };

  const carSpots = spots.filter(s => s.type === "car");
  const bikeSpots = spots.filter(s => s.type === "bike");

  return (
    <div className="min-h-screen bg-bg p-6 font-sans text-text">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
            <div className="p-4 rounded-full shadow-neu bg-bg text-neu-blue"><MapPin size={32} /></div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-700">VDart<span className="text-neu-blue">.ui</span></h1>
              <p className="text-gray-500">Smart Parking Management</p>
            </div>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <StatusCard icon={Car} label="Car Spots" count={stats.availableCars} />
            <StatusCard icon={Bike} label="Bike Slots" count={stats.availableBikes} />
            <StatusCard icon={CheckCircle} label="Total Parked" count={stats.totalOccupied} />
          </div>
        </header>

        {/* CAR ZONE */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Car /> Car Parking Zone</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {carSpots.map(spot => <ParkingSpot key={spot.id} {...spot} isSelected={selectedSpotId === spot.id} onSelect={handleSpotSelect} />)}
          </div>
        </section>

        {/* BIKE ZONE */}
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Bike /> Bike Parking Zone</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bikeSpots.map(spot => <ParkingSpot key={spot.id} {...spot} isSelected={selectedSpotId === spot.id} onSelect={handleSpotSelect} />)}
          </div>
        </section>

        {/* RESERVATION PANEL */}
        <ReservationPanel
          spotId={selectedSpotId}
          spotType={selectedSpot?.type}
          capacity={selectedSpot?.capacity}
          occupancy={selectedSpot?.occupancy}
          formData={selectedSpot?.formData}
          isOpen={isPanelOpen}
          onClose={() => { setIsPanelOpen(false); setSelectedSpotId(null); }}
          onSubmit={handleReservation}
          onCancel={handleCancelReservation}
        />
      </div>
    </div>
  );
}
