import { Appointment } from '../types';

const STORAGE_KEY = 'medinest_appointments_v1';

// Seed sample appointment if none exists so users can explore "My Appointments" immediately
const SAMPLE_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-sample-1',
    referenceNumber: 'MN-2026-7841',
    patientName: 'Sarah Jenkins',
    patientEmail: 'sarah.j@example.com',
    patientPhone: '+1 (555) 234-5678',
    patientAge: 34,
    patientGender: 'Female',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Heart Institute',
    doctorId: 'doc-cardio-1',
    doctorName: 'Dr. Sarah Mitchell',
    doctorSpecialty: 'Interventional Cardiology & Coronary Angioplasty',
    doctorRoom: 'Suite 301, Heart Wing',
    date: '2026-09-04',
    timeSlot: '10:00 AM',
    consultationType: 'In-Person Hospital Visit',
    reasonForVisit: 'Annual cardiovascular wellness check and echocardiogram review.',
    insuranceProvider: 'Blue Cross Blue Shield',
    isFirstVisit: false,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  }
];

export function getStoredAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_APPOINTMENTS));
      return SAMPLE_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse appointments from localStorage', e);
    return SAMPLE_APPOINTMENTS;
  }
}

export function saveAppointment(appointment: Appointment): Appointment[] {
  const current = getStoredAppointments();
  const updated = [appointment, ...current.filter(a => a.id !== appointment.id)];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save appointment', e);
  }
  return updated;
}

export function cancelAppointment(appointmentId: string): Appointment[] {
  const current = getStoredAppointments();
  const updated = current.map(a => 
    a.id === appointmentId ? { ...a, status: 'Cancelled' as const } : a
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to cancel appointment', e);
  }
  return updated;
}

export function rescheduleAppointment(appointmentId: string, newDate: string, newTimeSlot: string): Appointment[] {
  const current = getStoredAppointments();
  const updated = current.map(a => 
    a.id === appointmentId ? { ...a, date: newDate, timeSlot: newTimeSlot, status: 'Rescheduled' as const } : a
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to reschedule appointment', e);
  }
  return updated;
}

export function deleteStoredAppointment(appointmentId: string): Appointment[] {
  const current = getStoredAppointments();
  const updated = current.filter(a => a.id !== appointmentId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete appointment', e);
  }
  return updated;
}

export function updateStoredAppointment(appointmentId: string, updates: Partial<Appointment>): Appointment[] {
  const current = getStoredAppointments();
  const updated = current.map(a => 
    a.id === appointmentId ? { ...a, ...updates } : a
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update appointment', e);
  }
  return updated;
}

export function generateReferenceNumber(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `MN-2026-${randomNum}`;
}

export function exportAppointmentsToCSV(appointments: Appointment[]) {
  const headers = [
    'Reference No',
    'Patient Name',
    'Email',
    'Phone',
    'Age',
    'Gender',
    'Department',
    'Doctor',
    'Room',
    'Date',
    'Time Slot',
    'Consultation Type',
    'Insurance',
    'Status',
    'Created At',
    'Reason / Notes'
  ];

  const rows = appointments.map(a => [
    `"${a.referenceNumber || ''}"`,
    `"${(a.patientName || '').replace(/"/g, '""')}"`,
    `"${a.patientEmail || ''}"`,
    `"${a.patientPhone || ''}"`,
    `"${a.patientAge || ''}"`,
    `"${a.patientGender || ''}"`,
    `"${(a.departmentName || '').replace(/"/g, '""')}"`,
    `"${(a.doctorName || '').replace(/"/g, '""')}"`,
    `"${a.doctorRoom || ''}"`,
    `"${a.date || ''}"`,
    `"${a.timeSlot || ''}"`,
    `"${a.consultationType || ''}"`,
    `"${a.insuranceProvider || ''}"`,
    `"${a.status || ''}"`,
    `"${a.createdAt || ''}"`,
    `"${(a.reasonForVisit || a.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `medinest_appointments_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadCalendarEvent(appointment: Appointment) {
  const startTime = appointment.timeSlot.replace(/[^0-9APM:]/gi, '');
  const title = `MediNest Hospital Appointment - ${appointment.doctorName}`;
  const description = `Consultation with ${appointment.doctorName} (${appointment.departmentName}) at ${appointment.doctorRoom}. Ref: ${appointment.referenceNumber}`;
  const location = 'MediNest Hospital, 100 Medical Plaza Ave, Metro City';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MediNest Hospital//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${appointment.date.replace(/-/g, '')}T090000Z`,
    `DTEND:${appointment.date.replace(/-/g, '')}T100000Z`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `MediNest_Appointment_${appointment.referenceNumber}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
