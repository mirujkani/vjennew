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
