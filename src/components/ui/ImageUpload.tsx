import React, { useState, useRef } from 'react';
import { uploadImage } from '@/lib/store';

interface ImageUploadProps {
    label: string;
    currentImage?: string;
    onImageUploaded: (url: string) => void;
    directory: string; // 'business-logos' or 'physio-avatars'
    circular?: boolean;
    className?: string;
}

export default function ImageUpload({
    label,
    currentImage,
    onImageUploaded,
    directory,
    circular = false,
    className = '',
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('File is too large (max 5MB)');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Optimistic preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setIsUploading(true);

        try {
            // Create a unique path: directory/timestamp-filename
            const timestamp = Date.now();
            const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
            const path = `${directory}/${timestamp}-${safeName}`;

            const url = await uploadImage(file, path);
            onImageUploaded(url);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
            setPreview(currentImage); // Revert
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={`form-group ${className}`}>
            <label className="form-label">{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        width: circular ? '80px' : '120px',
                        height: '80px',
                        borderRadius: circular ? '50%' : 'var(--radius-lg)',
                        background: 'var(--bg-tertiary)',
                        border: '2px dashed var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0,
                    }}
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt={label}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto' }}>
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                        </div>
                    )}

                    {isUploading && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div className="spinner" style={{ width: '24px', height: '24px', borderColor: 'white', borderTopColor: 'transparent' }} />
                        </div>
                    )}
                </div>

                <div>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Zgjidh Foto'}
                    </button>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                        Max 5MB. JPG, PNG, WebP.
                    </p>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
}
