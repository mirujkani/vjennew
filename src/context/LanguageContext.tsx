'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'sq';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translation dictionary for now - can be moved to separate files later
const translations = {
    en: {
        'settings.title': 'Business Settings',
        'settings.save': 'Save Changes',
        'settings.saving': 'Saving...',
        'settings.saved': 'Saved!',
        'settings.language': 'Language',
        'settings.language_desc': 'Choose your preferred language for the dashboard.',
        'common.cancel': 'Cancel',
        'common.add': 'Add',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'booking.title': 'Booking Link',
        'booking.desc': 'Share this link with your clients so they can book appointments.',
        'booking.copy': 'Copy Link',
        'booking.copied': 'Copied!',
        'booking.customize': 'Customize Unique Link',
        'booking.locked': '(Locked)',
        'booking.warning': 'Warning: After saving, this link will be locked and cannot be changed.',
        'business.info_title': 'Business Information',
        'business.name': 'Business Name',
        'business.phone': 'Phone Number',
        'business.address': 'Address',
        'business.desc': 'Description',
        'business.logo': 'Business Logo',
        'services.title': 'Services and Pricing',
        'services.desc': 'Enable to display services on your booking page',
        'services.empty': 'You have no services added. Add your services below.',
        'services.add': 'Add Service',
        'services.modal_title': 'Add Service',
        'services.name_label': 'Service Name *',
        'services.price_label': 'Price (€) *',
        'services.desc_label': 'Description (optional)',
        'notifications.title': 'Notifications',
        'notifications.desc': 'Enable sound for new notifications',
        'specialists.title': 'Specialists',
        'specialists.add': 'Add New',
        'specialists.modal_title': 'Add Specialist',
        'specialists.profile_photo': 'Profile Photo',
        'specialists.name_label': 'Name *',
        'specialists.title_label': 'Title *',
        'specialists.bio_label': 'Bio',
        'specialists.services_label': 'Services (comma separated)',
        'appointments.duration_title': 'Appointment Duration',
        'appointments.duration_desc': 'Set the standard length of your appointments (in minutes).',
        'common.or_custom': 'or custom:',
        'common.min': 'min',
    },
    sq: {
        'settings.title': 'Cilësimet e Biznesit',
        'settings.save': 'Ruaj Ndryshimet',
        'settings.saving': 'Duke ruajtur...',
        'settings.saved': 'U ruajt!',
        'settings.language': 'Gjuha',
        'settings.language_desc': 'Zgjidhni gjuhën e preferuar për panelin.',
        'common.cancel': 'Anullo',
        'common.add': 'Shto',
        'common.delete': 'Fshi',
        'common.edit': 'Ndrysho',
        'booking.title': 'Linku i Rezervimeve',
        'booking.desc': 'Ndani këtë link me klientët tuaj që të mund të rezervojnë termine.',
        'booking.copy': 'Kopjo Linkun',
        'booking.copied': 'U kopjua!',
        'booking.customize': 'Përshtat Linkun Unik',
        'booking.locked': '(I Kyçur)',
        'booking.warning': 'Kujdes: Pas ruajtjes, ky link do të kyçet dhe nuk mund të ndryshohet më.',
        'business.info_title': 'Informatat e Biznesit',
        'business.name': 'Emri i Biznesit',
        'business.phone': 'Numri i Telefonit',
        'business.address': 'Adresa',
        'business.desc': 'Përshkrimi',
        'business.logo': 'Logo e Biznesit',
        'services.title': 'Shërbimet dhe Çmimet',
        'services.desc': 'Aktivizo për të shfaqur shërbimet në faqen e rezervimeve',
        'services.empty': 'Nuk keni shtuar asnjë shërbim. Shtoni shërbimet më poshtë.',
        'services.add': 'Shto Shërbim',
        'services.modal_title': 'Shto Shërbim',
        'services.name_label': 'Emri i Shërbimit *',
        'services.price_label': 'Çmimi (€) *',
        'services.desc_label': 'Përshkrimi (opsionale)',
        'notifications.title': 'Njoftimet',
        'notifications.desc': 'Aktivizo zërin për njoftimet e reja',
        'specialists.title': 'Specialistët',
        'specialists.add': 'Shto të Ri',
        'specialists.modal_title': 'Shto Specialist',
        'specialists.profile_photo': 'Foto e Profilit',
        'specialists.name_label': 'Emri *',
        'specialists.title_label': 'Titulli *',
        'specialists.bio_label': 'Biografia',
        'specialists.services_label': 'Shërbimet (të ndara me presje)',
        'appointments.duration_title': 'Kohëzgjatja e Takimit',
        'appointments.duration_desc': 'Caktoni gjatësinë standarde të takimeve tuaja (në minuta).',
        'common.or_custom': 'ose tjetër:',
        'common.min': 'min',
    }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en'); // Default to English initially
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedLang = localStorage.getItem('vjen_language') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'sq')) {
            setLanguage(savedLang);
        }
        setMounted(true);
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('vjen_language', lang);
    };

    const t = (key: string) => {
        const langData = translations[language] as Record<string, string>;
        return langData[key] || key;
    };

    if (!mounted) {
        return <>{children}</>; // Render children without context initially to avoid hydration mismatch, or loading spinner
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
