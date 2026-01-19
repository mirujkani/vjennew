import { useState, useEffect, useRef } from 'react';
import { getNotifications, markNotificationAsRead, getBusiness } from '@/lib/store';
import { Notification } from '@/lib/types';

const NOTIFICATION_SOUND_URL = 'https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const previousUnreadCountRef = useRef(0);
    const firstLoadRef = useRef(true);

    const loadNotifications = async () => {
        try {
            const [data, business] = await Promise.all([
                getNotifications(10),
                getBusiness()
            ]);

            const newUnreadCount = data.filter(n => !n.read).length;

            if (firstLoadRef.current) {
                firstLoadRef.current = false;
                previousUnreadCountRef.current = newUnreadCount;
                setNotifications(data);
                setUnreadCount(newUnreadCount);
                return;
            }

            // Play sound if new notification arrived (count increased) AND sound is enabled
            if (newUnreadCount > previousUnreadCountRef.current && business?.notificationSound) {
                const audio = new Audio(NOTIFICATION_SOUND_URL);
                audio.play().catch(e => console.error('Error playing notification sound:', e));
            }

            previousUnreadCountRef.current = newUnreadCount;
            setNotifications(data);
            setUnreadCount(newUnreadCount);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    useEffect(() => {
        loadNotifications();
        // Poll every 30 seconds for new notifications
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
        const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
        setNotifications(updated);
        setUnreadCount(updated.filter(n => !n.read).length);
    };

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
                className="btn btn-ghost btn-icon"
                onClick={() => setIsOpen(!isOpen)}
                style={{ position: 'relative' }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '8px',
                        height: '8px',
                        background: 'var(--color-error-500)',
                        borderRadius: '50%',
                        border: '1px solid var(--bg-primary)'
                    }} />
                )}
            </button>

            {isOpen && (
                <div className="card" style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    width: '320px',
                    padding: 0,
                    zIndex: 100,
                    marginTop: 'var(--space-2)',
                    boxShadow: 'var(--shadow-lg)',
                    maxHeight: '400px',
                    overflowY: 'auto',
                }}>
                    <div style={{
                        padding: 'var(--space-3) var(--space-4)',
                        borderBottom: '1px solid var(--border-color)',
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span>Njoftimet</span>
                        <button
                            onClick={loadNotifications}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-500)', fontSize: '12px' }}
                        >
                            Rifresko
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                Nuk ka njoftime të reja
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    style={{
                                        padding: 'var(--space-3) var(--space-4)',
                                        borderBottom: '1px solid var(--border-color)',
                                        background: notification.read ? 'transparent' : 'rgba(20, 184, 166, 0.05)',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                                >
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: notification.read ? 'normal' : 'bold', marginBottom: 'var(--space-1)' }}>
                                        {notification.title}
                                    </div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                                        {notification.message}
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                        {new Date(notification.createdAt).toLocaleString('sq-AL')}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
