'use client';

import { useState } from 'react';

interface CalendarPickerProps {
    selectedDate: string | null;
    onDateSelect: (date: string) => void;
    workingDays: number[];
}

export default function CalendarPicker({
    selectedDate,
    onDateSelect,
    workingDays = [1, 2, 3, 4, 5],
}: CalendarPickerProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthNames = [
        'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
        'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'
    ];

    const weekDays = ['Die', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days: (number | null)[] = [];

        // Add empty cells for days before the first of the month
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        // Add the days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const isDateDisabled = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Disable past dates
        if (date < today) return true;

        // Disable non-working days
        const dayOfWeek = date.getDay();
        const safeWorkingDays = Array.isArray(workingDays) ? workingDays : [1, 2, 3, 4, 5];
        return !safeWorkingDays.includes(dayOfWeek);
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (day: number) => {
        if (!selectedDate) return false;
        const dateStr = formatDate(day);
        return dateStr === selectedDate;
    };

    const formatDate = (day: number) => {
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `${year}-${month}-${dayStr}`;
    };

    const handleDateClick = (day: number) => {
        if (isDateDisabled(day)) return;
        onDateSelect(formatDate(day));
    };

    const days = getDaysInMonth(currentMonth);

    // Check if we can go to previous month (not before current month)
    const canGoPrevious = () => {
        const today = new Date();
        return (
            currentMonth.getFullYear() > today.getFullYear() ||
            (currentMonth.getFullYear() === today.getFullYear() &&
                currentMonth.getMonth() > today.getMonth())
        );
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button
                    className="calendar-nav-btn"
                    onClick={goToPreviousMonth}
                    disabled={!canGoPrevious()}
                    style={{ opacity: canGoPrevious() ? 1 : 0.3 }}
                    aria-label="Muaji i kaluar"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15,18 9,12 15,6" />
                    </svg>
                </button>

                <span className="calendar-month-year">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>

                <button
                    className="calendar-nav-btn"
                    onClick={goToNextMonth}
                    aria-label="Muaji tjetër"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,18 15,12 9,6" />
                    </svg>
                </button>
            </div>

            <div className="calendar-weekdays">
                {weekDays.map((day) => (
                    <div key={day} className="calendar-weekday">
                        {day}
                    </div>
                ))}
            </div>

            <div className="calendar-days">
                {days.map((day, index) => (
                    <button
                        key={index}
                        className={`calendar-day ${day === null ? 'calendar-day-empty' : ''
                            } ${day !== null && isDateDisabled(day) ? 'calendar-day-disabled' : ''
                            } ${day !== null && isToday(day) ? 'calendar-day-today' : ''
                            } ${day !== null && isSelected(day) ? 'calendar-day-selected' : ''
                            }`}
                        onClick={() => day !== null && handleDateClick(day)}
                        disabled={day === null || isDateDisabled(day)}
                        style={{ position: 'relative' }}
                    >
                        {day}
                    </button>
                ))}
            </div>
        </div>
    );
}
