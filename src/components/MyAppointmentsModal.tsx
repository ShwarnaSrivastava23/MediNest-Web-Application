import React, { useState, useEffect } from 'react';
import { Appointment } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Printer, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Search,
  RotateCcw,
  Building2,
  Stethoscope,
  Video,
  Cloud,
  ShieldCheck,
  LogIn
} from 'lucide-react';
import { cancelAppointment, rescheduleAppointment, downloadCalendarEvent, saveAppointment } from '../utils/appointmentStorage';
import { updateAppointmentStatusInFirestore, fetchUserAppointmentsFromFirestore } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';

interface MyAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  onBookNew: () => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
}

export const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({
  isOpen,
  onClose,
  appointments,
  setAppointments,
  onBookNew,
  onOpenAuth,
}) => {
  const { user, userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync with Firestore when modal opens and user is signed in
  useEffect(() => {
    if (isOpen && user?.uid) {
      setIsSyncing(true);
      fetchUserAppointmentsFromFirestore(user.uid)
        .then((remoteList) => {
          if (remoteList && remoteList.length > 0) {
            setAppointments((prev) => {
              // Merge remote and local without duplicates
              const map = new Map<string, Appointment>();
              prev.forEach((a) => map.set(a.id, a));
              remoteList.forEach((a) => map.set(a.id, a));
              const merged = Array.from(map.values()).sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
              return merged;
            });
          }
        })
        .finally(() => {
          setIsSyncing(false);
        });
    }
  }, [isOpen, user?.uid]);

  if (!isOpen) return null;

  // Filter for user appointments
  const userFiltered = appointments.filter((appt) => {
    if (user && appt.userId && appt.userId !== user.uid) {
      return false;
    }
    return true;
  });

  const filteredAppointments = userFiltered.filter((appt) => {
    const term = searchTerm.toLowerCase();
    return (
      appt.referenceNumber.toLowerCase().includes(term) ||
      appt.patientName.toLowerCase().includes(term) ||
      appt.doctorName.toLowerCase().includes(term) ||
      appt.departmentName.toLowerCase().includes(term)
    );
  });

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this scheduled appointment?')) {
      const updated = cancelAppointment(id);
      setAppointments(updated);
      await updateAppointmentStatusInFirestore(id, { status: 'Cancelled' });
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment({ ...selectedAppointment, status: 'Cancelled' });
      }
    }
  };

  const handleStartReschedule = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setRescheduleDate(appt.date);
    setRescheduleSlot(appt.timeSlot);
    setIsRescheduling(true);
  };

  const handleSaveReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment || !rescheduleDate || !rescheduleSlot) return;

    const updated = rescheduleAppointment(selectedAppointment.id, rescheduleDate, rescheduleSlot);
    setAppointments(updated);
    await updateAppointmentStatusInFirestore(selectedAppointment.id, {
      date: rescheduleDate,
      timeSlot: rescheduleSlot,
      status: 'Rescheduled',
    });
    setIsRescheduling(false);
    setSelectedAppointment({
      ...selectedAppointment,
      date: rescheduleDate,
      timeSlot: rescheduleSlot,
      status: 'Rescheduled',
    });
  };

  const handlePrintSlip = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-200 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold font-display">My Booked Appointments</h3>
                {user ? (
                  <span className="inline-flex items-center space-x-1 text-[11px] bg-blue-950/80 border border-blue-700/60 text-blue-300 px-2 py-0.5 rounded-full font-medium">
                    <Cloud className="w-3 h-3 text-blue-400" />
                    <span>Firebase Synced</span>
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-400">
                {user 
                  ? `Showing records for patient: ${userProfile?.displayName || user.email}`
                  : 'View, reschedule, download, or manage your hospital appointments'
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guest Banner if not signed in */}
        {!user && (
          <div className="px-6 py-2.5 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Sign in to automatically sync your medical bookings across your phone and desktop.</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAuth?.('signin');
              }}
              className="font-bold text-blue-700 hover:text-blue-900 underline flex items-center space-x-1 shrink-0 ml-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In Now</span>
            </button>
          </div>
        )}

        {/* Search & Actions Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ref ID, doctor, patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <button
            onClick={() => {
              onClose();
              onBookNew();
            }}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book New Appointment</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Calendar className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Appointments Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You do not have any scheduled appointments matching your search. Book an appointment with one of our acclaimed specialists in seconds.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onBookNew();
                }}
                className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm cursor-pointer"
              >
                Book An Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appt) => {
                const isConfirmed = appt.status === 'Confirmed' || appt.status === 'Rescheduled';
                const isCancelled = appt.status === 'Cancelled';

                return (
                  <div
                    key={appt.id}
                    className={`p-5 rounded-xl border transition-all ${
                      isCancelled
                        ? 'bg-slate-50/70 border-slate-200 opacity-70'
                        : 'bg-white border-slate-200 hover:border-blue-400 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                          {appt.referenceNumber}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center space-x-1 ${
                            appt.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : appt.status === 'Rescheduled'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {appt.status === 'Confirmed' && <CheckCircle2 className="w-3 h-3" />}
                          {appt.status === 'Rescheduled' && <RotateCcw className="w-3 h-3" />}
                          {appt.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                          <span>{appt.status}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        {appt.consultationType === 'Virtual Video Consult' ? (
                          <span className="flex items-center space-x-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            <Video className="w-3 h-3" />
                            <span>Video Consult</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            <Building2 className="w-3 h-3" />
                            <span>In-Person Visit</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Appointment Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-slate-400 text-xs block">Specialist Doctor</span>
                        <span className="font-bold text-slate-900 block">{appt.doctorName}</span>
                        <span className="text-blue-700 text-xs">{appt.departmentName}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 text-xs block">Date & Time</span>
                        <span className="font-bold text-slate-900 block flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0 inline" />
                          <span>{appt.date}</span>
                        </span>
                        <span className="text-slate-600 flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 inline" />
                          <span>{appt.timeSlot}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 text-xs block">Patient</span>
                        <span className="font-bold text-slate-900 block">{appt.patientName}</span>
                        <span className="text-slate-500 text-xs">{appt.patientPhone}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 text-xs block">Hospital Location</span>
                        <span className="font-semibold text-slate-800 block">{appt.doctorRoom}</span>
                        <span className="text-slate-500 text-xs">MediNest Main Campus</span>
                      </div>
                    </div>

                    {appt.reasonForVisit && (
                      <div className="mb-4 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">Reason / Symptoms: </span>
                        {appt.reasonForVisit}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePrintSlip(appt)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center space-x-1 cursor-pointer"
                          title="Print slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Slip</span>
                        </button>
                        <button
                          onClick={() => downloadCalendarEvent(appt)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center space-x-1 cursor-pointer"
                          title="Add to calendar"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Add to Calendar</span>
                        </button>
                      </div>

                      {isConfirmed && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStartReschedule(appt)}
                            className="px-3 py-1.5 rounded-lg border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reschedule</span>
                          </button>
                          <button
                            onClick={() => handleCancel(appt.id)}
                            className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reschedule Inline Modal/Overlay */}
        {isRescheduling && selectedAppointment && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 animate-in slide-in-from-bottom duration-150">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <span>Reschedule Appointment ({selectedAppointment.referenceNumber})</span>
            </h4>
            <form onSubmit={handleSaveReschedule} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">New Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">New Time Slot</label>
                <select
                  required
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value)}
                  className="w-full p-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="09:00 AM">09:00 AM (Morning)</option>
                  <option value="10:30 AM">10:30 AM (Morning)</option>
                  <option value="11:45 AM">11:45 AM (Morning)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon)</option>
                  <option value="03:30 PM">03:30 PM (Afternoon)</option>
                  <option value="05:00 PM">05:00 PM (Evening)</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRescheduling(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
                >
                  Confirm Change
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Printable Slip Container */}
        {selectedAppointment && (
          <div id="printable-appointment-slip" className="hidden">
            <div style={{ border: '2px solid #2563eb', padding: '24px', borderRadius: '8px', fontFamily: 'sans-serif' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', margin: '0 0 4px 0', color: '#2563eb' }}>MEDINEST HOSPITAL</h1>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>100 Medical Plaza Ave, Metro City • Emergency: 1-800-MEDINEST</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>APPOINTMENT SLIP</div>
                  <div style={{ fontSize: '14px', color: '#2563eb', fontWeight: 'bold' }}>Ref: {selectedAppointment.referenceNumber}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '14px' }}>
                <div>
                  <strong>Patient Name:</strong> {selectedAppointment.patientName}<br />
                  <strong>Patient Phone:</strong> {selectedAppointment.patientPhone}<br />
                  <strong>Age / Gender:</strong> {selectedAppointment.patientAge} / {selectedAppointment.patientGender}<br />
                  <strong>Insurance:</strong> {selectedAppointment.insuranceProvider || 'Direct Cashless Desk'}
                </div>
                <div>
                  <strong>Doctor:</strong> {selectedAppointment.doctorName}<br />
                  <strong>Department:</strong> {selectedAppointment.departmentName}<br />
                  <strong>Room / Suite:</strong> {selectedAppointment.doctorRoom}<br />
                  <strong>Type:</strong> {selectedAppointment.consultationType}
                </div>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                <strong style={{ color: '#1e40af' }}>Scheduled Date & Time:</strong> {selectedAppointment.date} at {selectedAppointment.timeSlot}<br />
                <span style={{ fontSize: '12px', color: '#64748b' }}>Status: {selectedAppointment.status}</span>
              </div>

              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
                * Please arrive 15 minutes prior to your scheduled consultation time. Bring your government photo ID and health insurance card.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

