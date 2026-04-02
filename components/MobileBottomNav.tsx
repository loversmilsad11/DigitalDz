'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useCart } from './CartContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const navItems = [
    { label: 'الرئيسية', icon: Home, path: '/' },
    { label: 'المنتجات', icon: ShoppingBag, path: '/products' },
    { label: 'السلة', icon: ShoppingCart, path: '/cart', badge: totalItems },
    { label: 'حسابي', icon: User, path: '/profile' },
  ];

  return (
    <div className="glass-morphism" style={{
      position: 'fixed',
      bottom: '15px',
      left: '15px',
      right: '15px',
      height: '65px',
      borderRadius: '20px',
      display: 'none', // Managed by media query below
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 1000,
      padding: '0 10px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      border: '1px solid var(--glass-border)',
    }}>
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.path} 
            href={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              gap: '4px',
              position: 'relative',
              width: '20%',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{
              position: 'relative',
              color: isActive ? 'var(--primary)' : 'var(--foreground-muted)',
              transform: isActive ? 'translateY(-2px)' : 'none',
              transition: 'all 0.3s ease',
            }}>
              <item.icon size={22} />
              {item.badge !== undefined && item.badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-10px',
                  backgroundColor: '#e879f9',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  border: '2px solid var(--background)',
                }}>
                  {item.badge}
                </span>
              )}
            </div>
            <span style={{ 
              fontSize: '0.65rem', 
              fontWeight: 700, 
              color: isActive ? 'var(--primary)' : 'var(--foreground-muted)',
              opacity: isActive ? 1 : 0.7 
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}

      <style jsx>{`
        div {
          display: none;
        }
        @media (max-width: 768px) {
          div {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
