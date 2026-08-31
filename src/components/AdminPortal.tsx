import React, { useState, useEffect, useMemo } from 'react';
import { Department, Doctor, Appointment } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  LogIn, 
  LogOut, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Printer, 
  RefreshCw, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Building2, 
  Stethoscope, 
  Video, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Activity, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye, 
  ArrowLeft,
  Cloud,
  Check,
  AlertTriangle
} from 'lucide-react';
import { 
  getStoredAppointments, 
  saveAppointment, 
  deleteStoredAppointment, 
  updateStoredAppointment, 
  generateReferenceNumber, 
  exportAppointmentsToCSV,
  downloadCalendarEvent
} from '../utils/appointmentStorage';
import { 
  fetchAllAppointmentsFromFirestore, 
  saveAppointmentToFirestore, 
  updateAppointmentStatusInFirestore, 
  deleteAppointmentFromFirestore 
} from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';

const ADMIN_EMAIL = 'shwarnasrivastava3@gmail.com';
const ADMIN_PASSWORD = '458900';
const ADMIN_STORAGE_KEY = 'medinest_admin_authenticated';

interface AdminPortalProps {
  departments: Department[];
  doctors: Doctor[];
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  onNavigateHome: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  departments,
  doctors,
  appointments,
  setAppointments,
  onNavigateHome,
}) => {
  const { user } = useAuth();

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
    return saved === 'true';
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled'>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [doctorFilter, setDoctorFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'UPCOMING' | 'PAST'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'In-Person Hospital Visit' | 'Virtual Video Consult'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Loading & Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Form State for Add New Booking
  const todayStr = new Date().toISOString().split('T')[0];
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientAge, setNewPatientAge] = useState<number | ''>(35);
  const [newPatientGender, setNewPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newDeptId, setNewDeptId] = useState<string>(departments[0]?.id || 'cardiology');
  const [newDoctorId, setNewDoctorId] = useState<string>('');
  const [newConsultationType, setNewConsultationType] = useState<'In-Person Hospital Visit' | 'Virtual Video Consult'>('In-Person Hospital Visit');
  const [newDate, setNewDate] = useState<string>(todayStr);
  const [newTimeSlot, setNewTimeSlot] = useState<string>('10:00 AM');
  const [newInsurance, setNewInsurance] = useState('Blue Cross Blue Shield');
  const [newReason, setNewReason] = useState('');
  const [newIsFirstVisit, setNewIsFirstVisit] = useState(true);
  const [newNotes, setNewNotes] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState('');

  // Edit state
  const [editPatientName, setEditPatientName] = useState('');
  const [editPatientPhone, setEditPatientPhone] = useState('');
  const [editPatientEmail, setEditPatientEmail] = useState('');
  const [editPatientAge, setEditPatientAge] = useState<number | ''>('');
  const [editPatientGender, setEditPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [editStatus, setEditStatus] = useState<Appointment['status']>('Confirmed');
  const [editInsurance, setEditInsurance] = useState('');
  const [editReason, setEditReason] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Sync Cloud Appointments on mount or sync button
  const syncAppointments = async () => {
    setIsSyncing(true);
    try {
      const remoteList = await fetchAllAppointmentsFromFirestore();
      if (remoteList && remoteList.length > 0) {
        setAppointments((prev) => {
          const map = new Map<string, Appointment>();
          prev.forEach((a) => map.set(a.id, a));
          remoteList.forEach((a) => map.set(a.id, a));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          return merged;
        });
        setSyncMessage(`Cloud synchronized: ${remoteList.length} database records retrieved.`);
      } else {
        const local = getStoredAppointments();
        setAppointments(local);
        setSyncMessage(`Loaded ${local.length} local records.`);
      }
    } catch (err) {
      console.error(err);
      setSyncMessage('Sync completed with local cache.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      syncAppointments();
    }
  }, [isAdminLoggedIn]);

  // Set default doctor when new department changes in Add modal
  const availableDoctorsForNew = doctors.filter((doc) => doc.departmentId === newDeptId);
  useEffect(() => {
    if (availableDoctorsForNew.length > 0) {
      const currentDocInDept = availableDoctorsForNew.find((d) => d.id === newDoctorId);
      if (!currentDocInDept) {
        setNewDoctorId(availableDoctorsForNew[0].id);
        if (availableDoctorsForNew[0].timeSlots.length > 0) {
          setNewTimeSlot(availableDoctorsForNew[0].timeSlots[0]);
        }
      }
    }
  }, [newDeptId, availableDoctorsForNew, newDoctorId]);

  // Selected doctor object for new booking
  const selectedNewDoctor = doctors.find((d) => d.id === newDoctorId) || availableDoctorsForNew[0];
  const selectedNewDept = departments.find((d) => d.id === newDeptId);

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (cleanEmail === ADMIN_EMAIL.toLowerCase() && cleanPass === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      setIsAdminLoggedIn(true);
      setLoginError('');
      setIsLoggingIn(false);
    } else {
      setIsLoggingIn(false);
      setLoginError('Invalid credentials. Access restricted to authorized MediNest clinical administration staff.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsAdminLoggedIn(false);
    setLoginEmail('');
    setLoginPassword('');
  };

  const fillDemoCredentials = () => {
    setLoginEmail(ADMIN_EMAIL);
    setLoginPassword(ADMIN_PASSWORD);
    setLoginError('');
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const total = appointments.length;
    const todayAppointments = appointments.filter((a) => a.date === todayStr);
    const confirmed = appointments.filter((a) => a.status === 'Confirmed');
    const completed = appointments.filter((a) => a.status === 'Completed');
    const rescheduled = appointments.filter((a) => a.status === 'Rescheduled');
    const cancelled = appointments.filter((a) => a.status === 'Cancelled');
    
    // Calculate total consultation value ($)
    const totalRevenue = appointments.reduce((sum, a) => {
      const doc = doctors.find((d) => d.id === a.doctorId);
      const fee = doc?.consultationFee || 150;
      return a.status !== 'Cancelled' ? sum + fee : sum;
    }, 0);

    return {
      total,
      todayCount: todayAppointments.length,
      confirmedCount: confirmed.length,
      completedCount: completed.length,
      rescheduledCount: rescheduled.length,
      cancelledCount: cancelled.length,
      totalRevenue
    };
  }, [appointments, doctors, todayStr]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = (appt.referenceNumber || '').toLowerCase().includes(q);
        const matchesPatient = (appt.patientName || '').toLowerCase().includes(q);
        const matchesEmail = (appt.patientEmail || '').toLowerCase().includes(q);
        const matchesPhone = (appt.patientPhone || '').toLowerCase().includes(q);
        const matchesDoc = (appt.doctorName || '').toLowerCase().includes(q);
        const matchesDept = (appt.departmentName || '').toLowerCase().includes(q);
        if (!matchesRef && !matchesPatient && !matchesEmail && !matchesPhone && !matchesDoc && !matchesDept) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'ALL' && appt.status !== statusFilter) {
        return false;
      }

      // Department
      if (departmentFilter !== 'ALL' && appt.departmentId !== departmentFilter) {
        return false;
      }

      // Doctor
      if (doctorFilter !== 'ALL' && appt.doctorId !== doctorFilter) {
        return false;
      }

      // Consultation Type
      if (typeFilter !== 'ALL' && appt.consultationType !== typeFilter) {
        return false;
      }

      // Date Filter
      if (dateFilter === 'TODAY' && appt.date !== todayStr) {
        return false;
      }
      if (dateFilter === 'UPCOMING' && appt.date < todayStr) {
        return false;
      }
      if (dateFilter === 'PAST' && appt.date >= todayStr) {
        return false;
      }

      return true;
    });
  }, [appointments, searchQuery, statusFilter, departmentFilter, doctorFilter, typeFilter, dateFilter, todayStr]);

  // Quick Status Update
  const handleQuickStatusChange = async (appointmentId: string, newStatus: Appointment['status']) => {
    const updated = updateStoredAppointment(appointmentId, { status: newStatus });
    setAppointments(updated);
    await updateAppointmentStatusInFirestore(appointmentId, { status: newStatus });
  };

  // Delete Action
  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;
    const updated = deleteStoredAppointment(selectedAppointment.id);
    setAppointments(updated);
    await deleteAppointmentFromFirestore(selectedAppointment.id);
    setIsDeleteConfirmOpen(false);
    setSelectedAppointment(null);
  };

  // Open Reschedule Modal
  const handleOpenReschedule = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setRescheduleDate(appt.date);
    setRescheduleTimeSlot(appt.timeSlot);
    setIsRescheduleModalOpen(true);
  };

  // Save Reschedule
  const handleSaveReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment || !rescheduleDate || !rescheduleTimeSlot) return;

    const updates: Partial<Appointment> = {
      date: rescheduleDate,
      timeSlot: rescheduleTimeSlot,
      status: 'Rescheduled'
    };

    const updated = updateStoredAppointment(selectedAppointment.id, updates);
    setAppointments(updated);
    await updateAppointmentStatusInFirestore(selectedAppointment.id, updates);
    setIsRescheduleModalOpen(false);
    setSelectedAppointment(null);
  };

  // Open Edit Modal
  const handleOpenEdit = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setEditPatientName(appt.patientName);
    setEditPatientPhone(appt.patientPhone);
    setEditPatientEmail(appt.patientEmail);
    setEditPatientAge(appt.patientAge);
    setEditPatientGender(appt.patientGender);
    setEditStatus(appt.status);
    setEditInsurance(appt.insuranceProvider || '');
    setEditReason(appt.reasonForVisit || '');
    setEditNotes(appt.notes || '');
    setIsEditModalOpen(true);
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    const updates: Partial<Appointment> = {
      patientName: editPatientName,
      patientPhone: editPatientPhone,
      patientEmail: editPatientEmail,
      patientAge: Number(editPatientAge) || selectedAppointment.patientAge,
      patientGender: editPatientGender,
      status: editStatus,
      insuranceProvider: editInsurance,
      reasonForVisit: editReason,
      notes: editNotes,
    };

    const updated = updateStoredAppointment(selectedAppointment.id, updates);
    setAppointments(updated);
    await updateAppointmentStatusInFirestore(selectedAppointment.id, updates);
    setIsEditModalOpen(false);
    setSelectedAppointment(null);
  };

  // Add New Booking by Admin
  const handleCreateNewBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNewDoctor || !selectedNewDept) return;

    setFormSubmitting(true);

    const refNumber = generateReferenceNumber();
    const newAppointment: Appointment = {
      id: `admin-appt-${Date.now()}`,
      referenceNumber: refNumber,
      patientName: newPatientName,
      patientEmail: newPatientEmail || 'hospital.direct@medinest.org',
      patientPhone: newPatientPhone,
      patientAge: Number(newPatientAge) || 30,
      patientGender: newPatientGender,
      departmentId: selectedNewDept.id,
      departmentName: selectedNewDept.name,
      doctorId: selectedNewDoctor.id,
      doctorName: selectedNewDoctor.name,
      doctorSpecialty: selectedNewDoctor.specialty,
      doctorRoom: selectedNewDoctor.roomNo,
      date: newDate,
      timeSlot: newTimeSlot,
      consultationType: newConsultationType,
      reasonForVisit: newReason || 'Direct Clinical Admin Registration',
      insuranceProvider: newInsurance,
      isFirstVisit: newIsFirstVisit,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      notes: newNotes || 'Registered via Hospital Admin Portal'
    };

    // Save to Firestore & local storage
    await saveAppointmentToFirestore(newAppointment);
    const updated = saveAppointment(newAppointment);
    setAppointments(updated);

    // Reset Form
    setNewPatientName('');
    setNewPatientEmail('');
    setNewPatientPhone('');
    setNewReason('');
    setNewNotes('');
    setFormSubmitting(false);
    setIsAddModalOpen(false);
    setSyncMessage(`Booking #${refNumber} registered successfully.`);
    setTimeout(() => setSyncMessage(null), 4000);
  };

  // -------------------------------------------------------------
  // RENDER: ADMIN LOGIN SCREEN IF NOT AUTHENTICATED
  // -------------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[85vh] py-16 bg-slate-900 flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-md w-full">
          
          {/* Header Branding */}
          <div className="text-center mb-8 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 border border-blue-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Hospital Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Authorized clinical personnel & administration access only
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center space-x-2 pb-4 mb-5 border-b border-slate-700 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>Admin Authentication Required</span>
            </div>

            {loginError && (
              <div className="mb-5 p-3.5 bg-rose-950/80 border border-rose-700/80 rounded-xl text-rose-200 text-xs flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="shwarnasrivastava3@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none placeholder:text-slate-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Admin Master Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none placeholder:text-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 text-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isLoggingIn ? 'Verifying Credentials...' : 'Sign In as Administrator'}</span>
                </button>
              </div>
            </form>

            {/* Quick Demo Helper */}
            <div className="mt-6 pt-5 border-t border-slate-700/60">
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-700 text-[11px] text-slate-300 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Authorized Admin Credentials:</span>
                  </span>
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-blue-950/80 border border-blue-800 px-2 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    Quick Autofill
                  </button>
                </div>
                <div className="font-mono text-slate-400 space-y-0.5">
                  <p>Email: <span className="text-slate-200">{ADMIN_EMAIL}</span></p>
                  <p>Password: <span className="text-slate-200">458900</span></p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-xs text-slate-400 hover:text-white flex items-center justify-center space-x-1 mx-auto transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Hospital Public Portal</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: ADMIN AUTHENTICATED DASHBOARD & MANAGEMENT PORTAL
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand / Admin Portal Title */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base sm:text-lg font-bold text-white font-display">
                    MediNest <span className="text-blue-400">Admin Hub</span>
                  </h2>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-900/60 border border-blue-700 text-blue-300">
                    Staff Clearance L3
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Hospital Booking & Patient Roster Management System
                </p>
              </div>
            </div>

            {/* Actions & Session info */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Cloud Sync Button */}
              <button
                onClick={syncAppointments}
                disabled={isSyncing}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                title="Sync from Firestore Cloud Database"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
              </button>

              {/* Add New Booking CTA */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Booking</span>
              </button>

              {/* Return to public site */}
              <button
                onClick={onNavigateHome}
                className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                <span>Public Site</span>
              </button>

              {/* Admin Profile & Logout */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="hidden lg:block text-right">
                  <span className="text-xs font-bold text-white block truncate max-w-[140px]">
                    Admin
                  </span>
                  <span className="text-[10px] text-blue-400 block font-mono truncate max-w-[140px]">
                    {ADMIN_EMAIL}
                  </span>
                </div>
                <button
                  onClick={handleAdminLogout}
                  className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 hover:text-white transition-colors cursor-pointer"
                  title="Sign Out of Admin Portal"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Sync Toast Notification */}
      {syncMessage && (
        <div className="bg-blue-600 text-white text-xs py-2 px-4 text-center font-medium shadow-md flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <Cloud className="w-3.5 h-3.5" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Main Admin Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* KPI Summary Cards Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Total Bookings</span>
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-display">{stats.total}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">All registered slots</span>
          </div>

          <div className="bg-slate-900/90 border border-blue-800/60 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-blue-300 mb-2">
              <span className="text-xs font-bold">Today's Schedule</span>
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-blue-400 font-display">{stats.todayCount}</div>
            <span className="text-[11px] text-blue-200/80 mt-1 block">{todayStr}</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-medium">Confirmed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-display">{stats.confirmedCount}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Active upcoming</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-blue-400 mb-2">
              <span className="text-xs font-medium">Completed</span>
              <Check className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-display">{stats.completedCount}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Treated & discharged</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-medium">Rescheduled</span>
              <RefreshCw className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-amber-400 font-display">{stats.rescheduledCount}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Adjusted time slots</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Est. Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-display">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Consultation value</span>
          </div>

        </section>

        {/* Filter & Search Toolbar */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          
          {/* Row 1: Search & Quick Status Tabs */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient, phone, email, reference (#MN-...), doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="flex items-center overflow-x-auto space-x-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
              {(['ALL', 'Confirmed', 'Completed', 'Rescheduled', 'Cancelled'] as const).map((status) => {
                const isActive = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {status === 'ALL' ? `All (${appointments.length})` : status}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Row 2: Secondary Dropdown Filters & Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800 text-xs">
            
            {/* Department Filter */}
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Doctor Filter */}
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Physician</label>
              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ALL">All Specialists</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ALL">All Dates</option>
                <option value="TODAY">Today's Appointments</option>
                <option value="UPCOMING">Upcoming Future</option>
                <option value="PAST">Past History</option>
              </select>
            </div>

            {/* Consultation Type */}
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Consultation Mode</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ALL">All Modes</option>
                <option value="In-Person Hospital Visit">In-Person Visit</option>
                <option value="Virtual Video Consult">Virtual Video</option>
              </select>
            </div>

            {/* Export & Print */}
            <div className="flex items-end space-x-1.5 col-span-2 sm:col-span-1 lg:col-span-2">
              <button
                onClick={() => exportAppointmentsToCSV(filteredAppointments)}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                title="Download spreadsheet of current filtered appointments"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => window.print()}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                title="Print current roster"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Print Roster</span>
              </button>
            </div>

          </div>

        </section>

        {/* Bookings Management Table / View */}
        <section className="space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white font-display">
                Clinical Bookings Roster
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-900/60 border border-blue-700/60 text-blue-300">
                {filteredAppointments.length} Record{filteredAppointments.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Table vs Cards Toggle */}
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Grid Cards
              </button>
            </div>
          </div>

          {/* Empty State */}
          {filteredAppointments.length === 0 ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">No Appointments Match Current Filters</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try clearing your search query or changing your status/date filters to view hospital records.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setDepartmentFilter('ALL');
                  setDoctorFilter('ALL');
                  setDateFilter('ALL');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'table' ? (
            
            /* Table Mode */
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Ref #</th>
                      <th className="py-3.5 px-4">Patient Information</th>
                      <th className="py-3.5 px-4">Department & Doctor</th>
                      <th className="py-3.5 px-4">Schedule Date & Slot</th>
                      <th className="py-3.5 px-4">Mode / Insurance</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredAppointments.map((appt) => {
                      return (
                        <tr key={appt.id} className="hover:bg-slate-800/40 transition-colors">
                          
                          {/* Reference Number */}
                          <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                            {appt.referenceNumber}
                            <span className="block text-[10px] text-slate-500 font-sans font-normal">
                              {new Date(appt.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          {/* Patient Info */}
                          <td className="py-3.5 px-4">
                            <strong className="text-white text-sm font-bold block">{appt.patientName}</strong>
                            <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                              <span>{appt.patientPhone}</span>
                              <span>•</span>
                              <span>{appt.patientAge}y ({appt.patientGender})</span>
                            </div>
                            {appt.patientEmail && (
                              <span className="text-[10px] text-slate-500 block truncate max-w-[180px]">
                                {appt.patientEmail}
                              </span>
                            )}
                          </td>

                          {/* Department & Doctor */}
                          <td className="py-3.5 px-4">
                            <strong className="text-slate-200 block font-medium">{appt.doctorName}</strong>
                            <span className="text-[11px] text-blue-400 block">{appt.departmentName}</span>
                            <span className="text-[10px] text-slate-500 block">{appt.doctorRoom}</span>
                          </td>

                          {/* Date & Slot */}
                          <td className="py-3.5 px-4">
                            <div className="inline-flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-white font-medium">
                              <Calendar className="w-3.5 h-3.5 text-blue-400" />
                              <span>{appt.date}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{appt.timeSlot}</span>
                            </div>
                          </td>

                          {/* Consultation Type & Insurance */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              appt.consultationType === 'Virtual Video Consult'
                                ? 'bg-purple-950/80 border border-purple-800 text-purple-300'
                                : 'bg-blue-950/80 border border-blue-800 text-blue-300'
                            }`}>
                              {appt.consultationType === 'Virtual Video Consult' ? (
                                <Video className="w-3 h-3" />
                              ) : (
                                <Building2 className="w-3 h-3" />
                              )}
                              <span>{appt.consultationType === 'Virtual Video Consult' ? 'Teleconsult' : 'OPD In-Person'}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-1 truncate max-w-[140px]">
                              {appt.insuranceProvider || 'Direct Cashless'}
                            </span>
                          </td>

                          {/* Status with Quick Select */}
                          <td className="py-3.5 px-4">
                            <select
                              value={appt.status}
                              onChange={(e) => handleQuickStatusChange(appt.id, e.target.value as any)}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                appt.status === 'Confirmed'
                                  ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                                  : appt.status === 'Completed'
                                  ? 'bg-blue-950/80 border-blue-700 text-blue-300'
                                  : appt.status === 'Rescheduled'
                                  ? 'bg-amber-950/80 border-amber-700 text-amber-300'
                                  : 'bg-rose-950/80 border-rose-700 text-rose-300'
                              }`}
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Rescheduled">Rescheduled</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              
                              {/* View Details / Slip */}
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appt);
                                  setIsDetailModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                title="View clinical slip & full patient notes"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Reschedule */}
                              <button
                                onClick={() => handleOpenReschedule(appt)}
                                className="p-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-800/80 text-blue-300 hover:text-white transition-colors cursor-pointer"
                                title="Reschedule Date & Time"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit details */}
                              <button
                                onClick={() => handleOpenEdit(appt)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                title="Edit patient details and clinical notes"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appt);
                                  setIsDeleteConfirmOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 hover:text-white transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            
            /* Grid Cards Mode */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAppointments.map((appt) => {
                return (
                  <div 
                    key={appt.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Ref Code</span>
                        <span className="font-mono text-sm font-black text-blue-400">{appt.referenceNumber}</span>
                      </div>
                      <select
                        value={appt.status}
                        onChange={(e) => handleQuickStatusChange(appt.id, e.target.value as any)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border cursor-pointer ${
                          appt.status === 'Confirmed'
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                            : appt.status === 'Completed'
                            ? 'bg-blue-950/80 border-blue-700 text-blue-300'
                            : appt.status === 'Rescheduled'
                            ? 'bg-amber-950/80 border-amber-700 text-amber-300'
                            : 'bg-rose-950/80 border-rose-700 text-rose-300'
                        }`}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Patient</span>
                        <strong className="text-white text-sm block">{appt.patientName}</strong>
                        <span className="text-slate-400">{appt.patientPhone} • {appt.patientAge}y ({appt.patientGender})</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block">Doctor & Dept</span>
                        <strong className="text-slate-200 block">{appt.doctorName}</strong>
                        <span className="text-blue-400 text-[11px]">{appt.departmentName}</span>
                      </div>

                      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          <span className="font-bold text-white">{appt.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{appt.timeSlot}</span>
                        </div>
                      </div>

                      {appt.reasonForVisit && (
                        <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 line-clamp-2">
                          <span className="text-slate-300 font-semibold">Reason: </span>
                          {appt.reasonForVisit}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setSelectedAppointment(appt);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-blue-400" />
                          <span>Slip</span>
                        </button>
                        <button
                          onClick={() => handleOpenReschedule(appt)}
                          className="px-2.5 py-1.5 bg-blue-950/80 hover:bg-blue-900 border border-blue-800 text-blue-300 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Slot</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEdit(appt)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAppointment(appt);
                            setIsDeleteConfirmOpen(true);
                          }}
                          className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </section>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD NEW BOOKING (ADMIN FORM) */}
      {/* ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display">Create Hospital Appointment</h3>
                  <p className="text-xs text-blue-200">Direct Patient OPD Registration (Admin Override)</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateNewBooking} className="p-6 space-y-5 text-xs text-slate-300">
              
              {/* Row 1: Patient Name, Phone, Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="font-bold text-white block mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ronald Vance"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={newPatientPhone}
                    onChange={(e) => setNewPatientPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={newPatientEmail}
                    onChange={(e) => setNewPatientEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Age, Gender, Insurance */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-white block mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">Gender *</label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">Insurance Provider</label>
                  <select
                    value={newInsurance}
                    onChange={(e) => setNewInsurance(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                    <option value="Aetna Health">Aetna Health</option>
                    <option value="Cigna Healthcare">Cigna Healthcare</option>
                    <option value="UnitedHealthcare">UnitedHealthcare</option>
                    <option value="Medicare / Medicaid">Medicare / Medicaid</option>
                    <option value="Direct / Cashless / Self-Pay">Direct / Cashless / Self-Pay</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Department & Doctor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <label className="font-bold text-blue-400 block mb-1">1. Department *</label>
                  <select
                    value={newDeptId}
                    onChange={(e) => setNewDeptId(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-blue-400 block mb-1">2. Attending Specialist Doctor *</label>
                  <select
                    value={newDoctorId}
                    onChange={(e) => setNewDoctorId(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {availableDoctorsForNew.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.specialty} - Fee: ${doc.consultationFee})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Date, Time Slot, Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-white block mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-white block mb-1">Time Slot *</label>
                  <select
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {(selectedNewDoctor?.timeSlots || ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM']).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-white block mb-1">Consultation Mode *</label>
                  <select
                    value={newConsultationType}
                    onChange={(e) => setNewConsultationType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="In-Person Hospital Visit">In-Person OPD Visit</option>
                    <option value="Virtual Video Consult">Virtual Video Teleconsult</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Reason & Notes */}
              <div>
                <label className="font-bold text-white block mb-1">Reason for Visit / Chief Complaint</label>
                <input
                  type="text"
                  placeholder="e.g. Follow-up consultation, ECG assessment, routine wellness"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1">Administrative / Clinical Notes</label>
                <textarea
                  rows={2}
                  placeholder="Internal triage notes or admission instructions..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{formSubmitting ? 'Saving to Database...' : 'Register & Confirm Booking'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: RESCHEDULE APPOINTMENT */}
      {/* ------------------------------------------------------------- */}
      {isRescheduleModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            
            <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Reschedule Appointment</h4>
                <p className="text-[11px] text-slate-400 font-mono">Ref: {selectedAppointment.referenceNumber}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Patient:</span>
                <strong className="text-white">{selectedAppointment.patientName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Doctor:</span>
                <span className="text-blue-400">{selectedAppointment.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Slot:</span>
                <span className="text-slate-300">{selectedAppointment.date} at {selectedAppointment.timeSlot}</span>
              </div>
            </div>

            <form onSubmit={handleSaveReschedule} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-white block mb-1">New Consultation Date</label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1">New Time Slot</label>
                <select
                  value={rescheduleTimeSlot}
                  onChange={(e) => setRescheduleTimeSlot(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {['08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT PATIENT & CLINICAL DETAILS */}
      {/* ------------------------------------------------------------- */}
      {isEditModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4 my-8 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Edit className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-bold text-white font-display">Edit Booking #{selectedAppointment.referenceNumber}</h4>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-white block mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={editPatientName}
                    onChange={(e) => setEditPatientName(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editPatientPhone}
                    onChange={(e) => setEditPatientPhone(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-white block mb-1">Email</label>
                  <input
                    type="email"
                    value={editPatientEmail}
                    onChange={(e) => setEditPatientEmail(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">Age</label>
                  <input
                    type="number"
                    value={editPatientAge}
                    onChange={(e) => setEditPatientAge(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-blue-500 focus:outline-none font-bold text-blue-400"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-white block mb-1">Insurance Provider</label>
                <input
                  type="text"
                  value={editInsurance}
                  onChange={(e) => setEditInsurance(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1">Chief Complaint / Reason</label>
                <input
                  type="text"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1">Clinical / Admin Notes</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: VIEW FULL CLINICAL SLIP */}
      {/* ------------------------------------------------------------- */}
      {isDetailModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">Official Clinical Voucher</h3>
                  <span className="font-mono text-xs text-blue-400">Ref: {selectedAppointment.referenceNumber}</span>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Slip Details Grid */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Patient Full Name</span>
                  <strong className="text-white text-sm block">{selectedAppointment.patientName}</strong>
                  <span className="text-slate-400">{selectedAppointment.patientPhone}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Status & Mode</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full font-bold bg-blue-950 border border-blue-700 text-blue-300">
                    {selectedAppointment.status} • {selectedAppointment.consultationType}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Specialist Physician</span>
                  <strong className="text-slate-200 block">{selectedAppointment.doctorName}</strong>
                  <span className="text-blue-400">{selectedAppointment.doctorSpecialty}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Department & Room</span>
                  <strong className="text-slate-200 block">{selectedAppointment.departmentName}</strong>
                  <span className="text-slate-400">{selectedAppointment.doctorRoom}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Scheduled Date & Slot</span>
                  <strong className="text-white block">{selectedAppointment.date} at {selectedAppointment.timeSlot}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Insurance Coverage</span>
                  <strong className="text-slate-200 block">{selectedAppointment.insuranceProvider || 'Direct / Cashless'}</strong>
                </div>
              </div>

              {selectedAppointment.reasonForVisit && (
                <div className="pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Chief Complaint / Reason</span>
                  <p className="text-slate-300 mt-0.5">{selectedAppointment.reasonForVisit}</p>
                </div>
              )}

              {selectedAppointment.notes && (
                <div className="pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Admin / Triage Notes</span>
                  <p className="text-amber-300/90 mt-0.5">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => downloadCalendarEvent(selectedAppointment)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Calendar (.ics)</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ------------------------------------------------------------- */}
      {isDeleteConfirmOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-800/80 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center space-y-4 animate-in zoom-in-95">
            
            <div className="w-12 h-12 rounded-full bg-rose-950 border border-rose-700 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Permanently Delete Record?</h4>
              <p className="text-xs text-slate-400 mt-1">
                Booking reference <strong className="font-mono text-rose-300">{selectedAppointment.referenceNumber}</strong> for {selectedAppointment.patientName} will be removed from Firestore cloud and hospital records.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAppointment}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Yes, Delete Booking
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
