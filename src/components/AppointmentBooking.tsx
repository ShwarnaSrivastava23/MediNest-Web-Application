import React, { useState, useEffect } from 'react';
import { Department, Doctor, Appointment } from '../types';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Stethoscope, 
  Building2, 
  Video, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Printer, 
  Download, 
  Star,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Lock,
  LogIn,
  UserCheck,
  Cloud
} from 'lucide-react';
import { saveAppointment, generateReferenceNumber, downloadCalendarEvent } from '../utils/appointmentStorage';
import { saveAppointmentToFirestore } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';

interface AppointmentBookingProps {
  departments: Department[];
  doctors: Doctor[];
  preSelectedDepartmentId?: string;
  preSelectedDoctorId?: string;
  onAppointmentBooked: (appointment: Appointment) => void;
  onViewMyAppointments: () => void;
  onNavigateHome: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup', prompt?: string) => void;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  departments,
  doctors,
  preSelectedDepartmentId,
  preSelectedDoctorId,
  onAppointmentBooked,
  onViewMyAppointments,
  onNavigateHome,
  onOpenAuth,
}) => {
  const { user, userProfile, updateProfileData } = useAuth();

  // Booking Form State
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    preSelectedDepartmentId || departments[0]?.id || 'cardiology'
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    preSelectedDoctorId || ''
  );
  const [consultationType, setConsultationType] = useState<'In-Person Hospital Visit' | 'Virtual Video Consult'>('In-Person Hospital Visit');
  
  // Date & Slot
  const todayStr = new Date().toISOString().split('T')[0];
  const [appointmentDate, setAppointmentDate] = useState<string>(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Patient Info
  const [patientName, setPatientName] = useState(userProfile?.displayName || user?.displayName || '');
  const [patientEmail, setPatientEmail] = useState(userProfile?.email || user?.email || '');
  const [patientPhone, setPatientPhone] = useState(userProfile?.phoneNumber || '');
  const [patientAge, setPatientAge] = useState<number | ''>(userProfile?.age || 32);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>(userProfile?.gender || 'Male');
  const [insuranceProvider, setInsuranceProvider] = useState(userProfile?.insuranceProvider || 'Blue Cross Blue Shield');
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [reasonForVisit, setReasonForVisit] = useState('');

  // Booking result
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync profile when user logs in or profile updates
  useEffect(() => {
    if (userProfile || user) {
      if (!patientName && (userProfile?.displayName || user?.displayName)) {
        setPatientName(userProfile?.displayName || user?.displayName || '');
      }
      if (!patientEmail && (userProfile?.email || user?.email)) {
        setPatientEmail(userProfile?.email || user?.email || '');
      }
      if (!patientPhone && userProfile?.phoneNumber) {
        setPatientPhone(userProfile.phoneNumber);
      }
      if (userProfile?.age && patientAge === 32) {
        setPatientAge(userProfile.age);
      }
      if (userProfile?.gender) {
        setPatientGender(userProfile.gender);
      }
      if (userProfile?.insuranceProvider) {
        setInsuranceProvider(userProfile.insuranceProvider);
      }
    }
  }, [user, userProfile]);

  // Sync props if they change
  useEffect(() => {
    if (preSelectedDepartmentId) {
      setSelectedDeptId(preSelectedDepartmentId);
    }
  }, [preSelectedDepartmentId]);

  useEffect(() => {
    if (preSelectedDoctorId) {
      setSelectedDoctorId(preSelectedDoctorId);
    }
  }, [preSelectedDoctorId]);

  // Filter doctors based on selected department
  const availableDoctors = doctors.filter((doc) => doc.departmentId === selectedDeptId);

  // Set default doctor if selected doctor is not in current department
  useEffect(() => {
    const isDocInDept = availableDoctors.some((d) => d.id === selectedDoctorId);
    if (!isDocInDept && availableDoctors.length > 0) {
      setSelectedDoctorId(availableDoctors[0].id);
    }
  }, [selectedDeptId, availableDoctors, selectedDoctorId]);

  const activeDoctor = doctors.find((d) => d.id === selectedDoctorId) || availableDoctors[0];
  const activeDepartment = departments.find((d) => d.id === selectedDeptId);

  // Set default time slot when doctor changes
  useEffect(() => {
    if (activeDoctor && activeDoctor.timeSlots.length > 0 && !selectedTimeSlot) {
      setSelectedTimeSlot(activeDoctor.timeSlots[0]);
    }
  }, [activeDoctor, selectedTimeSlot]);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTimeSlot && activeDoctor?.timeSlots.length > 0) {
      setSelectedTimeSlot(activeDoctor.timeSlots[0]);
    }

    // If user is not authenticated, prompt them to sign in / register
    if (!user) {
      onOpenAuth('signin', 'Please sign in or create an account to proceed with patient details and lock in your slot.');
      return;
    }

    setCurrentStep(2);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDoctor || !activeDepartment) return;

    if (!user) {
      onOpenAuth('signin', 'Please sign in to confirm and save your booking.');
      return;
    }

    setIsSubmitting(true);

    const refNum = generateReferenceNumber();
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      userId: user?.uid,
      referenceNumber: refNum,
      patientName: patientName || userProfile?.displayName || user.email || 'Patient',
      patientEmail: patientEmail || user.email || '',
      patientPhone: patientPhone || '',
      patientAge: Number(patientAge) || 30,
      patientGender,
      departmentId: activeDepartment.id,
      departmentName: activeDepartment.name,
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      doctorSpecialty: activeDoctor.specialty,
      doctorRoom: activeDoctor.roomNo,
      date: appointmentDate,
      timeSlot: selectedTimeSlot || '10:00 AM',
      consultationType,
      reasonForVisit: reasonForVisit || 'General clinical consultation and review',
      insuranceProvider: insuranceProvider || 'Direct / Self-Pay',
      isFirstVisit,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore & localStorage
    await saveAppointmentToFirestore(newAppointment);
    saveAppointment(newAppointment);

    // Update user profile with latest contact details if not set
    if (userProfile && (!userProfile.phoneNumber || !userProfile.age)) {
      updateProfileData({
        phoneNumber: patientPhone,
        age: Number(patientAge) || undefined,
        gender: patientGender,
        insuranceProvider: insuranceProvider
      });
    }

    setConfirmedAppointment(newAppointment);
    onAppointmentBooked(newAppointment);
    setIsSubmitting(false);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const resetForm = () => {
    setConfirmedAppointment(null);
    setCurrentStep(1);
    setReasonForVisit('');
  };

  return (
    <div className="min-h-[80vh] py-12 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Fast & Guaranteed Booking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Book an Appointment with a Specialist
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Select your clinical department, choose an acclaimed specialist, and secure your consultation date with instant cloud confirmation.
          </p>
        </div>

        {/* Authentication Notice Banner for Guests */}
        {!user && (
          <div className="mb-8 p-4 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 rounded-2xl text-white shadow-lg border border-blue-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center space-x-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">
                  Patient Sign In / Sign Up Required for Booking
                </h4>
                <p className="text-xs text-blue-200">
                  Sign in or create your free patient account to confirm appointments, access medical history, and sync across devices.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onOpenAuth('signin', 'Sign in to access stored patient information and book appointments.')}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('signup', 'Create a new patient account to book appointments and track prescriptions.')}
                className="flex-1 sm:flex-none px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Register</span>
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Screen */}
        {confirmedAppointment ? (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-8 text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest font-bold text-blue-200 bg-blue-900/40 px-3 py-1 rounded-full">
                <Cloud className="w-3.5 h-3.5" />
                <span>Saved to Firebase Cloud & Confirmed</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
                Thank You, {confirmedAppointment.patientName}!
              </h2>
              <p className="text-sm text-blue-100 max-w-md mx-auto">
                Your appointment has been registered in the MediNest Clinical Database and linked to your patient profile.
              </p>
            </div>

            {/* Appointment Slip Card */}
            <div className="p-6 sm:p-10 space-y-8">
              <div className="bg-slate-50 border-2 border-dashed border-blue-300 rounded-2xl p-6 sm:p-8 relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Booking Reference</span>
                    <span className="font-mono text-xl sm:text-2xl font-black text-blue-700 tracking-wider">
                      {confirmedAppointment.referenceNumber}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{confirmedAppointment.status}</span>
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {confirmedAppointment.consultationType}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Specialist Physician</span>
                    <strong className="text-slate-900 text-base block">{confirmedAppointment.doctorName}</strong>
                    <span className="text-blue-700 text-xs">{confirmedAppointment.doctorSpecialty}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Department & Room</span>
                    <strong className="text-slate-900 block">{confirmedAppointment.departmentName}</strong>
                    <span className="text-slate-600 text-xs">{confirmedAppointment.doctorRoom}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Consultation Date & Slot</span>
                    <strong className="text-slate-900 block flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-blue-600 inline" />
                      <span>{confirmedAppointment.date}</span>
                    </strong>
                    <span className="text-slate-600 text-xs flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 inline" />
                      <span>{confirmedAppointment.timeSlot}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Patient Name & Contact</span>
                    <strong className="text-slate-900 block">{confirmedAppointment.patientName}</strong>
                    <span className="text-slate-600 text-xs">{confirmedAppointment.patientPhone} • {confirmedAppointment.patientAge} yrs ({confirmedAppointment.patientGender})</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Insurance Coverage</span>
                    <strong className="text-slate-900 block">{confirmedAppointment.insuranceProvider || 'Direct / Cashless'}</strong>
                    <span className="text-slate-500 text-xs">Present card at reception</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Hospital Campus</span>
                    <strong className="text-slate-900 block">MediNest Main Campus</strong>
                    <span className="text-slate-500 text-xs">100 Medical Plaza Avenue</span>
                  </div>
                </div>

                {confirmedAppointment.reasonForVisit && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                    <span className="font-bold text-slate-800">Reason for Visit: </span>
                    {confirmedAppointment.reasonForVisit}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => downloadCalendarEvent(confirmedAppointment)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                    <span>Add to Calendar (.ics)</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                    <span>Print Slip</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={onViewMyAppointments}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    View in My Bookings
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Book Another Slot
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Multi-Step Booking Form */
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            
            {/* Step Indicators */}
            <div className="bg-slate-50 p-4 border-b border-slate-200">
              <div className="flex items-center justify-between max-w-md mx-auto">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentStep === 1
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    1
                  </span>
                  <span className={`text-xs font-bold ${currentStep === 1 ? 'text-blue-900' : 'text-slate-500'}`}>
                    Doctor & Slot
                  </span>
                </div>

                <div className="w-12 h-0.5 bg-slate-200" />

                <div className="flex items-center space-x-2">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentStep === 2
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    2
                  </span>
                  <span className={`text-xs font-bold ${currentStep === 2 ? 'text-blue-900' : 'text-slate-500'}`}>
                    Patient Details & Confirmation
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 1: Department, Doctor & Slot Selection */}
            {currentStep === 1 && (
              <form onSubmit={handleStep1Submit} className="p-6 sm:p-8 space-y-8">
                
                {/* 1. Choose Department */}
                <div>
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-800 block mb-3 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>1. Select Clinical Department</span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {departments.map((dept) => {
                      const isSelected = dept.id === selectedDeptId;
                      return (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => {
                            setSelectedDeptId(dept.id);
                          }}
                          className={`p-3 rounded-xl text-left border transition-all text-xs font-medium cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="font-bold truncate">{dept.name.split('&')[0]}</div>
                          <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {dept.locationFloor}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Choose Doctor in Department */}
                <div>
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-800 block mb-3 flex items-center space-x-2">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    <span>2. Select Specialist Doctor</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableDoctors.map((doc) => {
                      const isSelected = doc.id === (activeDoctor?.id);
                      return (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDoctorId(doc.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500 shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <img
                              src={doc.image}
                              alt={doc.name}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h4>
                              <p className="text-xs text-blue-600 font-medium truncate">{doc.specialty}</p>
                              <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
                                <span className="flex items-center space-x-0.5">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span className="font-bold text-slate-700">{doc.rating}</span>
                                </span>
                                <span>•</span>
                                <span>${doc.consultationFee} Fee</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                            <span>{doc.roomNo}</span>
                            <span className="text-blue-700 font-semibold">{doc.experienceYears}y exp</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Choose Consultation Mode */}
                <div>
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-800 block mb-3">
                    3. Consultation Mode
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setConsultationType('In-Person Hospital Visit')}
                      className={`p-4 rounded-xl border flex items-center space-x-3 text-left transition-all cursor-pointer ${
                        consultationType === 'In-Person Hospital Visit'
                          ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="block text-sm font-bold">In-Person Hospital Visit</strong>
                        <span className="text-xs text-slate-500">Consult at MediNest Specialist OPD Suite</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConsultationType('Virtual Video Consult')}
                      className={`p-4 rounded-xl border flex items-center space-x-3 text-left transition-all cursor-pointer ${
                        consultationType === 'Virtual Video Consult'
                          ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="block text-sm font-bold">Virtual Video Teleconsult</strong>
                        <span className="text-xs text-slate-500">Secure HD encrypted consultation from home</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 4. Choose Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Preferred Date</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      Doctor availability on selected day: {activeDoctor?.availableDays.join(', ')}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Available Time Slots</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(activeDoctor?.timeSlots || ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM']).map((slot) => {
                        const isSlotSelected = selectedTimeSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              isSlotSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Step 1 CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  {!user ? (
                    <span className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center space-x-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>Sign in required on next step</span>
                    </span>
                  ) : (
                    <span className="text-xs text-blue-700 font-semibold flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Logged in as {userProfile?.displayName || user.email}</span>
                    </span>
                  )}

                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <span>Continue to Patient Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            )}

            {/* STEP 2: Patient Info & Symptoms */}
            {currentStep === 2 && (
              <form onSubmit={handleFinalSubmit} className="p-6 sm:p-8 space-y-6">
                
                {/* Summary Pill */}
                <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center space-x-3">
                    <img
                      src={activeDoctor?.image}
                      alt={activeDoctor?.name}
                      className="w-12 h-12 rounded-xl object-cover border border-blue-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <strong className="text-slate-900 block font-bold">{activeDoctor?.name}</strong>
                      <span className="text-blue-700">{activeDepartment?.name} • {consultationType}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-700 font-bold block">{appointmentDate} at {selectedTimeSlot}</span>
                    <span className="text-slate-500 text-xs">Room: {activeDoctor?.roomNo}</span>
                  </div>
                </div>

                {/* Patient Information Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Patient Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Johnathan Doe"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="john.doe@example.com"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Age *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={120}
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Gender *
                      </label>
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value as any)}
                        className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Health Insurance Provider
                    </label>
                    <select
                      value={insuranceProvider}
                      onChange={(e) => setInsuranceProvider(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                      <option value="Aetna Health">Aetna Health</option>
                      <option value="Cigna Healthcare">Cigna Healthcare</option>
                      <option value="UnitedHealthcare">UnitedHealthcare</option>
                      <option value="Medicare / Medicaid">Medicare / Medicaid</option>
                      <option value="International / Direct Cashless">International / Direct Cashless</option>
                      <option value="Self-Pay / Cash">Self-Pay / Cash</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Patient Status
                    </label>
                    <div className="flex items-center space-x-4 pt-2">
                      <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="visitType"
                          checked={isFirstVisit}
                          onChange={() => setIsFirstVisit(true)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>First-Time Patient</span>
                      </label>
                      <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="visitType"
                          checked={!isFirstVisit}
                          onChange={() => setIsFirstVisit(false)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>Returning Patient</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Reason for Visit / Symptoms */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Symptoms or Reason for Consultation (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your current symptoms, medical history, or specific questions for the specialist..."
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Privacy & Cloud Notice */}
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    Your medical booking will be encrypted and saved to your Firebase patient record under HIPAA security protocols.
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Doctor Selection</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-md flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Registering Appointment...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Appointment Booking</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
