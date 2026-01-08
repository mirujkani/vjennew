'use client';

import { useState, useEffect } from 'react';
import { getBusiness, updateBusiness, getSpecialists, addSpecialist, deleteSpecialist } from '@/lib/store';
import { Business, Specialist } from '@/lib/types';
import ImageUpload from '@/components/ui/ImageUpload';

export default function SettingsPage() {
    const [business, setBusiness] = useState<Business | null>(null);
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showAddSpecialist, setShowAddSpecialist] = useState(false);
    const [newSpecialist, setNewSpecialist] = useState<{ name: string, title: string, bio: string, specialties: string, avatar?: string }>({ name: '', title: '', bio: '', specialties: '', avatar: '' });
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        try {
            const [biz, specs] = await Promise.all([
                getBusiness(),
                getSpecialists()
            ]);
            setBusiness(biz);
            setSpecialists(specs);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async () => {
        if (!business) return;
        setIsSaving(true);
        try {
            const updates = { ...business };

            if (!business.urlLocked && business.uniqueLink && business.uniqueLink !== 'myclinic') {
                updates.urlLocked = true;
            }

            await updateBusiness(updates);
            setBusiness(updates);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error saving business:', error);
            alert('Dështoi ruajtja e cilësimeve');
        } finally {
            setIsSaving(false);
        }
    };

    const copyLink = () => {
        if (business) {
            const fullLink = `${window.location.origin}/${business.uniqueLink}`;
            navigator.clipboard.writeText(fullLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleAddSpecialist = async () => {
        if (newSpecialist.name && newSpecialist.title) {
            try {
                await addSpecialist({
                    name: newSpecialist.name,
                    title: newSpecialist.title,
                    bio: newSpecialist.bio,
                    avatar: newSpecialist.avatar,
                    specialties: newSpecialist.specialties.split(',').map(s => s.trim()).filter(s => s),
                });
                await loadData();
                setNewSpecialist({ name: '', title: '', bio: '', specialties: '' });
                setShowAddSpecialist(false);
            } catch (error) {
                console.error('Error adding specialist:', error);
                alert('Dështoi shtimi i specialistit');
            }
        }
    };

    const handleDeleteSpecialist = async (id: string) => {
        if (specialists.length <= 1) {
            alert('Duhet të keni të paktën një specialist.');
            return;
        }
        if (confirm('A jeni të sigurt që doni të fshini këtë specialist?')) {
            try {
                await deleteSpecialist(id);
                await loadData();
            } catch (error) {
                console.error('Error deleting specialist:', error);
                alert('Dështoi fshirja e specialistit');
            }
        }
    };

    if (isLoading || !business) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>Cilësimet e Biznesit</h1>

            {/* Booking Link */}
            <div className="card" style={{
                marginBottom: 'var(--space-6)',
                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
            }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Linku i Rezervimeve</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    Ndani këtë link me klientët tuaj që të mund të rezervojnë termine.
                </p>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    marginBottom: 'var(--space-4)',
                    flexWrap: 'wrap',
                }}>
                    <div style={{
                        flex: 1,
                        minWidth: '250px',
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg-secondary)',
                        padding: 'var(--space-3) var(--space-4)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-color)',
                    }}>
                        <span style={{ color: 'var(--text-muted)', marginRight: 'var(--space-1)' }}>
                            {typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com'}/
                        </span>
                        <span style={{ color: 'var(--color-primary-400)', fontWeight: 'var(--font-medium)' }}>
                            {business.uniqueLink}
                        </span>
                    </div>
                    <button className="btn btn-primary" onClick={copyLink}>
                        {copied ? (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                    <polyline points="22,4 12,14.01 9,11.01" />
                                </svg>
                                U kopjua!
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                </svg>
                                Kopjo Linkun
                            </>
                        )}
                    </button>
                </div>

                <div className="form-group" style={{ margin: 0, maxWidth: '400px' }}>
                    <label className="form-label" htmlFor="uniqueLink">
                        Përshtatni Linkun Unik
                        {business.urlLocked && <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>(I kyçur)</span>}
                    </label>
                    <input
                        id="uniqueLink"
                        type="text"
                        className="form-input"
                        value={business.uniqueLink}
                        onChange={(e) => !business.urlLocked && setBusiness({ ...business, uniqueLink: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        placeholder="linku-juaj-unik"
                        disabled={business.urlLocked}
                        style={business.urlLocked ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                    />
                    {!business.urlLocked && business.uniqueLink !== 'myclinic' && (
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning-500)', marginTop: 'var(--space-2)' }}>
                            Kujdes: Pas ruajtjes, ky link do të kyçet dhe nuk mund të ndryshohet më.
                        </p>
                    )}
                </div>
            </div>

            {/* Business Information */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-6)',
                }}>
                    <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Informacionet e Biznesit</h2>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <span className="spinner" style={{ width: '16px', height: '16px' }} />
                                Duke ruajtur...
                            </>
                        ) : saved ? (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                    <polyline points="22,4 12,14.01 9,11.01" />
                                </svg>
                                U ruajt!
                            </>
                        ) : (
                            'Ruaj Ndryshimet'
                        )}
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 'var(--space-6)',
                }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <ImageUpload
                            label="Logo e Biznesit"
                            currentImage={business.logo}
                            onImageUploaded={(url) => setBusiness({ ...business, logo: url })}
                            directory="business-logos"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="businessName">Emri i Biznesit</label>
                        <input
                            id="businessName"
                            type="text"
                            className="form-input"
                            value={business.name}
                            onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="phone">Numri i Telefonit</label>
                        <input
                            id="phone"
                            type="tel"
                            className="form-input"
                            value={business.phone}
                            onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Adresa</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={business.email}
                            onChange={(e) => setBusiness({ ...business, email: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="address">Adresa</label>
                        <input
                            id="address"
                            type="text"
                            className="form-input"
                            value={business.address}
                            onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
                    <label className="form-label" htmlFor="description">Përshkrimi i Biznesit</label>
                    <textarea
                        id="description"
                        className="form-input form-textarea"
                        value={business.description}
                        onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                        rows={3}
                        placeholder="Përshkruani biznesin tuaj..."
                    />
                </div>
            </div>

            {/* Specialists */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-4)',
                }}>
                    <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Specialistët</h2>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowAddSpecialist(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Shto të ri
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {specialists.map((spec) => (
                        <div key={spec.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-4)',
                            padding: 'var(--space-4)',
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border-color)',
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'var(--gradient-accent)',
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <span style={{ color: 'white', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>
                                    {spec.name.charAt(0)}
                                </span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                                    {spec.name}
                                </div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                    {spec.title}
                                </div>
                            </div>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => handleDeleteSpecialist(spec.id)}
                                style={{ color: 'var(--color-error-500)' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3,6 5,6 21,6" />
                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add Specialist Modal */}
                {showAddSpecialist && (
                    <div className="modal-overlay" onClick={() => setShowAddSpecialist(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 style={{ margin: 0 }}>Shto Specialist</h3>
                                <button className="btn btn-ghost btn-icon" onClick={() => setShowAddSpecialist(false)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                            <div className="modal-body">
                                <ImageUpload
                                    label="Foto e Profilit"
                                    currentImage={newSpecialist.avatar}
                                    onImageUploaded={(url) => setNewSpecialist({ ...newSpecialist, avatar: url })}
                                    directory="specialist-avatars"
                                    circular={true}
                                />
                                <div className="form-group">
                                    <label className="form-label">Emri *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newSpecialist.name}
                                        onChange={(e) => setNewSpecialist({ ...newSpecialist, name: e.target.value })}
                                        placeholder="Emri Mbiemri"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Titulli *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newSpecialist.title}
                                        onChange={(e) => setNewSpecialist({ ...newSpecialist, title: e.target.value })}
                                        placeholder="Kosmetologe, Parukier etj."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea
                                        className="form-input form-textarea"
                                        value={newSpecialist.bio}
                                        onChange={(e) => setNewSpecialist({ ...newSpecialist, bio: e.target.value })}
                                        placeholder="Përshkrim i shkurtër..."
                                        rows={3}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Shërbimet (të ndara me presje)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newSpecialist.specialties}
                                        onChange={(e) => setNewSpecialist({ ...newSpecialist, specialties: e.target.value })}
                                        placeholder="Grim, Prerje Flokësh etj."
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowAddSpecialist(false)}>Anulo</button>
                                <button className="btn btn-primary" onClick={handleAddSpecialist}>Shto</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
