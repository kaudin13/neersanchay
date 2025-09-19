import { useTheme } from './ThemeProvider';

interface NeerSanchayLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function NeerSanchayLogo({ size = 'md', showText = true, className = '' }: NeerSanchayLogoProps) {
  const { theme } = useTheme();
  
  const sizes = {
    sm: { width: 32, height: 32, textSize: 'text-base' },
    md: { width: 40, height: 40, textSize: 'text-lg' },
    lg: { width: 56, height: 56, textSize: 'text-2xl' }
  };
  
  const { width, height, textSize } = sizes[size];
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <svg 
          width={width} 
          height={height} 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Background Circle */}
          <circle 
            cx="20" 
            cy="20" 
            r="19" 
            fill={theme === 'dark' ? '#1e293b' : '#ffffff'}
            stroke={theme === 'dark' ? '#475569' : '#e2e8f0'}
            strokeWidth="2"
          />
          
          {/* Water Container/Tank Base */}
          <path 
            d="M8 24 L8 32 Q8 34 10 34 L30 34 Q32 34 32 32 L32 24 Z" 
            fill="url(#waterGradient)"
            opacity="0.8"
          />
          
          {/* Water Container/Tank Outline */}
          <path 
            d="M8 24 L8 32 Q8 34 10 34 L30 34 Q32 34 32 32 L32 24" 
            stroke="#3b82f6"
            strokeWidth="1.5"
            fill="none"
          />
          
          {/* Roof/Collection Surface */}
          <path 
            d="M6 20 L20 12 L34 20 L30 20 L20 16 L10 20 Z" 
            fill={theme === 'dark' ? '#64748b' : '#94a3b8'}
            stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
            strokeWidth="1"
          />
          
          {/* Water Drops */}
          <circle cx="14" cy="8" r="1.5" fill="#06b6d4" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="20" cy="6" r="1.5" fill="#0ea5e9" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="26" cy="8" r="1.5" fill="#0284c7" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.8s" repeatCount="indefinite" />
          </circle>
          
          {/* Flow Lines */}
          <path 
            d="M16 22 Q18 21 20 22 Q22 23 24 22" 
            stroke="#3b82f6" 
            strokeWidth="1.5" 
            fill="none" 
            opacity="0.6"
          />
          
          {/* Water Level Indicator */}
          <rect 
            x="10" 
            y="28" 
            width="20" 
            height="4" 
            rx="2" 
            fill="url(#levelGradient)"
            opacity="0.9"
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <div>
          <h1 className={`${textSize} font-extrabold tracking-tight leading-none bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent`}>
            NeerSanchay
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-muted-foreground -mt-0.5">
              Rooftop RWH Assessment
            </p>
          )}
        </div>
      )}
    </div>
  );
}