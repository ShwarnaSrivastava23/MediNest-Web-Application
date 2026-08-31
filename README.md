# MediNest Hospital

A modern, responsive hospital web application designed to provide patients with an intuitive digital healthcare experience.

MediNest brings together hospital information, doctor discovery, department exploration, appointment booking, patient authentication, appointment management, and intelligent healthcare assistance in a single web application.

## Overview

MediNest is designed as a digital front door for a modern hospital.

The application allows patients and visitors to:

- Explore hospital departments and medical services
- Browse doctors and their specialties
- View detailed doctor and department information
- Register and sign in securely
- Book medical appointments
- View and manage appointments
- Access emergency information
- Interact with intelligent healthcare assistance
- Use a responsive interface across desktop and mobile devices

The project uses a modern React-based architecture with Firebase services for authentication and data persistence and Google's Gemini API for AI-powered functionality.

## Features

### 🏥 Hospital Information

- Hospital overview and introduction
- Medical departments
- Healthcare services
- Doctor directory
- Doctor profiles
- Department details
- Contact and hospital information

### 👨‍⚕️ Doctor Directory

Patients can explore available doctors and view information such as:

- Doctor name
- Medical specialty
- Professional information
- Availability
- Profile details

### 📅 Appointment Booking

The appointment system allows users to:

- Select a doctor
- Select a department
- Choose an appointment date
- Choose an available time
- Submit an appointment request
- View previously booked appointments

### 👤 Patient Authentication

The application includes patient authentication functionality with:

- Patient registration
- Patient login
- Google authentication
- Authentication state management
- Protected user functionality

Authentication and user data are handled through Firebase.

### 📋 Appointment Management

Authenticated users can access their appointment information and manage their existing bookings.

### 🚨 Emergency Access

The application provides quick access to emergency information through a dedicated emergency interface.

### 🤖 Intelligent Healthcare Assistance

MediNest integrates Google's Gemini API to provide AI-powered healthcare assistance within the application.

The AI functionality is designed to assist users with general healthcare-related guidance and navigation.

> AI-generated information should not be considered a substitute for professional medical advice, diagnosis, or treatment.

### 🛠️ Admin Functionality

The project includes an administrative portal for managing application-related information and appointment workflows.

### 📱 Responsive Design

The interface is designed to work across:

- Desktop computers
- Laptops
- Tablets
- Mobile devices

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Motion

### Backend & Services

- Firebase Authentication
- Firebase Firestore
- Google Gemini API

### Development Tools

- Node.js
- npm
- Vite
- Git

## Project Structure

```text
medinest-hospital/
│
├── src/
│   ├── components/
│   │   ├── About.tsx
│   │   ├── AdminPortal.tsx
│   │   ├── AppointmentBooking.tsx
│   │   ├── AuthModal.tsx
│   │   ├── Departments.tsx
│   │   ├── Doctors.tsx
│   │   ├── EmergencyModal.tsx
│   │   ├── Footer.tsx
│   │   ├── Home.tsx
│   │   ├── MyAppointmentsModal.tsx
│   │   └── Navbar.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── data/
│   │   └── hospitalData.ts
│   │
│   ├── lib/
│   │   └── firebase.ts
│   │
│   ├── services/
│   │   └── firebaseService.ts
│   │
│   ├── utils/
│   │   └── appointmentStorage.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
