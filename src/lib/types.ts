// Core types for the Vjen appointment scheduling platform

export interface Business {
    id: string;
    name: string;
    logo?: string;
    address: string;
    phone: string;
    email: string;
    description?: string;
    uniqueLink: string;
    urlLocked?: boolean;
}

export interface Specialist {
    id: string;
    businessId: string;
    name: string;
    title: string;
    avatar?: string;
    bio?: string;
    specialties: string[];
}

export interface Availability {
    businessId: string;
    workingDays: number[]; // 0 = Sunday, 1 = Monday, etc.
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    breakStart?: string;
    breakEnd?: string;
    appointmentDurations: number[]; // in minutes
    defaultDuration: number;
}

export interface TimeSlot {
    time: string; // HH:MM format
    available: boolean;
    appointmentId?: string;
}

export interface Appointment {
    id: string;
    businessId: string;
    specialistId: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    date: string; // YYYY-MM-DD format
    time: string; // HH:MM format
    duration: number; // in minutes
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    verificationMethod: 'whatsapp' | 'sms';
    notes?: string;
    createdAt: string;
    recurring?: {
        type: 'weekly' | 'biweekly' | 'monthly';
        parentId?: string; // ID of the first appointment in the series
    };
}

export interface BookingFormData {
    name: string;
    phone: string;
    email?: string;
    date: string;
    time: string;
    duration: number;
    verificationMethod: 'whatsapp' | 'sms';
    notes?: string;
    recurringType?: 'none' | 'weekly' | 'biweekly' | 'monthly';
}

export interface DashboardStats {
    todayAppointments: number;
    weekAppointments: number;
    totalClients: number;
    upcomingAppointments: Appointment[];
}

export interface Notification {
    id: string;
    businessId: string;
    type: 'new_appointment' | 'cancellation' | 'confirmation' | 'reminder_sent' | 'system';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    relatedId?: string; // appointment ID usually
}

export interface AvailabilityOverride {
    id: string;
    businessId: string;
    date: string; // YYYY-MM-DD
    isOff: boolean;
    startTime: string;
    endTime: string;
}

export interface BlockedSlot {
    id: string;
    businessId: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    reason?: string;
    createdAt: string;
}
export interface WaitlistEntry {
    id: string;
    businessId: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    preferredDates: string[]; // YYYY-MM-DD
    preferredTimes: string[]; // HH:MM
    status: 'pending' | 'notified' | 'assigned' | 'cancelled';
    notes?: string;
    createdAt: string;
}
