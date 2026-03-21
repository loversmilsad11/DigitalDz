'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'صورة المنتج' }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('الرجاء اختيار صورة صالحة');
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onChange(base64);
      setIsLoading(false);
    };
    reader.onerror = () => {
      setIsLoading(false);
      alert('فشل في قراءة الملف');
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground-muted)' }}>
        {label}
      </label>
      
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '200px',
          borderRadius: '1rem',
          border: '2px dashed',
          borderColor: isDragging ? '#e879f9' : 'rgba(255, 255, 255, 0.1)',
          backgroundColor: isDragging ? 'rgba(232, 121, 249, 0.05)' : 'rgba(255, 255, 255, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          overflow: 'hidden'
        }}
        className="group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        <AnimatePresence mode="wait">
          {value ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            >
              <img
                src={value}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '180px',
                  borderRadius: '0.525rem',
                  objectFit: 'contain',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                }}
              />
              <button
                type="button"
                onClick={removeImage}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  backgroundColor: 'rgba(244, 63, 94, 0.9)',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '0.4rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#f43f5e'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.9)'}
              >
                <X size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ textAlign: 'center', padding: '2rem' }}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" style={{ color: '#e879f9', margin: '0 auto 1rem' }} size={40} />
              ) : (
                <>
                  <div style={{ 
                    backgroundColor: 'rgba(232, 121, 249, 0.1)', 
                    color: '#e879f9', 
                    borderRadius: '50%', 
                    width: '64px', 
                    height: '64px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 1.5rem',
                    transition: 'transform 0.3s ease'
                  }}>
                    <Upload size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                    اسحب وأفلت الصورة هنا
                  </h3>
                  <p style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem' }}>
                    أو انقر لاختيار ملف من جهازك
                  </p>
                  <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: '#e879f9', fontSize: '0.8125rem', fontWeight: '500' }}>
                    <ImageIcon size={16} /> يدعم: JPG, PNG, WEBP
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
