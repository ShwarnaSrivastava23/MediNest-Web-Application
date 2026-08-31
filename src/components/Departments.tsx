import React, { useState } from 'react';
import { Department, Doctor, Page } from '../types';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  CheckCircle2, 
  Calendar, 
  User, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  Search,
  Activity,
  Stethoscope
} from 'lucide-react';

interface DepartmentsProps {
  departments: Department[];
  doctors: Doctor[];
  onSelectDepartment: (deptId: string) => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onBookAppointment: (deptId: string, doctorId?: string) => void;
  selectedDeptIdFromNav?: string | null;
}

export const Departments: React.FC<DepartmentsProps> = ({
  departments,
  doctors,
  onSelectDepartment,
  onSelectDoctor,
  onBookAppointment,
  selectedDeptIdFromNav,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'surgical' | 'general'>('all');

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch = 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.treatments.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'critical') return dept.emergencyAvailable;
    if (activeFilter === 'surgical') return dept.id === 'cardiology' || dept.id === 'neurology' || dept.id === 'orthopedics' || dept.id === 'oncology';
    if (activeFilter === 'general') return dept.id === 'pediatrics' || dept.id === 'gynecology' || dept.id === 'gastroenterology' || dept.id === 'ophthalmology';

    return true;
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 bg-slate-50 min-h-screen">
      
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Multi-Specialty Centers of Excellence</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display">
              Clinical Departments & Institutes
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              MediNest houses {departments.length} state-of-the-art medical departments, each staffed with multiple renowned specialist doctors, specialized operating theatres, and dedicated intensive care units.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Departments ({departments.length})
            </button>
            <button
              onClick={() => setActiveFilter('critical')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                activeFilter === 'critical'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Emergency & Critical Care
            </button>
            <button
              onClick={() => setActiveFilter('surgical')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                activeFilter === 'surgical'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Surgical Specialties
            </button>
            <button
              onClick={() => setActiveFilter('general')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                activeFilter === 'general'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Medical & Pediatrics
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search department or treatment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

        </div>
      </section>

      {/* Departments Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {filteredDepartments.map((dept) => {
            const deptDoctors = doctors.filter((d) => d.departmentId === dept.id);

            return (
              <div
                key={dept.id}
                id={`dept-${dept.id}`}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  
                  {/* Left Col: Image & Department Highlight (4 cols) */}
                  <div className="lg:col-span-4 relative h-64 lg:h-auto bg-slate-900 overflow-hidden">
                    <img
                      src={dept.image}
                      alt={dept.name}
                      className="w-full h-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                    
                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {dept.locationFloor}
                        </span>
                        {dept.emergencyAvailable && (
                          <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                            24/7 Acute Care
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold font-display">{dept.name}</h2>
                      <div className="flex items-center space-x-3 text-xs text-slate-300">
                        <span className="flex items-center space-x-1">
                          <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                          <span>{dept.phoneExtension}</span>
                        </span>
                        <span>•</span>
                        <span className="text-blue-300 font-bold">{deptDoctors.length} Doctors</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Col: Details & Doctors Roster (8 cols) */}
                  <div className="lg:col-span-8 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
                    
                    <div className="space-y-4">
                      {/* Description */}
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {dept.description}
                      </p>

                      {/* Head of Department Callout */}
                      <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                            MD
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block">Department Head</span>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">{dept.headDoctorName}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const head = doctors.find(d => d.id === dept.headDoctorId);
                            if (head) onSelectDoctor(head);
                          }}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
                        >
                          View Bio
                        </button>
                      </div>

                      {/* Key Procedures */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Featured Procedures & Treatments
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {dept.treatments.map((treatment, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 font-medium"
                            >
                              {treatment}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Practicing Doctors in this Department */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                            <Stethoscope className="w-4 h-4 text-blue-600" />
                            <span>Practicing Specialists in this Department ({deptDoctors.length})</span>
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {deptDoctors.map((doc) => (
                            <div
                              key={doc.id}
                              className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-500 transition-all flex items-start space-x-3 cursor-pointer group"
                              onClick={() => onSelectDoctor(doc)}
                            >
                              <img
                                src={doc.image}
                                alt={doc.name}
                                className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0 flex-1">
                                <h5 className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors truncate">
                                  {doc.name}
                                </h5>
                                <p className="text-[11px] text-blue-600 truncate font-medium">{doc.specialty}</p>
                                <div className="flex items-center space-x-1 mt-1 text-[11px] text-slate-500">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>{doc.rating}</span>
                                  <span>•</span>
                                  <span>{doc.experienceYears}y exp</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Department Action Bar */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => onSelectDepartment(dept.id)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <span>View Department Facilities & Specs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onBookAppointment(dept.id)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs flex items-center space-x-2 transition-all"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Book Appointment in {dept.name.split('&')[0]}</span>
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
