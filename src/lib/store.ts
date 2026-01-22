// Firebase Firestore data store for Vjen platform
// Provides real-time database operations

import { db, auth } from './firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    addDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { Business, Specialist, Availability, Appointment, BookingFormData, Notification, AvailabilityOverride, BlockedSlot, WaitlistEntry, Service } from './types';

// Collection names
const COLLECTIONS = {
    BUSINESS: 'business',
    SPECIALISTS: 'physiotherapists', // Keeping existing collection name for data continuity
    AVAILABILITY: 'availability',
    APPOINTMENTS: 'appointments',
    NOTIFICATIONS: 'notifications',
    AVAILABILITY_OVERRIDES: 'availability_overrides',
    BLOCKED_SLOTS: 'blocked_slots',
    WAITLIST: 'waitlist',
};

// Default data for new setup
const defaultBusiness: Business = {
    id: 'main',
    name: 'Biznesi Im',
    logo: '',
    address: 'Adresa juaj',
    phone: '+383 49 000 000',
    email: 'info@vjen.al',
    description: 'Shërbime profesionale për nevojat tuaja.',
    uniqueLink: 'biznesi-im',
    urlLocked: false,
    showServices: false,
    services: [],
    onboardingCompleted: false,
};

const defaultSpecialist: Omit<Specialist, 'id'> = {
    businessId: 'main',
    name: 'Emri Juaj',
    title: 'Specialist',
    bio: 'Përshkrimi juaj këtu',
    specialties: ['Shërbim i Përgjithshëm'],
};

const defaultAvailability: Availability = {
    businessId: 'main',
    workingDays: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '18:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    appointmentDurations: [30, 45, 60],
    defaultDuration: 30,
};

const getBusinessId = () => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    return user.uid;
};

// ============ BUSINESS OPERATIONS ============

export async function getBusiness(businessId?: string): Promise<Business> {
    try {
        let id = businessId;
        if (!id) {
            const user = auth.currentUser;
            if (user) id = user.uid;
            else return defaultBusiness;
        }

        const docRef = doc(db, COLLECTIONS.BUSINESS, id!);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Business;
        } else {
            if (auth.currentUser && auth.currentUser.uid === id) {
                const newBusiness = { ...defaultBusiness, id };
                await setDoc(docRef, newBusiness);
                return newBusiness;
            }
            return defaultBusiness;
        }
    } catch (error) {
        console.error('Error getting business:', error);
        return defaultBusiness;
    }
}

export async function getBusinessByLink(uniqueLink: string): Promise<Business | null> {
    try {
        const q = query(
            collection(db, COLLECTIONS.BUSINESS),
            where('uniqueLink', '==', uniqueLink)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Business;
    } catch (error) {
        console.error('Error getting business by link:', error);
        return null;
    }
}

export async function updateBusiness(updates: Partial<Business>): Promise<Business> {
    try {
        const id = getBusinessId();
        const docRef = doc(db, COLLECTIONS.BUSINESS, id);
        await updateDoc(docRef, updates);
        return await getBusiness();
    } catch (error) {
        console.error('Error updating business:', error);
        throw error;
    }
}

export async function createBusinessForUser(userId: string, email: string): Promise<void> {
    try {
        const docRef = doc(db, COLLECTIONS.BUSINESS, userId);
        const newBusiness = {
            ...defaultBusiness,
            id: userId,
            email: email,
            uniqueLink: email.split('@')[0].toLowerCase() + '-' + Math.random().toString(36).substring(2, 5).toLowerCase(),
        };
        await setDoc(docRef, newBusiness);
    } catch (error) {
        console.error('Error creating business for user:', error);
        throw error;
    }
}


// ============ SPECIALIST OPERATIONS ============

export async function getSpecialists(businessId?: string): Promise<Specialist[]> {
    try {
        const bId = businessId || getBusinessId();
        const q = query(
            collection(db, COLLECTIONS.SPECIALISTS),
            where('businessId', '==', bId)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // Create a default specialist if none exist for this business
            const newSpecialist = { ...defaultSpecialist, businessId };
            const docRef = await addDoc(collection(db, COLLECTIONS.SPECIALISTS), newSpecialist);
            return [{ id: docRef.id, ...newSpecialist } as Specialist];
        }

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as Specialist));
    } catch (error) {
        console.error('Error getting specialists:', error);
        return [];
    }
}

export async function addSpecialist(specialist: Omit<Specialist, 'id' | 'businessId'>): Promise<Specialist> {
    try {
        const businessId = getBusinessId();
        const docRef = await addDoc(collection(db, COLLECTIONS.SPECIALISTS), {
            ...specialist,
            businessId,
        });
        return {
            id: docRef.id,
            businessId,
            ...specialist,
        };
    } catch (error) {
        console.error('Error adding specialist:', error);
        throw error;
    }
}

export async function updateSpecialist(id: string, updates: Partial<Specialist>): Promise<void> {
    try {
        const docRef = doc(db, COLLECTIONS.SPECIALISTS, id);
        await updateDoc(docRef, updates);
    } catch (error) {
        console.error('Error updating specialist:', error);
        throw error;
    }
}

export async function deleteSpecialist(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, COLLECTIONS.SPECIALISTS, id));
    } catch (error) {
        console.error('Error deleting specialist:', error);
        throw error;
    }
}

// ============ AVAILABILITY OPERATIONS ============

export async function getAvailability(businessId?: string): Promise<Availability> {
    try {
        const bId = businessId || getBusinessId();
        const docRef = doc(db, COLLECTIONS.AVAILABILITY, bId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { ...defaultAvailability, ...docSnap.data() } as Availability;
        } else {
            const newAvailability = { ...defaultAvailability, businessId: bId };
            // Avoid saving if not authenticated as this business
            const user = auth.currentUser;
            if (user && user.uid === bId) {
                try {
                    await setDoc(docRef, newAvailability);
                } catch (e) {
                    console.log('Skipping auto-save of availability (read-only or non-owner)');
                }
            }
            return newAvailability;
        }
    } catch (error) {
        console.error('Error getting availability:', error);
        return defaultAvailability;
    }
}

export async function updateAvailability(updates: Partial<Availability>): Promise<Availability> {
    try {
        const businessId = getBusinessId();
        const docRef = doc(db, COLLECTIONS.AVAILABILITY, businessId);
        await updateDoc(docRef, updates);
        return await getAvailability();
    } catch (error) {
        console.error('Error updating availability:', error);
        throw error;
    }
}

// ============ APPOINTMENT OPERATIONS ============

export async function getAppointments(businessId?: string): Promise<Appointment[]> {
    try {
        const bId = businessId || getBusinessId();
        const q = query(
            collection(db, COLLECTIONS.APPOINTMENTS),
            where('businessId', '==', bId)
        );
        const querySnapshot = await getDocs(q);

        const appointments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Appointment[];

        return appointments.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        });
    } catch (error) {
        console.error('Error getting appointments:', error);
        return [];
    }
}

export async function getAppointmentsByDate(date: string, businessId?: string): Promise<Appointment[]> {
    try {
        const all = await getAppointments(businessId);
        return all.filter(a => a.date === date);
    } catch (error) {
        console.error('Error getting appointments by date:', error);
        return [];
    }
}

export async function getUpcomingAppointments(limit: number = 10): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    try {
        const all = await getAppointments();
        return all
            .filter(a => a.date >= today && a.status !== 'cancelled')
            .slice(0, limit);
    } catch (error) {
        console.error('Error getting upcoming appointments:', error);
        return [];
    }
}

export async function getClientAppointments(phone: string): Promise<Appointment[]> {
    try {
        const q = query(
            collection(db, COLLECTIONS.APPOINTMENTS),
            where('clientPhone', '==', phone)
        );
        const querySnapshot = await getDocs(q);

        const appointments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Appointment[];

        return appointments.sort((a, b) => {
            if (a.date !== b.date) return b.date.localeCompare(a.date);
            return b.time.localeCompare(a.time);
        });
    } catch (error) {
        console.error('Error getting client appointments:', error);
        return [];
    }
}

async function createFutureOccurrences(parentId: string, data: any, recurringType: 'weekly' | 'biweekly' | 'monthly') {
    const startDate = new Date(data.date);
    const numOccurrences = 12; // Create for the next ~3 months roughly
    let intervalDays = 7;
    if (recurringType === 'biweekly') intervalDays = 14;

    for (let i = 1; i < numOccurrences; i++) {
        const nextDate = new Date(startDate);
        if (recurringType === 'monthly') {
            nextDate.setMonth(startDate.getMonth() + i);
        } else {
            nextDate.setDate(startDate.getDate() + (i * intervalDays));
        }

        const nextDateStr = nextDate.toISOString().split('T')[0];

        await addDoc(collection(db, COLLECTIONS.APPOINTMENTS), {
            ...data,
            date: nextDateStr,
            recurring: {
                type: recurringType,
                parentId: parentId,
            },
            createdAt: new Date().toISOString(),
        });
    }
}

export async function createAppointment(
    data: BookingFormData,
    specialistId: string,
    status: 'pending' | 'confirmed' = 'pending',
    businessId?: string
): Promise<Appointment> {
    try {
        const bId = businessId || getBusinessId();
        const recurringType = data.recurringType && data.recurringType !== 'none' ? data.recurringType : null;

        const appointmentData: any = {
            businessId: bId,
            specialistId,
            clientName: data.name,
            clientPhone: data.phone,
            clientEmail: data.email || null,
            date: data.date,
            time: data.time,
            duration: data.duration,
            status: status,
            verificationMethod: data.verificationMethod,
            notes: data.notes || null,
            specialistName: data.specialistName || null,
            createdAt: new Date().toISOString(),
            serviceId: data.serviceId || null,
            serviceName: data.serviceName || null,
            servicePrice: data.servicePrice || null,
        };

        if (recurringType) {
            appointmentData.recurring = {
                type: recurringType,
            };
        }

        const docRef = await addDoc(collection(db, COLLECTIONS.APPOINTMENTS), appointmentData);
        const mainId = docRef.id;

        // If recurring, create future appointments
        if (recurringType) {
            await createFutureOccurrences(mainId, appointmentData, recurringType);
        }

        await createNotification({
            businessId: bId,
            type: 'new_appointment',
            title: 'Rezervim i Ri',
            message: `${data.name} ka rezervuar një termin për ${data.date} në ${data.time}`,
            relatedId: docRef.id
        });

        return { id: docRef.id, ...appointmentData } as Appointment;
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
}

export async function updateAppointment(id: string, updates: Partial<Appointment>): Promise<void> {
    try {
        const docRef = doc(db, COLLECTIONS.APPOINTMENTS, id);
        await updateDoc(docRef, updates);
    } catch (error) {
        console.error('Error updating appointment:', error);
        throw error;
    }
}

export async function approveAppointment(id: string, recurringType?: 'weekly' | 'biweekly' | 'monthly'): Promise<void> {
    const updates: Partial<Appointment> = { status: 'confirmed' };

    if (recurringType) {
        updates.recurring = { type: recurringType };
    }

    await updateAppointment(id, updates);

    if (recurringType) {
        // Fetch the full appointment data to create future occurrences
        const docSnap = await getDoc(doc(db, COLLECTIONS.APPOINTMENTS, id));
        if (docSnap.exists()) {
            const appointmentData = docSnap.data();
            await createFutureOccurrences(id, appointmentData, recurringType);
        }
    }

    const businessId = getBusinessId();
    await createNotification({
        businessId,
        type: 'confirmation',
        title: 'Termin i Konfirmuar',
        message: recurringType
            ? `Termini është konfirmuar si përsëritës (${recurringType === 'weekly' ? 'çdo javë' : recurringType === 'biweekly' ? 'çdo dy javë' : 'çdo muaj'}).`
            : `Termini është konfirmuar.`,
        relatedId: id,
    });
}

export async function cancelAppointment(id: string): Promise<void> {
    const businessId = getBusinessId();
    await updateAppointment(id, { status: 'cancelled' });
    await createNotification({
        businessId,
        type: 'cancellation',
        title: 'Termin i anuluar',
        message: `Termini është anuluar.`,
        relatedId: id,
    });
}

export async function deleteAppointment(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, COLLECTIONS.APPOINTMENTS, id));
    } catch (error) {
        console.error('Error deleting appointment:', error);
        throw error;
    }
}

// ============ AVAILABILITY OVERRIDES ============

export async function setAvailabilityOverride(override: Omit<AvailabilityOverride, 'id' | 'businessId'>): Promise<void> {
    const businessId = getBusinessId();
    const q = query(
        collection(db, COLLECTIONS.AVAILABILITY_OVERRIDES),
        where('businessId', '==', businessId),
        where('date', '==', override.date)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        await updateDoc(doc(db, COLLECTIONS.AVAILABILITY_OVERRIDES, snapshot.docs[0].id), override);
    } else {
        await addDoc(collection(db, COLLECTIONS.AVAILABILITY_OVERRIDES), {
            ...override,
            businessId
        });
    }
}

export async function getAvailabilityOverrides(businessId?: string): Promise<AvailabilityOverride[]> {
    const bId = businessId || getBusinessId();
    const q = query(collection(db, COLLECTIONS.AVAILABILITY_OVERRIDES), where('businessId', '==', bId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AvailabilityOverride));
}

export async function deleteAvailabilityOverride(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, COLLECTIONS.AVAILABILITY_OVERRIDES, id));
    } catch (error) {
        console.error('Error deleting availability override:', error);
        throw error;
    }
}

// ============ BLOCKED SLOTS ============

export async function addBlockedSlot(
    slot: Omit<BlockedSlot, 'id' | 'businessId' | 'createdAt'>
): Promise<BlockedSlot> {
    const businessId = getBusinessId();
    const newSlot = {
        ...slot,
        businessId,
        createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, COLLECTIONS.BLOCKED_SLOTS), newSlot);
    return { id: docRef.id, ...newSlot };
}

export async function getBlockedSlots(date?: string, businessId?: string): Promise<BlockedSlot[]> {
    const bId = businessId || getBusinessId();
    let q;
    if (date) {
        q = query(
            collection(db, COLLECTIONS.BLOCKED_SLOTS),
            where('businessId', '==', bId),
            where('date', '==', date)
        );
    } else {
        q = query(
            collection(db, COLLECTIONS.BLOCKED_SLOTS),
            where('businessId', '==', bId)
        );
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as BlockedSlot));
}

export async function deleteBlockedSlot(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, COLLECTIONS.BLOCKED_SLOTS, id));
    } catch (error) {
        console.error('Error deleting blocked slot:', error);
        throw error;
    }
}

// ============ TIME SLOT GENERATION ============

export interface TimeSlotStatus {
    time: string;
    available: boolean;
    reason?: 'booked' | 'break' | 'blocked' | 'past';
}

export async function generateTimeSlots(date: string, businessId?: string, specialistId?: string, duration?: number): Promise<TimeSlotStatus[]> {
    const availability = await getAvailability(businessId);
    const existingAppointments = await getAppointmentsByDate(date, businessId);
    const overrides = await getAvailabilityOverrides(businessId);
    const override = overrides.find(o => o.date === date);

    if (override && override.isOff) return [];

    const slots: TimeSlotStatus[] = [];
    const startTime = override?.startTime || availability.startTime || '09:00';
    const endTime = override?.endTime || availability.endTime || '18:00';

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMin;
    const endTotalMinutes = endHour * 60 + endMin;

    const [breakStartHour, breakStartMin] = (availability.breakStart || '').split(':').map(Number);
    const [breakEndHour, breakEndMin] = (availability.breakEnd || '').split(':').map(Number);
    const breakStartTotalMinutes = !isNaN(breakStartHour) ? breakStartHour * 60 + (breakStartMin || 0) : null;
    const breakEndTotalMinutes = !isNaN(breakEndHour) ? breakEndHour * 60 + (breakEndMin || 0) : null;

    const dateObj = new Date(date);
    const workingDays = availability.workingDays || [1, 2, 3, 4, 5];
    if (!override && !workingDays.includes(dateObj.getDay())) return slots;

    const blockedSlots = await getBlockedSlots(date, businessId);
    const slotDuration = duration || availability.defaultDuration || 30; // Use requested duration or default
    const step = slotDuration; // Step matches duration (e.g., 30min slots start at 9:00, 9:30...)

    let currentTotalMinutes = startTotalMinutes;

    while (currentTotalMinutes + slotDuration <= endTotalMinutes) {
        const hour = Math.floor(currentTotalMinutes / 60);
        const min = currentTotalMinutes % 60;
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const slotEndMinutes = currentTotalMinutes + slotDuration;

        // Check break overlap (if break exists)
        let isDuringBreak = false;
        if (breakStartTotalMinutes !== null && breakEndTotalMinutes !== null) {
            // Check if ANY part of the slot falls within the break
            // Overlap logic: (StartA < EndB) && (EndA > StartB)
            isDuringBreak = (currentTotalMinutes < breakEndTotalMinutes) && (slotEndMinutes > breakStartTotalMinutes);
        }

        // Check appointment overlap
        const isBooked = existingAppointments.some(apt => {
            if (apt.status === 'cancelled') return false;
            if (specialistId && apt.specialistId !== specialistId) return false;

            const [aptHour, aptMin] = apt.time.split(':').map(Number);
            const aptStartMinutes = aptHour * 60 + aptMin;
            const aptEndMinutes = aptStartMinutes + apt.duration;

            return (currentTotalMinutes < aptEndMinutes) && (slotEndMinutes > aptStartMinutes);
        });

        // Check blocked slots overlap
        const isBlocked = blockedSlots.some(block => {
            if (specialistId && block.specialistId && block.specialistId !== specialistId) return false;

            const [blockStartH, blockStartM] = block.startTime.split(':').map(Number);
            const [blockEndH, blockEndM] = block.endTime.split(':').map(Number);
            const blockStartMinutes = blockStartH * 60 + blockStartM;
            const blockEndMinutes = blockEndH * 60 + blockEndM;

            return (currentTotalMinutes < blockEndMinutes) && (slotEndMinutes > blockStartMinutes);
        });

        const isPast = new Date(date + 'T' + timeStr) < new Date();

        let reason: 'booked' | 'break' | 'blocked' | 'past' | undefined;
        if (isPast) reason = 'past';
        else if (isDuringBreak) reason = 'break';
        else if (isBooked) reason = 'booked';
        else if (isBlocked) reason = 'blocked';

        slots.push({
            time: timeStr,
            available: !reason,
            reason,
        });

        currentTotalMinutes += step;
    }
    return slots;
}

// ============ DASHBOARD STATS ============

export async function getDashboardStats() {
    const appointments = await getAppointments();
    const today = new Date().toISOString().split('T')[0];

    const next7Days: string[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        next7Days.push(date.toISOString().split('T')[0]);
    }

    const todayAppointments = appointments.filter(a => a.date === today && a.status !== 'cancelled');
    const weekAppointments = appointments.filter(a => next7Days.includes(a.date) && a.status !== 'cancelled');
    const uniqueClients = new Set(appointments.map(a => a.clientPhone)).size;

    const upcoming = appointments
        .filter(a => a.date >= today && a.status !== 'cancelled')
        .sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        })
        .slice(0, 10);

    return {
        todayCount: todayAppointments.length,
        weekCount: weekAppointments.length,
        totalClients: uniqueClients,
        todayAppointments,
        upcomingAppointments: upcoming,
    };
}

// ============ NOTIFICATIONS ============

export async function createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<void> {
    try {
        await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
            ...notification,
            read: false,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

export async function getNotifications(limitCount: number = 20): Promise<Notification[]> {
    try {
        const businessId = getBusinessId();
        const q = query(collection(db, COLLECTIONS.NOTIFICATIONS), where('businessId', '==', businessId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Notification))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limitCount);
    } catch (error) {
        console.error('Error getting notifications:', error);
        return [];
    }
}

export async function markNotificationAsRead(id: string): Promise<void> {
    try {
        await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id), { read: true });
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// ============ WAITLIST OPERATIONS ============

export async function createWaitlistEntry(data: Omit<WaitlistEntry, 'id' | 'createdAt' | 'status'>): Promise<WaitlistEntry> {
    try {
        const entry: any = {
            ...data,
            clientEmail: data.clientEmail || null,
            notes: data.notes || null,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        const docRef = await addDoc(collection(db, COLLECTIONS.WAITLIST), entry);

        await createNotification({
            businessId: data.businessId,
            type: 'system',
            title: 'Kërkesë e Re për Listë Pritjeje',
            message: `${data.clientName} u shtua në listën e pritjes.`,
            relatedId: docRef.id
        });

        return { id: docRef.id, ...entry } as WaitlistEntry;
    } catch (error) {
        console.error('Error creating waitlist entry:', error);
        throw error;
    }
}

export async function getWaitlistEntries(businessId?: string): Promise<WaitlistEntry[]> {
    try {
        const bId = businessId || getBusinessId();
        const q = query(
            collection(db, COLLECTIONS.WAITLIST),
            where('businessId', '==', bId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as WaitlistEntry)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch (error) {
        console.error('Error getting waitlist entries:', error);
        return [];
    }
}

export async function updateWaitlistEntry(id: string, updates: Partial<WaitlistEntry>): Promise<void> {
    try {
        const docRef = doc(db, COLLECTIONS.WAITLIST, id);
        await updateDoc(docRef, updates);
    } catch (error) {
        console.error('Error updating waitlist entry:', error);
        throw error;
    }
}

export async function deleteWaitlistEntry(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, COLLECTIONS.WAITLIST, id));
    } catch (error) {
        console.error('Error deleting waitlist entry:', error);
        throw error;
    }
}

// ============ STORAGE ============

export async function uploadImage(file: File, path: string): Promise<string> {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}
