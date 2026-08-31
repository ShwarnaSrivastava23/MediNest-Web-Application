export type Page = 'home' | 'about' | 'departments' | 'doctors' | 'appointment' | 'admin';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  specialty: string;
  qualifications: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  image: string;
  bio: string;
  languages: string[];
  availableDays: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  timeSlots: string[];
  roomNo: string;
  education: string[];
  memberships: string[];
  awards?: string[];
  acceptingNewPatients: boolean;
}

export interface Department {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  iconName: string;
  image: string;
  headDoctorId: string;
  headDoctorName: string;
  facilities: string[];
  treatments: string[];
  emergencyAvailable: boolean;
  phoneExtension: string;
  locationFloor: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  insuranceProvider?: string;
  createdAt?: string;
}

export interface Appointment {
  id: string;
  userId?: string;
  referenceNumber: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorRoom: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  consultationType: 'In-Person Hospital Visit' | 'Virtual Video Consult';
  reasonForVisit: string;
  insuranceProvider?: string;
  isFirstVisit: boolean;
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled';
  createdAt: string;
  notes?: string;
}

export interface PatientReview {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
  department: string;
  doctorName?: string;
}

export interface Facility {
  id: string;
  title: string;
  description: string;
  image: string;
  highlight: string;
}

export interface LeadershipMember {
  name: string;
  role: string;
  qualifications: string;
  image: string;
  bio: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Appointments' | 'Billing & Insurance' | 'Emergency';
}
