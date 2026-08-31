import React from 'react';
import { Doctor } from '../types';
import { 
  X, 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  Globe, 
  GraduationCap, 
  Award, 
  ShieldCheck, 
  CheckCircle2,
  DollarSign,
  PhoneCall,
  User
} from 'lucide-react';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  onBookAppointment,
}) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Photo & Quick Bio */}
        <div className="relative bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white/20 shadow-lg shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs px-2.5 py-1 rounded-full font-medium">
                  {doctor.departmentName}
                </span>
                {doctor.acceptingNewPatients && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs px-2.5 py-1 rounded-full font-medium flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Accepting Patients</span>
                  </span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-display">{doctor.name}</h3>
              <p className="text-blue-300 font-medium text-sm sm:text-base">{doctor.title}</p>
              <p className="text-xs text-slate-300 font-medium">{doctor.qualifications}</p>

              <div className="flex items-center justify-center sm:justify-start space-x-4 pt-1 text-sm text-slate-200">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white">{doctor.rating}</span>
                  <span className="text-slate-400 text-xs">({doctor.reviewCount} reviews)</span>
                </div>
                <span>•</span>
                <span>{doctor.experienceYears} Years Experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Details Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Biography */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Professional Biography</span>
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {doctor.bio}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Consultation Fee</span>
              <span className="font-bold text-slate-900 text-base">${doctor.consultationFee}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Location / Room</span>
              <span className="font-semibold text-slate-800 text-xs sm:text-sm">{doctor.roomNo}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-500 block">Languages Spoken</span>
              <span className="font-semibold text-slate-800 text-xs sm:text-sm">{doctor.languages.join(', ')}</span>
            </div>
          </div>

          {/* Available Days & Slots */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2.5 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Weekly Consultation Schedule</span>
            </h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((day) => {
                const isAvailable = doctor.availableDays.includes(day);
                return (
                  <span
                    key={day}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      isAvailable
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-400 line-through'
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {doctor.timeSlots.map((slot) => (
                <span
                  key={slot}
                  className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded border border-slate-200"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          {/* Education & Fellowships */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2.5 flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Education & Medical Training</span>
            </h4>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {doctor.education.map((edu, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{edu}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Professional Memberships & Honors */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2.5 flex items-center space-x-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Memberships & Accreditations</span>
            </h4>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {doctor.memberships.map((mem, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{mem}</span>
                </li>
              ))}
              {doctor.awards?.map((award, idx) => (
                <li key={`award-${idx}`} className="flex items-start space-x-2 text-amber-900 font-medium">
                  <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{award}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Room {doctor.roomNo} • Instant confirmation slip provided</span>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookAppointment(doctor);
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-md flex items-center justify-center space-x-2 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book with {doctor.name.split(' ')[1] || doctor.name}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
