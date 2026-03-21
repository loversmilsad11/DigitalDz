'use client';
import { useTranslations, useFormatter } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Zap } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  currency: string;
  addToCartLabel: string;
  image?: string;
}

export default function ProductCard({ name, description, price, slug, currency, addToCartLabel, image }: ProductCardProps) {
  const format = useFormatter();

  return (
    <div 
      className="glass-morphism group" 
      style={{ 
        padding: '1rem', 
        borderRadius: '2rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden'
      }} 
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232, 121, 249, 0.3)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(232, 121, 249, 0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.05)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Image Container */}
      <div style={{ 
        height: 220, 
        background: image ? 'rgba(0,0,0,0.2)' : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', 
        borderRadius: '1.5rem', 
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {image ? (
          <img 
            src={image} 
            alt={name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              transition: 'transform 0.7s ease' 
            }} 
            className="group-hover:scale-110"
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Zap size={48} style={{ color: 'rgba(232, 121, 249, 0.5)', marginBottom: '0.5rem' }} />
            <span className="title-font" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{name}</span>
          </div>
        )}
        
        {/* Instant Delivery Badge */}
        <div style={{ 
          position: 'absolute', 
          top: '1rem', 
          right: '1rem', 
          backgroundColor: 'rgba(10, 10, 12, 0.6)', 
          backdropFilter: 'blur(10px)',
          color: '#e879f9',
          padding: '0.4rem 0.8rem',
          borderRadius: '2rem',
          fontSize: '0.7rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          border: '1px solid rgba(232, 121, 249, 0.3)'
        }}>
          <Zap size={12} fill="currentColor" /> تسليم فوري
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 0.5rem 0.5rem' }}>
        <h3 className="title-font" style={{ 
          fontSize: '1.25rem', 
          marginBottom: '0.5rem', 
          fontWeight: 800,
          color: 'white',
          lineHeight: 1.3
        }}>
          {name}
        </h3>
        <p style={{ 
          color: 'var(--foreground-muted)', 
          marginBottom: '1.5rem', 
          fontSize: '0.85rem', 
          lineHeight: 1.5,
          height: '2.5rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {description}
        </p>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: 'auto',
          backgroundColor: 'rgba(255,255,255,0.03)',
          padding: '0.75rem 1rem',
          borderRadius: '1.25rem',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>السعر</span>
            <span className="title-font" style={{ fontWeight: 900, fontSize: '1.25rem', color: 'white' }}>
              {format.number(price)} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#e879f9' }}>{currency}</span>
            </span>
          </div>
          <button 
            className="btn-primary" 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              padding: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(192, 38, 211, 0.4)'
            }}
            title={addToCartLabel}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
