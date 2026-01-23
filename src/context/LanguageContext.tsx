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
        'common.back': 'Back',
        'common.close': 'Close',
        'common.powered_by': 'Powered by',
        'booking.select_date': 'Select Date',
        'booking.select_time': 'Select Time',
        'booking.select_specialist': 'Select Specialist',
        'booking.select_service': 'Select Service',
        'booking.business_not_found': 'Business not found',
        'booking.link_expired': 'The link you are looking for may be incorrect or has expired.',
        'booking.return_home': 'Return to Home Page',
        'booking.waitlist_prompt': 'Would you like to join the waitlist?',
        'booking.waitlist_desc': 'We will notify you if your preferred time becomes available again.',
        'booking.waitlist_selected': 'You have selected:',
        'booking.waitlist_select_prompt': 'Select the times above for which you want to be notified.',
        'booking.continue_waitlist': 'Continue with Waitlist',
        'booking.confirm_title': 'Confirm Appointment',
        'booking.confirm_waitlist_title': 'Join Waitlist',
        'booking.your_info': 'Your Information',
        'booking.full_name': 'Full Name',
        'booking.phone_number': 'Phone Number',
        'booking.email_optional': 'Email (Optional)',
        'booking.notes_optional': 'Notes (Optional)',
        'booking.name_placeholder': 'e.g. John Doe',
        'booking.notes_placeholder': 'Any specific requests...',
        'booking.confirm_booking': 'Confirm Booking',
        'booking.join_waitlist': 'Join Waitlist',
        'booking.processing': 'Processing...',
        'booking.success_title': 'Appointment Confirmed!',
        'booking.waitlist_success_title': 'Added to Waitlist!',
        'booking.success_message': 'Your appointment has been successfully booked. We look forward to seeing you!',
        'booking.waitlist_success_message': 'You have been added to the waitlist. We will notify you if a slot becomes available.',
        'booking.book_another': 'Book Another Appointment',
        'booking.summary_service': 'Service',
        'booking.summary_specialist': 'Specialist',
        'booking.summary_date': 'Date',
        'booking.summary_time': 'Time',
        'booking.summary_duration': 'Duration',
        'booking.summary_price': 'Price',
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
        'common.back': 'Kthehu',
        'common.close': 'Mbyll',
        'common.powered_by': 'Mundësuar nga',
        'booking.select_date': 'Zgjidhni Datën',
        'booking.select_time': 'Zgjidhni Orën',
        'booking.select_specialist': 'Zgjidhni Specialistin',
        'booking.select_service': 'Zgjidhni Shërbimin',
        'booking.business_not_found': 'Biznesi nuk u gjet',
        'booking.link_expired': 'Linku që kërkoni mund të jetë i pasaktë ose ka skaduar.',
        'booking.return_home': 'Kthehu në Faqen Kryesore',
        'booking.waitlist_prompt': 'Dëshironi të hyni në listën e pritjes?',
        'booking.waitlist_desc': 'Ne do t\'ju njoftojmë nëse koha juaj e preferuar bëhet e disponueshme.',
        'booking.waitlist_selected': 'Keni zgjedhur:',
        'booking.waitlist_select_prompt': 'Zgjidhni orët më lart për të cilat dëshironi të njoftoheni.',
        'booking.continue_waitlist': 'Vazhdo me Listën e Pritjes',
        'booking.confirm_title': 'Konfirmo Takimin',
        'booking.confirm_waitlist_title': 'Hyni në Listën e Pritjes',
        'booking.your_info': 'Të dhënat tuaja',
        'booking.full_name': 'Emri dhe Mbiemri',
        'booking.phone_number': 'Numri i Telefonit',
        'booking.email_optional': 'Email (Opsionale)',
        'booking.notes_optional': 'Shënime (Opsionale)',
        'booking.name_placeholder': 'p.sh. Agon Gashi',
        'booking.notes_placeholder': 'Kërkesa specifike...',
        'booking.confirm_booking': 'Konfirmo Rezervimin',
        'booking.join_waitlist': 'Hyni në Listën e Pritjes',
        'booking.processing': 'Duke procesuar...',
        'booking.success_title': 'Takimi u Konfirmua!',
        'booking.waitlist_success_title': 'U shtuat në Listën e Pritjes!',
        'booking.success_message': 'Takimi juaj është rezervuar me sukses. Shihemi së shpejti!',
        'booking.waitlist_success_message': 'Ju jeni shtuar në listën e pritjes. Ne do t\'ju njoftojmë nëse lirohet ndonjë orar.',
        'booking.book_another': 'Rezervo një tjetër',
        'booking.summary_service': 'Shërbimi',
        'booking.summary_specialist': 'Specialisti',
        'booking.summary_date': 'Data',
        'booking.summary_time': 'Ora',
        'booking.summary_duration': 'Kohëzgjatja',
        'booking.summary_price': 'Çmimi',
    },
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
