# 🏥 MediNest – Hospital Web Application

<p align="center">
  <img src="https://img.shields.io/badge/MediNest-Hospital%20Web%20Application-0EA5E9?style=for-the-badge" alt="MediNest">
</p>

<p align="center">
  <strong>AI-powered digital healthcare platform for smarter hospital services, appointment management, and patient assistance.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini">
</p>

---

## 📌 Overview

**MediNest** is a modern, responsive hospital web application designed to provide patients with a convenient and user-friendly digital healthcare experience.

The platform brings essential hospital services together in one place, allowing users to explore doctors and departments, book appointments, manage their appointments, access emergency information, and interact with AI-powered healthcare assistance.

The application is built using a modern React and TypeScript architecture with Firebase services for authentication and data management, along with Google's Gemini API for intelligent healthcare assistance.

---

## ✨ Key Features

### 🏥 Hospital Information

MediNest provides users with essential hospital information through a clean and accessible interface.

- Hospital overview
- Hospital services
- Medical departments
- Department details
- Contact information
- Emergency information
- Healthcare service information

---

### 👨‍⚕️ Doctor Directory

Users can explore doctors and learn more about available healthcare professionals.

**Features include:**

- Doctor listing
- Doctor profiles
- Medical specialties
- Doctor details
- Department association
- Doctor availability information

---

### 📅 Appointment Booking

MediNest provides a streamlined appointment booking experience.

Users can:

- Select a department
- Select a doctor
- Choose an appointment date
- Choose an available time
- Submit an appointment request
- View their booked appointments

---

### 👤 Patient Authentication

The application includes user authentication functionality.

**Authentication features:**

- Patient registration
- Patient login
- Google authentication
- Authentication state management
- User session handling

Firebase Authentication is used to manage authentication.

---

### 📋 Appointment Management

Authenticated users can access and manage their appointments.

Users can:

- View upcoming appointments
- Review appointment details
- Manage existing bookings
- Access their appointment history

---

### 🚨 Emergency Assistance

MediNest provides a dedicated emergency interface for quick access to important emergency-related information.

The emergency functionality is designed to make critical hospital information easier to access.

> **Important:** This application is not a replacement for emergency medical services. In a real emergency, contact your local emergency services or a qualified healthcare professional.

---

### 🤖 AI-Powered Healthcare Assistance

MediNest integrates **Google Gemini AI** to provide intelligent healthcare assistance.

The AI functionality can help users with:

- General healthcare questions
- Healthcare-related information
- Basic guidance
- Navigation through the application
- General wellness information

> ⚠️ **Medical Disclaimer:** AI-generated responses are provided for general informational purposes only. They should not be considered a substitute for professional medical advice, diagnosis, or treatment.

---

### 🔐 Firebase Integration

Firebase provides several backend services for the application.

The project uses Firebase for:

- Authentication
- Firestore database
- User management
- Appointment data
- Application data persistence

---

### 🛠️ Admin Portal

MediNest includes an administrative interface for managing application-related information and appointment workflows.

The admin functionality can be extended to support:

- Appointment management
- Doctor management
- Department management
- Patient management
- Hospital operations

---

### 📱 Responsive Design

MediNest is designed to provide a consistent experience across different screen sizes.

Supported layouts include:

- 💻 Desktop
- 💻 Laptop
- 📱 Tablet
- 📱 Mobile

---

# 🛠️ Tech Stack

## 🎨 Frontend

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</p>

### React

Used to build the application's interactive user interface and reusable components.

### TypeScript

Provides type safety and improved maintainability throughout the application.

### Vite

Used as the development server and build tool for the React application.

### Tailwind CSS

Used to create the responsive and modern user interface.

---

## 🔥 Backend & Database

<p>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firestore">
</p>

### Firebase Authentication

Handles user authentication and account management.

### Firebase Firestore

Provides cloud database functionality for storing and retrieving application data.

---

## 🤖 Artificial Intelligence

<p>
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini">
</p>

### Google Gemini API

Used to provide AI-powered healthcare assistance and intelligent responses within the application.

---

## ⚙️ Development Tools

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
</p>

---

# 📂 Project Structure

```text
MediNest-Web-Application/
│
├── src/
│   │
│   ├── components/
│   │   ├── About.tsx
│   │   ├── AdminPortal.tsx
│   │   ├── AppointmentBooking.tsx
│   │   ├── AuthModal.tsx
│   │   ├── DepartmentDetailModal.tsx
│   │   ├── Departments.tsx
│   │   ├── DoctorDetailModal.tsx
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
├── vite.config.ts
└── README.md
