import React from 'react';
import { Department, Doctor } from '../types';
import { 
  X, 
  MapPin, 
  PhoneCall, 
  Activity, 
  CheckCircle2, 
  Calendar, 
  UserCheck, 
  Star, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface DepartmentDetailModalProps {
  department: Department | null;
  doctors: Doctor[];
  onClose: () => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onBookAppointment: (departmentId: string, doctorId?: string) => void;
}

export const DepartmentDetailModal: React.FC<DepartmentDetailModalProps> = ({
  department,
  doctors,
  onClose,
  onSelectDoctor,
  onBookAppointment,
}) => {
  if (!department) return null;

  const deptDoctors = doctors.filter((d) => d.departmentId === department.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Image Banner */}
        <div className="relative h-48 sm:h-64 overflow-hidden bg-slate-900">
          <img
            src={department.image}
            alt={department.name}
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Clinical Department
              </span>
              {department.emergencyAvailable && (
                <span className="bg-rose-600 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center space-x-1">
                  <Activity className="w-3 h-3" />
                  <span>24/7 Acute Care</span>
                </span>
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-display">{department.name}</h3>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{department.locationFloor}</span>
              </span>
              <span className="flex items-center space-x-1">
                <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                <span>{department.phoneExtension}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[60vh] overflow-y-auto">
          {/* Overview */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">Overview</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {department.description}
            </p>
          </div>

          {/* Department Head */}
          <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                MD
              </div>
              <div>
                <span className="text-xs text-blue-800 font-semibold uppercase tracking-wider block">Head of Department</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">{department.headDoctorName}</span>
              </div>
            </div>
            <button
              onClick={() => {
                const headDoc = doctors.find(d => d.id === department.headDoctorId);
                if (headDoc) {
                  onClose();
                  onSelectDoctor(headDoc);
                }
              }}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline"
            >
              View Bio
            </button>
          </div>

          {/* Treatments & Clinical Procedures */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
              Key Clinical Procedures & Surgeries
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {department.treatments.map((treatment, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-medium">{treatment}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specialized Facilities */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
              Specialized Infrastructure & Labs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {department.facilities.map((fac, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Doctors in this Department */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Department Doctors & Specialists ({deptDoctors.length})
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {deptDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h5>
                      <p className="text-xs text-blue-700 font-medium truncate">{doc.specialty}</p>
                      <div className="flex items-center space-x-1 mt-1 text-xs text-slate-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-700">{doc.rating}</span>
                        <span>•</span>
                        <span>{doc.experienceYears} yrs exp</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectDoctor(doc);
                      }}
                      className="text-slate-600 hover:text-slate-900 font-medium"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onBookAppointment(department.id, doc.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center space-x-1"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Book Slot</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            <span>Location: {department.locationFloor} • Dedicated Reception</span>
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
                onBookAppointment(department.id);
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment in this Department</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
