import React, { useState } from 'react';
import { Page } from '../types';
import { 
  PhoneCall, 
  Clock, 
  MapPin, 
  Calendar, 
  Menu, 
  X, 
  AlertCircle,
  UserCheck,
  User,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onOpenMyAppointments: () => void;
  onOpenEmergency: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  appointmentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  onOpenMyAppointments,
  onOpenEmergency,
  onOpenAuth,
  appointmentCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();

  const navLinks: { id: Page; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Specialist Doctors' },
    { id: 'appointment', label: 'Book Appointment' },
  ];

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-100 shadow-xs transition-all">
      {/* Top Bar with Emergency Hotline & Key Info */}
      <div className="bg-slate-900 text-slate-200 text-xs sm:text-sm py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="flex items-center space-x-1.5 text-blue-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>24/7 Emergency Care Ready</span>
            </div>
            <a 
              href="tel:18006334637" 
              className="flex items-center space-x-1.5 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
              <span>Hotline: <strong className="text-white font-semibold">1-800-MEDINEST</strong></span>
            </a>
            <div className="hidden md:flex items-center space-x-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>OPD: 08:00 AM – 08:00 PM</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5">
            {user && (
              <div className="hidden sm:flex items-center space-x-1.5 text-blue-300 text-xs font-semibold bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-800/60">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Patient Account Active</span>
              </div>
            )}
            <div className="hidden lg:flex items-center space-x-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>100 Medical Plaza Ave, Metro City</span>
            </div>
            <button
              onClick={() => handleNavClick('admin')}
              id="admin-portal-top-btn"
              className="hidden sm:flex items-center space-x-1 text-slate-300 hover:text-white px-2.5 py-0.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-semibold cursor-pointer transition-colors"
              title="Hospital Administration & Booking Management"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={onOpenEmergency}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-full text-xs transition-colors shadow-sm cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Emergency Help</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Hospital Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-all shrink-0">
              <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-bold tracking-tight text-slate-800 font-display">
                  MediNest<span className="text-blue-600">Hospital</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Compassionate Care • Clinical Excellence
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-sm transition-all pb-1 cursor-pointer ${
                    isActive
                      ? 'font-semibold text-blue-600 border-b-2 border-blue-600'
                      : 'font-medium text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* My Appointments Trigger */}
            <button
              onClick={onOpenMyAppointments}
              id="my-appointments-btn"
              className="relative flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-all cursor-pointer"
              title="View your scheduled appointments"
            >
              <UserCheck className="w-4 h-4 text-slate-500" />
              <span>My Bookings</span>
              {appointmentCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                  {appointmentCount}
                </span>
              )}
            </button>

            {/* User Profile / Authentication Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-900 transition-all cursor-pointer"
                  id="user-profile-menu-btn"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {(userProfile?.displayName || user.email || 'P').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left text-xs max-w-[110px] truncate">
                    <span className="font-bold block truncate">
                      {userProfile?.displayName || 'Patient'}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {userProfile?.displayName || 'Patient Account'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenMyAppointments();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>My Appointment Records</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavClick('appointment');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Book New Slot</span>
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('signin')}
                id="patient-signin-btn"
                className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-blue-300 bg-blue-50/70 hover:bg-blue-100 text-blue-800 text-sm font-semibold transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* Direct Book Appointment CTA */}
            <button
              onClick={() => handleNavClick('appointment')}
              id="book-appointment-header-cta"
              className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={onOpenMyAppointments}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 relative"
              title="My Bookings"
            >
              <UserCheck className="w-5 h-5 text-slate-600" />
              {appointmentCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {appointmentCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white shadow-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          {/* User status in mobile drawer */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                  {(userProfile?.displayName || user.email || 'P').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{userProfile?.displayName || 'Patient'}</p>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-600">Not signed in</span>
              </div>
            )}

            {user ? (
              <button
                onClick={async () => {
                  setMobileMenuOpen(false);
                  await logout();
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signin');
                }}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 px-3 py-1 rounded-lg border border-blue-300 bg-blue-50"
              >
                Sign In / Register
              </button>
            )}
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyAppointments();
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-slate-200 text-slate-800 font-medium text-sm hover:bg-slate-50"
            >
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>View My Scheduled Appointments ({appointmentCount})</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEmergency();
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Emergency: 911</span>
            </button>

            <button
              onClick={() => handleNavClick('appointment')}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Doctor Appointment</span>
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-slate-300 bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Hospital Staff & Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

