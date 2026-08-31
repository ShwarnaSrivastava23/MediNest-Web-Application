import React from 'react';
import { 
  X, 
  PhoneCall, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Ambulance, 
  HeartPulse, 
  Activity,
  CheckCircle2
} from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8 border-2 border-rose-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Urgent Header */}
        <div className="bg-rose-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white text-rose-600 flex items-center justify-center font-bold shadow-md shrink-0">
              <Ambulance className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-rose-100 bg-rose-700/60 px-2 py-0.5 rounded">
                24/7 Level-1 Trauma Care
              </span>
              <h3 className="text-2xl font-bold font-display mt-0.5">MediNest Emergency Services</h3>
            </div>
          </div>
        </div>

        {/* Action Hotlines */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="tel:18006334637"
              className="p-5 rounded-xl bg-rose-50 border-2 border-rose-200 hover:border-rose-400 flex items-center space-x-4 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-xs text-rose-800 font-bold uppercase tracking-wider block">Hospital Emergency Line</span>
                <span className="text-lg font-black text-rose-950 font-display">1-800-MEDINEST</span>
                <span className="text-xs text-rose-700 block">Direct Emergency Triage</span>
              </div>
            </a>

            <a
              href="tel:911"
              className="p-5 rounded-xl bg-slate-900 text-white border-2 border-slate-800 hover:border-blue-500 flex items-center space-x-4 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-105 transition-transform">
                911
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">National Emergency Dispatch</span>
                <span className="text-lg font-black text-white font-display">Call 911 / EMS</span>
                <span className="text-xs text-blue-400 block">Paramedic Ambulance</span>
              </div>
            </a>
          </div>

          {/* Critical Indicators for Immediate Emergency */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm">
            <h4 className="font-bold text-amber-900 mb-2 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Seek Immediate Emergency Care If Experiencing:</span>
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-950">
              <li className="flex items-center space-x-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Crushing chest pain or shortness of breath</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Sudden numbness, facial drooping or stroke signs</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Severe uncontrolled bleeding or trauma</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Loss of consciousness or severe head injury</span>
              </li>
            </ul>
          </div>

          {/* Hospital Location & Gate Access */}
          <div className="space-y-2 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Dedicated Emergency Entrance:</strong> East Gate Ramp, Ground Level, 100 Medical Plaza Avenue.
              </div>
            </div>
            <div className="flex items-center space-x-2.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Zero triage wait times for acute critical conditions. Helipad on roof.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold transition-colors"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
