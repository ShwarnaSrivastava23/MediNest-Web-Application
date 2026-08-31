import React, { useState } from 'react';
import { Department, Doctor, Page } from '../types';
import { 
  Heart, 
  Activity, 
  Calendar, 
  PhoneCall, 
  ShieldCheck, 
  Award, 
  Users, 
  Clock, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  Stethoscope, 
  Building2, 
  ChevronRight, 
  Play,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { 
  HOSPITAL_STATS, 
  HOSPITAL_FACILITIES, 
  PATIENT_REVIEWS, 
  FAQS_DATA 
} from '../data/hospitalData';

interface HomeProps {
  departments: Department[];
  doctors: Doctor[];
  setCurrentPage: (page: Page) => void;
  onSelectDepartment: (deptId: string) => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onBookAppointment: (deptId?: string, doctorId?: string) => void;
  onOpenEmergency: () => void;
}

export const Home: React.FC<HomeProps> = ({
  departments,
  doctors,
  setCurrentPage,
  onSelectDepartment,
  onSelectDoctor,
  onBookAppointment,
  onOpenEmergency,
}) => {
  // Quick booking widget state on hero
  const [quickDeptId, setQuickDeptId] = useState(departments[0]?.id || 'cardiology');
  const [quickDoctorId, setQuickDoctorId] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const deptDoctors = doctors.filter((d) => d.departmentId === quickDeptId);

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    onBookAppointment(quickDeptId, quickDoctorId || undefined);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO SECTION - GEOMETRIC BALANCE THEME */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Col: 7 cols - Clean Slate/White Canvas with Geometric Ambient Blur */}
          <div className="lg:col-span-7 bg-slate-50 relative overflow-hidden rounded-2xl lg:rounded-3xl p-8 sm:p-12 border border-slate-200 flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -mr-32 -mt-32 pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <span className="uppercase tracking-widest text-xs font-bold text-blue-600 block">
                Compassionate Care • JCI & NABH Accredited
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 font-display">
                Modern Care,<br />
                Rooted in <span className="text-blue-600">Trust.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed">
                MediNest Hospital brings together world-renowned physicians, precision surgical suites, and 24/7 emergency trauma response to safeguard what matters most: your health.
              </p>

              {/* Call to action buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onBookAppointment()}
                  id="hero-book-appointment-btn"
                  className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-md flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book an Appointment</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentPage('doctors');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-8 py-4 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-900 font-bold text-base flex items-center space-x-2 transition-all shadow-xs"
                >
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  <span>Meet Specialists</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>120+ Board Specialists</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Zero-Wait Emergency Care</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Cashless Insurance Desk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: 5 cols - Geometric 2-Row Block */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Top Block: Solid Blue-600 Quick Appointment Card */}
            <div className="bg-blue-600 p-8 sm:p-10 text-white rounded-2xl shadow-xl flex flex-col justify-center relative overflow-hidden">
              <div className="mb-5">
                <span className="uppercase tracking-widest text-[11px] font-bold text-blue-200 block mb-1">
                  Express Booking
                </span>
                <h3 className="text-2xl font-bold font-display text-white">Book an Appointment</h3>
                <p className="text-xs text-blue-100 mt-1">Pick your clinical department & specialist</p>
              </div>

              <form onSubmit={handleQuickBook} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-blue-100 uppercase tracking-wider block mb-1">
                    Department
                  </label>
                  <select
                    value={quickDeptId}
                    onChange={(e) => {
                      setQuickDeptId(e.target.value);
                      setQuickDoctorId('');
                    }}
                    className="w-full p-3 bg-blue-500/40 border border-blue-400/40 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id} className="text-slate-900">
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-blue-100 uppercase tracking-wider block mb-1">
                    Doctor
                  </label>
                  <select
                    value={quickDoctorId}
                    onChange={(e) => setQuickDoctorId(e.target.value)}
                    className="w-full p-3 bg-blue-500/40 border border-blue-400/40 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <option value="" className="text-slate-900">Any Available Specialist</option>
                    {deptDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id} className="text-slate-900">
                        {doc.name} ({doc.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-blue-700/60 rounded-xl border border-blue-400/30 flex items-center justify-between text-xs text-blue-100">
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-200" />
                    <span>Next Slots Today & Tomorrow</span>
                  </span>
                  <span className="font-bold text-white bg-blue-500/60 px-2 py-0.5 rounded">Available</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-xl text-sm shadow-xl flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Select Date & Time Slot</span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </button>
              </form>
            </div>

            {/* Bottom Block: Top Specialists Preview Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Featured Clinical Specialists</h4>
                  <p className="text-xs text-slate-500">Board-certified leaders</p>
                </div>
                <button
                  onClick={() => {
                    setCurrentPage('doctors');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {doctors.slice(0, 2).map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => onSelectDoctor(doc)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px] sm:max-w-[200px]">
                          {doc.specialty}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full text-xs font-bold text-amber-800">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* 2. STATS BAR - GEOMETRIC BALANCE */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:px-12 mt-12 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {HOSPITAL_STATS.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-display">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-white">{stat.label}</div>
                <div className="text-xs text-slate-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 3. 24/7 EMERGENCY & URGENT CARE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-600/30">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
          
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-white/20 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>24/7 Critical Emergency Response</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display">
              Critical Emergency or Trauma?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base max-w-xl">
              MediNest features dedicated trauma resuscitation suites, mobile ICU ambulances equipped with ventilators, and a rooftop air-ambulance helipad.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={onOpenEmergency}
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Emergency Triage Guide</span>
            </button>
            <a
              href="tel:18006334637"
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2 border border-slate-800"
            >
              <PhoneCall className="w-4 h-4 text-blue-400" />
              <span>Call 1-800-MEDINEST</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4. FEATURED CLINICAL DEPARTMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest block">
              Centers of Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              Specialized Medical Departments
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
              Each department is led by distinguished clinician-researchers and equipped with high-precision surgical and diagnostic suites.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentPage('departments');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center space-x-1.5 text-blue-600 hover:text-blue-700 font-bold text-sm"
          >
            <span>View All 9 Departments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Column Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {departments.slice(0, 6).map((dept) => {
            const docCount = doctors.filter((d) => d.departmentId === dept.id).length;

            return (
              <div
                key={dept.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Department Image & Badge */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={dept.image}
                      alt={dept.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                      <span className="bg-blue-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                        {dept.locationFloor}
                      </span>
                      <span className="text-xs font-semibold text-blue-200">
                        {docCount} Specialists
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-display">
                      {dept.name}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {dept.shortDescription}
                    </p>

                    {/* Key procedures bullet previews */}
                    <div className="pt-2 space-y-1.5">
                      {dept.treatments.slice(0, 2).map((t, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <button
                    onClick={() => onSelectDepartment(dept.id)}
                    className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Department Info
                  </button>
                  <button
                    onClick={() => onBookAppointment(dept.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition-all flex items-center space-x-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Consult</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 5. MEET OUR FEATURED DOCTORS */}
      <section className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest block">
                World-Class Clinical Faculty
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
                Distinguished Specialist Doctors
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
                Our board-certified physicians, surgeons, and department directors bring decades of specialized academic medicine to your bedside.
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentPage('doctors');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-1.5 text-blue-600 hover:text-blue-700 font-bold text-sm"
            >
              <span>Explore All {doctors.length} Doctors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Doctors Grid (4 featured) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.slice(0, 4).map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-500 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo with rating badge */}
                  <div className="relative h-56 bg-slate-200 overflow-hidden">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center space-x-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{doctor.rating}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-blue-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                      {doctor.departmentName.split('&')[0]}
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 font-display">{doctor.name}</h3>
                    <p className="text-xs text-blue-600 font-semibold truncate">{doctor.specialty}</p>
                    <p className="text-xs text-slate-500">{doctor.qualifications}</p>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                      <span>{doctor.experienceYears} Years Experience</span>
                      <span className="font-bold text-slate-900">${doctor.consultationFee}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    onClick={() => onSelectDoctor(doctor)}
                    className="w-full py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    View Full Profile
                  </button>
                  <button
                    onClick={() => onBookAppointment(doctor.departmentId, doctor.id)}
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. ADVANCED MEDICAL FACILITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest block">
            State-of-the-Art Technology
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Hospital Infrastructure & Surgical Suites
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Equipped with cutting-edge medical robotics, high-speed imaging, and sterile ICU environments designed for optimal patient recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {HOSPITAL_FACILITIES.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col sm:flex-row"
            >
              <div className="sm:w-2/5 h-48 sm:h-auto bg-slate-100 shrink-0">
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {fac.highlight}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 font-display">{fac.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{fac.description}</p>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-blue-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Available 24/7 at MediNest</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PATIENT TESTIMONIALS */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-widest block">
              Patient Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
              Stories of Healing & Trust
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Hear from our patients and families about their clinical journey at MediNest Hospital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PATIENT_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/80">
                  <div className="font-bold text-white text-sm">{rev.patientName}</div>
                  <div className="text-blue-400 text-xs">{rev.department}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{rev.date}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest block">
            Have Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display">
            Patient & Visitor Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p>{faq.answer}</p>
                    <span className="inline-block mt-2 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
