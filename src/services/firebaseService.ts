import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Appointment, UserProfile } from '../types';

const APPOINTMENTS_COLLECTION = 'appointments';
const USERS_COLLECTION = 'users';

// User Profile Firestore handlers
export async function saveUserProfileToFirestore(profile: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, profile.uid);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore profile save warning (fallback to local state):', error);
  }
}

export async function getUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (error) {
    console.warn('Firestore profile get warning:', error);
  }
  return null;
}

// Appointment Firestore handlers
export async function saveAppointmentToFirestore(appointment: Appointment): Promise<void> {
  try {
    const apptRef = doc(db, APPOINTMENTS_COLLECTION, appointment.id);
    await setDoc(apptRef, {
      ...appointment,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore appointment save warning (saved locally):', error);
  }
}

export async function updateAppointmentStatusInFirestore(
  appointmentId: string, 
  updates: Partial<Appointment>
): Promise<void> {
  try {
    const apptRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    await updateDoc(apptRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore appointment update warning:', error);
  }
}

export async function fetchUserAppointmentsFromFirestore(userId: string): Promise<Appointment[]> {
  try {
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const results: Appointment[] = [];
    snapshot.forEach((docSnap) => {
      results.push(docSnap.data() as Appointment);
    });
    // Sort descending by creation
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Firestore fetch appointments warning:', error);
    return [];
  }
}

export async function fetchAllAppointmentsFromFirestore(): Promise<Appointment[]> {
  try {
    const apptsCol = collection(db, APPOINTMENTS_COLLECTION);
    const snapshot = await getDocs(apptsCol);
    const results: Appointment[] = [];
    snapshot.forEach((docSnap) => {
      results.push(docSnap.data() as Appointment);
    });
    // Sort descending by creation
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Firestore fetch all appointments warning:', error);
    return [];
  }
}

export async function deleteAppointmentFromFirestore(appointmentId: string): Promise<void> {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    const apptRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    await deleteDoc(apptRef);
  } catch (error) {
    console.warn('Firestore appointment delete warning:', error);
  }
}
