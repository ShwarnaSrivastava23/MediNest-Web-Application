import React, { useState, useEffect } from 'react';
import { Page, Doctor, Department, Appointment } from './types';
import { DEPARTMENTS_DATA, DOCTORS_DATA } from './data/hospitalData';
import { getStoredAppointments } from './utils/appointmentStorage';

import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { About } from './components/About';
import { Departments } from './components/Departments';
import { Doctors } from './components/Doctors';
import { AppointmentBooking } from './components/AppointmentBooking';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { DepartmentDetailModal } from './components/DepartmentDetailModal';
import { MyAppointmentsModal } from './components/MyAppointmentsModal';
import { EmergencyModal } from './components/EmergencyModal';
import { AuthModal } from './components/AuthModal';
import { AdminPortal } from './components/AdminPortal';

function AppContent() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Booking pre-selection states
  const [bookingDeptId, setBookingDeptId] = useState<string | undefined>(undefined);
  const [bookingDoctorId, setBookingDoctorId] = useState<string | undefined>(undefined);

  // Modal States
  const [selectedDoctorModal, setSelectedDoctorModal] = useState<Doctor | null>(null);
  const [selectedDeptModal, setSelectedDeptModal] = useState<Department | null>(null);
  const [isMyAppointmentsOpen, setIsMyAppointmentsOpen] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authPrompt, setAuthPrompt] = useState<string | undefined>(undefined);

  // Appointments State
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const loaded = getStoredAppointments();
    setAppointments(loaded);
  }, []);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin', prompt?: string) => {
    setAuthMode(mode);
    setAuthPrompt(prompt);
    setIsAuthOpen(true);
  };

  // Handle direct booking navigation
  const handleStartBooking = (deptId?: string, doctorId?: string) => {
    setBookingDeptId(deptId);
    setBookingDoctorId(doctorId);
    setCurrentPage('appointment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle department modal
  const handleOpenDepartmentDetail = (deptId: string) => {
    const dept = DEPARTMENTS_DATA.find((d) => d.id === deptId) || null;
    setSelectedDeptModal(dept);
  };

  // Handle doctor modal
  const handleOpenDoctorDetail = (doctor: Doctor) => {
    setSelectedDoctorModal(doctor);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* Sticky Header Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={(page) => {
          if (page !== 'appointment') {
            setBookingDeptId(undefined);
            setBookingDoctorId(undefined);
          }
          setCurrentPage(page);
        }}
        onOpenMyAppointments={() => setIsMyAppointmentsOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenAuth={handleOpenAuth}
        appointmentCount={appointments.length}
      />

      {/* Main Page View Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Home
            departments={DEPARTMENTS_DATA}
            doctors={DOCTORS_DATA}
            setCurrentPage={setCurrentPage}
            onSelectDepartment={handleOpenDepartmentDetail}
            onSelectDoctor={handleOpenDoctorDetail}
            onBookAppointment={handleStartBooking}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        )}

        {currentPage === 'about' && (
          <About
            setCurrentPage={setCurrentPage}
            onBookAppointment={() => handleStartBooking()}
          />
        )}

        {currentPage === 'departments' && (
          <Departments
            departments={DEPARTMENTS_DATA}
            doctors={DOCTORS_DATA}
            onSelectDepartment={handleOpenDepartmentDetail}
            onSelectDoctor={handleOpenDoctorDetail}
            onBookAppointment={handleStartBooking}
          />
        )}

        {currentPage === 'doctors' && (
          <Doctors
            doctors={DOCTORS_DATA}
            departments={DEPARTMENTS_DATA}
            onSelectDoctor={handleOpenDoctorDetail}
            onBookAppointment={handleStartBooking}
          />
        )}

        {currentPage === 'appointment' && (
          <AppointmentBooking
            departments={DEPARTMENTS_DATA}
            doctors={DOCTORS_DATA}
            preSelectedDepartmentId={bookingDeptId}
            preSelectedDoctorId={bookingDoctorId}
            onAppointmentBooked={(newAppt) => {
              setAppointments((prev) => [newAppt, ...prev]);
            }}
            onViewMyAppointments={() => setIsMyAppointmentsOpen(true)}
            onNavigateHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPortal
            departments={DEPARTMENTS_DATA}
            doctors={DOCTORS_DATA}
            appointments={appointments}
            setAppointments={setAppointments}
            onNavigateHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentPage={setCurrentPage}
        onSelectDepartment={handleOpenDepartmentDetail}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* Global Modals */}
      {selectedDoctorModal && (
        <DoctorDetailModal
          doctor={selectedDoctorModal}
          onClose={() => setSelectedDoctorModal(null)}
          onBookAppointment={(doctor) => {
            setSelectedDoctorModal(null);
            handleStartBooking(doctor.departmentId, doctor.id);
          }}
        />
      )}

      {selectedDeptModal && (
        <DepartmentDetailModal
          department={selectedDeptModal}
          doctors={DOCTORS_DATA}
          onClose={() => setSelectedDeptModal(null)}
          onSelectDoctor={handleOpenDoctorDetail}
          onBookAppointment={(deptId, docId) => {
            setSelectedDeptModal(null);
            handleStartBooking(deptId, docId);
          }}
        />
      )}

      {isMyAppointmentsOpen && (
        <MyAppointmentsModal
          isOpen={isMyAppointmentsOpen}
          onClose={() => setIsMyAppointmentsOpen(false)}
          appointments={appointments}
          setAppointments={setAppointments}
          onBookNew={() => {
            setIsMyAppointmentsOpen(false);
            handleStartBooking();
          }}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {isEmergencyOpen && (
        <EmergencyModal
          isOpen={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        customPrompt={authPrompt}
        onAuthSuccess={() => {
          setIsAuthOpen(false);
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
