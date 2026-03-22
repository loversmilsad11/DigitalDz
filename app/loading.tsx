import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--background)'
    }}>
      <div style={{ position: 'relative' }}>
         <Loader2 className="animate-spin" size={60} style={{ color: '#e879f9' }} />
         <div style={{ 
            position: 'absolute', 
            inset: -20, 
            background: 'radial-gradient(circle, rgba(232, 121, 249, 0.2) 0%, transparent 70%)',
            filter: 'blur(20px)',
            zIndex: -1
         }} />
      </div>
      <h2 className="title-font" style={{ marginTop: '2rem', fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '2px' }}>
        DIGITAL<span style={{ color: '#e879f9' }}>DZ</span>
      </h2>
    </div>
  );
}
