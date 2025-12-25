import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Mail,
  Lock,
  Car,
  Bike,
  Clock,
} from "lucide-react";
import { MonthlyPassForm } from "./MonthlyPassForm";
import { YearlyPassForm } from "./YearlyPassForm.jsx";

export function ReservationPanel({
  spotId,
  spotType = "car",
  capacity = 1,
  occupancy = 0,
  isOpen,
  onClose,
  onSubmit,
  onCancel,
}) {
  const [step, setStep] = useState(1);
  const [showMonthlyPass, setShowMonthlyPass] = useState(false);
  const [showYearlyPass, setShowYearlyPass] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    startTime: "",
    endTime: "",
    vehicleType: spotType,
    durationHours: 0,
  });

  const isOccupiedView = occupancy >= capacity;

  /* =======================
     SIMPLE VALIDATION
  ======================= */
  const canProceed = (...fields) =>
    fields.every(
      (f) => f !== undefined && f !== null && String(f).trim() !== ""
    );

  /* =======================
     RESET ON OPEN
  ======================= */
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setShowMonthlyPass(false);
      setShowYearlyPass(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        startTime: "",
        endTime: "",
        vehicleType: spotType,
        durationHours: 0,
      });
    }
  }, [isOpen, spotType]);

  /* =======================
     PASS SELECTION
  ======================= */
  const handlePassSelection = (type) => {
    if (type === "monthly") {
      setShowMonthlyPass(true);
      setShowYearlyPass(false);
    }
    if (type === "yearly") {
      setShowYearlyPass(true);
      setShowMonthlyPass(false);
    }
  };

  /* =======================
     SUBMIT RESERVATION
  ======================= */
  const handleReservationSubmit = (e) => {
    e.preventDefault();
    if (!spotId) return;

    const [sh, sm] = formData.startTime.split(":").map(Number);
    const [eh, em] = formData.endTime.split(":").map(Number);

    let start = sh * 60 + sm;
    let end = eh * 60 + em;
    if (end <= start) end += 1440;

    const duration = (end - start) / 60;

    onSubmit(spotId, { ...formData, durationHours: duration });
  };

  /* =======================
     EXTEND TIME
  ======================= */
  const handleExtendTime = () => {
    if (!formData.endTime) return alert("No end time found");

    const [h, m] = formData.endTime.split(":").map(Number);
    const newHour = Math.min(h + 1, 23);
    const newEnd = `${newHour.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;

    setFormData({ ...formData, endTime: newEnd });
    alert(`Extended till ${newEnd}`);
  };

  /* =======================
     QUICK TIME
  ======================= */
  const setQuickTime = (hrs) => {
    const now = new Date();
    const end = new Date(now.getTime() + hrs * 60 * 60 * 1000);
    const f = (n) => n.toString().padStart(2, "0");

    setFormData({
      ...formData,
      startTime: `${f(now.getHours())}:${f(now.getMinutes())}`,
      endTime: `${f(end.getHours())}:${f(end.getMinutes())}`,
    });
  };

  /* =======================
     PASS BUTTONS
  ======================= */
  const PassButtons = () => (
    <div className="mt-10 flex flex-col gap-4">
      {["monthly", "yearly"].map((id) => (
        <motion.button
          key={id}
          type="button"
          onClick={() => handlePassSelection(id)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-extrabold bg-yellow-400"
        >
          {id === "monthly" ? "Monthly Pass" : "Yearly Pass"}
        </motion.button>
      ))}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="fixed inset-y-0 right-0 w-full md:w-96 bg-bg z-50 p-8 overflow-y-auto"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">
              {showMonthlyPass
                ? "Monthly Pass"
                : showYearlyPass
                ? "Yearly Pass"
                : isOccupiedView
                ? "Occupied Spot Access"
                : "Reserve Spot"}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full shadow-neu">
              <X size={20} />
            </button>
          </div>

          {/* SLOT INFO */}
          <div className="mb-8 p-5 rounded-2xl shadow-neu-inset bg-bg flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">
                Slot Number
              </p>
              <p className="text-3xl font-extrabold text-neu-blue">
                {spotId}
              </p>
            </div>
            <div
              className={`h-12 w-12 rounded-full shadow-neu flex items-center justify-center text-white ${
                spotType === "bike" ? "bg-orange-400" : "bg-neu-blue"
              }`}
            >
              {spotType === "bike" ? <Bike size={24} /> : <Car size={24} />}
            </div>
          </div>

          {/* PASS FORMS */}
          {showMonthlyPass && (
            <MonthlyPassForm onBack={() => setShowMonthlyPass(false)} />
          )}
          {showYearlyPass && (
            <YearlyPassForm onBack={() => setShowYearlyPass(false)} />
          )}

          {/* RESERVATION FORM */}
          {!showMonthlyPass && !showYearlyPass && (
            <form onSubmit={handleReservationSubmit}>
              <AnimatePresence mode="wait">
                {/* OCCUPIED FLOW */}
                {isOccupiedView && step === 1 && (
                  <motion.div className="space-y-4">
                    <label className="flex gap-2 text-sm font-bold">
                      <Mail size={16} /> Gmail
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-xl shadow-neu-inset"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!canProceed(formData.email)) {
                          alert("Enter Gmail");
                          return;
                        }
                        setStep(2);
                      }}
                      className="w-full py-3 rounded-xl shadow-neu font-bold"
                    >
                      Next
                    </button>
                  </motion.div>
                )}

                {isOccupiedView && step === 2 && (
                  <motion.div className="space-y-4">
                    <label className="flex gap-2 text-sm font-bold">
                      <Lock size={16} /> Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl shadow-neu-inset"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!canProceed(formData.password)) {
                          alert("Enter Password");
                          return;
                        }
                        setStep(3);
                      }}
                      className="w-full py-3 rounded-xl shadow-neu font-bold"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}

                {isOccupiedView && step === 3 && (
                  <motion.div className="flex flex-col gap-4">
                    <button
                      type="button"
                      onClick={handleExtendTime}
                      className="py-3 rounded-xl shadow-neu font-extrabold flex justify-center gap-2"
                    >
                      <Clock size={18} /> Extend Time
                    </button>
                    <button
                      type="button"
                      onClick={() => onCancel(spotId)}
                      className="py-3 rounded-xl shadow-neu font-extrabold text-red-500"
                    >
                      Cancel Reservation
                    </button>
                  </motion.div>
                )}

                {/* NORMAL FLOW */}
                {!isOccupiedView && step === 1 && (
                  <motion.div className="space-y-4">
                    <label className="flex gap-2 text-sm font-bold">
                      <User size={16} /> Name
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-xl shadow-neu-inset"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!canProceed(formData.name)) {
                          alert("Enter Name");
                          return;
                        }
                        setStep(2);
                      }}
                      className="w-full py-3 rounded-xl shadow-neu font-bold"
                    >
                      Next
                    </button>
                    <PassButtons />
                  </motion.div>
                )}

                {!isOccupiedView && step === 2 && (
                  <motion.div className="space-y-4">
                    <label className="flex gap-2 text-sm font-bold">
                      <Mail size={16} /> Gmail
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-xl shadow-neu-inset"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!canProceed(formData.email)) {
                          alert("Enter Gmail");
                          return;
                        }
                        setStep(3);
                      }}
                      className="w-full py-3 rounded-xl shadow-neu font-bold"
                    >
                      Next
                    </button>
                    <PassButtons />
                  </motion.div>
                )}

                {!isOccupiedView && step === 3 && (
                  <motion.div className="space-y-4">
                    <label className="flex gap-2 text-sm font-bold">
                      <Lock size={16} /> Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl shadow-neu-inset"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!canProceed(formData.password)) {
                          alert("Enter Password");
                          return;
                        }
                        setStep(4);
                      }}
                      className="w-full py-3 rounded-xl shadow-neu font-bold"
                    >
                      Next
                    </button>
                    <PassButtons />
                  </motion.div>
                )}

                {!isOccupiedView && step === 4 && (
                  <motion.div className="space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setQuickTime(1)}
                        className="shadow-neu py-2 rounded-xl"
                      >
                        1 Hr
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickTime(2)}
                        className="shadow-neu py-2 rounded-xl"
                      >
                        2 Hr
                      </button>
                    </div>
                    <input
                      type="time"
                      className="w-full px-4 py-3 rounded-xl shadow-neu-inset"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                    />
                    <input
                      type="time"
                      className="w-full px-4 py-3 rounded-xl shadow-neu-inset"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl shadow-neu font-extrabold flex justify-center gap-2"
                    >
                      <Calendar size={20} /> Confirm Reservation
                    </button>
                    <PassButtons />
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
