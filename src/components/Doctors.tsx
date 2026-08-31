import React, { useState } from 'react';
import { Department, Doctor, Page } from '../types';
import { 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  UserCheck, 
  Stethoscope, 
  DollarSign, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

interface DoctorsProps {
  doctors: Doctor[];
  departments: Department[];
  onSelectDoctor: (doctor: Doctor) => void;
  onBookAppointment: (departmentId: string, doctorId: string) => void;
}

export const Doctors: React.FC<DoctorsProps> = ({
  doctors,
  departments,
  onSelectDoctor,
  onBookAppointment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee'>('rating');

  const filteredDoctors = doctors
    .filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.qualifications.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.languages.some((l) => l.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDept =
        selectedDeptFilter === 'all' || doc.departmentId === selectedDeptFilter;

      const matchesDay =
        selectedDayFilter === 'all' || doc.availableDays.includes(selectedDayFilter as any);

      return matchesSearch && matchesDept && matchesDay;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (sortBy === 'fee') return a.consultationFee - b.consultationFee;
      return 0;
    });

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 bg-slate-50 min-h-screen">
      
      {/* Banner */}
      <section className="bg-slate-900 text-white py-14 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
              <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
              <span>Medical Faculty & Specialists Directory</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display">
              Find Your Specialist Doctor
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Browse our board-certified clinical professors, interventional surgeons, and pediatric specialists. Filter by medical specialty or schedule an appointment online.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          
          {/* Top Search & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by doctor name, specialty, condition, language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-4 flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="rating">Sort by: Highest Patient Rating</option>
                <option value="experience">Sort by: Years of Experience</option>
                <option value="fee">Sort by: Consultation Fee (Low to High)</option>
              </select>
            </div>
          </div>

          {/* Department Filter Buttons */}
          <div>
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-2">
              Filter by Department:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDeptFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedDeptFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Departments ({doctors.length})
              </button>
              {departments.map((dept) => {
                const count = doctors.filter((d) => d.departmentId === dept.id).length;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDeptFilter(dept.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedDeptFilter === dept.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {dept.name.split('&')[0]} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Days Filter */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-500 mr-2">Available Day:</span>
            {['all', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDayFilter(day)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  selectedDayFilter === day
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {day === 'all' ? 'Any Day' : day}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Doctors Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-slate-600">
            Showing <span className="text-slate-900 font-bold">{filteredDoctors.length}</span> Specialist Doctors
          </p>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <Stethoscope className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No Doctors Match Your Search</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your department filter or clearing the search terms to view all available physicians.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDeptFilter('all');
                setSelectedDayFilter('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                id={`doc-card-${doc.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Doctor Banner */}
                  <div className="p-5 pb-0 flex items-start space-x-4">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-100 shadow-sm shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="bg-blue-50 text-blue-800 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-blue-200 truncate max-w-[140px]">
                          {doc.departmentName.split('&')[0]}
                        </span>
                        <div className="flex items-center space-x-1 text-xs font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{doc.rating}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base font-display truncate">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-blue-600 font-semibold truncate">{doc.specialty}</p>
                      <p className="text-[11px] text-slate-400 truncate">{doc.qualifications}</p>
                    </div>
                  </div>

                  {/* Body & Availability */}
                  <div className="p-5 space-y-3">
                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                      {doc.bio}
                    </p>

                    {/* Stats Pill */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Experience</span>
                        <span className="font-bold text-slate-800">{doc.experienceYears} Years</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Consult Fee</span>
                        <span className="font-bold text-slate-900">${doc.consultationFee}</span>
                      </div>
                    </div>

                    {/* Days schedule */}
                    <div>
                      <span className="text-[11px] text-slate-500 font-medium block mb-1">
                        Days Available: {doc.availableDays.join(', ')}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {doc.timeSlots.slice(0, 3).map((slot) => (
                          <span
                            key={slot}
                            className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium"
                          >
                            {slot}
                          </span>
                        ))}
                        {doc.timeSlots.length > 3 && (
                          <span className="text-[10px] text-slate-400 px-1 py-0.5">
                            +{doc.timeSlots.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 space-y-2 border-t border-slate-100 mt-2">
                  <div className="flex items-center space-x-2 pt-3">
                    <button
                      onClick={() => onSelectDoctor(doc)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onBookAppointment(doc.departmentId, doc.id)}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Slot</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
