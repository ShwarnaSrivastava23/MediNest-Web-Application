import React from 'react';
import { Page } from '../types';
import { 
  Activity, 
  Heart, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Award, 
  ChevronRight,
  Stethoscope,
  Calendar
} from 'lucide-react';
import { DEPARTMENTS_DATA } from '../data/hospitalData';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
  onSelectDepartment: (deptId: string) => void;
  onOpenEmergency: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentPage,
  onSelectDepartment,
  onOpenEmergency,
}) => {
  const handleNav = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeptClick = (deptId: string) => {
    onSelectDepartment(deptId);
    setCurrentPage('departments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Top Pre-Footer Emergency Callout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 rounded-2xl p-6 sm:p-8 border border-blue-800/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <PhoneCall className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Need Urgent Medical Assistance?</h4>
              <p className="text-slate-300 text-sm mt-0.5">
                Our Level-1 Trauma team and critical ICU ambulances are standing by 24/7.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenEmergency}
              className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>Emergency Protocols</span>
            </button>
            <a
              href="tel:18006334637"
              className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>Call 1-800-MEDINEST</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: About & Accreditations (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <div className="relative">
                  <Activity className="w-5 h-5 stroke-[2.5]" />
                  <Heart className="w-3 h-3 absolute -top-1 -right-1 text-rose-300 fill-rose-300" />
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-display">
                Medi<span className="text-blue-400">Nest</span> Hospital
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              MediNest Hospital is an internationally accredited, multi-specialty quaternary care medical institution dedicated to clinical excellence, advanced medical technology, and patient-centered healing.
            </p>

            {/* Quality Certifications */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-3">
                Accreditations & Standards
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-blue-300">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold">JCI Gold Seal</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-blue-300">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold">NABH Accredited</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-blue-300">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold">ISO 9001:2015</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white font-display">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => handleNav('home')}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                  <span>Hospital Home</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('about')}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                  <span>About MediNest</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('departments')}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                  <span>Clinical Departments</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('doctors')}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                  <span>Find a Specialist Doctor</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('appointment')}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                  <span>Book Appointment Online</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('admin')}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1.5 text-slate-400 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Hospital Admin & Staff Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Departments */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white font-display">Departments</h4>
            <ul className="space-y-2 text-sm">
              {DEPARTMENTS_DATA.slice(0, 6).map((dept) => (
                <li key={dept.id}>
                  <button
                    onClick={() => handleDeptClick(dept.id)}
                    className="hover:text-blue-400 transition-colors text-left truncate max-w-full block"
                  >
                    {dept.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Hospital Contact & Location */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white font-display">Hospital Contact</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                <span>100 Medical Plaza Avenue, Metro City, MC 94016</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <PhoneCall className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+1 (800) 633-4637</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>care@medinesthospital.org</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                <div>
                  <p className="text-white font-medium">Emergency: 24/7/365</p>
                  <p className="text-xs">Outpatient: 08:00 AM – 08:00 PM</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 MediNest Hospital. All Rights Reserved. Committed to Patient Privacy (HIPAA Compliant).</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Healthcare Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Patient Bill of Rights</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
