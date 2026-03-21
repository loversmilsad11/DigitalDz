'use client';

export const SkeletonCard = () => (
  <div 
    className="glass-morphism" 
    style={{ 
      padding: '1rem', 
      borderRadius: '2rem',
      height: '420px',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      overflow: 'hidden',
      position: 'relative'
    }}
  >
    {/* Skeleton Shimmer */}
    <div className="skeleton-shimmer" style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
      animation: 'shimmer 1.5s infinite linear'
    }} />

    <div style={{ 
      height: 220, 
      backgroundColor: 'rgba(255,255,255,0.03)', 
      borderRadius: '1.5rem', 
      marginBottom: '1.25rem' 
    }} />
    
    <div style={{ height: '1.5rem', width: '70%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', marginBottom: '0.5rem' }} />
    <div style={{ height: '1rem', width: '90%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', marginBottom: '0.25rem' }} />
    <div style={{ height: '1rem', width: '40%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', marginBottom: '1.5rem' }} />
    
    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ height: '2rem', width: '80px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem' }} />
      <div style={{ height: '40px', width: '40px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
    </div>
  </div>
);

export const ProductGridSkeleton = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
    {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
  </div>
);
