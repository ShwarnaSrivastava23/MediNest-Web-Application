import React from 'react';
import { Page } from '../types';
import { 
  ShieldCheck, 
  Award, 
  Heart, 
  Users, 
  Activity, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  GraduationCap, 
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import { LEADERSHIP_TEAM, HOSPITAL_STATS } from '../data/hospitalData';

interface AboutProps {
  setCurrentPage: (page: Page) => void;
  onBookAppointment: () => void;
}

export const About: React.FC<AboutProps> = ({ setCurrentPage, onBookAppointment }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO BANNER */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>About MediNest Hospital</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight">
              A Legacy of Healing, Innovation, and Human Dignity.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Founded on the belief that world-class healthcare should be delivered with profound empathy, MediNest Hospital has grown into a premier quaternary academic medical center trusted by patients across the nation.
            </p>
          </div>
        </div>
      </section>

      {/* 2. MISSION, VISION & CORE VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To provide exceptional, evidence-based, compassionate medical care to every patient, advancing clinical medicine through relentless innovation, ethical practice, and medical research.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To be the most trusted global healthcare sanctuary—where groundbreaking clinical technology meets the warmth of human healing, transforming patient lives and setting international benchmarks.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Core Values</h3>
            <ul className="text-slate-600 text-sm space-y-1.5">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span><strong>Clinical Integrity:</strong> Unwavering ethics.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span><strong>Empathy First:</strong> Deep patient listening.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span><strong>Innovation:</strong> Precision robotics & AI tools.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3. HOSPITAL STATS & INFRASTRUCTURE */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-widest block">
              Scale & Clinical Capacity
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
              Hospital Infrastructure at a Glance
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {HOSPITAL_STATS.map((stat, idx) => (
              <div key={idx} className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700">
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-display mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-white">{stat.label}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXECUTIVE CLINICAL LEADERSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest block">
            Executive Board
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Medical Directorate & Leadership
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Guiding MediNest with unmatched academic pedigree, international accreditation oversight, and patient advocacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {LEADERSHIP_TEAM.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-64 bg-slate-200 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 font-display">{member.name}</h3>
                  <p className="text-xs text-blue-600 font-semibold">{member.role}</p>
                  <p className="text-xs text-slate-400 font-medium">{member.qualifications}</p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-2">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ACCREDITATIONS & AWARDS */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest block">
              Recognized Worldwide
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-display">
              International Quality Accreditations
            </h2>
            <p className="text-slate-600 text-sm">
              Our clinical outcomes, sterilization protocols, and surgical benchmarks are audited independently by top global healthcare accreditation councils.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 text-center hover:border-blue-500 transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">JCI Gold Seal</h4>
              <p className="text-xs text-slate-500">Joint Commission International Gold Seal of Approval for Patient Safety</p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 text-center hover:border-blue-500 transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">NABH Accredited</h4>
              <p className="text-xs text-slate-500">Highest standard of hospital care, continuous safety benchmarking & ethics</p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 text-center hover:border-blue-500 transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">ISO 9001:2015</h4>
              <p className="text-xs text-slate-500">Certified Quality Management Systems across laboratory and radiology</p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 text-center hover:border-blue-500 transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Zero-Infection ICU</h4>
              <p className="text-xs text-slate-500">National Healthcare Safety Network distinction for HEPA sterilized wards</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-slate-900 font-display">
          Experience world-class healthcare at MediNest
        </h2>
        <p className="text-slate-600 text-base max-w-xl mx-auto">
          Whether you need a routine checkup, specialist consultation, or emergency care, our clinical doors are always open.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onBookAppointment}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center space-x-2 transition-all"
          >
            <Calendar className="w-5 h-5" />
            <span>Book Doctor Appointment</span>
          </button>
          <button
            onClick={() => {
              setCurrentPage('departments');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-sm"
          >
            Explore Clinical Departments
          </button>
        </div>
      </section>

    </div>
  );
};
