// Mock data for the Vjen platform demo

import { Business, Physiotherapist, Availability, Appointment } from './types';

export const mockBusinesses: Business[] = [
    {
        id: 'physio123',
        name: 'PhysioWell Clinic',
        logo: '/images/logo-placeholder.svg',
        address: '123 Health Street, Amsterdam, Netherlands',
        phone: '+31 20 123 4567',
        email: 'info@physiowell.nl',
        description: 'Professional physiotherapy services for all your recovery needs.',
        uniqueLink: 'physio123',
    },
    {
        id: 'wellness-center',
        name: 'Active Recovery Center',
        logo: '/images/logo-placeholder.svg',
        address: '456 Wellness Ave, Rotterdam, Netherlands',
        phone: '+31 10 987 6543',
        email: 'contact@activerecovery.nl',
        description: 'Specialized in sports rehabilitation and chronic pain management.',
        uniqueLink: 'wellness-center',
    },
];

export const mockPhysiotherapists: Physiotherapist[] = [
    {
        id: 'pt-1',
        businessId: 'physio123',
        name: 'Dr. Sarah van der Berg',
        title: 'Senior Physiotherapist',
        bio: 'Specialized in sports injuries and post-operative rehabilitation with 15+ years of experience.',
        specialties: ['Sports Injuries', 'Post-Surgery Rehab', 'Manual Therapy'],
    },
    {
        id: 'pt-2',
        businessId: 'physio123',
        name: 'Mark de Vries',
        title: 'Physiotherapist',
        bio: 'Expert in chronic pain management and ergonomic consultations.',
        specialties: ['Chronic Pain', 'Workplace Ergonomics', 'Dry Needling'],
    },
    {
        id: 'pt-3',
        businessId: 'wellness-center',
        name: 'Lisa Jansen',
        title: 'Lead Physiotherapist',
        bio: 'Dedicated to helping athletes achieve peak performance through targeted rehabilitation.',
        specialties: ['Athletic Performance', 'Injury Prevention', 'Sports Massage'],
    },
];

export const mockAvailability: Availability[] = [
    {
        businessId: 'physio123',
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday
        startTime: '09:00',
        endTime: '18:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        appointmentDurations: [15, 30, 45, 60],
        defaultDuration: 30,
    },
    {
        businessId: 'wellness-center',
        workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
        startTime: '08:00',
        endTime: '20:00',
        breakStart: '13:00',
        breakEnd: '14:00',
        appointmentDurations: [30, 60],
        defaultDuration: 60,
    },
];

// Generate dates for the next 30 days
const generateDates = () => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
};

export const mockAppointments: Appointment[] = [
    {
        id: 'apt-1',
        businessId: 'physio123',
        physiotherapistId: 'pt-1',
        clientName: 'Jan Bakker',
        clientPhone: '+31 6 1234 5678',
        clientEmail: 'jan.bakker@email.com',
        date: generateDates()[0], // Today
        time: '09:00',
        duration: 30,
        status: 'confirmed',
        notes: 'Follow-up for knee rehabilitation',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'apt-2',
        businessId: 'physio123',
        physiotherapistId: 'pt-1',
        clientName: 'Emma de Groot',
        clientPhone: '+31 6 2345 6789',
        clientEmail: 'emma.degroot@email.com',
        date: generateDates()[0], // Today
        time: '10:30',
        duration: 45,
        status: 'confirmed',
        notes: 'Initial consultation - lower back pain',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'apt-3',
        businessId: 'physio123',
        physiotherapistId: 'pt-2',
        clientName: 'Pieter Visser',
        clientPhone: '+31 6 3456 7890',
        date: generateDates()[1], // Tomorrow
        time: '14:00',
        duration: 30,
        status: 'pending',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'apt-4',
        businessId: 'physio123',
        physiotherapistId: 'pt-1',
        clientName: 'Anna Smit',
        clientPhone: '+31 6 4567 8901',
        clientEmail: 'anna.smit@email.com',
        date: generateDates()[2],
        time: '11:00',
        duration: 60,
        status: 'confirmed',
        notes: 'Sports injury evaluation',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'apt-5',
        businessId: 'physio123',
        physiotherapistId: 'pt-2',
        clientName: 'Lucas Brouwer',
        clientPhone: '+31 6 5678 9012',
        date: generateDates()[3],
        time: '15:30',
        duration: 30,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
    },
];

// Helper functions
export function getBusinessById(id: string): Business | undefined {
    return mockBusinesses.find((b) => b.id === id || b.uniqueLink === id);
}

export function getPhysiotherapistsByBusiness(businessId: string): Physiotherapist[] {
    return mockPhysiotherapists.filter((p) => p.businessId === businessId);
}

export function getAvailabilityByBusiness(businessId: string): Availability | undefined {
    return mockAvailability.find((a) => a.businessId === businessId);
}

export function getAppointmentsByBusiness(businessId: string): Appointment[] {
    return mockAppointments.filter((a) => a.businessId === businessId);
}

export function getAppointmentsByDate(businessId: string, date: string): Appointment[] {
    return mockAppointments.filter((a) => a.businessId === businessId && a.date === date);
}

export function generateTimeSlots(
    availability: Availability,
    date: string,
    existingAppointments: Appointment[]
): { time: string; available: boolean }[] {
    const slots: { time: string; available: boolean }[] = [];
    const [startHour, startMin] = availability.startTime.split(':').map(Number);
    const [endHour, endMin] = availability.endTime.split(':').map(Number);
    const [breakStartHour, breakStartMin] = availability.breakStart
        ? availability.breakStart.split(':').map(Number)
        : [null, null];
    const [breakEndHour, breakEndMin] = availability.breakEnd
        ? availability.breakEnd.split(':').map(Number)
        : [null, null];

    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();

    // Check if this day is a working day
    if (!availability.workingDays.includes(dayOfWeek)) {
        return slots;
    }

    const duration = availability.defaultDuration;
    let currentHour = startHour;
    let currentMin = startMin;

    while (
        currentHour < endHour ||
        (currentHour === endHour && currentMin < endMin)
    ) {
        const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;

        // Check if slot is during break
        let isDuringBreak = false;
        if (breakStartHour !== null && breakEndHour !== null) {
            const currentMinutes = currentHour * 60 + currentMin;
            const breakStartMinutes = breakStartHour * 60 + (breakStartMin || 0);
            const breakEndMinutes = breakEndHour * 60 + (breakEndMin || 0);
            isDuringBreak = currentMinutes >= breakStartMinutes && currentMinutes < breakEndMinutes;
        }

        // Check if slot is already booked
        const isBooked = existingAppointments.some((apt) => apt.time === timeStr);

        // Check if slot is in the past
        const now = new Date();
        const slotDate = new Date(date);
        slotDate.setHours(currentHour, currentMin);
        const isPast = slotDate < now;

        slots.push({
            time: timeStr,
            available: !isDuringBreak && !isBooked && !isPast,
        });

        // Increment by slot duration
        currentMin += duration;
        if (currentMin >= 60) {
            currentHour += Math.floor(currentMin / 60);
            currentMin = currentMin % 60;
        }
    }

    return slots;
}
