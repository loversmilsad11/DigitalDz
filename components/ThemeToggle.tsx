'use client';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      setIsDark(false);
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      style={{
        background: 'var(--glass)',
        border: '1px solid var(--glass-border)',
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--foreground)',
        transition: 'all 0.2s',
      }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
