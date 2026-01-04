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
}

export interface Physiotherapist {
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
    physiotherapistId: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    date: string; // YYYY-MM-DD format
    time: string; // HH:MM format
    duration: number; // in minutes
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    notes?: string;
    createdAt: string;
}

export interface BookingFormData {
    name: string;
    phone: string;
    email?: string;
    date: string;
    time: string;
    duration: number;
    notes?: string;
}

export interface DashboardStats {
    todayAppointments: number;
    weekAppointments: number;
    totalClients: number;
    upcomingAppointments: Appointment[];
}
